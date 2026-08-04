import prisma from "../../lib/prisma.js";
import { auth } from "../../lib/auth.js";
import { Prisma } from "../../lib/generated/prisma/client.js";
import { ValidationError, NotFoundError } from "../../lib/errors.js";

export async function getProfile(username) {
    let user;
    try {
        user = await prisma.user.findUniqueOrThrow({
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
    } catch (err) {
        if (
            err instanceof Prisma.PrismaClientKnownRequestError &&
            err.code === "P2025"
        ) {
            throw new NotFoundError("المستخدم غير موجود");
        }
        throw err;
    }

    const { _count, ...userData } = user;
    return {
        ...userData,
        articlesCount: _count.articles,
        followersCount: _count.followers,
        followingCount: _count.following,
    };
}

export async function updateProfile(userId, data) {
    const allowed = ["name", "username", "bio", "socialLinks", "preferences"];
    const updateData = {};
    for (const key of allowed) {
        if (data[key] !== undefined) updateData[key] = data[key];
    }

    if (Object.keys(updateData).length === 0) {
        throw new ValidationError("لا توجد بيانات للتحديث");
    }

    if (updateData.username) {
        const existing = await prisma.user.findUnique({
            where: { username: updateData.username },
            select: { id: true },
        });
        if (existing && existing.id !== userId) {
            throw new ValidationError("اسم المستخدم موجود بالفعل", "username");
        }
    }

    try {
        const profile = await prisma.user.update({
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
        return profile;
    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            switch (err.code) {
                case "P2002":
                    throw new ValidationError(
                        "اسم المستخدم موجود بالفعل",
                        "username",
                    );
                case "P2025":
                    throw new NotFoundError("المستخدم غير موجود");
                default:
                    throw err;
            }
        }
        throw err;
    }
}

export async function updatePassword(
    userId,
    currentPassword,
    newPassword,
    headers,
) {
    try {
        await auth.api.changePassword({
            body: {
                currentPassword,
                newPassword,
                revokeOtherSessions: true,
            },
            headers,
        });
    } catch (err) {
        const message =
            err.body?.message ||
            err.message ||
            "حدث خطأ أثناء تحديث كلمة المرور";
        throw new ValidationError(message);
    }
}
