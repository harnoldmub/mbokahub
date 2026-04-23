-- CreateEnum
CREATE TYPE "ReportTargetType" AS ENUM ('TRAJET', 'PRO_PROFILE', 'AFTER', 'USER', 'MERCH_PRODUCT');

-- CreateEnum
CREATE TYPE "ReportReason" AS ENUM ('ARNAQUE', 'FAUX_PROFIL', 'SPAM', 'CONTENU_INAPPROPRIE', 'PRIX_ABUSIF', 'CONTACT_NON_REPONSE', 'AUTRE');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('PENDING', 'REVIEWING', 'RESOLVED', 'DISMISSED');

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "targetType" "ReportTargetType" NOT NULL,
    "targetId" TEXT NOT NULL,
    "reason" "ReportReason" NOT NULL,
    "description" TEXT,
    "reporterEmail" TEXT,
    "reporterId" TEXT,
    "status" "ReportStatus" NOT NULL DEFAULT 'PENDING',
    "adminNotes" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Report_status_createdAt_idx" ON "Report"("status", "createdAt");

-- CreateIndex
CREATE INDEX "Report_targetType_targetId_idx" ON "Report"("targetType", "targetId");
