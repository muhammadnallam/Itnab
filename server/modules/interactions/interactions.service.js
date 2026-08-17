import prisma from "../../lib/prisma.js";
import { Prisma } from "../../lib/generated/prisma/client.js";
import {
  AuthorizationError,
  NotFoundError,
  ValidationError,
} from "../../lib/errors.js";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function assertUuid(value, message) {
  if (typeof value !== "string" || !UUID_REGEX.test(value)) {
    throw new ValidationError(message);
  }
}

function isP2002(e) {
  return (
    e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002"
  );
}

async function assertArticleExists(db, articleId) {
  const article = await db.article.findFirst({
    where: { id: articleId, deletedAt: null },
    select: { id: true },
  });
  if (!article) throw new NotFoundError("المقال غير موجود");
  return article;
}

async function assertUserExists(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });
  if (!user) throw new NotFoundError("المستخدم غير موجود");
}

export async function getFollow(targetUserId, userId) {
  assertUuid(targetUserId, "معرف المستخدم غير صالح");
  const target = await prisma.user.findUnique({
    where: { id: targetUserId },
    select: { followerCount: true },
  });
  if (!target) throw new NotFoundError("المستخدم غير موجود");

  let isFollowing = false;
  if (userId) {
    const row = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: targetUserId,
        },
      },
      select: { followingId: true },
    });
    isFollowing = !!row;
  }
  return { isFollowing, followerCount: target.followerCount };
}

export async function followUser(targetUserId, userId) {
  assertUuid(targetUserId, "معرف المستخدم غير صالح");
  if (targetUserId === userId) {
    throw new ValidationError("لا يمكنك متابعة نفسك");
  }
  await assertUserExists(targetUserId);

  try {
    await prisma.$transaction(async (tx) => {
      await tx.follow.create({
        data: { followerId: userId, followingId: targetUserId },
      });
      await tx.user.update({
        where: { id: userId },
        data: { followingCount: { increment: 1 } },
      });
      await tx.user.update({
        where: { id: targetUserId },
        data: { followerCount: { increment: 1 } },
      });
    });
  } catch (e) {
    if (!isP2002(e)) throw e;
  }

  const target = await prisma.user.findUnique({
    where: { id: targetUserId },
    select: { followerCount: true },
  });
  return { isFollowing: true, followerCount: target.followerCount };
}

export async function unfollowUser(targetUserId, userId) {
  assertUuid(targetUserId, "معرف المستخدم غير صالح");
  await assertUserExists(targetUserId);

  await prisma.$transaction(async (tx) => {
    const deleted = await tx.follow.deleteMany({
      where: { followerId: userId, followingId: targetUserId },
    });
    if (deleted.count > 0) {
      await tx.user.update({
        where: { id: userId },
        data: { followingCount: { decrement: 1 } },
      });
      await tx.user.update({
        where: { id: targetUserId },
        data: { followerCount: { decrement: 1 } },
      });
    }
  });

  const target = await prisma.user.findUnique({
    where: { id: targetUserId },
    select: { followerCount: true },
  });
  return { isFollowing: false, followerCount: target.followerCount };
}

export async function getLikes(articleId, userId) {
  assertUuid(articleId, "معرف المقال غير صالح");
  await assertArticleExists(prisma, articleId);

  const article = await prisma.article.findUnique({
    where: { id: articleId },
    select: { likeCount: true, dislikeCount: true },
  });

  let type = null;
  if (userId) {
    const like = await prisma.like.findUnique({
      where: { userId_articleId: { userId, articleId } },
      select: { type: true },
    });
    type = like?.type ?? null;
  }

  return {
    type,
    likeCount: article.likeCount,
    dislikeCount: article.dislikeCount,
  };
}

