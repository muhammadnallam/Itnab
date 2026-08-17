import { UAParser } from "ua-parser-js";

function mapDeviceType(type) {
  if (type === "mobile" || type === "tablet") return "MOBILE";
  if (type === "desktop" || !type) return "DESKTOP";
  return "OTHER";
}

export function parseUserAgent(ua) {
  const parser = new UAParser(typeof ua === "string" ? ua : "");
  const result = parser.getResult();
  return {
    deviceType: mapDeviceType(result.device?.type),
    browser: result.browser?.name ?? null,
    os: result.os?.name ?? null,
  };
}
