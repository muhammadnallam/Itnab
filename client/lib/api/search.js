import { fetcher } from "@/lib/fetcher";
import { parseArticle } from "./feed";

export async function search({ q, limit = 20, signal }) {
    const query = new URLSearchParams({ q, limit: String(limit) }).toString();
    const json = await fetcher(`/api/search?${query}`, { credentials: "include", signal });
    return {
        articles: (json.articles || []).map(parseArticle),
        authors: (json.authors || []).map(parseUser),
    };
}

function parseUser(u) {
    return {
        id: u.id,
        name: u.name,
        username: u.username,
        image: u.image,
        followerCount: u.followerCount ?? 0,
    };
}
