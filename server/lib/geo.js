import { Reader } from "@maxmind/geoip2-node";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, "..", "data", "GeoLite2-Country.mmdb");

let reader = null;
let failed = false;

async function loadReader() {
  if (reader || failed) return;
  try {
    reader = await Reader.open(DB_PATH);
  } catch {
    failed = true;
    console.warn(
      "[geo] GeoLite2-Country.mmdb not found — country will be null. Download it via scripts/fetch-geolite.sh",
    );
  }
}

export async function getCountry(ip) {
  await loadReader();
  if (!reader) return null;
  try {
    const result = reader.country(ip);
    return result.country?.isoCode ?? null;
  } catch {
    return null;
  }
}
