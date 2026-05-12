"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

type SlotJson = {
  startsAt: string;
  endsAt: string;
  teamMemberId: string;
};
type DayJson = { date: string; slots: SlotJson[] };

export function BookingWeek({
  proId,
  serviceId,
  teamMemberId,
  days,
  members,
}: {
  proId: string;
  serviceId: string;
  teamMemberId: string;
  days: DayJson[];
  members: { id: string; displayName: string }[];
}) {
  const [offset, setOffset] = useState(0);
  const sp = useSearchParams();
  const PAGE = 7;

  const window = useMemo(
    () => days.slice(offset, offset + PAGE),
    [days, offset],
  );

  const memberLabel = (id: string) => {
    const m = members.find((x) => x.id === id);
    return m ? m.displayName : "";
  };

  const buildHref = (slot: SlotJson) => {
    const params = new URLSearchParams(sp?.toString() ?? "");
    params.set("serviceId", serviceId);
    params.set("teamMemberId", slot.teamMemberId);
    params.set("startsAt", slot.startsAt);
    return `/pro/${proId}?${params.toString()}#booking-form`;
  };

  return (
    <div className="grid gap-3">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setOffset(Math.max(0, offset - PAGE))}
          disabled={offset === 0}
          className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-coal px-3 py-1.5 text-sm text-paper-dim disabled:opacity-30"
        >
          <ChevronLeft className="size-4" />
          Préc.
        </button>
        <p className="font-mono text-[10px] uppercase tracking-widest text-paper-mute">
          {window.length > 0
            ? `${formatRange(window[0].date, window[window.length - 1].date)}`
            : ""}
        </p>
        <button
          type="button"
          onClick={() => setOffset(Math.min(days.length - PAGE, offset + PAGE))}
          disabled={offset + PAGE >= days.length}
          className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-coal px-3 py-1.5 text-sm text-paper-dim disabled:opacity-30"
        >
          Suiv.
          <ChevronRight className="size-4" />
        </button>
      </div>

      <div className="grid gap-2 sm:grid-cols-7">
        {window.map((day) => {
          const filteredSlots = teamMemberId
            ? day.slots.filter((s) => s.teamMemberId === teamMemberId)
            : day.slots;
          const dayLabel = formatDay(day.date);
          return (
            <div
              key={day.date}
              className="rounded-2xl border border-white/10 bg-coal p-2"
            >
              <p className="text-center font-mono text-[10px] uppercase tracking-widest text-paper-mute">
                {dayLabel.weekday}
              </p>
              <p className="text-center font-display text-lg text-paper">
                {dayLabel.day}
              </p>
              <div className="mt-2 grid gap-1.5">
                {filteredSlots.length === 0 ? (
                  <p className="text-center text-paper-mute text-xs py-2">—</p>
                ) : (
                  filteredSlots.slice(0, 16).map((slot) => (
                    <Link
                      key={`${slot.teamMemberId}-${slot.startsAt}`}
                      href={buildHref(slot)}
                      className="rounded-lg border border-white/10 bg-smoke px-2 py-1 text-center text-xs text-paper hover:border-blood/40 hover:bg-blood/10"
                      title={
                        members.length > 1
                          ? `Avec ${memberLabel(slot.teamMemberId)}`
                          : undefined
                      }
                    >
                      {formatTime(slot.startsAt)}
                    </Link>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function formatDay(date: string) {
  const d = new Date(`${date}T12:00:00`);
  return {
    weekday: new Intl.DateTimeFormat("fr-FR", { weekday: "short" }).format(d),
    day: new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "short",
    }).format(d),
  };
}

function formatTime(iso: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

function formatRange(from: string, to: string) {
  const fmt = new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
  });
  return `${fmt.format(new Date(`${from}T12:00:00`))} → ${fmt.format(
    new Date(`${to}T12:00:00`),
  )}`;
}
