import prisma from "../../lib/prisma.js";
import { ARTICLE_METADATA_SELECT } from "../feed/feed.service.js";
import { getMonthBounds, getYearBounds } from "../../lib/time.js";

export async function getRecommendations({ userId }) {
    const now = new Date();
    const monthBounds = getMonthBounds(now);
    const yearBounds = getYearBounds(now);

    const [bestThisMonth, randomArticles, randomAuthors] = await Promise.all([
        // Best 3 this month by gravity score
        getBestArticles(monthBounds, 3, userId),
        // 9 random articles
        getRandomArticles(9, userId),
        // 6 random authors
        getRandomAuthors(6),
    ]);

    // If less than 3 this month, fill from this year
    if (bestThisMonth.length < 3) {
        const remaining = 3 - bestThisMonth.length;
        const existingIds = new Set(bestThisMonth.map(a => a.id));
        const yearArticles = await prisma.article.findMany({
            where: {
                deletedAt: null,
                createdAt: { gte: yearBounds.gte, lt: yearBounds.lt },
                id: { notIn: [...existingIds] },
            },
            orderBy: { score: "desc" },
            select: ARTICLE_METADATA_SELECT,
            take: remaining,
        });
        bestThisMonth.push(...yearArticles);
    }

    // Annotate with saved for logged-in users
    if (userId && bestThisMonth.length > 0) {
        const articleIds = [...bestThisMonth.map(a => a.id), ...randomArticles.map(a => a.id)];
        const bookmarks = await prisma.bookmark.findMany({
            where: { userId, articleId: { in: articleIds } },
            select: { articleId: true },
        });
        const savedSet = new Set(bookmarks.map(b => b.articleId));
        for (const a of [...bestThisMonth, ...randomArticles]) {
            a.saved = savedSet.has(a.id);
        }
    }

    return { bestThisMonth, randomArticles, randomAuthors };
}

async function getBestArticles({ gte, lt }, take, userId) {
    return prisma.article.findMany({
        where: { deletedAt: null, createdAt: { gte, lt } },
        orderBy: { score: "desc" },
        select: ARTICLE_METADATA_SELECT,
        take,
    });
}

async function getRandomArticles(take, userId) {
    // Use raw query for true random ordering
    const articles = await prisma.$queryRaw`
        SELECT "Article"."id", "Article"."slug", "Article"."title", "Article"."subtitle",
               "Article"."topic", "Article"."coverImage", "Article"."readTime",
               "Article"."score", "Article"."createdAt",
               "user"."id" as "author_id", "user"."name" as "author_name",
               "user"."username" as "author_username", "user"."image" as "author_image"
        FROM "Article"
        JOIN "user" ON "Article"."authorId" = "user"."id"
        WHERE "Article"."deletedAt" IS NULL
        ORDER BY RANDOM()
        LIMIT ${take}
    `;
    return articles.map(mapRandomArticle);
}

async function getRandomAuthors(take) {
    const authors = await prisma.$queryRaw`
        SELECT "id", "name", "username", "image", "followerCount"
        FROM "user"
        ORDER BY RANDOM()
        LIMIT ${take}
    `;
    return authors;
}

function mapRandomArticle(row) {
    return {
        id: row.id,
        slug: row.slug,
        title: row.title,
        subtitle: row.subtitle,
        topic: row.topic,
        coverImage: row.coverImage,
        readTime: row.readTime,
        score: row.score,
        createdAt: row.createdAt,
        author: {
            id: row.author_id,
            name: row.author_name,
            username: row.author_username,
            image: row.author_image,
        },
    };
}
