import { API_URL } from "./config";

export async function publishArticle({ content, data }) {
    const res = await fetch(`${API_URL}/api/article/create`, {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({ content, data }),
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json.error || "حدث خطأ أثناء نشر المقال");
    return json;
}

export async function getArticle(slug) {
    const res = await fetch(`${API_URL}/api/article/${slug}/read`);
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "المقال غير موجود");
    return json;
}

export async function updateArticle({ content, data, articleId }) {
    const res = await fetch(`${API_URL}/api/article/${articleId}/update`, {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        method: "PUT",
        body: JSON.stringify({ content, data }),
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json.error || "حدث خطأ أثناء تعديل المقال");
    return json;
}

export async function deleteArticle(articleId) {
    const res = await fetch(`${API_URL}/api/article/${articleId}/delete`, {
        credentials: "include",
        method: "DELETE",
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json.error || "حدث خطأ أثناء حذف المقال");
    return json;
}
