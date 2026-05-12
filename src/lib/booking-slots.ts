import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/db/prisma";

type PrismaLike = Prisma.TransactionClient | typeof prisma;

export const SLOT_GRANULARITY_MIN = 15;
export const BOOKING_WINDOW_DAYS = 28;

// Categories where the slot booking flow is intentionally disabled
// (clients buy directly or coordinate outside the platform).
export const NON_BOOKABLE_CATEGORIES = new Set<string>([
  "VENDEUR_MERCH",
  "BABYSITTER",
]);

export type AvailableSlot = {
  startsAt: Date;
  endsAt: Date;
  teamMemberId: string;
};

export type DaySlots = {
  date: string;
  slots: AvailableSlot[];
};

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function dayKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function overlaps(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date): boolean {
  return aStart < bEnd && bStart < aEnd;
}

type SlotComputeInput = {
  proProfileId: string;
  serviceId: string;
  teamMemberIds?: string[];
  fromDate?: Date;
  days?: number;
};

export async function computeAvailableSlots(input: SlotComputeInput): Promise<{
  service: {
    id: string;
    name: string;
    durationMin: number;
    priceCents: number;
  };
  members: { id: string; displayName: string; photoUrl: string | null }[];
  days: DaySlots[];
}> {
  const days = input.days ?? BOOKING_WINDOW_DAYS;
  const from = startOfDay(input.fromDate ?? new Date());
  const to = new Date(from);
  to.setDate(to.getDate() + days);

  const service = await prisma.service.findUnique({
    where: { id: input.serviceId },
    include: {
      members: {
        include: {
          teamMember: {
            include: {
              workingHours: true,
              timeOffs: {
                where: { endsAt: { gte: from }, startsAt: { lt: to } },
              },
            },
          },
        },
      },
    },
  });

  if (!service || service.proProfileId !== input.proProfileId) {
    return {
      service: {
        id: input.serviceId,
        name: "",
        durationMin: 0,
        priceCents: 0,
      },
      members: [],
      days: [],
    };
  }

  const allowedMembers = service.members
    .map((sm) => sm.teamMember)
    .filter((m) => m.isActive)
    .filter((m) => !input.teamMemberIds || input.teamMemberIds.includes(m.id));

  const memberIds = allowedMembers.map((m) => m.id);
  const bookings = memberIds.length
    ? await prisma.proBooking.findMany({
        where: {
          teamMemberId: { in: memberIds },
          status: { in: ["PENDING", "CONFIRMED"] },
          requestedAt: { gte: from, lt: to },
        },
        select: { teamMemberId: true, requestedAt: true, durationMin: true },
      })
    : [];

  const bookingsByMember = new Map<
    string,
    { startsAt: Date; endsAt: Date }[]
  >();
  for (const b of bookings) {
    if (!b.teamMemberId) continue;
    const dur = b.durationMin ?? service.durationMin;
    const arr = bookingsByMember.get(b.teamMemberId) ?? [];
    arr.push({
      startsAt: b.requestedAt,
      endsAt: new Date(b.requestedAt.getTime() + dur * 60_000),
    });
    bookingsByMember.set(b.teamMemberId, arr);
  }

  const result: DaySlots[] = [];
  const now = new Date();

  for (let i = 0; i < days; i++) {
    const dayStart = new Date(from);
    dayStart.setDate(dayStart.getDate() + i);
    const dow = dayStart.getDay();
    const slots: AvailableSlot[] = [];

    for (const member of allowedMembers) {
      const wh = member.workingHours.filter((w) => w.dayOfWeek === dow);
      if (wh.length === 0) continue;
      const memberBookings = bookingsByMember.get(member.id) ?? [];
      const memberOff = member.timeOffs;

      for (const w of wh) {
        for (
          let m = w.openMinute;
          m + service.durationMin <= w.closeMinute;
          m += SLOT_GRANULARITY_MIN
        ) {
          const slotStart = new Date(dayStart);
          slotStart.setMinutes(m);
          const slotEnd = new Date(
            slotStart.getTime() + service.durationMin * 60_000,
          );
          if (slotStart < now) continue;

          const conflictsBooking = memberBookings.some((b) =>
            overlaps(slotStart, slotEnd, b.startsAt, b.endsAt),
          );
          if (conflictsBooking) continue;

          const conflictsOff = memberOff.some((t) =>
            overlaps(slotStart, slotEnd, t.startsAt, t.endsAt),
          );
          if (conflictsOff) continue;

          slots.push({
            startsAt: slotStart,
            endsAt: slotEnd,
            teamMemberId: member.id,
          });
        }
      }
    }

    slots.sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime());
    result.push({ date: dayKey(dayStart), slots });
  }

  return {
    service: {
      id: service.id,
      name: service.name,
      durationMin: service.durationMin,
      priceCents: service.priceCents,
    },
    members: allowedMembers.map((m) => ({
      id: m.id,
      displayName: m.displayName,
      photoUrl: m.photoUrl,
    })),
    days: result,
  };
}

