import { SITE_URL } from "@/lib/site-url";

export const SITEMAP_REVALIDATE = 3600;
export const SITEMAP_SHARD_SIZE = 5000;

const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || "";

export function escapeXml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}

function toLastmod(value) {
    if (!value) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

export function buildUrlSet(entries) {
    const body = entries
        .map((entry) => {
            const lines = ["  <url>", `    <loc>${escapeXml(entry.loc)}</loc>`];
            const lastmod = toLastmod(entry.lastmod);
            if (lastmod) lines.push(`    <lastmod>${lastmod}</lastmod>`);
            if (entry.changefreq) {
                lines.push(`    <changefreq>${entry.changefreq}</changefreq>`);
            }
            if (entry.priority != null) {
                lines.push(`    <priority>${entry.priority}</priority>`);
            }
            lines.push("  </url>");
            return lines.join("\n");
        })
        .join("\n");

    return [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        body,
        "</urlset>",
        "",
    ].join("\n");
}

export function buildSitemapIndex(entries) {
    const body = entries
        .map((entry) => {
            const lines = [
                "  <sitemap>",
                `    <loc>${escapeXml(entry.loc)}</loc>`,
            ];
            const lastmod = toLastmod(entry.lastmod);
            if (lastmod) lines.push(`    <lastmod>${lastmod}</lastmod>`);
            lines.push("  </sitemap>");
            return lines.join("\n");
        })
        .join("\n");

    return [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        body,
        "</sitemapindex>",
        "",
    ].join("\n");
}

async function apiGet(path) {
    const res = await fetch(`${API_URL}${path}`, {
        next: { revalidate: SITEMAP_REVALIDATE },
    });
    if (!res.ok) {
        throw new Error(`Sitemap API request failed: ${path} (${res.status})`);
    }
    return res.json();
}

export async function fetchSitemapMeta() {
    try {
        return await apiGet("/api/sitemap/meta");
    } catch {
        return null;
    }
}

export async function fetchSitemapArticles(offset, limit) {
    try {
        return await apiGet(
            `/api/sitemap/articles?offset=${offset}&limit=${limit}`,
        );
    } catch {
        return null;
    }
}

export async function fetchSitemapAuthors(offset, limit) {
    try {
        return await apiGet(
            `/api/sitemap/authors?offset=${offset}&limit=${limit}`,
        );
    } catch {
        return null;
    }
}
