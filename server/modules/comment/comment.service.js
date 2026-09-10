import prisma from "../../lib/prisma.js";
import { Prisma } from "../../lib/generated/prisma/client.js";
import {
  AuthorizationError,
  NotFoundError,
  ValidationError,
} from "../../lib/errors.js";

const MAX_DEPTH = 3;

const AUTHOR_INCLUDE = {
  select: { id: true, name: true, username: true, image: true },
};

function isP2002(e) {
  return (
    e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002"
  );
}

async function assertArticleExists(articleId) {
  const article = await prisma.article.findFirst({
    where: { id: articleId, deletedAt: null },
    select: { id: true, authorId: true },
  });
  if (!article) throw new NotFoundError("المقال غير موجود");
  return article;
}

async function assertCommentExists(commentId) {
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    select: { id: true },
  });
  if (!comment) throw new NotFoundError("التعليق غير موجود");
}

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

function serializeComment(comment, articleAuthorId, likedByMe) {
  const isDeleted = !!comment.deletedAt;
  return {
    id: comment.id,
    content: isDeleted ? null : comment.content,
    depth: comment.depth,
    likeCount: comment.likeCount,
    replyCount: comment.replyCount,
    isEdited: comment.isEdited,
    isDeleted,
    isByAuthor: comment.authorId === articleAuthorId,
    likedByMe: !!likedByMe,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
    author: comment.author,
    replies: [],
  };
}

function pruneDeleted(comments) {
  return comments.filter((comment) => {
    comment.replies = pruneDeleted(comment.replies);
    return !comment.isDeleted || comment.replies.length > 0;
  });
}

export async function listComments(articleId, { page, pageSize, userId }) {
  const article = await assertArticleExists(articleId);

  const rootsMeta = await prisma.comment.findMany({
    where: { articleId, depth: 1 },
    select: { id: true, likeCount: true, replyCount: true, createdAt: true },
  });

  const now = Date.now();
  const sorted = rootsMeta
    .map((c) => {
      const ageHours = (now - c.createdAt.getTime()) / 3_600_000;
      const score =
        (c.likeCount + 2 * c.replyCount) / Math.pow(ageHours + 2, 1.5);
      return { ...c, score };
    })
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      const t = a.createdAt.getTime() - b.createdAt.getTime();
      if (t !== 0) return t;
      return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
    });

  const total = sorted.length;
  const pageIds = sorted
    .slice((page - 1) * pageSize, page * pageSize)
    .map((c) => c.id);

  if (pageIds.length === 0) {
    return { comments: [], ...buildMeta(total, page, pageSize) };
  }

  const [rootRows, replyRows] = await Promise.all([
    prisma.comment.findMany({
      where: { id: { in: pageIds } },
      include: { author: AUTHOR_INCLUDE },
    }),
    prisma.comment.findMany({
      where: { rootId: { in: pageIds } },
      orderBy: { createdAt: "asc" },
      include: { author: AUTHOR_INCLUDE },
    }),
  ]);

  const rootsById = new Map(rootRows.map((c) => [c.id, c]));
  const orderedRoots = pageIds.map((id) => rootsById.get(id)).filter(Boolean);

  let likedIds = null;
  if (userId) {
    const allIds = [...pageIds, ...replyRows.map((c) => c.id)];
    const likes = await prisma.commentLike.findMany({
      where: { userId, commentId: { in: allIds } },
      select: { commentId: true },
    });
    likedIds = new Set(likes.map((l) => l.commentId));
  }

  const commentsById = new Map();
  for (const row of [...orderedRoots, ...replyRows]) {
    commentsById.set(
      row.id,
      serializeComment(row, article.authorId, likedIds?.has(row.id)),
    );
  }

  const roots = orderedRoots.map((row) => commentsById.get(row.id));
  for (const row of replyRows) {
    const parent = commentsById.get(row.parentId);
    if (parent) parent.replies.push(commentsById.get(row.id));
  }

  return {
    comments: pruneDeleted(roots),
    ...buildMeta(total, page, pageSize),
  };
}

