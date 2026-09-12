import prisma from "../../lib/prisma.js";
import { NotFoundError, ValidationError } from "../../lib/errors.js";
import { getFeedCache, setFeedCache } from "../../lib/cache/feed-cache.js";

export const ARTICLE_METADATA_SELECT = {
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
            id: true,
            name: true,
            username: true,
            image: true,
        },
    },
};

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

async function assertAuthorExists(authorId) {
    const author = await prisma.user.findUnique({
        where: { id: authorId },
        select: { id: true },
    });
    if (!author) throw new NotFoundError("الكاتب غير موجود");
}

export async function getFeed({ sort, author, topic, filter, page, pageSize, userId }) {
    if (author) await assertAuthorExists(author);

    const where = { deletedAt: null };
    if (filter === "subscriptions") {
        if (!userId) {
            where.authorId = "__none__";
        } else {
            const follows = await prisma.follow.findMany({
                where: { followerId: userId },
                select: { followingId: true },
            });
            const followingIds = follows.map((f) => f.followingId);
            if (followingIds.length === 0) {
                return { articles: [], ...buildMeta(0, page, pageSize) };
            }
            where.authorId = { in: followingIds };
        }
    } else {
        if (author) where.authorId = author;
        if (topic) where.topic = topic;
    }

    const orderBy =
        filter === "subscriptions"
            ? { createdAt: "desc" }
            : topic
              ? { createdAt: "desc" }
              : sort === "new"
                ? { createdAt: "desc" }
                : { score: "desc" };

    const cacheable = sort === "top" && !author && !filter;
    const cacheKey = `top:${page}:${pageSize}`;
    let result = cacheable ? getFeedCache(cacheKey) : null;
    if (!result) {
        const [articles, total] = await Promise.all([
            prisma.article.findMany({
                where,
                orderBy,
                select: ARTICLE_METADATA_SELECT,
                skip: (page - 1) * pageSize,
                take: pageSize,
            }),
            prisma.article.count({ where }),
        ]);

        result = { articles, ...buildMeta(total, page, pageSize) };
        if (cacheable) setFeedCache(cacheKey, result);
    }

    if (userId && result.articles.length > 0) {
        const bookmarks = await prisma.bookmark.findMany({
            where: {
                userId,
                articleId: { in: result.articles.map((a) => a.id) },
            },
            select: { articleId: true },
        });
        const savedSet = new Set(bookmarks.map((b) => b.articleId));
        result = {
            ...result,
            articles: result.articles.map((a) => ({
                ...a,
                saved: savedSet.has(a.id),
            })),
        };
    }

    return result;
}

export async function getUserLists({ author, articleId, page, pageSize, userId }) {
    if (!author) throw new ValidationError("معرف المؤلف مطلوب");
    await assertAuthorExists(author);

    const where = { authorId: author };
    const [lists, total] = await Promise.all([
        prisma.list.findMany({
            where,
            orderBy: { updatedAt: "desc" },
            select: {
                id: true,
                name: true,
                authorId: true,
                createdAt: true,
                updatedAt: true,
                author: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                        image: true,
                    },
                },
                savedArticles: {
                    take: 3,
                    orderBy: { createdAt: "desc" },
                    select: {
                        article: {
                            select: { coverImage: true },
                        },
                    },
                },
                _count: {
                    select: { savedArticles: true },
                },
            },
            skip: (page - 1) * pageSize,
            take: pageSize,
        }),
        prisma.list.count({ where }),
    ]);

    let annotated = lists.map((l) => ({
        ...l,
        images: l.savedArticles.map((sa) => sa.article.coverImage).filter(Boolean),
        savedArticles: undefined,
    }));

    if (articleId && annotated.length > 0) {
        const saved = await prisma.savedArticle.findMany({
            where: {
                articleId,
                listId: { in: annotated.map((l) => l.id) },
            },
            select: { listId: true },
        });
        const savedSet = new Set(saved.map((s) => s.listId));
        annotated = annotated.map((l) => ({
            ...l,
            containsArticle: savedSet.has(l.id),
        }));
    }

    let savedListIds = new Set();
    if (userId && annotated.length > 0) {
        const userSaves = await prisma.savedList.findMany({
            where: {
                userId,
                listId: { in: annotated.map((l) => l.id) },
            },
            select: { listId: true },
        });
        savedListIds = new Set(userSaves.map((s) => s.listId));
    }

    annotated = annotated.map((l) => ({
        ...l,
        saved: savedListIds.has(l.id),
    }));

    return { lists: annotated, ...buildMeta(total, page, pageSize) };
}