export async function setReaction(articleId, type, userId) {
  assertUuid(articleId, "معرف المقال غير صالح");
  await assertArticleExists(prisma, articleId);

  try {
    await prisma.$transaction(async (tx) => {
      const existing = await tx.like.findUnique({
        where: { userId_articleId: { userId, articleId } },
      });

      if (existing && existing.type === type) {
        return;
      }

      if (!existing) {
        await tx.like.create({ data: { userId, articleId, type } });
        await tx.article.update({
          where: { id: articleId },
          data: {
            [type === "LIKE" ? "likeCount" : "dislikeCount"]: {
              increment: 1,
            },
          },
        });
      } else {
        await tx.like.update({
          where: { userId_articleId: { userId, articleId } },
          data: { type },
        });
        await tx.article.update({
          where: { id: articleId },
          data: {
            [existing.type === "LIKE" ? "likeCount" : "dislikeCount"]: {
              decrement: 1,
            },
          },
        });
        await tx.article.update({
          where: { id: articleId },
          data: {
            [type === "LIKE" ? "likeCount" : "dislikeCount"]: {
              increment: 1,
            },
          },
        });
      }
    });
  } catch (e) {
    if (!isP2002(e)) throw e;
  }

  const article = await prisma.article.findUnique({
    where: { id: articleId },
    select: { likeCount: true, dislikeCount: true },
  });
  return {
    type,
    likeCount: article.likeCount,
    dislikeCount: article.dislikeCount,
  };
}

export async function deleteReaction(articleId, userId) {
  assertUuid(articleId, "معرف المقال غير صالح");
  await assertArticleExists(prisma, articleId);

  await prisma.$transaction(async (tx) => {
    const existing = await tx.like.findUnique({
      where: { userId_articleId: { userId, articleId } },
    });
    if (!existing) return;
    await tx.like.delete({
      where: { userId_articleId: { userId, articleId } },
    });
    await tx.article.update({
      where: { id: articleId },
      data: {
        [existing.type === "LIKE" ? "likeCount" : "dislikeCount"]: {
          decrement: 1,
        },
      },
    });
  });

  const article = await prisma.article.findUnique({
    where: { id: articleId },
    select: { likeCount: true, dislikeCount: true },
  });
  return {
    type: null,
    likeCount: article.likeCount,
    dislikeCount: article.dislikeCount,
  };
}

export async function getSaveState(articleId, userId) {
  assertUuid(articleId, "معرف المقال غير صالح");
  await assertArticleExists(prisma, articleId);

  const article = await prisma.article.findUnique({
    where: { id: articleId },
    select: { savedCount: true },
  });

  let saved = false;
  let listIds = [];
  if (userId) {
    const bookmark = await prisma.bookmark.findUnique({
      where: { userId_articleId: { userId, articleId } },
      select: { articleId: true },
    });
    saved = !!bookmark;
    const rows = await prisma.savedArticle.findMany({
      where: { articleId, list: { authorId: userId } },
      select: { listId: true },
    });
    listIds = rows.map((r) => r.listId);
  }

  return { saved, savedCount: article.savedCount, listIds };
}

export async function saveArticle(articleId, userId, listId) {
  assertUuid(articleId, "معرف المقال غير صالح");
  if (listId) assertUuid(listId, "معرف القائمة غير صالح");
  await assertArticleExists(prisma, articleId);

  try {
    await prisma.$transaction(async (tx) => {
      let resolvedListId;
      if (listId) {
        const list = await tx.list.findFirst({
          where: { id: listId, authorId: userId },
          select: { id: true },
        });
        if (!list) {
          throw new AuthorizationError("لا يمكنك الحفظ في هذه القائمة");
        }
        resolvedListId = list.id;
      } else {
        let list = await tx.list.findFirst({
          where: { authorId: userId, isDefault: true },
          select: { id: true },
        });
        if (!list) {
          list = await tx.list.create({
            data: {
              name: "قراءة لاحقًا",
              authorId: userId,
              isDefault: true,
            },
            select: { id: true },
          });
        }
        resolvedListId = list.id;
      }

      await tx.savedArticle.create({
        data: { listId: resolvedListId, articleId },
      });

      const bookmark = await tx.bookmark.findUnique({
        where: { userId_articleId: { userId, articleId } },
        select: { articleId: true },
      });
      if (!bookmark) {
        await tx.bookmark.create({ data: { userId, articleId } });
        await tx.article.update({
          where: { id: articleId },
          data: { savedCount: { increment: 1 } },
        });
      }
    });
  } catch (e) {
    if (!isP2002(e)) throw e;
  }

  const article = await prisma.article.findUnique({
    where: { id: articleId },
    select: { savedCount: true },
  });
  return { saved: true, savedCount: article.savedCount };
}

