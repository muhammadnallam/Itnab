import { fetcher } from "@/lib/fetcher";
import { API_URL } from "@/lib/api/config";

export async function publishArticle({ content, data }) {
    return fetcher("/api/article/create", {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({ content, data }),
    });
}

export async function getArticle(slug) {
    return fetcher(`/api/article/${slug}/read`);
}

export async function updateArticle({ content, data, articleId }) {
    return fetcher(`/api/article/${articleId}/update`, {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        method: "PUT",
        body: JSON.stringify({ content, data }),
    });
}

export async function deleteArticle(articleId) {
    return fetcher(`/api/article/${articleId}/delete`, {
        credentials: "include",
        method: "DELETE",
    });
}

export async function downloadPdf(slug) {
    const res = await fetch(`${API_URL}/api/article/${slug}/pdf`);
    if (!res.ok) {
        throw new Error("تعذر تحميل المقال");
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${slug}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}