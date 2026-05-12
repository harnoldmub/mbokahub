-- CreateTable ProService
CREATE TABLE "ProService" (
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

CREATE INDEX "ProService_proProfileId_isActive_order_idx" ON "ProService"("proProfileId", "isActive", "order");

ALTER TABLE "ProService" ADD CONSTRAINT "ProService_proProfileId_fkey" FOREIGN KEY ("proProfileId") REFERENCES "ProProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Alter ProBooking: add service fields
ALTER TABLE "ProBooking"
    ADD COLUMN "serviceId" TEXT,
    ADD COLUMN "serviceName" TEXT,
    ADD COLUMN "durationMinutes" INTEGER;

ALTER TABLE "ProBooking" ADD CONSTRAINT "ProBooking_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "ProService"("id") ON DELETE SET NULL ON UPDATE CASCADE;
