#!/usr/bin/env bash
set -euo pipefail

TAG="${1:-v0.3.0}"
BASE="${2:-main}"
PR_BODY_FILE="PR_BODY_v0.3.0.txt"
RELEASE_NOTES_FILE="RELEASE_NOTES.md"

echo "[One-Click Release] Tag=${TAG}, Base=${BASE}"

if ! command -v gh >/dev/null 2>&1; then
  echo "gh CLI not found. Install gh and authenticate (gh auth login)." >&2
  exit 1
fi
if ! gh auth status >/dev/null 2>&1; then
  echo "gh is not authenticated. Please run 'gh auth login' to authenticate." >&2
  exit 1
fi

echo "Fetching repo state..."
git fetch --all --tags

echo "Ensuring base branch is up-to-date..."
git switch "${BASE}" >/dev/null 2>&1 || git checkout "${BASE}"
git pull --ff-only

BRANCH="release/${TAG}"
if git rev-parse --verify --quiet "refs/heads/${BRANCH}"; then
  echo "Branch ${BRANCH} exists. Checking out..."
  git checkout "${BRANCH}"
else
  git checkout -b "${BRANCH}"
fi

echo "Tagging release ${TAG} if needed..."
if ! git rev-parse -q --verify "refs/tags/${TAG}"; then
  git tag -a "${TAG}" -m "Release ${TAG}"
  git push -u origin "${TAG}"
fi
git push -u origin "${BRANCH}"

echo "Creating PR (if not exists)..."
if gh pr list --head "${BRANCH}" --state open >/dev/null 2>&1; then
  echo "PR already open for ${BRANCH}."
else
  gh pr create --title "Release ${TAG}: End-to-End Flows A-F" --body "$(cat ${PR_BODY_FILE})" --head "${BRANCH}" --base "${BASE}"
fi

echo "Creating GitHub Release..."
if gh release list | grep -q "${TAG}"; then
  echo "Release ${TAG} already exists."
else
  gh release create "${TAG}" --notes-file "${RELEASE_NOTES_FILE}" --title "Release ${TAG}"
fi

echo "Packaging release asset..."
./scripts/pack-release.sh "${TAG}"
if [ -f assets/release-${TAG}.zip ]; then
  gh release upload "${TAG}" assets/release-${TAG}.zip
fi

echo "Collecting URLs..."
PR_URL=$(gh pr list --head "${BRANCH}" --state open --limit 1 --json url -q '.[0].url' 2>/dev/null || echo "")
RELEASE_URL=$(gh release view "${TAG}" --json url -q '.url' 2>/dev/null || echo "")
if [ -n "$PR_URL" ]; then echo "PR URL: $PR_URL"; fi
if [ -n "$RELEASE_URL" ]; then echo "Release URL: $RELEASE_URL"; fi

echo "Release complete. PR URL and Release URL (if created) are shown above."
