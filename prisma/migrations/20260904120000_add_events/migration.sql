DO $$ BEGIN
  CREATE TYPE "EventStatus" AS ENUM ('DRAFT', 'ON_SALE', 'SOLD_OUT', 'POSTPONED', 'CANCELLED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "Event" (
  "id" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "artist" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "genres" TEXT[] NOT NULL,
  "image" TEXT NOT NULL,
  "poster" TEXT,
  "startDate" TIMESTAMP(3) NOT NULL,
  "endDate" TIMESTAMP(3),
  "venue" TEXT NOT NULL,
  "city" TEXT NOT NULL,
  "country" TEXT NOT NULL,
  "latitude" DOUBLE PRECISION,
  "longitude" DOUBLE PRECISION,
  "officialTicketUrl" TEXT NOT NULL,
  "sourceUrl" TEXT NOT NULL,
  "featured" BOOLEAN NOT NULL DEFAULT false,
  "published" BOOLEAN NOT NULL DEFAULT false,
  "status" "EventStatus" NOT NULL DEFAULT 'DRAFT',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "Event_slug_key" ON "Event"("slug");
CREATE INDEX IF NOT EXISTS "Event_published_startDate_idx" ON "Event"("published", "startDate");
CREATE INDEX IF NOT EXISTS "Event_featured_startDate_idx" ON "Event"("featured", "startDate");
CREATE INDEX IF NOT EXISTS "Event_city_startDate_idx" ON "Event"("city", "startDate");
CREATE INDEX IF NOT EXISTS "Event_artist_idx" ON "Event"("artist");
