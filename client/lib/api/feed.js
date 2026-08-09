import { API_URL } from "./config";

function formatArabicDate(iso) {
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
        authorAvatar: getInitials(a.author?.name),
        date: formatArabicDate(a.createdAt),
    };
}

export function parseList(l, ownerName) {
    return {
        id: l.id,
        name: l.name,
        ownerName,
        ownerAvatar: getInitials(ownerName),
        storyCount: l._count?.articles ?? 0,
        images: [],
    };
}

async function fetchFeed(path, params) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_URL}/api/feed/${path}?${query}`);
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json.error || "حدث خطأ أثناء جلب البيانات");
    return json;
}

export async function getFeedArticles({
    sort = "top",
    author,
    page = 1,
    limit = 20,
} = {}) {
    const json = await fetchFeed("articles", {
        sort,
        page,
        limit,
        ...(author ? { author } : {}),
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

export async function getUserLists(author, { page = 1, limit = 20 } = {}) {
    const json = await fetchFeed("lists", { author, page, limit });
    return {
        items: json.lists || [],
        hasMore: json.hasMore,
        nextPage: json.nextPage,
    };
}
