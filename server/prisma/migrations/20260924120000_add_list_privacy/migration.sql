-- Add private flag to lists and default existing "read later" lists to private.
ALTER TABLE "list" ADD COLUMN "isPrivate" BOOLEAN NOT NULL DEFAULT false;

UPDATE "list" SET "isPrivate" = true WHERE "isDefault" = true;
