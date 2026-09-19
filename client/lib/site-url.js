export const SITE_URL = (
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:5000"
).replace(/\/$/, "");

export default SITE_URL;
