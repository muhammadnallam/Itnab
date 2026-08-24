import normalizeArabic from "@itnab/normalize";
import extractText from "../../lib/extractText.js";
import prisma from "../../lib/prisma.js";
import { nanoid } from "nanoid";
import { AuthorizationError, handlePrismaError } from "../../lib/errors.js";

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

export async function createArticle(validatedContent, articleData, userId) {
    const { seoTitle, seoDescription, tag, sendEmail, coverImage, wordCount } =
        articleData;
    const title =
        validatedContent.content?.[0]?.content?.[0]?.text?.trim() || "";
    const subtitle =
        validatedContent.content?.[1]?.content?.[0]?.text?.trim() || "";
    const slug = await slugify(title);
    const searchVector = normalizeArabic(extractText(validatedContent));
    const readTime = Math.max(1, Math.ceil(wordCount / 120));

    const contentClone = JSON.parse(JSON.stringify(validatedContent));
    contentClone.content.splice(0, 2);

    try {
        const result = await prisma.article.create({
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
                authorId: userId,
            },
        });

        return slug;
    } catch (e) {
        handlePrismaError(e, {
            duplicateMsg: "تعذر حفظ المقال, يرجى المحاولة مرة أخرى",
        });
    }
}

export async function getArticle({ slug, id }) {
    try {
        return await prisma.article.findUniqueOrThrow({
            where: slug ? { slug, deletedAt: null } : { id, deletedAt: null },
            include: {
                author: {
                    select: { name: true, username: true, image: true },
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
    userId,
) {
    const article = await getArticle({ id: articleId });
    if (article.authorId !== userId) {
        throw new AuthorizationError("ليس لديك صلاحية تعديل هذا المقال");
    }

    const { seoTitle, seoDescription, tag, sendEmail, coverImage, wordCount } =
        articleData;
    const title =
        validatedContent.content?.[0]?.content?.[0]?.text?.trim() || "";
    const subtitle =
        validatedContent.content?.[1]?.content?.[0]?.text?.trim() || "";
    const searchVector = normalizeArabic(extractText(validatedContent));
    const readTime = Math.max(1, Math.ceil(wordCount / 120));

    const contentClone = JSON.parse(JSON.stringify(validatedContent));
    contentClone.content.splice(0, 2);

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
            },
        });
    } catch (e) {
        handlePrismaError(e, { notFoundMsg: "المقال غير موجود" });
    }
}

export async function deleteArticle(articleId, userId) {
    const article = await getArticle({ id: articleId });
    if (article.authorId !== userId) {
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
