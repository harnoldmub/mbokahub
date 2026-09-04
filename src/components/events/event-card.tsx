import { ArrowUpRight, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import type { NeventEvent } from "@/lib/events";
import { localizedHref } from "@/lib/nls";

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "short",
  timeZone: "Europe/Paris",
});

export function EventCard({
  event,
  locale,
  priority = false,
}: {
  event: NeventEvent;
  locale: string;
  priority?: boolean;
}) {
  const start = new Date(event.startDate);
  const end = event.endDate ? new Date(event.endDate) : null;
  const date = end
    ? `${dateFormatter.format(start)}–${dateFormatter.format(end)}`
    : dateFormatter.format(start);

  return (
    <article className="group min-w-0">
      <Link
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blood focus-visible:ring-offset-4"
        href={localizedHref(`/evenements/${event.slug}`, locale)}
      >
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-neutral-900">
          <Image
            alt={event.imageAlt}
            className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.025]"
            fill
            priority={priority}
            sizes="(max-width: 640px) 86vw, (max-width: 1024px) 44vw, 31vw"
            src={event.image}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/5 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 text-white">
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-[0.12em] text-white">
                {date.toUpperCase()}
              </p>
              <p className="mt-1 text-sm text-white/80">{event.venue}</p>
            </div>
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-white text-black transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1">
              <ArrowUpRight aria-hidden className="size-5" />
            </span>
          </div>
        </div>
        <div className="pt-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-blood">
            <MapPin aria-hidden className="size-3.5" />
            {event.city}
          </div>
          <h3 className="mt-2 text-2xl font-semibold leading-tight text-paper">
            {event.artist}
          </h3>
          <p className="mt-1 text-sm text-paper-dim">
            {event.category} · {event.genres.join(" · ")}
          </p>
        </div>
      </Link>
    </article>
  );
}
