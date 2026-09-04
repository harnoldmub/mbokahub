import type { Metadata } from "next";
import { EventsExplorer } from "@/components/events/events-explorer";
import { getPublicEvents } from "@/lib/events.server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tous les événements afro en Europe",
  description:
    "Découvre les concerts, festivals et événements afro vérifiés à Paris, Bruxelles, Londres et ailleurs, puis prépare trajets et services avec Nevent.",
  alternates: { canonical: "/fr/evenements" },
};

export default async function EventsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ ville?: string; artiste?: string }>;
}) {
  const [{ locale }, filters] = await Promise.all([params, searchParams]);
  const events = await getPublicEvents();
  return (
    <main className="force-light min-h-screen bg-white text-paper">
      <header className="bg-black px-5 py-16 text-white sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-blood">
            Découvrir
          </p>
          <h1 className="mt-4 max-w-5xl font-display text-[clamp(4rem,10vw,8rem)] uppercase leading-[0.86]">
            Tous les événements
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-white/65 sm:text-lg">
            Une sélection vérifiée de la scène afro en Europe. Choisis ta date,
            puis organise tout ce qui se passe autour.
          </p>
        </div>
      </header>
      <EventsExplorer
        events={events}
        initialArtist={filters?.artiste}
        initialCity={filters?.ville}
        locale={locale}
      />
    </main>
  );
}
