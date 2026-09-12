-- Add lastReadDate to View so re-reads re-surface in reading history
ALTER TABLE "View" ADD COLUMN "lastReadDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Backfill existing rows so current history order is preserved
UPDATE "View" SET "lastReadDate" = "createdAt";