export async function createComment(articleId, { content, parentId }, userId) {
  const article = await assertArticleExists(articleId);

  let depth = 1;
  let rootId = null;
  let finalContent = content;

  if (parentId) {
    const parent = await prisma.comment.findFirst({
      where: { id: parentId, articleId, deletedAt: null },
      include: { author: { select: { username: true } } },
    });
    if (!parent) throw new NotFoundError("التعليق غير موجود");
    if (parent.depth >= MAX_DEPTH) {
      throw new ValidationError("لا يمكن الرد على هذا التعليق");
    }
    depth = parent.depth + 1;
    rootId = parent.rootId ?? parent.id;
    finalContent = `@${parent.author.username} ${content}`;
  }

  const comment = await prisma.$transaction(async (tx) => {
    const created = await tx.comment.create({
      data: {
        content: finalContent,
        depth,
        articleId,
        authorId: userId,
        parentId: parentId ?? null,
        rootId,
      },
      include: { author: AUTHOR_INCLUDE },
    });
    if (parentId) {
      await tx.comment.update({
        where: { id: parentId },
        data: { replyCount: { increment: 1 } },
      });
      if (rootId !== parentId) {
        await tx.comment.update({
          where: { id: rootId },
          data: { replyCount: { increment: 1 } },
        });
      }
    }
    await tx.article.update({
      where: { id: articleId },
      data: { commentCount: { increment: 1 } },
    });
    return created;
  });

  return serializeComment(comment, article.authorId, false);
}

export async function updateComment(commentId, content, userId) {
  const existing = await prisma.comment.findUnique({
    where: { id: commentId },
    select: { authorId: true, deletedAt: true },
  });
  if (!existing || existing.deletedAt) {
    throw new NotFoundError("التعليق غير موجود");
  }
  if (existing.authorId !== userId) {
    throw new AuthorizationError("لا يمكنك تعديل هذا التعليق");
  }

  const comment = await prisma.comment.update({
    where: { id: commentId },
    data: { content, isEdited: true },
    include: {
      author: AUTHOR_INCLUDE,
      article: { select: { authorId: true } },
      likes: { where: { userId }, select: { userId: true } },
    },
  });

  return serializeComment(
    comment,
    comment.article.authorId,
    comment.likes.length > 0,
  );
}

export async function deleteComment(commentId, userId) {
  const existing = await prisma.comment.findUnique({
    where: { id: commentId },
    select: {
      id: true,
      authorId: true,
      articleId: true,
      parentId: true,
      rootId: true,
      deletedAt: true,
    },
  });
  if (!existing) throw new NotFoundError("التعليق غير موجود");
  if (existing.authorId !== userId) {
    throw new AuthorizationError("لا يمكنك حذف هذا التعليق");
  }

  if (!existing.deletedAt) {
    await prisma.$transaction(async (tx) => {
      await tx.comment.update({
        where: { id: commentId },
        data: { deletedAt: new Date() },
      });

      const liveChildren = await tx.comment.count({
        where: { parentId: commentId, deletedAt: null },
      });
      if (liveChildren === 0) {
        if (existing.parentId) {
          await tx.comment.update({
            where: { id: existing.parentId },
            data: { replyCount: { decrement: 1 } },
          });
          if (existing.rootId && existing.rootId !== existing.parentId) {
            await tx.comment.update({
              where: { id: existing.rootId },
              data: { replyCount: { decrement: 1 } },
            });
          }
        }
        await tx.article.update({
          where: { id: existing.articleId },
          data: { commentCount: { decrement: 1 } },
        });
      }
    });
  }

  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    include: {
      author: AUTHOR_INCLUDE,
      article: { select: { authorId: true } },
      likes: { where: { userId }, select: { userId: true } },
    },
  });

  return serializeComment(
    comment,
    comment.article.authorId,
    comment.likes.length > 0,
  );
}

export async function likeComment(commentId, userId) {
  await assertCommentExists(commentId);

  try {
    await prisma.$transaction(async (tx) => {
      const existing = await tx.commentLike.findUnique({
        where: { userId_commentId: { userId, commentId } },
      });
      if (existing) return;
      await tx.commentLike.create({ data: { userId, commentId } });
      await tx.comment.update({
        where: { id: commentId },
        data: { likeCount: { increment: 1 } },
      });
    });
  } catch (e) {
    if (!isP2002(e)) throw e;
  }

  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    select: { likeCount: true },
  });
  return { liked: true, likeCount: comment.likeCount };
}

export async function unlikeComment(commentId, userId) {
  await assertCommentExists(commentId);

  await prisma.$transaction(async (tx) => {
    const existing = await tx.commentLike.findUnique({
      where: { userId_commentId: { userId, commentId } },
    });
    if (!existing) return;
    await tx.commentLike.delete({
      where: { userId_commentId: { userId, commentId } },
    });
    await tx.comment.update({
      where: { id: commentId },
      data: { likeCount: { decrement: 1 } },
    });
  });

  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    select: { likeCount: true },
  });
  return { liked: false, likeCount: comment.likeCount };
}
