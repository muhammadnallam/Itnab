import { fetcher } from "@/lib/fetcher";

const JSON_HEADERS = { "Content-Type": "application/json" };

export const getComments = (articleId, { page = 1, limit = 10 } = {}) =>
    fetcher(`/api/articles/${articleId}/comments?page=${page}&limit=${limit}`, {
        credentials: "include",
    });

export const createComment = (articleId, { content, parentId }) =>
    fetcher(`/api/articles/${articleId}/comments`, {
        credentials: "include",
        method: "POST",
        headers: JSON_HEADERS,
        body: JSON.stringify(
            parentId === undefined ? { content } : { content, parentId },
        ),
    });

export const updateComment = (commentId, content) =>
    fetcher(`/api/comments/${commentId}`, {
        credentials: "include",
        method: "PUT",
        headers: JSON_HEADERS,
        body: JSON.stringify({ content }),
    });

export const deleteComment = (commentId) =>
    fetcher(`/api/comments/${commentId}`, {
        credentials: "include",
        method: "DELETE",
    });

export const likeComment = (commentId) =>
    fetcher(`/api/comments/${commentId}/like`, {
        credentials: "include",
        method: "PUT",
    });

export const unlikeComment = (commentId) =>
    fetcher(`/api/comments/${commentId}/like`, {
        credentials: "include",
        method: "DELETE",
    });
