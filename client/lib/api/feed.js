import { fetcher } from "@/lib/fetcher";

export function formatArabicDate(iso) {
    if (!iso) return "";
    const date = new Date(iso);
    const diffMs = date.getTime() - Date.now();
    const rtf = new Intl.RelativeTimeFormat("ar", { numeric: "auto" });
    const minutes = Math.round(diffMs / 60000);
    if (Math.abs(minutes) < 60) return rtf.format(minutes, "minute");
    const hours = Math.round(minutes / 60);
    if (Math.abs(hours) < 24) return rtf.format(hours, "hour");
    const days = Math.round(hours / 24);
    if (Math.abs(days) < 30) return rtf.format(days, "day");
    return new Intl.DateTimeFormat("ar", {
        month: "long",
        year: "numeric",
    }).format(date);
}

const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.trim().split(/\s+/);
    return parts.length > 1 ? parts[0][0] + parts[1][0] : parts[0][0];
};

export function parseArticle(a) {
    return {
        id: a.id,
        slug: a.slug,
        title: a.title,
        excerpt: a.subtitle,
        image: a.coverImage,
        topic: a.topic,
        readTime: a.readTime,
        author: a.author?.name || "",
        authorUsername: a.author?.username,
        authorId: a.author?.id,
        authorInitials: getInitials(a.author?.name),
        authorImage: a.author?.image,
        date: formatArabicDate(a.createdAt),
        saved: a.saved ?? false,
    };
}

export function parseList(l, ownerName) {
    return {
        id: l.id,
        name: l.name,
        ownerName,
        ownerInitials: getInitials(ownerName),
        authorImage: l.owner?.image,
        date: formatArabicDate(l.createdAt),
        storyCount: l._count?.savedArticles ?? 0,
        containsArticle: l.containsArticle ?? false,
        images: [],
    };
}

async function fetchFeed(path, params) {
    const query = new URLSearchParams(params).toString();
    return fetcher(`/api/feed/${path}?${query}`, { credentials: "include" });
}

export async function getFeedArticles({
    sort = "top",
    author,
    topic,
    page = 1,
    limit = 20,
} = {}) {
    const json = await fetchFeed("articles", {
        sort,
        page,
        limit,
        ...(author ? { author } : {}),
        ...(topic ? { topic } : {}),
    });
    return {
        items: (json.articles || []).map(parseArticle),
        hasMore: json.hasMore,
        nextPage: json.nextPage,
    };
}

export function getTopArticles(opts) {
    return getFeedArticles({ sort: "top", ...opts });
}

export function getNewestArticles(opts) {
    return getFeedArticles({ sort: "new", ...opts });
}

export function getAuthorArticles(author, opts) {
    return getFeedArticles({ sort: "new", author, ...opts });
}

export function getTagArticles(tag, opts) {
    return getFeedArticles({ sort: "new", topic: tag, ...opts });
}

export async function getUserLists(
    author,
    { page = 1, limit = 20, articleId } = {},
) {
    const json = await fetchFeed("lists", {
        ...(author ? { author } : {}),
        ...(articleId ? { articleId } : {}),
        page,
        limit,
    });
    return {
        items: json.lists || [],
        hasMore: json.hasMore,
        nextPage: json.nextPage,
    };
}

export async function createList(name) {
    return fetcher("/api/feed/lists", {
        credentials: "include",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
    });
}