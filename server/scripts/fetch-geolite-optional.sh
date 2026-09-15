#!/usr/bin/env bash
set -euo pipefail

# Build-safe wrapper around fetch-geolite.sh.
# - Skips download if the DB already exists.
# - Works both from repo root (pnpm --filter) and from server/.
# - MAXMIND_LICENSE_KEY is expected to be present at build time.

DEST="server/data/GeoLite2-Country.mmdb"
FETCH="server/scripts/fetch-geolite.sh"
if [ ! -d "server/data" ] && [ -d "data" ]; then
  DEST="data/GeoLite2-Country.mmdb"
  FETCH="$(dirname "$0")/fetch-geolite.sh"
fi

if [ -f "$DEST" ]; then
  echo "[geo] $DEST exists — skipping download."
  exit 0
fi

bash "$FETCH"
