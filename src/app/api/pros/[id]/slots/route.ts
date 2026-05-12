import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

// Returns available 30-min slots for a given pro and optional service on a given date range.
// GET /api/pros/[id]/slots?startDate=2026-05-12&days=7&serviceId=xxx
// All dates/times are in the server's local TZ (Europe/Paris in production).
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

  // Parse "YYYY-MM-DD" as local-time midnight (Europe/Paris on the server).
  const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(startDateParam);
  if (!dateMatch) {
    return NextResponse.json({ error: "invalid startDate" }, { status: 400 });
  }
  const y = Number(dateMatch[1]);
  const mo = Number(dateMatch[2]);
  const d = Number(dateMatch[3]);
  const startDate = new Date(y, mo - 1, d, 0, 0, 0, 0);
  // Reject calendar-invalid dates that JS would silently roll over (e.g. Feb 31).
  if (
    Number.isNaN(startDate.getTime()) ||
    startDate.getFullYear() !== y ||
    startDate.getMonth() !== mo - 1 ||
    startDate.getDate() !== d
  ) {
    return NextResponse.json({ error: "invalid startDate" }, { status: 400 });
  }
  const days = Math.min(Math.max(daysParam, 1), 14);

  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + days);

  const [bookings, service] = await Promise.all([
    prisma.proBooking.findMany({
      where: {
        proProfileId,
        requestedAt: { gte: startDate, lt: endDate },
        status: { in: ["PENDING", "CONFIRMED"] },
      },
      select: { requestedAt: true, durationMin: true },
    }),
    serviceId
      ? prisma.service.findFirst({
          where: { id: serviceId, proProfileId },
          select: { durationMin: true },
        })
      : null,
  ]);

  const slotDuration = 30; // fixed slot grid in minutes
  const serviceDuration = service?.durationMin ?? slotDuration;

  // Build a Set of booked minute-offsets (from local midnight) per local date.
  const blockedSlots = new Set<string>();
  for (const b of bookings) {
    const dateStr = toLocalDateStr(b.requestedAt);
    const bookingMinutes =
      b.requestedAt.getHours() * 60 + b.requestedAt.getMinutes();
    const dur = b.durationMin ?? slotDuration;
    for (let m = bookingMinutes; m < bookingMinutes + dur; m += slotDuration) {
      blockedSlots.add(`${dateStr} ${minutesToTime(m)}`);
    }
  }

  // Default availability when no per-pro config exists: Mon-Sat 9h-19h.
  const availByDay = new Map<number, { start: number; end: number }>();
  for (let day = 1; day <= 6; day++) {
    availByDay.set(day, {
      start: timeToMinutes("09:00"),
      end: timeToMinutes("19:00"),
    });
  }

  type DaySlots = { date: string; dayLabel: string; slots: string[] };
  const result: DaySlots[] = [];
  const now = new Date();

  for (let i = 0; i < days; i++) {
    const day = new Date(startDate);
    day.setDate(day.getDate() + i);
    const dow = day.getDay();
    const dateStr = toLocalDateStr(day);

    const avail = availByDay.get(dow);
    if (!avail) {
      result.push({ date: dateStr, dayLabel: dayLabel(day), slots: [] });
      continue;
    }

    const slots: string[] = [];
    const lastStart = avail.end - serviceDuration;
    for (let m = avail.start; m <= lastStart; m += slotDuration) {
      const time = minutesToTime(m);
      // Skip slots already blocked by a confirmed/pending booking
      let free = true;
      for (let sm = m; sm < m + serviceDuration; sm += slotDuration) {
        if (blockedSlots.has(`${dateStr} ${minutesToTime(sm)}`)) {
          free = false;
          break;
        }
      }
      if (!free) continue;
      // Skip slots in the past (today)
      const slotDate = new Date(day);
      slotDate.setHours(Math.floor(m / 60), m % 60, 0, 0);
      if (slotDate <= now) continue;

      slots.push(time);
    }

    result.push({ date: dateStr, dayLabel: dayLabel(day), slots });
  }

  return NextResponse.json({ days: result, serviceDuration });
}

function toLocalDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
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
  return `${FR_DAYS[d.getDay()]} ${d.getDate()} ${FR_MONTHS[d.getMonth()]}`;
}
