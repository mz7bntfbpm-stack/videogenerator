#!/usr/bin/env bash
set -euo pipefail

TAG=${1:-v0.3.0}
ARCHIVE="assets/release-${TAG}.zip"

echo "Packaging release ${TAG} into ${ARCHIVE}"
git fetch --all --tags

if ! git rev-parse -q --verify "refs/tags/${TAG}"; then
  echo "Tag ${TAG} not found. Ensure the tag exists before packaging."
  exit 1
fi

git archive --format=zip --output="${ARCHIVE}" "${TAG}"
echo "Release archive created at ${ARCHIVE}"
