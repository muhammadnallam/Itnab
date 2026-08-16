import { fetcher } from "@/lib/fetcher";

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