/**
 * Re-check at booking time: returns true if the requested slot is still
 * available for the given member and service (no overlapping booking,
 * inside working hours, no time-off).
 */
export async function isSlotStillAvailable(
  params: {
    serviceId: string;
    teamMemberId: string;
    startsAt: Date;
  },
  client: PrismaLike = prisma,
): Promise<boolean> {
  const service = await client.service.findUnique({
    where: { id: params.serviceId },
    select: {
      durationMin: true,
      isOnlineBookable: true,
      proProfile: { select: { category: true } },
      members: {
        where: { teamMemberId: params.teamMemberId },
        select: { teamMember: { select: { isActive: true } } },
      },
    },
  });
  if (!service || !service.isOnlineBookable || service.members.length === 0) {
    return false;
  }
  if (NON_BOOKABLE_CATEGORIES.has(service.proProfile.category)) return false;
  if (!service.members[0]?.teamMember.isActive) return false;

  const startsAt = params.startsAt;
  const endsAt = new Date(startsAt.getTime() + service.durationMin * 60_000);
  const dow = startsAt.getDay();
  const minuteOfDay = startsAt.getHours() * 60 + startsAt.getMinutes();
  const endMinuteOfDay = minuteOfDay + service.durationMin;

  if (startsAt < new Date()) return false;

  const wh = await client.workingHours.findMany({
    where: { teamMemberId: params.teamMemberId, dayOfWeek: dow },
  });
  const insideHours = wh.some(
    (w) => w.openMinute <= minuteOfDay && endMinuteOfDay <= w.closeMinute,
  );
  if (!insideHours) return false;

  const off = await client.timeOff.count({
    where: {
      teamMemberId: params.teamMemberId,
      startsAt: { lt: endsAt },
      endsAt: { gt: startsAt },
    },
  });
  if (off > 0) return false;

  // Overlapping bookings (PENDING or CONFIRMED) for the same member.
  // We don't store endsAt, so use the longest known booking duration for this
  // member as a safe lower bound — covers both existing bookings (via their
  // own durationMin) and existing services (in case a booking is missing
  // durationMin and falls back to its service duration).
  const longest = await client.proBooking.aggregate({
    where: {
      teamMemberId: params.teamMemberId,
      status: { in: ["PENDING", "CONFIRMED"] },
    },
    _max: { durationMin: true },
  });
  const longestService = await client.service.aggregate({
    where: { members: { some: { teamMemberId: params.teamMemberId } } },
    _max: { durationMin: true },
  });
  const maxDurationMin = Math.max(
    longest._max.durationMin ?? 0,
    longestService._max.durationMin ?? 0,
    service.durationMin,
    60,
  );
  const overlapping = await client.proBooking.findMany({
    where: {
      teamMemberId: params.teamMemberId,
      status: { in: ["PENDING", "CONFIRMED"] },
      requestedAt: {
        gte: new Date(startsAt.getTime() - maxDurationMin * 60_000),
        lt: endsAt,
      },
    },
    select: { requestedAt: true, durationMin: true },
  });
  for (const b of overlapping) {
    const bStart = b.requestedAt;
    const bEnd = new Date(
      bStart.getTime() + (b.durationMin ?? service.durationMin) * 60_000,
    );
    if (bStart < endsAt && startsAt < bEnd) return false;
  }
  return true;
}

export function formatPriceCents(cents: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

export function formatDuration(min: number): string {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m === 0 ? `${h}h` : `${h}h${String(m).padStart(2, "0")}`;
}
