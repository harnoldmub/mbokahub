-- CreateTable ProService
-- Note: ProBooking already has serviceId/durationMin from the prior
-- "20260512000000_add_booking_slots" migration. We only create the
-- ProService table here. (Idempotent for partial-apply recovery.)

CREATE TABLE IF NOT EXISTS "ProService" (
    "id" TEXT NOT NULL,
    "proProfileId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "durationMinutes" INTEGER NOT NULL,
    "price" DOUBLE PRECISION,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProService_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "ProService_proProfileId_isActive_order_idx"
    ON "ProService"("proProfileId", "isActive", "order");

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'ProService_proProfileId_fkey'
    ) THEN
        ALTER TABLE "ProService"
            ADD CONSTRAINT "ProService_proProfileId_fkey"
            FOREIGN KEY ("proProfileId") REFERENCES "ProProfile"("id")
            ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;
