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

export async function getFeed({ sort, author, topic, page, pageSize, userId }) {
    if (author) await assertAuthorExists(author);

    const where = { deletedAt: null };
    if (author) where.authorId = author;
    if (topic) where.topic = topic;

    const orderBy = topic
        ? { createdAt: "desc" }
        : sort === "new" ? { createdAt: "desc" } : { score: "desc" };

    const cacheable = sort === "top" && !author;
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

export async function getUserLists({ author, articleId, page, pageSize }) {
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
                createdAt: true,
                updatedAt: true,
                _count: {
                    select: { savedArticles: true },
                },
            },
            skip: (page - 1) * pageSize,
            take: pageSize,
        }),
        prisma.list.count({ where }),
    ]);

    let annotated = lists;
    if (articleId && lists.length > 0) {
        const saved = await prisma.savedArticle.findMany({
            where: {
                articleId,
                listId: { in: lists.map((l) => l.id) },
            },
            select: { listId: true },
        });
        const savedSet = new Set(saved.map((s) => s.listId));
        annotated = lists.map((l) => ({
            ...l,
            containsArticle: savedSet.has(l.id),
        }));
    }

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
