/*
  Warnings:

  - The primary key for the `Share` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `_ArticleToList` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[guestId,articleId]` on the table `View` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `Share` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- CreateEnum
CREATE TYPE "ReactionType" AS ENUM ('LIKE', 'DISLIKE');

-- CreateEnum
CREATE TYPE "DeviceType" AS ENUM ('DESKTOP', 'MOBILE', 'OTHER');

-- DropForeignKey
ALTER TABLE "Share" DROP CONSTRAINT "Share_userId_fkey";

-- DropForeignKey
ALTER TABLE "_ArticleToList" DROP CONSTRAINT "_ArticleToList_A_fkey";

-- DropForeignKey
ALTER TABLE "_ArticleToList" DROP CONSTRAINT "_ArticleToList_B_fkey";

-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "dislikeCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "likeCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "savedCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "shareCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "viewCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Like" ADD COLUMN     "type" "ReactionType" NOT NULL DEFAULT 'LIKE';

-- AlterTable
ALTER TABLE "Share" DROP CONSTRAINT "Share_pkey",
ADD COLUMN     "guestId" TEXT,
ADD COLUMN     "id" UUID NOT NULL,
ADD COLUMN     "platform" TEXT NOT NULL DEFAULT 'copy',
ALTER COLUMN "userId" DROP NOT NULL,
ADD CONSTRAINT "Share_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "View" ADD COLUMN     "browser" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "deviceType" "DeviceType" NOT NULL DEFAULT 'OTHER',
ADD COLUMN     "guestId" TEXT,
ADD COLUMN     "os" TEXT,
ADD COLUMN     "referrer" TEXT;

-- AlterTable
ALTER TABLE "list" ADD COLUMN     "isDefault" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "followerCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "followingCount" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "_ArticleToList";

-- CreateTable
CREATE TABLE "SavedArticle" (
    "listId" UUID NOT NULL,
    "articleId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedArticle_pkey" PRIMARY KEY ("listId","articleId")
);

-- CreateIndex
CREATE INDEX "SavedArticle_articleId_idx" ON "SavedArticle"("articleId");

-- CreateIndex
CREATE INDEX "Share_articleId_idx" ON "Share"("articleId");

-- CreateIndex
CREATE INDEX "View_articleId_idx" ON "View"("articleId");

-- CreateIndex
CREATE UNIQUE INDEX "View_guestId_articleId_key" ON "View"("guestId", "articleId");

-- AddForeignKey
ALTER TABLE "Share" ADD CONSTRAINT "Share_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedArticle" ADD CONSTRAINT "SavedArticle_listId_fkey" FOREIGN KEY ("listId") REFERENCES "list"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedArticle" ADD CONSTRAINT "SavedArticle_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;
