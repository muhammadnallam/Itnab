import { fetcher } from "@/lib/fetcher";

const JSON_HEADERS = { "Content-Type": "application/json" };

export const getFollowState = (userId) =>
    fetcher(`/api/users/${userId}/follow`, { credentials: "include" });

export const followUser = (userId) =>
    fetcher(`/api/users/${userId}/follow`, {
        credentials: "include",
        method: "PUT",
    });

export const unfollowUser = (userId) =>
    fetcher(`/api/users/${userId}/follow`, {
        credentials: "include",
        method: "DELETE",
    });

export const getLikesState = (articleId) =>
    fetcher(`/api/articles/${articleId}/likes`, { credentials: "include" });

export const setReaction = (articleId, type) =>
    fetcher(`/api/articles/${articleId}/likes`, {
        credentials: "include",
        method: "PUT",
        headers: JSON_HEADERS,
        body: JSON.stringify({ type }),
    });

export const deleteReaction = (articleId) =>
    fetcher(`/api/articles/${articleId}/likes`, {
        credentials: "include",
        method: "DELETE",
    });

export const getSaveState = (articleId) =>
    fetcher(`/api/articles/${articleId}/save`, { credentials: "include" });

export const saveArticle = (articleId, { listId } = {}) =>
    fetcher(`/api/articles/${articleId}/save`, {
        credentials: "include",
        method: "PUT",
        headers: JSON_HEADERS,
        body: JSON.stringify(listId ? { listId } : {}),
    });

export const unsaveArticle = (articleId, { listId } = {}) =>
    fetcher(`/api/articles/${articleId}/save`, {
        credentials: "include",
        method: "DELETE",
        headers: JSON_HEADERS,
        body: JSON.stringify(listId ? { listId } : {}),
    });

export const shareArticle = (articleId, platform) =>
    fetcher(`/api/articles/${articleId}/share`, {
        method: "POST",
        credentials: "include",
        headers: JSON_HEADERS,
        body: JSON.stringify({ platform }),
    });

export const recordView = (articleId) =>
    fetcher(`/api/articles/${articleId}/view`, {
        method: "POST",
        credentials: "include",
    });