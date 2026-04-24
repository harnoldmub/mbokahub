import { ArrowRight, ShieldCheck, Users } from "lucide-react";
import Link from "next/link";

import { prisma } from "@/lib/db/prisma";
import {
  getLocaleFromSearchParams,
  nls,
  type SearchParams,
} from "@/lib/nls";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Communautés WhatsApp · Mboka Hub",
  description:
    "Rejoins la communauté Mboka Hub de ta région : entraide, infos concert, bons plans, covoiturage.",
};

type Props = { searchParams?: Promise<SearchParams> };

export default async function CommunautePage({ searchParams }: Props) {
  const locale = getLocaleFromSearchParams(await searchParams);
  const copy = nls[locale].communityPage;

  const communities = await prisma.whatsAppCommunity.findMany({
    where: { isActive: true },
    orderBy: [
      { isFeatured: "desc" },
      { memberCount: "desc" },
      { createdAt: "desc" },
    ],
    include: {
      moderator: {
        include: { user: { select: { name: true } } },
      },
    },
  });

  const grouped = communities.reduce<Record<string, typeof communities>>(
    (acc, c) => {
      const key = c.country;
      acc[key] = acc[key] ?? [];
      acc[key].push(c);
      return acc;
    },
    {},
  );

  const countries = Object.keys(grouped).sort();

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[600px] bg-gradient-to-b from-blood/10 via-transparent to-transparent" />

      <section className="relative z-10 mx-auto max-w-7xl px-6 pt-24 pb-16 lg:px-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-blood">
          {copy.eyebrow}
        </p>
        <h1 className="mt-4 font-display text-5xl uppercase tracking-tight text-paper sm:text-6xl lg:text-7xl">
          {copy.title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-paper-dim">{copy.subtitle}</p>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/communaute/devenir-moderateur"
            className="group inline-flex items-center gap-2 rounded-full border border-blood/40 bg-blood/10 px-6 py-3 font-mono text-xs uppercase tracking-widest text-blood transition hover:bg-blood/20"
          >
            <ShieldCheck className="size-4" />
            {copy.cta}
            <ArrowRight className="size-3 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      {communities.length === 0 ? (
        <section className="relative z-10 mx-auto max-w-4xl px-6 pb-32 lg:px-8">
          <div className="rounded-[3rem] border border-blood/20 bg-blood/5 p-12 text-center">
            <span className="inline-flex h-3 w-3 animate-pulse rounded-full bg-blood" />
            <h2 className="mt-6 font-display text-3xl uppercase text-paper">
              {copy.emptyTitle}
            </h2>
            <p className="mt-4 text-paper-dim">{copy.emptyText}</p>
          </div>
        </section>
      ) : (
        <section className="relative z-10 mx-auto max-w-7xl space-y-16 px-6 pb-32 lg:px-8">
          {countries.map((country) => (
            <div key={country}>
              <div className="mb-6 flex items-center gap-3">
                <h2 className="font-display text-3xl uppercase text-paper">
                  {country}
                </h2>
                <span className="font-mono text-[10px] uppercase tracking-widest text-paper-mute">
                  {grouped[country].length} {copy.membersLabel}
                </span>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {grouped[country].map((c) => (
                  <article
                    key={c.id}
                    className="group relative flex flex-col gap-4 overflow-hidden rounded-3xl border border-white/10 bg-coal/60 p-6 transition hover:-translate-y-1 hover:border-blood/40"
                  >
                    {c.isFeatured && (
                      <span className="absolute right-4 top-4 rounded-full bg-vip px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest text-coal">
                        ★
                      </span>
                    )}
                    <div className="flex items-center gap-3">
                      <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-300">
                        <Users className="size-5" />
                      </div>
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-widest text-paper-mute">
                          {c.region}
                        </p>
                        <h3 className="font-display text-xl text-paper">
                          {c.name}
                        </h3>
                      </div>
                    </div>
                    {c.description && (
                      <p className="text-sm text-paper-dim">{c.description}</p>
                    )}
                    {c.moderator?.user?.name && (
                      <p className="font-mono text-[10px] uppercase tracking-widest text-paper-mute">
                        {copy.moderatedBy} : {c.moderator.user.name}
                      </p>
                    )}
                    <a
                      href={c.inviteLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-4 py-3 font-mono text-xs uppercase tracking-widest text-paper transition hover:bg-emerald-400"
                    >
                      {copy.joinButton}
                      <ArrowRight className="size-3" />
                    </a>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}
    </main>
  );
}
