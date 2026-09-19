import { API_URL } from "@/lib/api/config";

export async function getProfileByUsername(username) {
    const res = await fetch(`${API_URL}/api/user/${username}/profile`, {
        next: { revalidate: 3600 },
    });
    const json = await res.json().catch(() => null);
    if (!res.ok) throw new Error(json?.error || "المستخدم غير موجود");
    return json;
}
