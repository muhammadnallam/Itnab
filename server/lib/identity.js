import { createHmac, randomBytes } from "node:crypto";

// Guest IPs are hashed with HMAC-SHA256 keyed by a secret salt. A plain hash
// (or one with an empty/guessable salt) is trivially brute-forced over the
// small IPv4 space, which would de-anonymize guests. HMAC makes the salt a
// required key: without it, the digest cannot be reproduced.

const MIN_SALT_LENGTH = 16;

function resolveSalt() {
  const salt = process.env.IP_HASH_SALT;
  if (salt && salt.length >= MIN_SALT_LENGTH) {
    return salt;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "IP_HASH_SALT must be set to a strong value (>= 16 chars) in production",
    );
  }

  console.warn(
    "IP_HASH_SALT is missing or too short; using a random development salt. " +
      "Guest dedupe will reset on restart.",
  );
  return randomBytes(32).toString("hex");
}

const SALT = resolveSalt();

export function getClientIp(req) {
  const xff = req.headers["x-forwarded-for"];
  if (typeof xff === "string" && xff.trim()) {
    return xff.split(",")[0].trim();
  }
  return req.ip || req.socket?.remoteAddress || "unknown";
}

export function hashIp(ip) {
  return createHmac("sha256", SALT).update(String(ip)).digest("hex");
}
