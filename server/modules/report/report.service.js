import prisma from "../../lib/prisma.js";
import {
    ConflictError,
    NotFoundError,
    ValidationError,
} from "../../lib/errors.js";

export async function createReport({
    reporterId,
    articleId,
    profileId,
    category,
    details,
}) {
    if (articleId) {
        const article = await prisma.article.findFirst({
            where: { id: articleId, deletedAt: null },
            select: { authorId: true },
        });
        if (!article) throw new NotFoundError("المقال غير موجود");
        if (article.authorId === reporterId) {
            throw new ValidationError("لا يمكنك الإبلاغ عن مقالك");
        }
    } else {
        const profile = await prisma.user.findUnique({
            where: { id: profileId },
            select: { id: true },
        });
        if (!profile) throw new NotFoundError("المستخدم غير موجود");
        if (profile.id === reporterId) {
            throw new ValidationError("لا يمكنك الإبلاغ عن حسابك");
        }
    }

    try {
        await prisma.report.create({
            data: {
                reporterId,
                articleId: articleId ?? null,
                profileId: profileId ?? null,
                category,
                details: details ?? null,
            },
        });
    } catch (e) {
        if (e?.code === "P2002") {
            throw new ConflictError(
                articleId
                    ? "لقد سبق أن أبلغت عن هذا المقال"
                    : "لقد سبق أن أبلغت عن هذا المؤلف",
                "ALREADY_REPORTED",
            );
        }
        throw e;
    }

    return { success: true };
}