export async function createUserList({ userId, name }) {
    return prisma.list.create({
        data: { name, authorId: userId, isDefault: false },
        select: {
            id: true,
            name: true,
            createdAt: true,
            updatedAt: true,
            _count: { select: { savedArticles: true } },
        },
    });
}

export async function getList({ listId, userId }) {
    const list = await prisma.list.findUnique({
        where: { id: listId },
        select: {
            id: true,
            name: true,
            authorId: true,
            createdAt: true,
            updatedAt: true,
            author: {
                select: {
                    id: true,
                    name: true,
                    username: true,
                    image: true,
                },
            },
            savedArticles: {
                orderBy: { createdAt: "desc" },
                select: {
                    article: {
                        select: ARTICLE_METADATA_SELECT,
                    },
                },
            },
            _count: { select: { savedArticles: true } },
        },
    });

    if (!list) throw new NotFoundError("القائمة غير موجودة");

    let saved = false;
    if (userId) {
        const entry = await prisma.savedList.findUnique({
            where: { userId_listId: { userId, listId } },
            select: { userId: true },
        });
        saved = !!entry;
    }

    let articles = list.savedArticles.map((sa) => sa.article);
    if (userId && articles.length > 0) {
        const bookmarks = await prisma.bookmark.findMany({
            where: {
                userId,
                articleId: { in: articles.map((a) => a.id) },
            },
            select: { articleId: true },
        });
        const savedSet = new Set(bookmarks.map((b) => b.articleId));
        articles = articles.map((a) => ({
            ...a,
            saved: savedSet.has(a.id),
        }));
    }

    return {
        ...list,
        articles,
        savedArticles: undefined,
        saved,
    };
}

export async function renameList({ listId, userId, name }) {
    const list = await prisma.list.findUnique({
        where: { id: listId },
        select: { id: true, authorId: true },
    });
    if (!list) throw new NotFoundError("القائمة غير موجودة");
    if (list.authorId !== userId) throw new NotFoundError("غير مصرح לך بتعديل هذه القائمة");

    return prisma.list.update({
        where: { id: listId },
        data: { name },
        select: {
            id: true,
            name: true,
            updatedAt: true,
        },
    });
}

export async function deleteList({ listId, userId }) {
    const list = await prisma.list.findUnique({
        where: { id: listId },
        select: { id: true, authorId: true, isDefault: true },
    });
    if (!list) throw new NotFoundError("القائمة غير موجودة");
    if (list.authorId !== userId) throw new NotFoundError("غير مصرح لك بحذف هذه القائمة");
    if (list.isDefault) throw new NotFoundError("لا يمكن حذف القائمة الافتراضية");

    await prisma.list.delete({ where: { id: listId } });
    return { success: true };
}

export async function saveList({ listId, userId }) {
    const list = await prisma.list.findUnique({
        where: { id: listId },
        select: { id: true },
    });
    if (!list) throw new NotFoundError("القائمة غير موجودة");

    await prisma.savedList.upsert({
        where: { userId_listId: { userId, listId } },
        create: { userId, listId },
        update: {},
    });
    return { saved: true };
}

export async function unsaveList({ listId, userId }) {
    await prisma.savedList.deleteMany({
        where: { userId, listId },
    });
    return { saved: false };
}
