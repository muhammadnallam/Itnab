import { API_URL } from "@/lib/api/config";

export async function getArticleBySlug(slug) {
    const res = await fetch(`${API_URL}/api/article/${slug}/read`);
    const json = await res.json().catch(() => null);
    if (!res.ok) throw new Error(json?.error || "المقال غير موجود");
    return json;
}