-- Add booking slot tables

ALTER TABLE "ProBooking"
  ADD COLUMN "serviceId" TEXT,
  ADD COLUMN "teamMemberId" TEXT,
  ADD COLUMN "durationMin" INTEGER;

CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "proProfileId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "durationMin" INTEGER NOT NULL,
    "priceCents" INTEGER NOT NULL,
    "isOnlineBookable" BOOLEAN NOT NULL DEFAULT true,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Service_proProfileId_position_idx" ON "Service"("proProfileId", "position");

ALTER TABLE "Service" ADD CONSTRAINT "Service_proProfileId_fkey"
  FOREIGN KEY ("proProfileId") REFERENCES "ProProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "TeamMember" (
    "id" TEXT NOT NULL,
    "proProfileId" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "photoUrl" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "TeamMember_proProfileId_position_idx" ON "TeamMember"("proProfileId", "position");

ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_proProfileId_fkey"
  FOREIGN KEY ("proProfileId") REFERENCES "ProProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "ServiceMember" (
    "serviceId" TEXT NOT NULL,
    "teamMemberId" TEXT NOT NULL,
    CONSTRAINT "ServiceMember_pkey" PRIMARY KEY ("serviceId", "teamMemberId")
);

CREATE INDEX "ServiceMember_teamMemberId_idx" ON "ServiceMember"("teamMemberId");

ALTER TABLE "ServiceMember" ADD CONSTRAINT "ServiceMember_serviceId_fkey"
  FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ServiceMember" ADD CONSTRAINT "ServiceMember_teamMemberId_fkey"
  FOREIGN KEY ("teamMemberId") REFERENCES "TeamMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "WorkingHours" (
    "id" TEXT NOT NULL,
    "teamMemberId" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "openMinute" INTEGER NOT NULL,
    "closeMinute" INTEGER NOT NULL,
    CONSTRAINT "WorkingHours_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "WorkingHours_teamMemberId_dayOfWeek_idx" ON "WorkingHours"("teamMemberId", "dayOfWeek");

ALTER TABLE "WorkingHours" ADD CONSTRAINT "WorkingHours_teamMemberId_fkey"
  FOREIGN KEY ("teamMemberId") REFERENCES "TeamMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "TimeOff" (
    "id" TEXT NOT NULL,
    "teamMemberId" TEXT NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "reason" TEXT,
    CONSTRAINT "TimeOff_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "TimeOff_teamMemberId_startsAt_idx" ON "TimeOff"("teamMemberId", "startsAt");

ALTER TABLE "TimeOff" ADD CONSTRAINT "TimeOff_teamMemberId_fkey"
  FOREIGN KEY ("teamMemberId") REFERENCES "TeamMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ProBooking" ADD CONSTRAINT "ProBooking_serviceId_fkey"
  FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ProBooking" ADD CONSTRAINT "ProBooking_teamMemberId_fkey"
  FOREIGN KEY ("teamMemberId") REFERENCES "TeamMember"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX "ProBooking_teamMemberId_requestedAt_idx" ON "ProBooking"("teamMemberId", "requestedAt");
