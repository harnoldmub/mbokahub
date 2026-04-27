-- AlterTable: add moderation fields to Trajet
ALTER TABLE "Trajet" ADD COLUMN "isApproved" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Trajet" ADD COLUMN "approvedAt" TIMESTAMP(3);

-- Backfill: existing trajets are considered already approved
UPDATE "Trajet" SET "isApproved" = true, "approvedAt" = "createdAt";

-- CreateIndex
CREATE INDEX "Trajet_isApproved_isActive_idx" ON "Trajet"("isApproved", "isActive");
