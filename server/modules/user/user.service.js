import prisma from "../../lib/prisma.js";
import { auth } from "../../lib/auth.js";
import { ValidationError, handlePrismaError } from "../../lib/errors.js";

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
                image: true,
                bannerUrl: true,
                preferences: true,
                socialLinks: true,
        followerCount: true,
        followingCount: true,
                _count: {
                    select: {
                        articles: true,
                    },
                },
            },
        });
    } catch (err) {
        handlePrismaError(err, { notFoundMsg: "المستخدم غير موجود" });
    }

  const { _count, followerCount, followingCount, ...userData } = user;
    return {
        ...userData,
        articlesCount: _count.articles,
    followersCount: followerCount,
    followingCount,
    };
}

export async function updateProfile(userId, data) {
    const allowed = [
        "name",
        "username",
        "bio",
        "image",
        "bannerUrl",
        "socialLinks",
        "preferences",
    ];
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
                image: true,
                bannerUrl: true,
                preferences: true,
                socialLinks: true,
            },
        });
        return profile;
    } catch (err) {
        handlePrismaError(err, {
            notFoundMsg: "المستخدم غير موجود",
            duplicateMsg: "اسم المستخدم موجود بالفعل",
            duplicateField: "username",
        });
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
      err.body?.message || err.message || "حدث خطأ أثناء تحديث كلمة المرور";
        throw new ValidationError(message);
    }
}

export async function deleteUserAccount(userId) {
    try {
        await prisma.user.delete({
            where: { id: userId },
        });
    } catch (err) {
        handlePrismaError(err, { notFoundMsg: "المستخدم غير موجود" });
    }
}

export async function getFollowing(userId, { page, pageSize }) {
    const where = { followerId: userId };
    const [follows, total] = await Promise.all([
        prisma.follow.findMany({
            where,
            orderBy: { createdAt: "desc" },
            select: {
                following: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                        image: true,
                    },
                },
            },
            skip: (page - 1) * pageSize,
            take: pageSize,
        }),
        prisma.follow.count({ where }),
    ]);

    const writers = follows.map((f) => f.following);
    return { writers, ...buildMeta(total, page, pageSize) };
}

export async function getFollowers(userId, { page, pageSize }) {
    const where = { followingId: userId };
    const [follows, total] = await Promise.all([
        prisma.follow.findMany({
            where,
            orderBy: { createdAt: "desc" },
            select: {
                follower: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                        image: true,
                    },
                },
            },
            skip: (page - 1) * pageSize,
            take: pageSize,
        }),
        prisma.follow.count({ where }),
    ]);

    const writers = follows.map((f) => f.follower);
    return { writers, ...buildMeta(total, page, pageSize) };
}

function buildMeta(total, page, pageSize) {
    const hasMore = page * pageSize < total;
    return {
        page,
        pageSize,
        total,
        hasMore,
        nextPage: hasMore ? page + 1 : null,
    };
}

const ARTICLE_METADATA_SELECT = {
    id: true,
    slug: true,
    title: true,
    subtitle: true,
    topic: true,
    coverImage: true,
    readTime: true,
    score: true,
    createdAt: true,
    author: {
        select: {
            name: true,
            username: true,
            image: true,
        },
    },
};

export async function getUserSaves(userId, { page, pageSize }) {
    const where = { userId };
    const [bookmarks, total] = await Promise.all([
        prisma.bookmark.findMany({
            where,
            orderBy: { createdAt: "desc" },
            select: {
                createdAt: true,
                article: { select: ARTICLE_METADATA_SELECT },
            },
            skip: (page - 1) * pageSize,
            take: pageSize,
        }),
        prisma.bookmark.count({ where }),
    ]);

    const articles = bookmarks.map((b) => ({
        ...b.article,
        saved: true,
    }));

    return { articles, ...buildMeta(total, page, pageSize) };
}

export async function getUserViews(userId, { page, pageSize }) {
    const where = { userId };
    const [views, total] = await Promise.all([
        prisma.view.findMany({
            where,
            orderBy: { lastReadDate: "desc" },
            select: {
                lastReadDate: true,
                article: { select: ARTICLE_METADATA_SELECT },
            },
            skip: (page - 1) * pageSize,
            take: pageSize,
        }),
        prisma.view.count({ where }),
    ]);

    const articleIds = views.map((v) => v.article.id);
    const bookmarks = articleIds.length
        ? await prisma.bookmark.findMany({
              where: { userId, articleId: { in: articleIds } },
              select: { articleId: true },
          }
)
        : [];
    const savedSet = new Set(bookmarks.map((b) => b.articleId));

    const articles = views.map((v) => ({
        ...v.article,
        saved: savedSet.has(v.article.id),
    }));

    return { articles, ...buildMeta(total, page, pageSize) };
}
