import {
  BarChart3,
  CalendarCheck,
  Camera,
  Check,
  ChevronRight,
  Clock3,
  Megaphone,
  Scissors,
  ShieldCheck,
  Sparkles,
  Star,
  Store,
  UserRound,
} from "lucide-react";
import Link from "next/link";

import type { Metadata } from "next";

import { HeroSearch } from "@/components/marketing/hero-search";
import { Button } from "@/components/ui/button";
import {
  localizedHref,
  type SearchParams,
} from "@/lib/nls";

export const metadata: Metadata = {
  title: "Nevent — Prestataires, trajets & afters de la diaspora",
  description:
    "Trouvez coiffeurs, maquilleurs, photographes, covoiturages et afters de la diaspora. Annuaire 100% gratuit, réservation directe et messagerie incluse.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Nevent — Prestataires, trajets & afters de la diaspora",
    description:
      "Annuaire 100% gratuit de prestataires de la diaspora : beauté, transport, événements, merch.",
    url: "/",
  },
};

type HomePageProps = {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<SearchParams>;
};

const categories = [
  { label: "Coiffeur", href: "/prestataires?q=coiffeur", icon: Scissors },
  { label: "Barbier", href: "/prestataires?q=barbier", icon: UserRound },
  { label: "Manucure", href: "/prestataires?q=ongles", icon: Sparkles },
  { label: "Institut de beauté", href: "/prestataires?q=beaute", icon: Store },
  { label: "Bien-être", href: "/prestataires?q=bien-etre", icon: ShieldCheck },
  { label: "Photographe", href: "/prestataires?q=photo", icon: Camera },
];

const stats = [
  { value: "0 €", label: "pour créer sa fiche" },
  { value: "3 clics", label: "pour demander un rendez-vous" },
  { value: "Boost", label: "pour augmenter sa visibilité" },
];

const proBenefits = [
  "Profil public gratuit",
  "Photo principale et galerie",
  "Demandes de rendez-vous",
  "Boost optionnel",
];

