import { fetcher } from "@/lib/fetcher";
import { parseArticle } from "./feed";

export async function getExploreRecommendations() {
    const json = await fetcher("/api/explore/recommendations", { credentials: "include" });
    return {
        bestThisMonth: (json.bestThisMonth || []).map(parseArticle),
        randomArticles: (json.randomArticles || []).map(parseArticle),
        randomAuthors: (json.randomAuthors || []).map(parseUser),
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
