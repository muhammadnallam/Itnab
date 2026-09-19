import { SITE_URL } from "@/lib/site-url";
import {
    SITEMAP_SHARD_SIZE,
    buildSitemapIndex,
    fetchSitemapMeta,
} from "@/lib/sitemap";

export const revalidate = 3600;

export async function GET() {
    const meta = await fetchSitemapMeta();

    const entries = [
        { loc: `${SITE_URL}/sitemaps/static.xml` },
        { loc: `${SITE_URL}/sitemaps/categories.xml` },
    ];

    const authorCount = meta?.authors?.count ?? 0;
    if (authorCount > 0) {
        entries.push({
            loc: `${SITE_URL}/sitemaps/authors.xml`,
            lastmod: meta.authors.lastmod,
        });
    }

    const articleCount = meta?.articles?.count ?? 0;
    const shards = Math.ceil(articleCount / SITEMAP_SHARD_SIZE);
    for (let i = 0; i < shards; i += 1) {
        entries.push({
            loc: `${SITE_URL}/sitemaps/articles-${i}.xml`,
            lastmod: meta.articles.lastmod,
        });
    }

    return new Response(buildSitemapIndex(entries), {
        headers: { "Content-Type": "application/xml; charset=utf-8" },
    });
}
