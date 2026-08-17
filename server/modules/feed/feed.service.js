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
            name: true,
            username: true,
            avatarUrl: true,
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

export async function getFeed({ sort, author, page, pageSize }) {
    if (author) await assertAuthorExists(author);

  const where = author
    ? { authorId: author, deletedAt: null }
    : { deletedAt: null };
    const orderBy = sort === "new" ? { createdAt: "desc" } : { score: "desc" };

    const cacheable = sort === "top" && !author;
    const cacheKey = `top:${page}:${pageSize}`;
    if (cacheable) {
        const cached = getFeedCache(cacheKey);
        if (cached) return cached;
    }

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

    const result = { articles, ...buildMeta(total, page, pageSize) };
    if (cacheable) setFeedCache(cacheKey, result);
    return result;
}

export async function getUserLists({ author, page, pageSize }) {
    if (!author) {
        throw new ValidationError("معرف المؤلف مطلوب");
    }
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

    return { lists, ...buildMeta(total, page, pageSize) };
}
