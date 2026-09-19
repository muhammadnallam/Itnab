import { TAGS } from "@itnab/constants";
import { SITE_URL } from "@/lib/site-url";
import {
    SITEMAP_SHARD_SIZE,
    buildUrlSet,
    fetchSitemapMeta,
    fetchSitemapAuthors,
    fetchSitemapArticles,
} from "@/lib/sitemap";

export const revalidate = 3600;

const STATIC_PAGES = [
    { loc: `${SITE_URL}/`, changefreq: "daily", priority: 1 },
    { loc: `${SITE_URL}/explore`, changefreq: "daily", priority: 0.8 },
];

const CATEGORY_PAGES = TAGS.map((tag) => ({
    loc: `${SITE_URL}/explore?tag=${encodeURIComponent(tag)}`,
    changefreq: "weekly",
    priority: 0.6,
}));

async function buildArticles(shard) {
    const data = await fetchSitemapArticles(
        shard * SITEMAP_SHARD_SIZE,
        SITEMAP_SHARD_SIZE,
    );
    const items = data?.items ?? [];
    return items.map((article) => ({
        loc: `${SITE_URL}/article/${encodeURIComponent(article.slug)}`,
        lastmod: article.updatedAt,
    }));
}

async function buildAuthors() {
    const meta = await fetchSitemapMeta();
    const total = meta?.authors?.count ?? 0;
    const items = [];

    for (let offset = 0; offset < total; offset += SITEMAP_SHARD_SIZE) {
        const data = await fetchSitemapAuthors(offset, SITEMAP_SHARD_SIZE);
        const page = data?.items ?? [];
        items.push(...page);
        if (page.length < SITEMAP_SHARD_SIZE) break;
    }

    return items.map((author) => ({
        loc: `${SITE_URL}/@${encodeURIComponent(author.username)}`,
        lastmod: author.updatedAt,
    }));
}

export async function GET(request, { params }) {
    const { name } = await params;
    const id = name.endsWith(".xml") ? name.slice(0, -4) : name;

    let entries;

    if (id === "static") {
        entries = STATIC_PAGES;
    } else if (id === "categories") {
        entries = CATEGORY_PAGES;
    } else if (id === "authors") {
        entries = await buildAuthors();
    } else if (/^articles-\d+$/.test(id)) {
        entries = await buildArticles(Number(id.split("-")[1]));
    } else {
        return new Response("Not Found", { status: 404 });
    }

    return new Response(buildUrlSet(entries), {
        headers: { "Content-Type": "application/xml; charset=utf-8" },
    });
}
