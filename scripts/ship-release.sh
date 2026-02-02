#!/usr/bin/env bash
set -euo pipefail

TAG=${1:-v0.3.0}
BASE=${2:-main}

if ! command -v gh >/dev/null 2>&1; then
  echo "gh CLI not found. Install gh and re-run to publish PR and Release automatically."
  echo "Alternatively, publish PR and Release manually using the PR body and release notes: RELEASE_NOTES.md"
  exit 1
fi

echo "Launching release for ${TAG} against base ${BASE}"

# Ensure local is up to date
git switch ${BASE}
git pull --ff-only

# Create release branch
REL_BRANCH="release/${TAG}"
git checkout -b ${REL_BRANCH}

# Tag release if needed
if git rev-parse -q --verify "refs/tags/${TAG}"; then
  echo "Tag ${TAG} already exists. Skipping tag creation."
else
  git tag -a ${TAG} -m "Release ${TAG}"
  git push -u origin ${TAG}
fi

# Push release branch
git push -u origin ${REL_BRANCH}

# Create PR
echo "Creating GitHub PR..."
gh pr create --title "Release ${TAG}: End-to-End Flows A-F" --body "$(cat RELEASE_NOTES.md)" --head "${REL_BRANCH}" --base ${BASE} || true

# Create GitHub Release and attach artifacts
echo "Creating GitHub Release and attaching artifacts..."
gh release create ${TAG} --notes-file RELEASE_NOTES.md --title "Release ${TAG}"

echo "Packaging release assets..."
./scripts/pack-release.sh ${TAG}
if [ -f assets/release-${TAG}.zip ]; then
  gh release upload ${TAG} assets/release-${TAG}.zip
else
  echo "Release asset not found; ensure pack-release.sh succeeded."
fi

echo "Release complete. PR URL and Release URL should be visible on GitHub."
