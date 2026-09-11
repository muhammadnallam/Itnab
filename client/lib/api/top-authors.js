import { fetcher } from "@/lib/fetcher";

export async function getTopAuthors(limit = 10) {
    const json = await fetcher(`/api/explore/top-authors?limit=${limit}`, {
        credentials: "include",
    });
    return (json.authors || []).map((a) => ({
        id: a.id,
        name: a.name,
        username: a.username,
        image: a.image,
        followerCount: a.followerCount ?? 0,
    }));
}
