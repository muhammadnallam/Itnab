import normalizeArabic from "@itnab/normalize";
import extractText from "../../lib/extractText.js";
import prisma from "../../lib/prisma.js";
import { nanoid } from "nanoid";
import {
    AuthorizationError,
    NotFoundError,
    handlePrismaError,
} from "../../lib/errors.js";
import { clearFeedCache } from "../../lib/cache/feed-cache.js";

function parseOriginalDate(value) {
    return new Date(`${value}T12:00:00.000Z`);
}

async function assertUserExists(userId) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true },
    });
    if (!user) throw new NotFoundError("المستخدم غير موجود");
}

async function resolveListForAuthor(tx, authorId, { listId, listName }) {
    if (listId) {
        const list = await tx.list.findFirst({
            where: { id: listId, authorId },
            select: { id: true },
        });
        if (!list) {
            throw new AuthorizationError("لا يمكنك الإضافة إلى هذه القائمة");
        }
        return list.id;
    }

    if (listName) {
        let list = await tx.list.findFirst({
            where: {
                authorId,
                name: { equals: listName, mode: "insensitive" },
            },
            select: { id: true },
        });
        if (!list) {
            list = await tx.list.create({
                data: { name: listName, authorId, isDefault: false },
                select: { id: true },
            });
        }
        return list.id;
    }

    return null;
}

