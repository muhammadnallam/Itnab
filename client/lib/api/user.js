import { API_URL } from "./config";

export async function getProfile(username) {
    const res = await fetch(`${API_URL}/api/user/${username}/profile`);
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "المستخدم غير موجود");
    return json;
}

export async function updateProfile(data) {
    const res = await fetch(`${API_URL}/api/user/update-profile`, {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        method: "PUT",
        body: JSON.stringify(data),
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok)
        throw new Error(json.error || "حدث خطأ أثناء تحديث الملف الشخصي");
    return json;
}

export async function updateSocialLinks(data) {
    const res = await fetch(`${API_URL}/api/user/update-social-links`, {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        method: "PUT",
        body: JSON.stringify(data),
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json.error || "حدث خطأ أثناء تحديث الروابط");
    return json;
}

export async function updatePassword(data) {
    const res = await fetch(`${API_URL}/api/user/update-password`, {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        method: "PUT",
        body: JSON.stringify(data),
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok)
        throw new Error(json.error || "حدث خطأ أثناء تحديث كلمة المرور");
    return json;
}

export async function deleteAccount() {
    const res = await fetch(`${API_URL}/api/user/delete-account`, {
        credentials: "include",
        method: "POST",
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json.error || "حدث خطأ أثناء حذف الحساب");
    return json;
}
