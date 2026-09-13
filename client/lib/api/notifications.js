import { fetcher } from "@/lib/fetcher";

const JSON_HEADERS = { "Content-Type": "application/json" };

export const getNotifications = ({ page = 1, limit = 20 } = {}) =>
    fetcher(`/api/notifications?page=${page}&limit=${limit}`, {
        credentials: "include",
    });

export const getUnreadCount = () =>
    fetcher("/api/notifications/unread-count", {
        credentials: "include",
    });

export const markAllRead = () =>
    fetcher("/api/notifications/read", {
        credentials: "include",
        method: "PUT",
        headers: JSON_HEADERS,
    });
