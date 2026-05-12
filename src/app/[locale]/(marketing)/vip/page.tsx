import {
  Car,
  Check,
  Crown,
  Heart,
  MessagesSquare,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import Link from "next/link";

import { SectionHeading } from "@/components/marketing/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { isFoundingFamilyMember } from "@/lib/auth-helpers";

export const metadata = {
  title: "Famille Fondatrice · Mboka Hub",
  description:
    "Mboka Hub est désormais 100% gratuit pour les fans. Les premiers à avoir cru au projet (anciens VIP) gardent un badge ⭐ Famille Fondatrice à vie.",
};

const FREE_FOR_FANS = [
  {
    icon: Users,
    title: "Tous les prestataires",
    body: "Coiffeurs, maquilleurs, photographes, chauffeurs, sécurité… Le profil complet et la messagerie de chaque prestataire validé, sans paywall.",
  },
  {
    icon: Car,
    title: "Tous les covoiturages",
    body: "Toutes les annonces de la diaspora, les contacts des conducteurs, les villes de départ. Gratuit, comme ça doit l'être.",
  },
  {
    icon: ShieldCheck,
    title: "Toutes les soirées",
    body: "Les afters validés par le Hub : lieu, line-up, billetterie. Plus de paywall.",
  },
  {
    icon: MessagesSquare,
    title: "Toute l'info",
    body: "Concert, classiques de Paris, playlists, communauté. La maison Mboka est ouverte.",
  },
];

export default async function VipPage() {
  const isFounding = await isFoundingFamilyMember();

  if (isFounding) {
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
                    ⭐ Famille Fondatrice
                  </p>
                  <h1 className="mt-1 font-display text-4xl uppercase leading-none text-paper sm:text-5xl">
                    Tu es <span className="text-amber-300">fondateur</span>
                  </h1>
                </div>
              </div>
              <Badge
                className="border-amber-400/50 bg-amber-400/10 text-amber-200"
                variant="outline"
              >
                Badge à vie
              </Badge>
            </div>

            <p className="mt-6 max-w-2xl text-lg text-paper-dim">
              Tu fais partie des premiers qui ont cru à Mboka Hub avant le
              concert, quand l&apos;accès était encore payant. Aujourd&apos;hui
              la plateforme est 100% gratuite pour tous les fans — mais ton
              badge ⭐ Famille Fondatrice reste, à vie.
            </p>

            <p className="mt-4 max-w-2xl text-paper-dim text-sm">
              Sans toi on n&apos;aurait pas tenu jusqu&apos;ici. Merci.
            </p>

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
      {/* HERO — gratuit pour les fans */}
      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8">
        <div>
          <Badge
            className="border-emerald-400/40 bg-emerald-400/15 text-emerald-100"
            variant="outline"
          >
            100% gratuit pour la famille
          </Badge>
          <h1 className="mt-6 font-display text-5xl text-foreground leading-[1.05] md:text-7xl">
            MBOKA HUB EST{" "}
            <span className="text-emerald-300">GRATUIT</span> POUR{" "}
            <span className="text-primary">TOUS LES FANS</span>.
          </h1>
          <p className="mt-6 max-w-xl text-muted-foreground text-lg leading-8">
            Plus de pass à acheter. Plus de paywall. Tu vois tous les
            prestataires, tu prends tous les contacts, tu réserves tous les
            trajets et tous les afters. La maison Mboka est ouverte.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Button asChild className="shadow-[var(--glow-red)]">
              <Link href="/prestataires">Voir les prestataires</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/trajets">Trouver un trajet</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/afters">Voir les afters</Link>
            </Button>
          </div>
        </div>

        <Card className="rounded-3xl border-amber-400/30 bg-gradient-to-br from-amber-500/10 via-background to-background">
          <CardHeader>
            <p className="font-mono text-amber-200 text-xs uppercase tracking-[0.3em]">
              ⭐ Famille Fondatrice
            </p>
            <CardTitle className="mt-2 font-display text-foreground">
              <span className="text-3xl">Anciens VIP — badge à vie</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-5">
            <p className="text-paper-dim text-sm">
              Si tu as déjà payé un pass VIP avant la bascule (6,99 € ou
              9,99 €), ton badge ⭐ Famille Fondatrice reste à vie sur ton
              profil. Pas besoin de rien faire — connecte-toi, il est déjà
              là.
            </p>
            <ul className="grid gap-3">
              <li className="flex items-start gap-3 text-paper">
                <Check
                  aria-hidden
                  className="mt-1 size-4 shrink-0 text-amber-300"
                />
                <span className="text-sm">
                  Badge ⭐ Famille Fondatrice visible sur ton profil
                </span>
              </li>
              <li className="flex items-start gap-3 text-paper">
                <Check
                  aria-hidden
                  className="mt-1 size-4 shrink-0 text-amber-300"
                />
                <span className="text-sm">
                  Reconnaissance dans la communauté
                </span>
              </li>
              <li className="flex items-start gap-3 text-paper">
                <Heart
                  aria-hidden
                  className="mt-1 size-4 shrink-0 text-amber-300"
                />
                <span className="text-sm">
                  Notre gratitude éternelle pour avoir lancé le projet
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* WHAT'S FREE NOW */}
      <section className="border-white/10 border-t bg-background/80 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            number="01"
            description="Mboka Hub appartient à la famille. Voici ce qui est gratuit, pour tout le monde, dès aujourd'hui."
            eyebrow="Tout est ouvert"
            title="Ce qui est gratuit pour les fans"
          />

          <div className="mt-16 grid gap-6 lg:grid-cols-2">
            {FREE_FOR_FANS.map((p, idx) => {
              const Icon = p.icon;
              return (
                <article
                  key={p.title}
                  className="relative overflow-hidden rounded-3xl border border-white/10 bg-coal/60 p-8 transition hover:border-emerald-400/30"
                >
                  <span className="absolute right-6 top-6 font-mono text-[10px] uppercase tracking-[0.3em] text-paper-mute">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <div className="flex items-start gap-5">
                    <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-300">
                      <Icon className="size-6" aria-hidden />
                    </span>
                    <div>
                      <h3 className="font-display text-2xl uppercase text-paper">
                        {p.title}
                      </h3>
                      <p className="mt-3 text-paper-dim">{p.body}</p>
                      <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-emerald-200">
                        <Sparkles className="size-3" />
                        Gratuit
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* WHO PAYS NOW */}
      <section className="border-white/10 border-t bg-background py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            number="02"
            description="On ne fait jamais payer un fan pour voir. On fait payer ceux qui veulent de la visibilité."
            eyebrow="Le nouveau modèle"
            title="Qui paye Mboka Hub ?"
          />

          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-coal/40 p-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-blood">
                Prestataires
              </p>
              <p className="mt-2 font-display text-2xl uppercase text-paper">
                Boost & visibilité
              </p>
              <p className="mt-3 text-paper-dim text-sm">
                Fiche de base gratuite. Les prestataires qui veulent être en
                tête de liste payent un Boost (à partir de 5 €), un badge
                Vérifié (10 €) ou un Pack visibilité complet (49 €).
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-coal/40 p-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-blood">
                Entreprises
              </p>
              <p className="mt-2 font-display text-2xl uppercase text-paper">
                Sponsoring
              </p>
              <p className="mt-3 text-paper-dim text-sm">
                Marques, restaurants, clubs, agences — placements
                sponsorisés et fiches mises en avant pour toucher la
                diaspora.
              </p>
            </div>
          </div>

          <div className="mt-10 text-center">
            <Button asChild className="shadow-[var(--glow-red)]">
              <Link href="/pro/inscrire">Devenir prestataire — gratuit</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
