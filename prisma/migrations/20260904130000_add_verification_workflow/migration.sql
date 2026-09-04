DO $$
BEGIN
  CREATE TYPE "VerificationType" AS ENUM ('ACCOUNT', 'PROFESSIONAL');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE TYPE "VerificationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE "User"
  ADD COLUMN IF NOT EXISTS "accountVerified" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "accountVerifiedAt" TIMESTAMP(3);

ALTER TABLE "ProProfile"
  ADD COLUMN IF NOT EXISTS "isCertified" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "certifiedAt" TIMESTAMP(3);

CREATE TABLE IF NOT EXISTS "VerificationRequest" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "proProfileId" TEXT,
  "type" "VerificationType" NOT NULL,
  "status" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
  "message" TEXT,
  "adminNote" TEXT,
  "reviewerEmail" TEXT,
  "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "reviewedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "VerificationRequest_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "VerificationRequest_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "VerificationRequest_proProfileId_fkey"
    FOREIGN KEY ("proProfileId") REFERENCES "ProProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "VerificationRequest_status_requestedAt_idx"
  ON "VerificationRequest"("status", "requestedAt");
CREATE INDEX IF NOT EXISTS "VerificationRequest_userId_type_status_idx"
  ON "VerificationRequest"("userId", "type", "status");
CREATE INDEX IF NOT EXISTS "VerificationRequest_proProfileId_idx"
  ON "VerificationRequest"("proProfileId");
