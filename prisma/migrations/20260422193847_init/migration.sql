-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('FAN', 'PRO', 'ADMIN');

-- CreateEnum
CREATE TYPE "ProCategory" AS ENUM ('MAQUILLEUSE', 'COIFFEUR', 'BARBIER', 'VENDEUR_MERCH', 'ORGANISATEUR_AFTER');

-- CreateEnum
CREATE TYPE "UnlockedTargetType" AS ENUM ('TRAJET', 'PRO_PROFILE');

-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('VIP_FAN', 'PRO_PREMIUM_MAQUILLEUSE', 'PRO_PREMIUM_COIFFEUR', 'PRO_PREMIUM_BARBIER', 'PRO_PREMIUM_MERCH', 'PRO_PREMIUM_AFTER', 'BOOST', 'CONDUCTEUR_REVEAL');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "clerkId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "phone" TEXT,
    "country" TEXT,
    "city" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'FAN',
    "isVipActive" BOOLEAN NOT NULL DEFAULT false,
    "vipUntil" TIMESTAMP(3),
    "stripeCustomerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trajet" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "villeDepart" TEXT NOT NULL,
    "paysDepart" TEXT NOT NULL,
    "villeArrivee" TEXT NOT NULL DEFAULT 'Paris',
    "date" TIMESTAMP(3) NOT NULL,
    "heureDepart" TEXT NOT NULL,
    "placesDispo" INTEGER NOT NULL,
    "placesTotal" INTEGER NOT NULL,
    "prix" DOUBLE PRECISION NOT NULL,
    "vehicule" TEXT,
    "note" TEXT,
    "whatsapp" TEXT NOT NULL,
    "contactRevealed" BOOLEAN NOT NULL DEFAULT false,
    "isBoosted" BOOLEAN NOT NULL DEFAULT false,
    "boostUntil" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "views" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Trajet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "category" "ProCategory" NOT NULL,
    "displayName" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "bio" TEXT,
    "specialities" TEXT[],
    "photos" TEXT[],
    "instagramHandle" TEXT,
    "tiktokHandle" TEXT,
    "whatsapp" TEXT NOT NULL,
    "priceRange" TEXT,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "reviewsCount" INTEGER NOT NULL DEFAULT 0,
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "premiumUntil" TIMESTAMP(3),
    "isBoosted" BOOLEAN NOT NULL DEFAULT false,
    "boostUntil" TIMESTAMP(3),
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verifiedAt" TIMESTAMP(3),
    "views" INTEGER NOT NULL DEFAULT 0,
    "contactAttempts" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnlockedContact" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "targetType" "UnlockedTargetType" NOT NULL,
    "unlockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UnlockedContact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "After" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "venue" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "capacity" INTEGER,
    "priceFrom" DOUBLE PRECISION NOT NULL,
    "ticketUrl" TEXT NOT NULL,
    "flyerUrl" TEXT,
    "organizerId" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isBoosted" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "views" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "After_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MerchProduct" (
    "id" TEXT NOT NULL,
    "vendorName" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "externalUrl" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MerchProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParisClassic" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "arrondissement" INTEGER,
    "priceLevel" INTEGER NOT NULL DEFAULT 2,
    "externalUrl" TEXT,
    "googleMapsUrl" TEXT,
    "phone" TEXT,
    "imageUrl" TEXT,
    "tags" TEXT[],
    "isSponsored" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ParisClassic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuizResult" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "email" TEXT NOT NULL,
    "answers" JSONB NOT NULL,
    "archetype" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuizResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameScore" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "pseudo" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GameScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NewsletterSubscriber" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "source" TEXT,
    "confirmed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NewsletterSubscriber_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "stripeSessionId" TEXT NOT NULL,
    "stripePaymentId" TEXT,
    "type" "PaymentType" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'eur',
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkId_key" ON "User"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_stripeCustomerId_key" ON "User"("stripeCustomerId");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_clerkId_idx" ON "User"("clerkId");

-- CreateIndex
CREATE INDEX "Trajet_paysDepart_villeDepart_date_idx" ON "Trajet"("paysDepart", "villeDepart", "date");

-- CreateIndex
CREATE INDEX "Trajet_isBoosted_createdAt_idx" ON "Trajet"("isBoosted", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ProProfile_userId_key" ON "ProProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ProProfile_slug_key" ON "ProProfile"("slug");

-- CreateIndex
CREATE INDEX "ProProfile_category_city_idx" ON "ProProfile"("category", "city");

-- CreateIndex
CREATE INDEX "ProProfile_isBoosted_rating_idx" ON "ProProfile"("isBoosted", "rating");

-- CreateIndex
CREATE INDEX "UnlockedContact_userId_idx" ON "UnlockedContact"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UnlockedContact_userId_targetId_targetType_key" ON "UnlockedContact"("userId", "targetId", "targetType");

-- CreateIndex
CREATE UNIQUE INDEX "After_slug_key" ON "After"("slug");

-- CreateIndex
CREATE INDEX "After_date_isActive_idx" ON "After"("date", "isActive");

-- CreateIndex
CREATE INDEX "ParisClassic_category_order_idx" ON "ParisClassic"("category", "order");

-- CreateIndex
CREATE INDEX "QuizResult_email_idx" ON "QuizResult"("email");

-- CreateIndex
CREATE INDEX "GameScore_score_idx" ON "GameScore"("score" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "NewsletterSubscriber_email_key" ON "NewsletterSubscriber"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_stripeSessionId_key" ON "Payment"("stripeSessionId");

-- CreateIndex
CREATE INDEX "Payment_userId_idx" ON "Payment"("userId");

-- AddForeignKey
ALTER TABLE "Trajet" ADD CONSTRAINT "Trajet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProProfile" ADD CONSTRAINT "ProProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnlockedContact" ADD CONSTRAINT "UnlockedContact_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "After" ADD CONSTRAINT "After_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizResult" ADD CONSTRAINT "QuizResult_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameScore" ADD CONSTRAINT "GameScore_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
