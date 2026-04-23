-- CreateEnum
CREATE TYPE "PromoCodeCategory" AS ENUM ('VIP_FAN', 'PRO_MAQUILLEUSE', 'PRO_COIFFEUR', 'PRO_BARBIER', 'PRO_PHOTOGRAPHE', 'PRO_VENDEUR_MERCH', 'PRO_ORGANISATEUR_AFTER');

-- AlterEnum
ALTER TYPE "PaymentType" ADD VALUE 'PRO_PREMIUM_PHOTOGRAPHE';

-- AlterEnum
ALTER TYPE "ProCategory" ADD VALUE 'PHOTOGRAPHE';

-- AlterTable
ALTER TABLE "Trajet" ADD COLUMN     "carPhoto" TEXT,
ADD COLUMN     "vehiculeColor" TEXT,
ADD COLUMN     "vehiculeModel" TEXT;

-- CreateTable
CREATE TABLE "PromoCode" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "category" "PromoCodeCategory" NOT NULL,
    "label" TEXT,
    "discountPercent" INTEGER NOT NULL DEFAULT 100,
    "maxUses" INTEGER NOT NULL DEFAULT 1,
    "usedCount" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "expiresAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PromoCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PromoCodeRedemption" (
    "id" TEXT NOT NULL,
    "promoCodeId" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "userId" TEXT,
    "redeemedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PromoCodeRedemption_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PromoCode_code_key" ON "PromoCode"("code");

-- CreateIndex
CREATE INDEX "PromoCode_category_isActive_idx" ON "PromoCode"("category", "isActive");

-- CreateIndex
CREATE INDEX "PromoCodeRedemption_userEmail_idx" ON "PromoCodeRedemption"("userEmail");

-- CreateIndex
CREATE UNIQUE INDEX "PromoCodeRedemption_promoCodeId_userEmail_key" ON "PromoCodeRedemption"("promoCodeId", "userEmail");

-- AddForeignKey
ALTER TABLE "PromoCodeRedemption" ADD CONSTRAINT "PromoCodeRedemption_promoCodeId_fkey" FOREIGN KEY ("promoCodeId") REFERENCES "PromoCode"("id") ON DELETE CASCADE ON UPDATE CASCADE;
