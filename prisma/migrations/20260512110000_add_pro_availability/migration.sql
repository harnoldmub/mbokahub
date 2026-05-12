-- CreateTable ProAvailability
CREATE TABLE "ProAvailability" (
    "id" TEXT NOT NULL,
    "proProfileId" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ProAvailability_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ProAvailability_proProfileId_dayOfWeek_key" ON "ProAvailability"("proProfileId", "dayOfWeek");
CREATE INDEX "ProAvailability_proProfileId_idx" ON "ProAvailability"("proProfileId");

ALTER TABLE "ProAvailability" ADD CONSTRAINT "ProAvailability_proProfileId_fkey" FOREIGN KEY ("proProfileId") REFERENCES "ProProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
