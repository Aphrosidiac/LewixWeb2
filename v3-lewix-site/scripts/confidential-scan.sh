#!/usr/bin/env bash
# Fails if any client term appears in the tracked source or in the built HTML.
# The terms live in ../CONFIDENTIAL-client-terms.txt, which is git-ignored:
# the list of names to keep out of this repo cannot itself be in this repo.
set -euo pipefail
cd "$(dirname "$0")/.."
terms="../CONFIDENTIAL-client-terms.txt"
[ -f "$terms" ] || { echo "missing $terms"; exit 2; }
pattern=$(grep -v '^\s*$' "$terms" | paste -sd'|' -)
hits=0
echo "== tracked source"
git grep -I -n -i -w -E "$pattern" -- . ':!scripts/confidential-scan.sh' && hits=1 || true
echo "== public/ file names"
find public -iname '*' | grep -i -E "$pattern" && hits=1 || true
if [ -d .next/server/app ]; then
  echo "== built HTML / RSC / txt"
  grep -r -l -I -i -w -E "$pattern" .next/server/app && hits=1 || true
fi
[ $hits -eq 0 ] && echo "clean" || { echo "CLIENT TERMS FOUND"; exit 1; }
