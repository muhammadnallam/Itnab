import { fetcher } from "@/lib/fetcher";

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