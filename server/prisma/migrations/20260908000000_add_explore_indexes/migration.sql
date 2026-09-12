-- Index for tag feed queries (topic filter + time ordering)
CREATE INDEX "Article_topic_createdAt_idx" ON "Article"("topic", "createdAt" DESC);

-- Index for search on title and subtitle
CREATE INDEX "Article_title_idx" ON "Article"("title");
CREATE INDEX "Article_subtitle_idx" ON "Article"("subtitle");

-- Index for user search on name
CREATE INDEX "User_name_idx" ON "user"("name");
