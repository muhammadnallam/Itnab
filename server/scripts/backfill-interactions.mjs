import prisma from "../lib/prisma.js";

async function main() {
  const followers = await prisma.follow.groupBy({
    by: ["followingId"],
    _count: { _all: true },
  });
  const following = await prisma.follow.groupBy({
    by: ["followerId"],
    _count: { _all: true },
  });

  for (const row of followers) {
    await prisma.user.update({
      where: { id: row.followingId },
      data: { followerCount: row._count._all },
    });
  }
  for (const row of following) {
    await prisma.user.update({
      where: { id: row.followerId },
      data: { followingCount: row._count._all },
    });
  }

  const likes = await prisma.like.groupBy({
    by: ["articleId"],
    _count: { _all: true },
  });
  for (const row of likes) {
    await prisma.article.update({
      where: { id: row.articleId },
      data: { likeCount: row._count._all },
    });
  }

  const bookmarks = await prisma.bookmark.groupBy({
    by: ["articleId"],
    _count: { _all: true },
  });
  for (const row of bookmarks) {
    await prisma.article.update({
      where: { id: row.articleId },
      data: { savedCount: row._count._all },
    });
  }

  const shares = await prisma.share.groupBy({
    by: ["articleId"],
    _count: { _all: true },
  });
  for (const row of shares) {
    await prisma.article.update({
      where: { id: row.articleId },
      data: { shareCount: row._count._all },
    });
  }

  const views = await prisma.view.groupBy({
    by: ["articleId"],
    _count: { _all: true },
  });
  for (const row of views) {
    await prisma.article.update({
      where: { id: row.articleId },
      data: { viewCount: row._count._all },
    });
  }

  console.log("Backfill complete");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
