import prisma from "../../lib/prisma.js";

const ACTOR_SELECT = { id: true, name: true, username: true, image: true };
const ARTICLE_SELECT = { id: true, slug: true, title: true };

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

export async function listNotifications(userId, { page, pageSize }) {
    const [total, rows] = await Promise.all([
        prisma.notification.count({ where: { recipientId: userId } }),
        prisma.notification.findMany({
            where: { recipientId: userId },
            orderBy: { updatedAt: "desc" },
            skip: (page - 1) * pageSize,
            take: pageSize,
        }),
    ]);

    if (rows.length === 0) {
        return { notifications: [], ...buildMeta(total, page, pageSize) };
    }

    // Collect actor ids (preserve per-row order later via map).
    const actorIdSet = new Set();
    for (const row of rows) {
        for (const id of row.actorIds ?? []) actorIdSet.add(id);
        if (row.actorId) actorIdSet.add(row.actorId);
    }
    const usersById = new Map();
    if (actorIdSet.size > 0) {
        const users = await prisma.user.findMany({
            where: { id: { in: [...actorIdSet] } },
            select: ACTOR_SELECT,
        });
        for (const u of users) usersById.set(u.id, u);
    }

    // Collect article ids: direct ARTICLE targets + articles behind COMMENT notifications.
    const directArticleIds = new Set();
    const commentIds = new Set();
    for (const row of rows) {
        if (row.targetType === "ARTICLE") directArticleIds.add(row.targetId);
        if (row.commentId) commentIds.add(row.commentId);
    }

    const articlesById = new Map();
    if (directArticleIds.size > 0) {
        const articles = await prisma.article.findMany({
            where: { id: { in: [...directArticleIds] } },
            select: ARTICLE_SELECT,
        });
        for (const a of articles) articlesById.set(a.id, a);
    }
    if (commentIds.size > 0) {
        const comments = await prisma.comment.findMany({
            where: { id: { in: [...commentIds] } },
            select: {
                id: true,
                articleId: true,
                article: { select: ARTICLE_SELECT },
            },
        });
        for (const c of comments) {
            if (c.article) articlesById.set(c.article.id, c.article);
        }
        // Map notification commentId -> article for reply-type rows.
        var commentArticleByCommentId = new Map(
            comments.map((c) => [c.id, c.article ?? null]),
        );
    }

    const notifications = rows.map((row) => {
        const actors = (row.actorIds ?? [])
            .map((id) => usersById.get(id))
            .filter(Boolean);
        const actor = row.actorId ? (usersById.get(row.actorId) ?? null) : null;
        let article = null;
        if (row.targetType === "ARTICLE") {
            article = articlesById.get(row.targetId) ?? null;
        } else if (row.commentId) {
            article =
                commentArticleByCommentId?.get(row.commentId) ?? null;
        }
        return {
            id: row.id,
            type: row.type,
            targetType: row.targetType,
            targetId: row.targetId,
            commentId: row.commentId,
            commentPreview: row.commentPreview,
            count: row.count,
            readAt: row.readAt,
            createdAt: row.createdAt,
            updatedAt: row.updatedAt,
            actors,
            actor,
            article,
        };
    });

    return { notifications, ...buildMeta(total, page, pageSize) };
}

export async function getUnreadCount(userId) {
    const count = await prisma.notification.count({
        where: { recipientId: userId, readAt: null },
    });
    return { count };
}

export async function markAllRead(userId) {
    const result = await prisma.notification.updateMany({
        where: { recipientId: userId, readAt: null },
        data: { readAt: new Date() },
    });
    return { marked: result.count, count: 0 };
}
