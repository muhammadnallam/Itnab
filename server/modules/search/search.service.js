import prisma from "../../lib/prisma.js";
import normalizeArabic from "@itnab/normalize";

export async function search({ q, tab, limit }) {
    const qNorm = normalizeArabic(q.trim());
    const result = { articles: [], authors: [] };

    if (tab === "articles" || !tab) {
        result.articles = await prisma.article.findMany({
            where: {
                deletedAt: null,
                OR: [
                    { title: { contains: qNorm, mode: "insensitive" } },
                    { subtitle: { contains: qNorm, mode: "insensitive" } },
                    { searchVector: { contains: qNorm, mode: "insensitive" } },
                ],
            },
            orderBy: { score: "desc" },
            select: {
                id: true, slug: true, title: true, subtitle: true,
                topic: true, coverImage: true, readTime: true,
                score: true, createdAt: true,
                author: {
                    select: { id: true, name: true, username: true, image: true },
                },
            },
            take: limit,
        });
    }

    if (tab === "authors" || !tab) {
        result.authors = await prisma.user.findMany({
            where: {
                OR: [
                    { name: { contains: qNorm, mode: "insensitive" } },
                    { username: { contains: qNorm, mode: "insensitive" } },
                ],
            },
            select: {
                id: true, name: true, username: true, image: true,
                followerCount: true,
            },
            take: limit,
        });
    }

    return result;
}