export async function unsaveArticle(articleId, userId, listId) {
  assertUuid(articleId, "معرف المقال غير صالح");
  if (listId) assertUuid(listId, "معرف القائمة غير صالح");
  await assertArticleExists(prisma, articleId);

  const result = await prisma.$transaction(async (tx) => {
    let resolvedListId = null;
    if (listId) {
      const list = await tx.list.findFirst({
        where: { id: listId, authorId: userId },
        select: { id: true },
      });
      if (!list) {
        throw new AuthorizationError("لا يمكنك إزالة الحفظ من هذه القائمة");
      }
      resolvedListId = list.id;
    } else {
      const list = await tx.list.findFirst({
        where: { authorId: userId, isDefault: true },
        select: { id: true },
      });
      resolvedListId = list?.id ?? null;
    }

    if (resolvedListId) {
      await tx.savedArticle.deleteMany({
        where: { listId: resolvedListId, articleId },
      });
    }

    const remaining = await tx.savedArticle.findFirst({
      where: { articleId, list: { authorId: userId } },
      select: { listId: true },
    });
    if (!remaining) {
      const deleted = await tx.bookmark.deleteMany({
        where: { userId, articleId },
      });
      if (deleted.count > 0) {
        await tx.article.update({
          where: { id: articleId },
          data: { savedCount: { decrement: 1 } },
        });
      }
    }

    return tx.article.findUnique({
      where: { id: articleId },
      select: { savedCount: true },
    });
  });

  return { saved: false, savedCount: result.savedCount };
}

export async function shareArticle(articleId, platform, userId, guestId) {
  assertUuid(articleId, "معرف المقال غير صالح");
  await assertArticleExists(prisma, articleId);

  const result = await prisma.$transaction(async (tx) => {
    await tx.share.create({
      data: {
        userId: userId ?? null,
        guestId: userId ? null : guestId,
        articleId,
        platform,
      },
    });
    await tx.article.update({
      where: { id: articleId },
      data: { shareCount: { increment: 1 } },
    });
    return tx.article.findUnique({
      where: { id: articleId },
      select: { shareCount: true },
    });
  });

  return { shareCount: result.shareCount };
}

export async function recordView(
  articleId,
  userId,
  { guestId, deviceType, country, browser, os, referrer },
) {
  assertUuid(articleId, "معرف المقال غير صالح");

  try {
    await prisma.$transaction(async (tx) => {
      const article = await tx.article.findFirst({
        where: { id: articleId, deletedAt: null },
        select: { id: true, authorId: true },
      });
      if (!article) throw new NotFoundError("المقال غير موجود");

      if (userId && userId === article.authorId) {
        return;
      }

      await tx.view.create({
        data: {
          ...(userId ? { userId } : { guestId }),
          articleId,
          deviceType,
          country,
          browser,
          os,
          referrer,
        },
      });
      await tx.article.update({
        where: { id: articleId },
        data: { viewCount: { increment: 1 } },
      });
    });
  } catch (e) {
    if (!isP2002(e)) throw e;
  }

  const article = await prisma.article.findUnique({
    where: { id: articleId },
    select: { viewCount: true },
  });
  return { viewCount: article.viewCount };
}