async function slugify(title) {
    let slug = normalizeArabic(title)
        .replace(/\s+/g, "-")
        .replace(/[،؛!.,"']/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9\u0600-\u06FF-]/g, "")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");

    let exists = await prisma.article.findUnique({ where: { slug } });
    while (exists) {
        slug = slug + "-" + nanoid(6);
        exists = await prisma.article.findUnique({ where: { slug } });
    }

    return slug;
}

const MAX_SUBTITLE_LENGTH = 200;

function extractBodyText(doc) {
    const parts = [];

    function walk(node) {
        if (node.type === "text") {
            parts.push(node.text);
            return;
        }
        if (Array.isArray(node.content)) {
            for (const child of node.content) {
                walk(child);
            }
            parts.push(" ");
        }
    }

    walk(doc);
    return parts.join("").replace(/\s+/g, " ").trim();
}

function resolveSubtitle(validatedContent, bodyContent) {
    const rawSubtitle =
        validatedContent.content?.[1]?.content?.[0]?.text?.trim() || "";
    if (rawSubtitle) return rawSubtitle;

    return extractBodyText(bodyContent).slice(0, MAX_SUBTITLE_LENGTH);
}

export async function createArticle(
    validatedContent,
    articleData,
    requesterId,
    admin = false,
) {
    const { seoTitle, seoDescription, tag, sendEmail, coverImage, wordCount } =
        articleData;
    const title =
        validatedContent.content?.[0]?.content?.[0]?.text?.trim() || "";
    const slug = await slugify(title);
    const searchVector = normalizeArabic(extractText(validatedContent));
    const readTime = Math.max(1, Math.ceil(wordCount / 120));

    const contentClone = JSON.parse(JSON.stringify(validatedContent));
    contentClone.content.splice(0, 2);
    const subtitle = resolveSubtitle(validatedContent, contentClone);

    const authorId =
        admin && articleData.publishTo ? articleData.publishTo : requesterId;
    if (authorId !== requesterId) {
        await assertUserExists(authorId);
    }
    const createdAt =
        admin && articleData.originalDate
            ? parseOriginalDate(articleData.originalDate)
            : null;

    const { listId, listName } = articleData;

    try {
        await prisma.$transaction(async (tx) => {
            const resolvedListId = await resolveListForAuthor(tx, authorId, {
                listId,
                listName,
            });

            const article = await tx.article.create({
                data: {
                    slug: slug,
                    title: title,
                    subtitle: subtitle,
                    seoTitle: seoTitle,
                    seoSubtitle: seoDescription,
                    topic: tag,
                    coverImage: coverImage,
                    content: contentClone,
                    searchVector: searchVector,
                    readTime: readTime,
                    authorId,
                    ...(createdAt ? { createdAt } : {}),
                },
            });

            if (resolvedListId) {
                await tx.savedArticle.create({
                    data: { listId: resolvedListId, articleId: article.id },
                });

                const bookmark = await tx.bookmark.findUnique({
                    where: {
                        userId_articleId: {
                            userId: authorId,
                            articleId: article.id,
                        },
                    },
                    select: { articleId: true },
                });

                if (!bookmark) {
                    await tx.bookmark.create({
                        data: { userId: authorId, articleId: article.id },
                    });
                    await tx.article.update({
                        where: { id: article.id },
                        data: { savedCount: { increment: 1 } },
                    });
                }
            }
        });

        if (createdAt) {
            clearFeedCache();
        }

        return slug;
    } catch (e) {
        handlePrismaError(e, {
            duplicateMsg: "تعذر حفظ المقال, يرجى المحاولة مرة أخرى",
        });
    }
}

export async function getArticlesForExport(authorId) {
    return prisma.article.findMany({
        where: { authorId, deletedAt: null },
        orderBy: { createdAt: "asc" },
        select: {
            slug: true,
            title: true,
            subtitle: true,
            content: true,
        },
    });
}

export async function getArticle({ slug, id }) {
    try {
        return await prisma.article.findUniqueOrThrow({
            where: slug ? { slug, deletedAt: null } : { id, deletedAt: null },
            include: {
                author: {
                    select: { id: true, name: true, username: true, image: true },
                },
            },
        });
    } catch (e) {
        handlePrismaError(e, { notFoundMsg: "المقال غير موجود" });
    }
}

export async function updateArticle(
    articleId,
    validatedContent,
    articleData,
    requesterId,
    admin = false,
) {
    const article = await getArticle({ id: articleId });
    if (article.authorId !== requesterId && !admin) {
        throw new AuthorizationError("ليس لديك صلاحية تعديل هذا المقال");
    }

    const { seoTitle, seoDescription, tag, sendEmail, coverImage, wordCount } =
        articleData;
    const title =
        validatedContent.content?.[0]?.content?.[0]?.text?.trim() || "";
    const searchVector = normalizeArabic(extractText(validatedContent));
    const readTime = Math.max(1, Math.ceil(wordCount / 120));

    const contentClone = JSON.parse(JSON.stringify(validatedContent));
    contentClone.content.splice(0, 2);
    const subtitle = resolveSubtitle(validatedContent, contentClone);

    const nextAuthorId =
        admin && articleData.publishTo ? articleData.publishTo : null;
    if (nextAuthorId) {
        await assertUserExists(nextAuthorId);
    }
    const createdAt =
        admin && articleData.originalDate
            ? parseOriginalDate(articleData.originalDate)
            : null;

    try {
        await prisma.article.update({
            where: { id: articleId },
            data: {
                title,
                subtitle,
                seoTitle,
                seoSubtitle: seoDescription,
                topic: tag,
                coverImage,
                content: contentClone,
                searchVector,
                readTime,
                ...(nextAuthorId ? { authorId: nextAuthorId } : {}),
                ...(createdAt ? { createdAt } : {}),
            },
        });

        if (createdAt) {
            clearFeedCache();
        }
    } catch (e) {
        handlePrismaError(e, { notFoundMsg: "المقال غير موجود" });
    }
}

export async function deleteArticle(articleId, requesterId, admin = false) {
    const article = await getArticle({ id: articleId });
    if (article.authorId !== requesterId && !admin) {
        throw new AuthorizationError("ليس لديك صلاحية حذف هذا المقال");
    }

    try {
        await prisma.article.update({
            where: { id: articleId },
            data: { deletedAt: new Date() },
        });
    } catch (e) {
        handlePrismaError(e, { notFoundMsg: "المقال غير موجود" });
    }
}
