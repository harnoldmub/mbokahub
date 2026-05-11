import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  Camera,
  Car,
  MapPin,
  Megaphone,
  Scissors,
  Search,
  ShieldCheck,
  Sparkles,
  Store,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  getLocaleFromSearchParams,
  localizedHref,
  type SearchParams,
} from "@/lib/nls";

type HomePageProps = {
  searchParams?: Promise<SearchParams>;
};

const categories = [
  {
    label: "Coiffure & beauté",
    href: "/prestataires?q=coiffure",
    icon: Scissors,
    count: "Pros vérifiés",
  },
  {
    label: "Photo & vidéo",
    href: "/prestataires?q=photo",
    icon: Camera,
    count: "Book shooting",
  },
  {
    label: "Transport",
    href: "/trajets",
    icon: Car,
    count: "Trajets directs",
  },
  {
    label: "Événements",
    href: "/afters",
    icon: Store,
    count: "Afters & lieux",
  },
];

const steps = [
  {
    icon: Search,
    title: "Trouver",
    text: "Filtre par métier, ville, prix ou disponibilité.",
  },
  {
    icon: CalendarCheck,
    title: "Réserver",
    text: "Le client choisit un créneau et contacte le prestataire sans paywall.",
  },
  {
    icon: BadgeCheck,
    title: "Gérer",
    text: "Le pro pilote sa fiche, ses médias, ses demandes et bientôt son planning.",
  },
];

const proFeatures = [
  "Fiche gratuite avec photo principale, galerie et liens sociaux",
  "Contacts ouverts aux clients, sans abonnement fan",
  "Boosts sponsorisés pour remonter dans les listes",
  "Espaces pub pour marques, événements et partenaires",
];

