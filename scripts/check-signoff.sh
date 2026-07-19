#!/usr/bin/env bash
# Verify Signed-off-by on commits in a range (CI).
set -euo pipefail

FROM_REF="${1:-origin/main}"
TO_REF="${2:-HEAD}"

if ! git rev-parse --verify "$FROM_REF" >/dev/null 2>&1; then
  FROM_REF="$(git rev-list --max-parents=0 HEAD)"
fi

missing=0
while IFS= read -r sha; do
  if ! git log -1 --format=%B "$sha" | grep -qE '^Signed-off-by: .+ <.+>$'; then
    echo "Missing Signed-off-by on $sha" >&2
    missing=1
  fi
done < <(git rev-list "$FROM_REF..$TO_REF")

if [[ "$missing" -ne 0 ]]; then
  exit 1
fi

echo "All commits in range have Signed-off-by."
