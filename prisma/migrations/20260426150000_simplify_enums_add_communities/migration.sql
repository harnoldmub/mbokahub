-- CreateEnum
CREATE TYPE "ModeratorStatus" AS ENUM ('PENDING', 'APPROVED', 'SUSPENDED');

-- AlterEnum
BEGIN;
CREATE TYPE "PaymentType_new" AS ENUM ('VIP_FAN', 'PRO_PREMIUM', 'BOOST', 'CONDUCTEUR_REVEAL');
ALTER TABLE "Payment" ALTER COLUMN "type" TYPE "PaymentType_new" USING ("type"::text::"PaymentType_new");
ALTER TYPE "PaymentType" RENAME TO "PaymentType_old";
ALTER TYPE "PaymentType_new" RENAME TO "PaymentType";
DROP TYPE "public"."PaymentType_old";
COMMIT;

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ProCategory" ADD VALUE 'ESTHETICIENNE';
ALTER TYPE "ProCategory" ADD VALUE 'PROTHESISTE_ONGLES';
ALTER TYPE "ProCategory" ADD VALUE 'TECHNICIENNE_CILS';
ALTER TYPE "ProCategory" ADD VALUE 'VIDEASTE';
ALTER TYPE "ProCategory" ADD VALUE 'CREATEUR_CONTENU';
ALTER TYPE "ProCategory" ADD VALUE 'SECURITE';
ALTER TYPE "ProCategory" ADD VALUE 'CHAUFFEUR_VTC';
ALTER TYPE "ProCategory" ADD VALUE 'DJ';
ALTER TYPE "ProCategory" ADD VALUE 'ANIMATEUR';
ALTER TYPE "ProCategory" ADD VALUE 'CUISINIER';
ALTER TYPE "ProCategory" ADD VALUE 'TRAITEUR';
ALTER TYPE "ProCategory" ADD VALUE 'DECORATEUR';
ALTER TYPE "ProCategory" ADD VALUE 'COUTURIER';
ALTER TYPE "ProCategory" ADD VALUE 'BIJOUTIER';
ALTER TYPE "ProCategory" ADD VALUE 'BABYSITTER';
ALTER TYPE "ProCategory" ADD VALUE 'AUTRE';

-- AlterEnum
BEGIN;
CREATE TYPE "PromoCodeCategory_new" AS ENUM ('VIP_FAN', 'PRO');
ALTER TABLE "PromoCode" ALTER COLUMN "category" TYPE "PromoCodeCategory_new" USING ("category"::text::"PromoCodeCategory_new");
ALTER TYPE "PromoCodeCategory" RENAME TO "PromoCodeCategory_old";
ALTER TYPE "PromoCodeCategory_new" RENAME TO "PromoCodeCategory";
DROP TYPE "public"."PromoCodeCategory_old";
COMMIT;

-- CreateTable
CREATE TABLE "Moderator" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'France',
    "whatsappLink" TEXT,
    "bio" TEXT,
    "motivation" TEXT,
    "status" "ModeratorStatus" NOT NULL DEFAULT 'PENDING',
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Moderator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WhatsAppCommunity" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'France',
    "inviteLink" TEXT NOT NULL,
    "description" TEXT,
    "rules" TEXT,
    "memberCount" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "moderatorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WhatsAppCommunity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Moderator_userId_key" ON "Moderator"("userId");

-- CreateIndex
CREATE INDEX "Moderator_status_region_idx" ON "Moderator"("status", "region");

-- CreateIndex
CREATE UNIQUE INDEX "WhatsAppCommunity_moderatorId_key" ON "WhatsAppCommunity"("moderatorId");

-- CreateIndex
CREATE INDEX "WhatsAppCommunity_region_isActive_idx" ON "WhatsAppCommunity"("region", "isActive");

-- CreateIndex
CREATE INDEX "WhatsAppCommunity_country_isActive_idx" ON "WhatsAppCommunity"("country", "isActive");

-- AddForeignKey
ALTER TABLE "Moderator" ADD CONSTRAINT "Moderator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WhatsAppCommunity" ADD CONSTRAINT "WhatsAppCommunity_moderatorId_fkey" FOREIGN KEY ("moderatorId") REFERENCES "Moderator"("id") ON DELETE SET NULL ON UPDATE CASCADE;
