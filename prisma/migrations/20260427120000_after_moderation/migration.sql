-- AlterTable: add moderation fields to After
ALTER TABLE "After" ADD COLUMN "isApproved" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "After" ADD COLUMN "approvedAt" TIMESTAMP(3);

-- Backfill: existing afters are considered already approved
UPDATE "After" SET "isApproved" = true, "approvedAt" = "createdAt";

-- CreateIndex
CREATE INDEX "After_isApproved_isActive_date_idx" ON "After"("isApproved", "isActive", "date");
