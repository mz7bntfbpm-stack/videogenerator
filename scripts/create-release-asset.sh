#!/usr/bin/env bash
set -euo pipefail

TAG="${1:-v0.3.0}"
ARCHIVE="assets/release-${TAG}.zip"
mkdir -p assets

git fetch --all --tags
git archive --format=zip --output="${ARCHIVE}" "${TAG}"
echo "Release asset created: ${ARCHIVE}"
