import prisma from "../../lib/prisma.js";
import { Prisma } from "../../lib/generated/prisma/client.js";

function isP2002(e) {
    return (
        e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002"
    );
}

function prependActorId(actorIds, actorId, max = 10) {
    return [actorId, ...(actorIds ?? []).filter((id) => id !== actorId)].slice(
        0,
        max,
    );
}

/**
 * Grouped like notification per article: groupKey = `like:article:{articleId}`.
 * Never throws to caller.
 */
export async function notifyArticleLike({ articleId, actorId }) {
    try {
        if (!articleId || !actorId) return null;
        const article = await prisma.article.findUnique({
            where: { id: articleId },
            select: { id: true, authorId: true },
        });
        if (!article) return null;
        if (article.authorId === actorId) return null;

        const recipientId = article.authorId;
        const groupKey = `like:article:${articleId}`;

        const existing = await prisma.notification.findUnique({
            where: { recipientId_groupKey: { recipientId, groupKey } },
        });
        if (existing) {
            const alreadyCounted = (existing.actorIds ?? []).includes(actorId);
            return await prisma.notification.update({
                where: { id: existing.id },
                data: {
                    actorIds: prependActorId(existing.actorIds, actorId),
                    count: alreadyCounted ? existing.count : existing.count + 1,
                    readAt: null,
                },
            });
        }

        try {
            return await prisma.notification.create({
                data: {
                    recipientId,
                    type: "LIKE",
                    actorIds: [actorId],
                    targetType: "ARTICLE",
                    targetId: articleId,
                    count: 1,
                    groupKey,
                },
            });
        } catch (e) {
            if (!isP2002(e)) throw e;
            // Lost a race with a concurrent create: re-read and merge.
            const raced = await prisma.notification.findUnique({
                where: { recipientId_groupKey: { recipientId, groupKey } },
            });
            if (!raced) return null;
            const alreadyCounted = (raced.actorIds ?? []).includes(actorId);
            return await prisma.notification.update({
                where: { id: raced.id },
                data: {
                    actorIds: prependActorId(raced.actorIds, actorId),
                    count: alreadyCounted ? raced.count : raced.count + 1,
                    readAt: null,
                },
            });
        }
    } catch (e) {
        console.error("[notify] notifyArticleLike failed:", e);
        return null;
    }
}

/**
 * Follow notification: reuse the latest FOLLOW row for the recipient from the
 * last 24h, otherwise insert a new row with a unique groupKey.
 * Never throws to caller.
 */
export async function notifyFollow({ targetUserId, actorId }) {
    try {
        if (!targetUserId || !actorId) return null;
        if (targetUserId === actorId) return null;

        const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const latest = await prisma.notification.findFirst({
            where: {
                recipientId: targetUserId,
                type: "FOLLOW",
                createdAt: { gt: since },
            },
            orderBy: { createdAt: "desc" },
        });

        if (latest) {
            const alreadyCounted = (latest.actorIds ?? []).includes(actorId);
            return await prisma.notification.update({
                where: { id: latest.id },
                data: {
                    actorIds: prependActorId(latest.actorIds, actorId),
                    count: alreadyCounted ? latest.count : latest.count + 1,
                    readAt: null,
                },
            });
        }

        return await prisma.notification.create({
            data: {
                recipientId: targetUserId,
                type: "FOLLOW",
                actorIds: [actorId],
                targetType: "USER",
                targetId: actorId,
                count: 1,
                groupKey: `follow:${targetUserId}:${Date.now()}`,
            },
        });
    } catch (e) {
        console.error("[notify] notifyFollow failed:", e);
        return null;
    }
}

/**
 * Comment notification: always a fresh row (groupKey null).
 * - top-level comment -> recipient = article author, target ARTICLE/articleId
 * - reply -> recipient = parent author, target COMMENT/parentId
 * Never throws to caller.
 */
export async function notifyComment({
    articleId,
    commentId,
    content,
    actorId,
    parentId = null,
    parentAuthorId = null,
    articleAuthorId = null,
    isReply,
}) {
    try {
        if (!commentId || !actorId) return null;
        const reply = isReply ?? !!parentId;

        let recipientId;
        let targetType;
        let targetId;

        if (reply) {
            if (!parentAuthorId && parentId) {
                const parent = await prisma.comment.findUnique({
                    where: { id: parentId },
                    select: { authorId: true },
                });
                parentAuthorId = parent?.authorId ?? null;
            }
            recipientId = parentAuthorId;
            targetType = "COMMENT";
            targetId = parentId;
        } else {
            if (!articleAuthorId && articleId) {
                const article = await prisma.article.findUnique({
                    where: { id: articleId },
                    select: { authorId: true },
                });
                articleAuthorId = article?.authorId ?? null;
            }
            recipientId = articleAuthorId;
            targetType = "ARTICLE";
            targetId = articleId;
        }

        if (!recipientId || !targetId) return null;
        if (recipientId === actorId) return null;

        return await prisma.notification.create({
            data: {
                recipientId,
                type: "COMMENT",
                actorId,
                actorIds: [],
                targetType,
                targetId,
                commentId,
                commentPreview:
                    typeof content === "string" ? content.slice(0, 140) : null,
                count: 1,
                groupKey: null,
            },
        });
    } catch (e) {
        console.error("[notify] notifyComment failed:", e);
        return null;
    }
}
