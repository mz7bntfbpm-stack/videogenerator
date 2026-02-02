#!/usr/bin/env bash
set -euo pipefail

RELEASE_TAG="${1:-v0.3.0}"
BRANCH="release/${RELEASE_TAG}"

echo "[Release] Preparing branch ${BRANCH} for tag ${RELEASE_TAG}"

git fetch --all --tags
git switch main
git pull --rebase
git checkout -b "${BRANCH}"

if git rev-parse --verify "${RELEASE_TAG}" >/dev/null 2>&1; then
  echo "Tag ${RELEASE_TAG} already exists locally."
else
  git tag -a "${RELEASE_TAG}" -m "Release ${RELEASE_TAG}"
  git push origin "${RELEASE_TAG}"
fi

git push -u origin "${BRANCH}"
echo "Branch ${BRANCH} ready. Open a PR against main and include release notes."
