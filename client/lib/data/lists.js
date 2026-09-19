import { API_URL } from "@/lib/api/config";

export async function getListById(listId) {
    const res = await fetch(`${API_URL}/api/feed/lists/${listId}`, {
        next: { revalidate: 3600 },
    });
    const json = await res.json().catch(() => null);
    if (!res.ok) throw new Error(json?.error || "القائمة غير موجودة");
    return json;
}
