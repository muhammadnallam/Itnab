#!/usr/bin/env bash
set -euo pipefail

LICENSE_KEY="${MAXMIND_LICENSE_KEY:?MAXMIND_LICENSE_KEY is required}"
URL="https://download.maxmind.com/app/geoip_download?edition_id=GeoLite2-Country&license_key=${LICENSE_KEY}&suffix=tar.gz"
DEST_DIR="$(cd "$(dirname "$0")/.." && pwd)/data"

mkdir -p "$DEST_DIR"
TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

curl -fsSL "$URL" -o "$TMP_DIR/geolite.tar.gz"
tar -xzf "$TMP_DIR/geolite.tar.gz" -C "$TMP_DIR"
find "$TMP_DIR" -name "GeoLite2-Country.mmdb" -exec mv {} "$DEST_DIR/GeoLite2-Country.mmdb" \;

echo "Downloaded GeoLite2-Country.mmdb to $DEST_DIR"