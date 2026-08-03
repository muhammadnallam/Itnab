import normalizeArabic from "@itnab/normalize";
import extractText from "../../lib/extractText";
import prisma from "../../lib/prisma";
import { nanoid } from "nanoid";

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
    } catch (err) {
        console.error("Error creating article:", err);
        throw new Error("حدث خطأ أثناء حفظ المقال");
    }
}

export async function getArticle({ slug, id }) {
    try {
        const article = await prisma.article.findUnique({
            where: slug ? { slug } : { id },
            include: {
                author: {
                    select: { name: true, image: true },
                },
            },
        });
        return article;
    } catch (err) {
        console.error("Error fetching article:", err);
        throw new Error("حدث خطأ أثناء جلب المقال");
    }
}

export async function updateArticle(
    articleId,
    validatedContent,
    articleData,
    userId,
) {
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
    } catch (err) {
        console.error("Error updating article:", err);
        throw new Error("حدث خطأ أثناء تعديل المقال");
    }
}

export async function deleteArticle(articleId) {
    try {
        await prisma.article.delete({
            where: { id: articleId },
        });
    } catch (err) {
        console.error("Error deleting article:", err);
        throw new Error("حدث خطأ أثناء حذف المقال");
    }
}
