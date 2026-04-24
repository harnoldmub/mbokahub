import { auth } from "@clerk/nextjs/server";
import { Check, Crown, Sparkles, Timer, Users } from "lucide-react";
import Link from "next/link";

import { SectionHeading } from "@/components/marketing/section-heading";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PRICE_VIP_EUR } from "@/lib/marketing-data";
import {
  EARLY_BIRD_DEADLINE,
  PRICE_VIP_EARLY_BIRD_EUR,
  isEarlyBirdActive,
} from "@/lib/stripe-config";

import { VipCheckoutButton } from "./vip-checkout-button";

export const metadata = {
  title: "Devenir VIP Famille · Mboka Hub",
  description:
    "Accède à toute la Famille Mboka, débloque les contacts pros et participe au tirage backstage. Early Bird 7 € jusqu'au 30 avril.",
};

const benefits = [
  "Accès illimité à la Famille Mboka privée",
  "Déblocage de tous les contacts WhatsApp pros",
  "Annonces de covoiturage prioritaires",
  "Tirage au sort meet & greet & cadeaux exclusifs",
  "Badge VIP sur ton profil et ton message dans le forum",
  "Newsletter premium avant, pendant et après le concert",
];

export default async function VipPage() {
  const { userId } = await auth();
  const earlyBird = isEarlyBirdActive();
  const currentPrice = earlyBird ? PRICE_VIP_EARLY_BIRD_EUR : PRICE_VIP_EUR;
  const deadline = EARLY_BIRD_DEADLINE.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div>
      {earlyBird ? (
        <div className="border-amber-400/40 border-y bg-gradient-to-r from-amber-500/20 via-amber-400/10 to-amber-500/20">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-3 px-4 py-3 text-center sm:px-6 lg:px-8">
            <Timer aria-hidden className="size-5 text-amber-300" />
            <p className="font-mono text-amber-100 text-xs uppercase tracking-[0.2em] sm:text-sm">
              Early Bird actif &middot; {PRICE_VIP_EARLY_BIRD_EUR} €
              au lieu de {PRICE_VIP_EUR} € jusqu'au {deadline}
            </p>
          </div>
        </div>
      ) : null}

      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8">
        <div>
          <Badge
            className="border-primary/40 bg-primary/15 text-white"
            variant="outline"
          >
            Pass Famille Mboka
          </Badge>
          <h1 className="mt-6 font-display text-5xl text-foreground leading-tight md:text-7xl">
            DEVIENS{" "}
            <span className="text-primary">VIP FAMILLE</span>
            {", "}
            VIS LE STADE EN VRAI.
          </h1>
          <p className="mt-6 max-w-xl text-muted-foreground text-lg leading-8">
            Un seul paiement, une seule promesse&nbsp;: tu rejoins la Famille
            Mboka qui prépare le Stade de France les 2 et 3 mai 2026. Pas
            d'abonnement, pas de reconduction, pas de spam.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <Crown aria-hidden className="size-6 text-amber-300" />
              <p className="mt-3 font-mono text-muted-foreground text-xs uppercase">
                Statut
              </p>
              <p className="mt-1 font-heading text-foreground text-lg">
                VIP Famille
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <Users aria-hidden className="size-6 text-primary" />
              <p className="mt-3 font-mono text-muted-foreground text-xs uppercase">
                Communauté
              </p>
              <p className="mt-1 font-heading text-foreground text-lg">
                Accès total
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <Sparkles aria-hidden className="size-6 text-accent" />
              <p className="mt-3 font-mono text-muted-foreground text-xs uppercase">
                Bonus
              </p>
              <p className="mt-1 font-heading text-foreground text-lg">
                Tirages cadeaux
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
              <span className="text-7xl">{currentPrice}</span>
              <span className="text-3xl text-muted-foreground">€</span>
              {earlyBird ? (
                <span className="ml-2 font-mono text-muted-foreground text-base line-through">
                  {PRICE_VIP_EUR} €
                </span>
              ) : null}
            </CardTitle>
            <p className="mt-1 text-muted-foreground text-sm">
              Paiement unique &middot; valide jusqu'au 31 mai 2026
            </p>
          </CardHeader>
          <CardContent className="grid gap-5">
            <ul className="grid gap-3">
              {benefits.map((b) => (
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
              <VipCheckoutButton priceLabel={`${currentPrice} €`} />
            ) : (
              <Link
                className="inline-flex w-full items-center justify-center rounded-full bg-primary px-6 py-4 font-mono text-ink text-sm uppercase tracking-[0.2em] transition hover:bg-primary/90"
                href={`/sign-in?redirect_url=/vip`}
              >
                Se connecter pour devenir VIP
              </Link>
            )}

            <p className="text-center text-muted-foreground text-xs">
              Paiement sécurisé Stripe &middot; Apple Pay, Google Pay et CB
              acceptés
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="border-white/10 border-t bg-background/80 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            number="VIP"
            description="Le pass VIP Famille, c'est un accès tout-en-un à la Famille Mboka, pas un abonnement déguisé. Tu paies une fois, tu profites jusqu'au 31 mai."
            eyebrow="Promesse"
            title="Tout est inclus, sans surprise"
          />
        </div>
      </section>
    </div>
  );
}
