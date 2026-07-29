import prisma from "../lib/prisma";
import { auth } from "../lib/auth.js";

export async function getProfile(username) {
    const user = await prisma.user.findUnique({
        where: { username },
        select: {
            id: true,
            name: true,
            username: true,
            bio: true,
            avatarUrl: true,
            bannerUrl: true,
            preferences: true,
            socialLinks: true,
            _count: {
                select: {
                    articles: true,
                    followers: true,
                    following: true,
                },
            },
        },
    });

    if (!user) return null;

    const { _count, ...userData } = user;
    return {
        ...userData,
        articlesCount: _count.articles,
        followersCount: _count.followers,
        followingCount: _count.following,
    };
}

export async function updateProfile(userId, data) {
    const allowed = ["name", "username", "bio", "socialLinks"];
    const updateData = {};
    for (const key of allowed) {
        if (data[key] !== undefined) updateData[key] = data[key];
    }

    const user = await prisma.user.update({
        where: { id: userId },
        data: updateData,
        select: {
            name: true,
            username: true,
            bio: true,
            avatarUrl: true,
            bannerUrl: true,
            preferences: true,
            socialLinks: true,
        },
    });

    return user;
}

export async function updatePassword(userId, currentPassword, newPassword, headers) {
    await auth.api.changePassword({
        body: {
            currentPassword,
            newPassword,
            revokeOtherSessions: true,
        },
        headers,
    });
}
