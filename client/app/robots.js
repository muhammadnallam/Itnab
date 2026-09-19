import { SITE_URL } from "@/lib/site-url";

export default function robots() {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: [
                "/new",
                "/edit/",
                "/settings",
                "/library",
                "/subscriptions",
                "/reset-password",
                "/profile/",
            ],
        },
        sitemap: `${SITE_URL}/sitemap.xml`,
    };
}
