-- Idempotent migration: safe to re-run if some objects already exist in production.

-- CreateEnum: ModeratorStatus
DO $$ BEGIN
  CREATE TYPE "ModeratorStatus" AS ENUM ('PENDING', 'APPROVED', 'SUSPENDED');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- AlterEnum: PaymentType -> (VIP_FAN, PRO_PREMIUM, BOOST, CONDUCTEUR_REVEAL)
-- Only run the rename dance if the current PaymentType still contains old labels.
DO $$
DECLARE
  has_old BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM pg_enum e
    JOIN pg_type t ON t.oid = e.enumtypid
    WHERE t.typname = 'PaymentType'
      AND e.enumlabel NOT IN ('VIP_FAN', 'PRO_PREMIUM', 'BOOST', 'CONDUCTEUR_REVEAL')
  ) INTO has_old;

  IF has_old THEN
    CREATE TYPE "PaymentType_new" AS ENUM ('VIP_FAN', 'PRO_PREMIUM', 'BOOST', 'CONDUCTEUR_REVEAL');
    ALTER TABLE "Payment" ALTER COLUMN "type" TYPE "PaymentType_new" USING ("type"::text::"PaymentType_new");
    ALTER TYPE "PaymentType" RENAME TO "PaymentType_old";
    ALTER TYPE "PaymentType_new" RENAME TO "PaymentType";
    DROP TYPE "public"."PaymentType_old";
  END IF;
END $$;

-- AlterEnum: ProCategory — add new values if missing
ALTER TYPE "ProCategory" ADD VALUE IF NOT EXISTS 'ESTHETICIENNE';
ALTER TYPE "ProCategory" ADD VALUE IF NOT EXISTS 'PROTHESISTE_ONGLES';
ALTER TYPE "ProCategory" ADD VALUE IF NOT EXISTS 'TECHNICIENNE_CILS';
ALTER TYPE "ProCategory" ADD VALUE IF NOT EXISTS 'VIDEASTE';
ALTER TYPE "ProCategory" ADD VALUE IF NOT EXISTS 'CREATEUR_CONTENU';
ALTER TYPE "ProCategory" ADD VALUE IF NOT EXISTS 'SECURITE';
ALTER TYPE "ProCategory" ADD VALUE IF NOT EXISTS 'CHAUFFEUR_VTC';
ALTER TYPE "ProCategory" ADD VALUE IF NOT EXISTS 'DJ';
ALTER TYPE "ProCategory" ADD VALUE IF NOT EXISTS 'ANIMATEUR';
ALTER TYPE "ProCategory" ADD VALUE IF NOT EXISTS 'CUISINIER';
ALTER TYPE "ProCategory" ADD VALUE IF NOT EXISTS 'TRAITEUR';
ALTER TYPE "ProCategory" ADD VALUE IF NOT EXISTS 'DECORATEUR';
ALTER TYPE "ProCategory" ADD VALUE IF NOT EXISTS 'COUTURIER';
ALTER TYPE "ProCategory" ADD VALUE IF NOT EXISTS 'BIJOUTIER';
ALTER TYPE "ProCategory" ADD VALUE IF NOT EXISTS 'BABYSITTER';
ALTER TYPE "ProCategory" ADD VALUE IF NOT EXISTS 'AUTRE';

-- AlterEnum: PromoCodeCategory -> (VIP_FAN, PRO)
DO $$
DECLARE
  has_old BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM pg_enum e
    JOIN pg_type t ON t.oid = e.enumtypid
    WHERE t.typname = 'PromoCodeCategory'
      AND e.enumlabel NOT IN ('VIP_FAN', 'PRO')
  ) INTO has_old;

  IF has_old THEN
    CREATE TYPE "PromoCodeCategory_new" AS ENUM ('VIP_FAN', 'PRO');
    ALTER TABLE "PromoCode" ALTER COLUMN "category" TYPE "PromoCodeCategory_new" USING ("category"::text::"PromoCodeCategory_new");
    ALTER TYPE "PromoCodeCategory" RENAME TO "PromoCodeCategory_old";
    ALTER TYPE "PromoCodeCategory_new" RENAME TO "PromoCodeCategory";
    DROP TYPE "public"."PromoCodeCategory_old";
  END IF;
END $$;

-- CreateTable: Moderator
CREATE TABLE IF NOT EXISTS "Moderator" (
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

-- CreateTable: WhatsAppCommunity
CREATE TABLE IF NOT EXISTS "WhatsAppCommunity" (
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
CREATE UNIQUE INDEX IF NOT EXISTS "Moderator_userId_key" ON "Moderator"("userId");
CREATE INDEX IF NOT EXISTS "Moderator_status_region_idx" ON "Moderator"("status", "region");
CREATE UNIQUE INDEX IF NOT EXISTS "WhatsAppCommunity_moderatorId_key" ON "WhatsAppCommunity"("moderatorId");
CREATE INDEX IF NOT EXISTS "WhatsAppCommunity_region_isActive_idx" ON "WhatsAppCommunity"("region", "isActive");
CREATE INDEX IF NOT EXISTS "WhatsAppCommunity_country_isActive_idx" ON "WhatsAppCommunity"("country", "isActive");

-- AddForeignKey: Moderator_userId_fkey (skip if it already exists)
DO $$ BEGIN
  ALTER TABLE "Moderator"
    ADD CONSTRAINT "Moderator_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- AddForeignKey: WhatsAppCommunity_moderatorId_fkey (skip if it already exists)
DO $$ BEGIN
  ALTER TABLE "WhatsAppCommunity"
    ADD CONSTRAINT "WhatsAppCommunity_moderatorId_fkey"
    FOREIGN KEY ("moderatorId") REFERENCES "Moderator"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