export default async function HomePage({ params, searchParams }: HomePageProps) {
  const { locale } = await params;
  void searchParams;

  return (
    <main className="force-light min-h-screen bg-ink text-paper">
      <section className="border-b border-white/10 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-5 sm:px-6 lg:px-8">
          <nav
            aria-label="Catégories populaires"
            className="flex items-center gap-1 overflow-x-auto py-1"
          >
            {categories.map((category) => (
              <Link
                className="shrink-0 rounded-md px-4 py-2 text-sm font-medium text-paper-dim transition hover:bg-smoke hover:text-paper"
                href={localizedHref(category.href, locale)}
                key={category.label}
              >
                {category.label}
              </Link>
            ))}
          </nav>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 pb-16 pt-8 sm:px-6 sm:pt-10 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:pb-24 lg:pt-12">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blood">
              Réservation de services
            </p>
            <h1 className="mt-3 max-w-4xl text-3xl font-semibold leading-[1.05] tracking-normal text-paper sm:mt-4 sm:text-4xl lg:text-5xl">
              Trouvez un prestataire et réservez un rendez-vous.
            </h1>

            <HeroSearch locale={locale} />

            <p className="mt-6 max-w-2xl text-base leading-7 text-paper-dim">
              Nevent connecte les clients aux professionnels : beauté,
              coiffure, photo, transport et services événementiels. Gratuit pour
              chercher, publier et gérer ses demandes.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {categories.slice(0, 5).map((category) => {
                const Icon = category.icon;
                return (
                  <Link
                    className="inline-flex items-center gap-2 rounded-full border border-[#dfe3ea] bg-white px-3 py-2 text-sm text-paper-dim transition hover:border-blood/40 hover:text-paper"
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

          <div className="grid gap-5 lg:pt-5">
            <div className="rounded-xl border border-[#d7dbe2] bg-[#e9f6f7] p-6">
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-lg bg-[#4ca8b6] text-white">
                  <CalendarCheck className="size-5" />
                </div>
                <p className="font-semibold text-paper">
                  Vous cherchez un salon ou un service ?
                </p>
              </div>
              <h2 className="mt-8 text-3xl font-semibold tracking-normal text-paper">
                Réservez instantanément, où vous voulez.
              </h2>
              <p className="mt-4 max-w-md text-paper-dim">
                Choisissez un professionnel, envoyez une demande de créneau et
                gardez le contact ouvert gratuitement.
              </p>
              <div className="mt-8 rounded-lg bg-white p-3">
                <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.25em] text-paper-mute">
                  Aperçu d&apos;une réservation
                </p>
                <div className="flex items-center justify-between gap-3 rounded-md border border-[#dfe3ea] p-3">
                  <div>
                    <p className="text-sm font-semibold text-paper">
                      Coiffure afro
                    </p>
                    <p className="text-xs text-paper-mute">
                      Demain · Paris 18ᵉ
                    </p>
                  </div>
                  <span className="rounded-md bg-[#202124] px-3 py-2 text-xs font-semibold text-white">
                    18:30
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-[#d7dbe2] bg-smoke p-6">
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-lg bg-[#202124] text-white">
                  <Store className="size-5" />
                </div>
                <p className="font-semibold text-paper">
                  Vous êtes professionnel ?
                </p>
              </div>
              <h2 className="mt-8 text-3xl font-semibold tracking-normal text-paper">
                Gérez votre visibilité et vos rendez-vous.
              </h2>
              <p className="mt-4 max-w-md text-paper-dim">
                Créez votre fiche, ajoutez vos médias, recevez des demandes et
                boostez seulement quand vous voulez apparaître plus haut.
              </p>
              <Button asChild className="mt-8">
                <Link href={localizedHref("/pro/inscrire", locale)}>
                  Référencer mon activité
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#d7dbe2] bg-white">
        <div className="mx-auto grid max-w-7xl sm:grid-cols-3">
          {stats.map((stat, index) => (
            <div
              className="min-h-48 border-[#d7dbe2] px-8 py-10 sm:border-l first:sm:border-l-0"
              key={stat.label}
            >
              {index === 1 ? (
                <div className="mb-8 h-1 w-full max-w-xs bg-blood" />
              ) : null}
              <p className="text-5xl font-medium tracking-normal text-paper">
                {stat.value}
              </p>
              <p className="mt-4 text-xl text-paper-dim">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-smoke py-16">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div className="rounded-xl border border-[#d7dbe2] bg-white p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blood">
              Professionnel
            </p>
            <h2 className="mt-4 text-4xl font-semibold leading-tight text-paper">
              Une fiche gratuite, une galerie propre, un planning clair.
            </h2>
            <div className="mt-8 grid gap-3">
              {proBenefits.map((benefit) => (
                <div
                  className="flex items-center gap-3 rounded-lg border border-[#dfe3ea] bg-white p-3"
                  key={benefit}
                >
                  <span className="grid size-7 place-items-center rounded-full bg-blood/10 text-blood">
                    <Check className="size-4" />
                  </span>
                  <span className="text-sm font-medium text-paper">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                icon: Clock3,
                title: "Demandes de rendez-vous",
                text: "Le client choisit un créneau et le pro confirme depuis son planning.",
              },
              {
                icon: Camera,
                title: "Médias pro",
                text: "Photo principale et galerie stockées dans le dossier média monté.",
              },
              {
                icon: Megaphone,
                title: "Boosts sponsorisés",
                text: "La plateforme reste gratuite, boostez pour apparaître en premier.",
              },
              {
                icon: BarChart3,
                title: "Stats à venir",
                text: "Vues, clics, demandes et performance des placements.",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <article
                  className="rounded-xl border border-[#d7dbe2] bg-white p-5"
                  key={item.title}
                >
                  <Icon className="size-6 text-blood" />
                  <h3 className="mt-5 text-xl font-semibold text-paper">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-paper-dim">
                    {item.text}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-6 border-t border-[#d7dbe2] pt-10 sm:flex-row sm:items-center">
            <div>
              <h2 className="mt-3 text-3xl font-semibold text-paper">
                Trouvez le prestataire idéal dès aujourd'hui.
              </h2>
            </div>
            <Button asChild size="lg">
              <Link href={localizedHref("/prestataires", locale)}>
                Explorer les prestataires
                <ChevronRight className="ml-2 size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
