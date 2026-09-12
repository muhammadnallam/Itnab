import { fetcher } from "@/lib/fetcher";
import { parseArticle, parseList } from "./feed";

export async function getProfile(username) {
    return fetcher(`/api/user/${username}/profile`);
}

export async function updateProfile(data) {
    return fetcher("/api/user/update-profile", {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        method: "PUT",
        body: JSON.stringify(data),
    });
}

export async function updateSocialLinks(data) {
    return fetcher("/api/user/update-social-links", {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        method: "PUT",
        body: JSON.stringify(data),
    });
}

export async function updatePassword(data) {
    return fetcher("/api/user/update-password", {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        method: "PUT",
        body: JSON.stringify(data),
    });
}

export async function deleteAccount() {
    return fetcher("/api/user/delete-account", {
        credentials: "include",
        method: "POST",
    });
}

export async function getUserSaves(userId, { page = 1, limit = 20 } = {}) {
    const json = await fetcher(
        `/api/user/${userId}/saves?page=${page}&limit=${limit}`,
        { credentials: "include" },
    );
    return {
        items: (json.articles || []).map(parseArticle),
        hasMore: json.hasMore,
        nextPage: json.nextPage,
    };
}

export async function getUserViews(userId, { page = 1, limit = 20 } = {}) {
    const json = await fetcher(
        `/api/user/${userId}/views?page=${page}&limit=${limit}`,
        { credentials: "include" },
    );
    return {
        items: (json.articles || []).map(parseArticle),
        hasMore: json.hasMore,
        nextPage: json.nextPage,
    };
}

export async function getFollowing(userId, { page = 1, limit = 50 } = {}) {
    const json = await fetcher(
        `/api/user/${userId}/following?page=${page}&limit=${limit}`,
        { credentials: "include" },
    );
    return {
        items: json.writers || [],
        hasMore: json.hasMore,
        nextPage: json.nextPage,
    };
}

export async function getFollowers(userId, { page = 1, limit = 50 } = {}) {
    const json = await fetcher(
        `/api/user/${userId}/followers?page=${page}&limit=${limit}`,
        { credentials: "include" },
    );
    return {
        items: json.writers || [],
        hasMore: json.hasMore,
        nextPage: json.nextPage,
    };
}

export async function getUserSavedLists(userId, { page = 1, limit = 20 } = {}) {
    const json = await fetcher(
        `/api/user/${userId}/saved-lists?page=${page}&limit=${limit}`,
        { credentials: "include" },
    );
    return {
        items: (json.lists || []).map((l) => parseList(l, l.author?.name)),
        hasMore: json.hasMore,
        nextPage: json.nextPage,
    };
}