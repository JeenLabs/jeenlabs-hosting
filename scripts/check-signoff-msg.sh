#!/usr/bin/env bash
set -euo pipefail

MSG_FILE="${1:-}"
if [[ -z "$MSG_FILE" || ! -f "$MSG_FILE" ]]; then
  echo "check-signoff: missing commit message file" >&2
  exit 1
fi

if ! grep -qE '^Signed-off-by: .+ <.+>$' "$MSG_FILE"; then
  echo "check-signoff: commit must include Signed-off-by (use git commit -s)" >&2
  exit 1
fi
