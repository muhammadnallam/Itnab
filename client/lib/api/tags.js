import { fetcher } from "@/lib/fetcher";

export async function getTopTags(limit = 8) {
    const json = await fetcher(`/api/explore/tags?limit=${limit}`, {
        credentials: "include",
    });
    return json.tags || [];
}
