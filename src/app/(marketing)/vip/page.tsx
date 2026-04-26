import { auth } from "@clerk/nextjs/server";
import {
  Calendar,
  Car,
  Check,
  Crown,
  EyeOff,
  Gift,
  LockKeyhole,
  MessagesSquare,
  ShieldCheck,
  Sparkles,
  Timer,
  Users,
} from "lucide-react";
import Link from "next/link";

import { SectionHeading } from "@/components/marketing/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getOptionalDbUser, isCurrentUserVip } from "@/lib/auth-helpers";
import {
  PRICE_VIP_EUR,
  formatEuro,
  formatEuroAmount,
} from "@/lib/marketing-data";
import {
  EARLY_BIRD_DEADLINE,
  PRICE_VIP_EARLY_BIRD_EUR,
  isEarlyBirdActive,
} from "@/lib/stripe-config";

import { VipCheckoutButton } from "./vip-checkout-button";

export const metadata = {
  title: "Rejoins la Famille Mboka · Pass VIP",
  description:
    "Pass VIP Famille Mboka : groupe privé bons plans, tirage backstage, contacts prestas vérifiés, covoiturages prioritaires, badge Famille. Early Bird 6,99 € jusqu'au 30 avril.",
};

const PILLARS = [
  {
    icon: MessagesSquare,
    title: "Groupe privé Famille Mboka",
    body: "WhatsApp / Telegram en direct avec l'équipe et la communauté. Bons plans, annonces de dernière minute, entraide diaspora avant, pendant et après les concerts.",
    accent: "Tu sais avant tout le monde",
  },
  {
    icon: Gift,
    title: "Tirage meet & greet avec l'artiste",
    body: "Une place backstage tirée au sort parmi les VIP, plus des cadeaux exclusifs (merch, entrées invité, expériences) tout au long du week-end.",
    accent: "Réservé à la Famille",
  },
  {
    icon: ShieldCheck,
    title: "Tous les contacts prestas vérifiés",
    body: "Beauté, transport, garde d'enfants, photographes, sécurité… Le nom et le contact direct de chaque prestataire validé par l'équipe.",
    accent: "Plus de prix gonflés, plus d'arnaque",
  },
  {
    icon: Car,
    title: "Covoiturages prioritaires",
    body: "Tu vois et réserves les annonces avant tout le monde. Une place ne traîne jamais longtemps quand on est 50 000 dans la diaspora.",
    accent: "Accès anticipé",
  },
  {
    icon: Crown,
    title: "Badge Famille sur ton profil",
    body: "Reconnaissable dans le forum, dans les commentaires et dans les groupes — pour qu'on voie qui fait vraiment partie de la maison.",
    accent: "Statut visible",
  },
];

const VIP_BENEFITS_SHORT = [
  "Groupe privé Famille Mboka (bons plans temps réel)",
  "Tirage meet & greet avec l'artiste",
  "Tous les contacts prestas vérifiés",
  "Covoiturages prioritaires",
  "Badge Famille sur ton profil",
  "Newsletter premium avant, pendant et après le concert",
];

const MISSED_DROPS = [
  {
    tag: "Bon plan",
    text: "Tresses africaines à domicile la veille du concert — 35 € au lieu de 55 €",
  },
  {
    tag: "Annonce",
    text: "3 places côte à côte revendues à prix coûtant par un Famille",
  },
  {
    tag: "Trajet",
    text: "Bus Bruxelles → Saint-Denis 2 mai, 4 places restantes",
  },
  {
    tag: "Cadeau",
    text: "5 t-shirts officiels à gagner pour les VIP qui répondent dans l'heure",
  },
];

