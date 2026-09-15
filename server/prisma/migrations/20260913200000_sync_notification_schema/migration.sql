-- Reconcile the Notification table (created by 20260913095106_add_notifications)
-- with the Prisma schema: actorIds as TEXT[] (String[]) and the composite
-- @@unique([recipientId, groupKey]) instead of a lone unique on groupKey.

-- DropIndex
DROP INDEX IF EXISTS "Notification_groupKey_key";

-- AlterTable
ALTER TABLE "Notification" ALTER COLUMN "actorIds" SET DATA TYPE TEXT[] USING "actorIds"::TEXT[];

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Notification_recipientId_groupKey_key" ON "Notification"("recipientId", "groupKey");
