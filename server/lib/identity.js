import { createHash } from "node:crypto";

const SALT = process.env.IP_HASH_SALT || "";

export function getClientIp(req) {
  const xff = req.headers["x-forwarded-for"];
  if (typeof xff === "string" && xff.trim()) {
    return xff.split(",")[0].trim();
  }
  return req.ip || req.socket?.remoteAddress || "unknown";
}

export function hashIp(ip) {
  return createHash("sha256").update(`${ip}:${SALT}`).digest("hex");
}
