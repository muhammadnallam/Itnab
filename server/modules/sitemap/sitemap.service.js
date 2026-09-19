import prisma from "../../lib/prisma.js";

export async function getSitemapMeta() {
    const [articleAgg, authorAgg] = await Promise.all([
        prisma.article.aggregate({
            where: { deletedAt: null },
            _count: { _all: true },
            _max: { updatedAt: true },
        }),
        prisma.user.aggregate({
            where: { articles: { some: { deletedAt: null } } },
            _count: { _all: true },
            _max: { updatedAt: true },
        }),
    ]);

    return {
        articles: {
            count: articleAgg._count._all,
            lastmod: articleAgg._max.updatedAt,
        },
        authors: {
            count: authorAgg._count._all,
            lastmod: authorAgg._max.updatedAt,
        },
    };
}

export async function getSitemapArticles({ offset, limit }) {
    const where = { deletedAt: null };
    const [total, items] = await Promise.all([
        prisma.article.count({ where }),
        prisma.article.findMany({
            where,
            orderBy: [{ createdAt: "asc" }, { id: "asc" }],
            skip: offset,
            take: limit,
            select: { slug: true, updatedAt: true },
        }),
    ]);

    return { total, items };
}

export async function getSitemapAuthors({ offset, limit }) {
    const where = { articles: { some: { deletedAt: null } } };
    const [total, items] = await Promise.all([
        prisma.user.count({ where }),
        prisma.user.findMany({
            where,
            orderBy: [{ createdAt: "asc" }, { id: "asc" }],
            skip: offset,
            take: limit,
            select: { username: true, updatedAt: true },
        }),
    ]);

    return { total, items };
}
