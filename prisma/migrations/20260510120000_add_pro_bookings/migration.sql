CREATE TYPE "ProBookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED');

CREATE TABLE "ProBooking" (
    "id" TEXT NOT NULL,
    "proProfileId" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "clientEmail" TEXT,
    "clientPhone" TEXT NOT NULL,
    "requestedAt" TIMESTAMP(3) NOT NULL,
    "note" TEXT,
    "status" "ProBookingStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProBooking_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ProBooking_proProfileId_requestedAt_idx" ON "ProBooking"("proProfileId", "requestedAt");
CREATE INDEX "ProBooking_status_createdAt_idx" ON "ProBooking"("status", "createdAt");

ALTER TABLE "ProBooking" ADD CONSTRAINT "ProBooking_proProfileId_fkey" FOREIGN KEY ("proProfileId") REFERENCES "ProProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
