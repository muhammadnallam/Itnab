-- CreateTable
CREATE TABLE "report" (
    "id" UUID NOT NULL,
    "category" TEXT NOT NULL,
    "details" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reporterId" UUID NOT NULL,
    "articleId" UUID,
    "profileId" UUID,

    CONSTRAINT "report_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "report_articleId_idx" ON "report"("articleId");

-- CreateIndex
CREATE INDEX "report_profileId_idx" ON "report"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "report_reporterId_articleId_key" ON "report"("reporterId", "articleId");

-- CreateIndex
CREATE UNIQUE INDEX "report_reporterId_profileId_key" ON "report"("reporterId", "profileId");

-- AddForeignKey
ALTER TABLE "report" ADD CONSTRAINT "report_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report" ADD CONSTRAINT "report_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report" ADD CONSTRAINT "report_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