export default async function HomePage({ searchParams }: HomePageProps) {
  const locale = getLocaleFromSearchParams(await searchParams);

  return (
    <main className="min-h-screen bg-ink text-paper">
      <section className="border-b border-white/10 bg-[linear-gradient(135deg,rgba(18,113,91,0.12),transparent_42%),linear-gradient(90deg,rgba(213,159,47,0.14),transparent_48%)]">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 pb-12 pt-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:pb-16 lg:pt-16">
          <div className="flex flex-col justify-center">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-blood/20 bg-blood/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-blood">
              <span className="size-1.5 rounded-full bg-success" />
              Plateforme gratuite de mise en relation
            </div>

            <h1 className="mt-6 max-w-4xl font-display text-5xl uppercase leading-[0.95] tracking-normal text-paper sm:text-6xl lg:text-7xl">
              Trouve le bon service.
              <span className="block font-serif italic text-blood">
                Réserve le bon créneau.
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-paper-dim sm:text-lg">
              Mboka Hub devient la plateforme de référence pour connecter
              clients et prestataires : beauté, photo, transport, events,
              services locaux. Gratuit pour les clients comme pour les pros.
            </p>

            <form
              action={localizedHref("/prestataires", locale)}
              className="mt-8 grid gap-3 rounded-2xl border border-white/10 bg-coal p-3 shadow-sm sm:grid-cols-[1fr_auto]"
            >
              {locale !== "fr" ? (
                <input name="lang" type="hidden" value={locale} />
              ) : null}
              <label className="relative block">
                <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-paper-mute" />
                <input
                  className="h-13 w-full rounded-xl border border-transparent bg-smoke py-3 pl-12 pr-4 text-sm text-paper outline-none transition placeholder:text-paper-mute focus:border-blood/40 focus:bg-coal"
                  name="q"
                  placeholder="Maquilleuse, photographe, chauffeur..."
                  type="search"
                />
              </label>
              <Button className="h-13 rounded-xl px-6" type="submit">
                Rechercher
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </form>

            <div className="mt-5 flex flex-wrap gap-2">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <Link
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-paper-dim transition hover:border-blood/30 hover:bg-blood/10 hover:text-paper"
                    href={localizedHref(category.href, locale)}
                    key={category.label}
                  >
                    <Icon className="size-4 text-blood" />
                    {category.label}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="relative">
            <div className="rounded-2xl border border-white/10 bg-coal p-4 shadow-[0_28px_90px_-60px_rgba(18,113,91,0.55)]">
              <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <Image
                    alt=""
                    aria-hidden
                    className="size-11"
                    height={44}
                    src="/logo.svg"
                    width={44}
                  />
                  <div>
                    <p className="font-display text-xl uppercase text-paper">
                      Mboka Hub
                    </p>
                    <p className="text-xs text-paper-mute">
                      Annuaire, planning, réservation
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-success/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-success">
                  Gratuit
                </span>
              </div>

              <div className="mt-4 grid gap-3">
                {[
                  ["Studio Liputa", "Makeup · Bruxelles", "18:30 dispo"],
                  ["Lens Kin", "Photo · Paris", "Shooting samedi"],
                  ["Driver diaspora", "VTC · Saint-Denis", "4 places"],
                ].map(([name, meta, slot]) => (
                  <article
                    className="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-xl border border-white/10 bg-smoke p-3"
                    key={name}
                  >
                    <div className="grid size-11 place-items-center rounded-xl bg-blood/10 text-blood">
                      <Sparkles className="size-5" />
                    </div>
                    <div>
                      <h2 className="font-body text-sm font-semibold text-paper">
                        {name}
                      </h2>
                      <p className="text-xs text-paper-mute">{meta}</p>
                    </div>
                    <span className="rounded-full border border-success/30 bg-success/10 px-2.5 py-1 text-xs text-success">
                      {slot}
                    </span>
                  </article>
                ))}
              </div>

              <div className="mt-4 grid gap-3 rounded-xl border border-blood/20 bg-blood/10 p-4 sm:grid-cols-[auto_1fr]">
                <div className="grid size-10 place-items-center rounded-xl bg-coal text-blood">
                  <CalendarCheck className="size-5" />
                </div>
                <div>
                  <p className="font-body text-sm font-semibold text-paper">
                    Réservation directe
                  </p>
                  <p className="mt-1 text-xs leading-5 text-paper-dim">
                    Le modèle cible : le pro publie ses disponibilités, le
                    client demande un rendez-vous, la plateforme monétise la
                    visibilité sponsorisée.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                className="group rounded-2xl border border-white/10 bg-coal p-5 transition hover:-translate-y-0.5 hover:border-blood/30"
                href={localizedHref(category.href, locale)}
                key={category.label}
              >
                <div className="flex items-start justify-between gap-4">
                  <Icon className="size-6 text-blood" />
                  <ArrowRight className="size-4 text-paper-mute transition group-hover:translate-x-1 group-hover:text-blood" />
                </div>
                <h2 className="mt-5 font-display text-2xl uppercase text-paper">
                  {category.label}
                </h2>
                <p className="mt-1 text-sm text-paper-mute">{category.count}</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="border-y border-white/10 bg-coal">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-blood">
              Nouveau positionnement
            </p>
            <h2 className="mt-3 font-display text-4xl uppercase leading-tight text-paper sm:text-5xl">
              Gratuit pour tous, rentable par visibilité.
            </h2>
            <p className="mt-4 text-paper-dim">
              On enlève la friction : pas de pass fan, pas d’abonnement
              obligatoire pour exister. La valeur payante devient claire : pub,
              placement, boost local, opérations partenaires.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <article
                  className="rounded-2xl border border-white/10 bg-ink p-5"
                  key={step.title}
                >
                  <Icon className="size-6 text-blood" />
                  <h3 className="mt-5 font-display text-xl uppercase text-paper">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-paper-dim">
                    {step.text}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-14 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8">
        <div className="rounded-2xl border border-white/10 bg-coal p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <ShieldCheck className="size-7 text-blood" />
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-blood">
              Prestataires
            </p>
          </div>
          <h2 className="mt-4 font-display text-4xl uppercase text-paper">
            Un espace pro simple et gratuit.
          </h2>
          <ul className="mt-6 grid gap-3">
            {proFeatures.map((feature) => (
              <li
                className="flex items-start gap-3 text-paper-dim"
                key={feature}
              >
                <span className="mt-2 size-1.5 rounded-full bg-blood" />
                {feature}
              </li>
            ))}
          </ul>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button asChild>
              <Link href={localizedHref("/pro/inscrire", locale)}>
                Référencer mon activité
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={localizedHref("/pro", locale)}>Voir l’offre pro</Link>
            </Button>
          </div>
        </div>

        <div className="rounded-2xl border border-blood/20 bg-blood/10 p-6 sm:p-8">
          <Megaphone className="size-8 text-blood" />
          <h2 className="mt-4 font-display text-4xl uppercase text-paper">
            Boosts, pubs, placements.
          </h2>
          <p className="mt-4 text-paper-dim">
            Le revenu vient des marques et des pros qui veulent plus de
            visibilité : top annuaire, bannière locale, sponsor newsletter, push
            catégorie ou mise en avant événement.
          </p>
          <div className="mt-6 flex items-center gap-2 text-sm text-paper-mute">
            <MapPin className="size-4 text-blood" />
            Paris, Bruxelles, Kinshasa, Montréal : prêt pour un nom
            international.
          </div>
          <Button asChild className="mt-7" variant="vip">
            <Link href={localizedHref("/ads", locale)}>
              Acheter de la visibilité
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