export default async function VipPage() {
  const { userId } = await auth();
  const isVip = await isCurrentUserVip();
  const dbUser = isVip ? await getOptionalDbUser() : null;
  const vipUntil = dbUser?.vipUntil
    ? dbUser.vipUntil.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;
  const earlyBird = isEarlyBirdActive();
  const currentPrice = earlyBird ? PRICE_VIP_EARLY_BIRD_EUR : PRICE_VIP_EUR;
  const deadline = EARLY_BIRD_DEADLINE.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  if (isVip) {
    return (
      <div>
        <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-amber-400/40 bg-gradient-to-br from-amber-500/15 via-background to-background p-8 sm:p-12">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <span className="flex size-14 items-center justify-center rounded-full bg-amber-400/20 text-amber-300">
                  <Crown aria-hidden className="size-7" />
                </span>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber-200">
                    Famille Mboka
                  </p>
                  <h1 className="mt-1 font-display text-4xl uppercase leading-none text-paper sm:text-5xl">
                    Tu es <span className="text-amber-300">Famille</span>
                  </h1>
                </div>
              </div>
              <Badge
                className="border-amber-400/50 bg-amber-400/10 text-amber-200"
                variant="outline"
              >
                Pass actif
              </Badge>
            </div>

            <p className="mt-6 max-w-2xl text-lg text-paper-dim">
              Tu fais partie de ceux qui savent avant les autres. Ton accès est
              actif
              {vipUntil ? (
                <>
                  {" "}
                  jusqu&apos;au{" "}
                  <span className="font-mono text-amber-200">{vipUntil}</span>
                </>
              ) : null}
              .
            </p>

            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {VIP_BENEFITS_SHORT.map((b) => (
                <li
                  className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4 text-paper"
                  key={b}
                >
                  <Check
                    aria-hidden
                    className="mt-0.5 size-4 shrink-0 text-amber-300"
                  />
                  <span className="text-sm">{b}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-wrap gap-3">
              <Button asChild className="shadow-[var(--glow-red)]">
                <Link href="/dashboard">Mon tableau de bord</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/prestataires">Voir les prestataires</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href="/trajets">Trouver un trajet</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div>
      {earlyBird ? (
        <div className="border-amber-400/40 border-y bg-gradient-to-r from-amber-500/20 via-amber-400/10 to-amber-500/20">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-3 px-4 py-3 text-center sm:px-6 lg:px-8">
            <Timer aria-hidden className="size-5 text-amber-300" />
            <p className="font-mono text-amber-100 text-xs uppercase tracking-[0.2em] sm:text-sm">
              Early Bird actif &middot; {formatEuro(PRICE_VIP_EARLY_BIRD_EUR)}{" "}
              au lieu de {formatEuro(PRICE_VIP_EUR)} jusqu'au {deadline}
            </p>
          </div>
        </div>
      ) : null}

      {/* HERO — community first */}
      <section
        id="rejoindre"
        className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8"
      >
        <div>
          <Badge
            className="border-primary/40 bg-primary/15 text-white"
            variant="outline"
          >
            Pass Famille Mboka
          </Badge>
          <h1 className="mt-6 font-display text-5xl text-foreground leading-[1.05] md:text-7xl">
            REJOINS LA <span className="text-primary">FAMILLE</span> —{" "}
            <span className="text-amber-300">CEUX QUI SAVENT</span> AVANT LES
            AUTRES.
          </h1>
          <p className="mt-6 max-w-xl text-muted-foreground text-lg leading-8">
            Le Pass Famille, c&apos;est d&apos;abord une place dans le groupe
            privé Mboka : annonces de dernière minute, bons plans, entraide
            diaspora avant, pendant et après le Stade de France 2 et 3 mai 2026.
            Le reste vient avec.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <Users aria-hidden className="size-6 text-amber-300" />
              <p className="mt-3 font-mono text-muted-foreground text-xs uppercase">
                Communauté
              </p>
              <p className="mt-1 font-heading text-foreground text-lg">
                Groupe privé
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <Gift aria-hidden className="size-6 text-primary" />
              <p className="mt-3 font-mono text-muted-foreground text-xs uppercase">
                Bonus
              </p>
              <p className="mt-1 font-heading text-foreground text-lg">
                Tirage backstage
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <Calendar aria-hidden className="size-6 text-accent" />
              <p className="mt-3 font-mono text-muted-foreground text-xs uppercase">
                Durée
              </p>
              <p className="mt-1 font-heading text-foreground text-lg">
                Jusqu&apos;au 31 mai
              </p>
            </div>
          </div>
        </div>

        <Card className="rounded-3xl border-amber-400/30 bg-gradient-to-br from-amber-500/10 via-background to-background">
          <CardHeader>
            <p className="font-mono text-amber-200 text-xs uppercase tracking-[0.3em]">
              {earlyBird ? "Early Bird" : "Tarif standard"}
            </p>
            <CardTitle className="mt-2 flex items-baseline gap-3 font-display text-foreground">
              <span className="text-7xl">{formatEuroAmount(currentPrice)}</span>
              <span className="text-3xl text-muted-foreground">€</span>
              {earlyBird ? (
                <span className="ml-2 font-mono text-muted-foreground text-base line-through">
                  {formatEuro(PRICE_VIP_EUR)}
                </span>
              ) : null}
            </CardTitle>
            <p className="mt-1 text-muted-foreground text-sm">
              Paiement unique &middot; valide jusqu'au 31 mai 2026
            </p>
            {earlyBird ? (
              <p className="mt-1 font-mono text-amber-200 text-xs uppercase tracking-[0.2em]">
                Early &middot; valide jusqu'au {deadline}
              </p>
            ) : null}
          </CardHeader>
          <CardContent className="grid gap-5">
            <ul className="grid gap-3">
              {VIP_BENEFITS_SHORT.map((b) => (
                <li className="flex items-start gap-3 text-foreground" key={b}>
                  <Check
                    aria-hidden
                    className="mt-1 size-4 shrink-0 text-primary"
                  />
                  <span className="text-sm">{b}</span>
                </li>
              ))}
            </ul>

            {userId ? (
              <VipCheckoutButton priceLabel={formatEuro(currentPrice)} />
            ) : (
              <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                <Link
                  className="inline-flex w-full items-center justify-center rounded-full bg-primary px-6 py-4 font-mono text-ink text-sm uppercase tracking-[0.2em] transition hover:bg-primary/90"
                  href={`/sign-up?redirect_url=/vip`}
                >
                  Rejoindre la Famille — {formatEuro(currentPrice)}
                </Link>
                <Link
                  className="inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-full border border-white/15 bg-white/5 px-6 py-4 font-mono text-paper text-xs uppercase tracking-[0.2em] transition hover:border-white/30 hover:bg-white/10"
                  href={`/sign-in?redirect_url=/vip`}
                >
                  Se connecter
                </Link>
              </div>
            )}

            <p className="text-center text-muted-foreground text-xs">
              Paiement sécurisé Stripe &middot; Apple Pay, Google Pay et CB
              acceptés
            </p>
          </CardContent>
        </Card>
      </section>

      {/* PILLARS — community-first hierarchy */}
      <section className="border-white/10 border-t bg-background/80 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            number="01"
            description="Le Pass Famille n'est pas un déblocage de fiches. C'est une place dans la maison Mboka, et tout ce qui va avec."
            eyebrow="Ce qui est inclus"
            title="L'esprit Famille, dans cet ordre"
          />

          <div className="mt-16 grid gap-6 lg:grid-cols-2">
            {PILLARS.map((p, idx) => {
              const Icon = p.icon;
              return (
                <article
                  key={p.title}
                  className="relative overflow-hidden rounded-3xl border border-white/10 bg-coal/60 p-8 transition hover:border-amber-400/40"
                >
                  <span className="absolute right-6 top-6 font-mono text-[10px] uppercase tracking-[0.3em] text-paper-mute">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <div className="flex items-start gap-5">
                    <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-amber-400/15 text-amber-300">
                      <Icon className="size-6" aria-hidden />
                    </span>
                    <div>
                      <h3 className="font-display text-2xl uppercase text-paper">
                        {p.title}
                      </h3>
                      <p className="mt-3 text-paper-dim">{p.body}</p>
                      <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-amber-200">
                        <Sparkles className="size-3" />
                        {p.accent}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* WHAT YOU MISS — blurred preview */}
      <section className="border-white/10 border-t bg-background py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            number="02"
            description="Voici ce qui passe dans le groupe Famille en ce moment. Sans le Pass, tu vois ces messages flouttés, et tu loupes la fenêtre."
            eyebrow="Aperçu"
            title="Ce que tu rates sans le Pass"
          />

          <div className="mt-12 overflow-hidden rounded-3xl border border-white/10 bg-coal/60">
            <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-coal/80 px-6 py-4">
              <div className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300">
                  <MessagesSquare className="size-4" aria-hidden />
                </span>
                <div>
                  <p className="font-display text-sm uppercase text-paper">
                    Famille Mboka · Privé
                  </p>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper-mute">
                    En direct · 1 247 membres
                  </p>
                </div>
              </div>
              <span className="hidden items-center gap-1 rounded-full bg-white/5 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-paper-mute sm:inline-flex">
                <EyeOff className="size-3" />
                Aperçu flouté
              </span>
            </div>

            <ul className="relative divide-y divide-white/5">
              {MISSED_DROPS.map((d, i) => (
                <li
                  key={i}
                  className="flex items-start gap-4 px-6 py-5 sm:px-8"
                >
                  <span className="mt-1 inline-flex shrink-0 items-center rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest text-amber-200">
                    {d.tag}
                  </span>
                  <p className="select-none text-paper-dim blur-[6px]">
                    {d.text}
                  </p>
                </li>
              ))}

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-coal/40 to-coal" />
            </ul>

            <div className="flex flex-col items-center gap-3 border-t border-white/10 bg-coal/80 px-6 py-6 text-center">
              <p className="max-w-md font-display text-lg uppercase text-paper">
                Tu vois flou. Les Famille voient clair.
              </p>
              <Button asChild className="shadow-[var(--glow-red)]">
                <Link href="#rejoindre">
                  <LockKeyhole className="size-4" />
                  Rejoindre la Famille — {formatEuro(currentPrice)}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
