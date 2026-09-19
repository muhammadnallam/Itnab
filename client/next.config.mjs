/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    allowedDevOrigins: ["192.168.1.12"],
    async headers() {
        const headers = [
            { key: "X-Frame-Options", value: "DENY" },
            {
                key: "Content-Security-Policy",
                value: "frame-ancestors 'none'",
            },
            { key: "X-Content-Type-Options", value: "nosniff" },
            {
                key: "Referrer-Policy",
                value: "strict-origin-when-cross-origin",
            },
            {
                key: "Permissions-Policy",
                value: "camera=(), microphone=(), geolocation=()",
            },
        ];

        if (process.env.NODE_ENV === "production") {
            headers.push({
                key: "Strict-Transport-Security",
                value: "max-age=63072000; includeSubDomains; preload",
            });
        }

        return [{ source: "/:path*", headers }];
    },
};

export default nextConfig;