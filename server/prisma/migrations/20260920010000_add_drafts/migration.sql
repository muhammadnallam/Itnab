-- CreateTable
CREATE TABLE "draft" (
    "id" UUID NOT NULL,
    "title" TEXT,
    "wordCount" INTEGER NOT NULL DEFAULT 0,
    "content" JSONB NOT NULL,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "topic" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" UUID NOT NULL,
    "articleId" UUID,
    CONSTRAINT "draft_pkey" PRIMARY KEY ("id")
);
-- CreateIndex
CREATE INDEX "draft_userId_updatedAt_idx" ON "draft"("userId", "updatedAt" DESC);
CREATE INDEX "draft_expiresAt_idx" ON "draft"("expiresAt");
CREATE UNIQUE INDEX "draft_articleId_key" ON "draft"("articleId");
-- AddForeignKey
ALTER TABLE "draft" ADD CONSTRAINT "draft_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "draft" ADD CONSTRAINT "draft_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;
