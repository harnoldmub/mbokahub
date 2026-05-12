import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

// Returns available 30-min slots for a given pro and optional service on a given date range.
// GET /api/pros/[id]/slots?startDate=2026-05-12&days=7&serviceId=xxx
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: proProfileId } = await params;
  const { searchParams } = req.nextUrl;

  const startDateParam = searchParams.get("startDate");
  const daysParam = Number(searchParams.get("days") ?? "7");
  const serviceId = searchParams.get("serviceId") ?? null;

  if (!startDateParam) {
    return NextResponse.json({ error: "startDate required" }, { status: 400 });
  }

  const startDate = new Date(startDateParam + "T00:00:00");
  if (Number.isNaN(startDate.getTime())) {
    return NextResponse.json({ error: "invalid startDate" }, { status: 400 });
  }
  const days = Math.min(Math.max(daysParam, 1), 14);

  // Load pro availability + confirmed/pending bookings in range
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + days);

  const [availability, bookings, service] = await Promise.all([
    prisma.proAvailability.findMany({
      where: { proProfileId, isActive: true },
    }),
    prisma.proBooking.findMany({
      where: {
        proProfileId,
        requestedAt: { gte: startDate, lt: endDate },
        status: { in: ["PENDING", "CONFIRMED"] },
      },
      select: { requestedAt: true, durationMinutes: true },
    }),
    serviceId
      ? prisma.proService.findUnique({
          where: { id: serviceId },
          select: { durationMinutes: true },
        })
      : null,
  ]);

  const slotDuration = 30; // fixed slot grid in minutes
  const serviceDuration = service?.durationMinutes ?? slotDuration;

  // Build a Set of booked minute-offsets (from midnight UTC) per date string
  // We store blocked slots as "YYYY-MM-DD HH:MM" strings
  const blockedSlots = new Set<string>();
  for (const b of bookings) {
    const dateStr = toLocalDateStr(b.requestedAt);
    const bookingMinutes = timeToMinutes(
      b.requestedAt.getUTCHours().toString().padStart(2, "0") +
        ":" +
        b.requestedAt.getUTCMinutes().toString().padStart(2, "0")
    );
    const dur = b.durationMinutes ?? slotDuration;
    // Block all 30-min slots that overlap this booking
    for (let m = bookingMinutes; m < bookingMinutes + dur; m += slotDuration) {
      blockedSlots.add(`${dateStr} ${minutesToTime(m)}`);
    }
  }

  // If no availability configured, default Mon-Sat 9h-19h
  const availByDay = new Map<number, { start: number; end: number }>();
  if (availability.length === 0) {
    // Default: Mon–Sat 09:00–19:00
    for (let d = 1; d <= 6; d++) {
      availByDay.set(d, { start: timeToMinutes("09:00"), end: timeToMinutes("19:00") });
    }
  } else {
    for (const a of availability) {
      availByDay.set(a.dayOfWeek, {
        start: timeToMinutes(a.startTime),
        end: timeToMinutes(a.endTime),
      });
    }
  }

  type DaySlots = { date: string; dayLabel: string; slots: string[] };
  const result: DaySlots[] = [];

  for (let i = 0; i < days; i++) {
    const day = new Date(startDate);
    day.setDate(day.getDate() + i);
    const dow = day.getUTCDay();
    const dateStr = toLocalDateStr(day);

    const avail = availByDay.get(dow);
    if (!avail) {
      result.push({ date: dateStr, dayLabel: dayLabel(day), slots: [] });
      continue;
    }

    const slots: string[] = [];
    // Last possible start = avail.end - serviceDuration
    const lastStart = avail.end - serviceDuration;
    for (let m = avail.start; m <= lastStart; m += slotDuration) {
      const time = minutesToTime(m);
      // Check if all 30-min sub-slots needed for this service are free
      let free = true;
      for (let sm = m; sm < m + serviceDuration; sm += slotDuration) {
        if (blockedSlots.has(`${dateStr} ${minutesToTime(sm)}`)) {
          free = false;
          break;
        }
      }
      // Skip slots in the past (today)
      const now = new Date();
      const slotDate = new Date(`${dateStr}T${time}:00Z`);
      if (slotDate <= now) continue;

      if (free) slots.push(time);
    }

    result.push({ date: dateStr, dayLabel: dayLabel(day), slots });
  }

  return NextResponse.json({ days: result, serviceDuration });
}

function toLocalDateStr(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function timeToMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function minutesToTime(m: number): string {
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
}

const FR_DAYS = ["Dim.", "Lun.", "Mar.", "Mer.", "Jeu.", "Ven.", "Sam."];
const FR_MONTHS = ["jan.", "fév.", "mar.", "avr.", "mai", "juin", "juil.", "août", "sep.", "oct.", "nov.", "déc."];

function dayLabel(d: Date): string {
  return `${FR_DAYS[d.getUTCDay()]} ${d.getUTCDate()} ${FR_MONTHS[d.getUTCMonth()]}`;
}
