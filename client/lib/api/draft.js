import { fetcher } from "@/lib/fetcher";

export async function listDrafts(articleId) {
    const query = articleId ? `?articleId=${encodeURIComponent(articleId)}` : "";
    return fetcher(`/api/drafts${query}`, {
        credentials: "include",
    });
}

export async function getDraft(id) {
    return fetcher(`/api/drafts/${id}`, {
        credentials: "include",
    });
}

export async function createDraft({ content, seoTitle, seoDescription, topic, articleId }) {
    return fetcher("/api/drafts", {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({ content, seoTitle, seoDescription, topic, articleId }),
    });
}

export async function saveDraft({ id, content, seoTitle, seoDescription, topic }) {
    return fetcher(`/api/drafts/${id}`, {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        method: "PUT",
        body: JSON.stringify({ content, seoTitle, seoDescription, topic }),
    });
}

export async function deleteDraft(id) {
    return fetcher(`/api/drafts/${id}`, {
        credentials: "include",
        method: "DELETE",
    });
}
