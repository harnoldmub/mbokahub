import { ArrowRight, Check, ShieldCheck } from "lucide-react";
import Link from "next/link";

import { SectionHeading } from "@/components/marketing/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { proOffers, proProofPoints } from "@/lib/marketing-data";

export default function ProPage() {
  return (
    <div>
      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_0.85fr] lg:px-8">
        <div>
          <Badge
            className="border-primary/40 bg-primary/15 text-white"
            variant="outline"
          >
            Espace professionnels
          </Badge>
          <h1 className="mt-6 max-w-4xl font-display text-5xl text-foreground uppercase leading-none sm:text-7xl">
            Vends ta <span className="text-primary italic">visibilité</span>,
            pas ton temps dans le vide
          </h1>
          <p className="mt-6 max-w-2xl text-muted-foreground text-xl leading-8">
            Mboka Hub connecte les fans à des pros utiles pour le week-end :
            beauté, merch et afters. Les paiements premium vont uniquement à
            Mboka Hub.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild className="shadow-[var(--glow-red)]" size="lg">
              <Link href="/sign-up">
                Créer mon compte <ArrowRight aria-hidden />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/cgu">Voir les règles</Link>
            </Button>
          </div>
        </div>

        <div className="grid content-start gap-3">
          {proProofPoints.map((point) => {
            const Icon = point.icon;

            return (
              <article
                className="grid grid-cols-[auto_1fr] gap-4 border border-white/10 bg-card/80 p-5"
                key={point.label}
              >
                <div className="grid size-11 place-items-center bg-primary/15 text-primary">
                  <Icon aria-hidden className="size-5" />
                </div>
                <div>
                  <p className="font-heading text-2xl text-foreground">
                    {point.value}
                  </p>
                  <p className="text-muted-foreground text-sm uppercase">
                    {point.label}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-white/10 border-y bg-background/80 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            number="PRO"
            description="Tarifs one-shot pour une fenêtre événementielle claire. Pas d'abonnement caché pour le MVP."
            eyebrow="Pricing"
            title="Offres premium pros"
          />
          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {proOffers.map((offer) => (
              <Card
                className="rounded-lg border-white/10 transition duration-200 hover:-translate-y-1 hover:border-primary/40"
                key={offer.title}
              >
                <CardHeader>
                  <CardTitle className="font-heading text-2xl">
                    {offer.title}
                  </CardTitle>
                  <p className="text-muted-foreground">{offer.audience}</p>
                </CardHeader>
                <CardContent className="grid gap-6">
                  <p className="font-display text-5xl text-foreground">
                    {offer.price}
                  </p>
                  <ul className="grid gap-3">
                    {offer.benefits.map((benefit) => (
                      <li className="flex items-center gap-3" key={benefit}>
                        <Check aria-hidden className="size-4 text-primary" />
                        <span className="text-muted-foreground">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[auto_1fr] lg:px-8">
          <div className="grid size-14 place-items-center bg-accent/15 text-accent">
            <ShieldCheck aria-hidden className="size-7" />
          </div>
          <div>
            <h2 className="font-heading text-3xl text-foreground">
              Validation manuelle avant mise en avant
            </h2>
            <p className="mt-4 max-w-3xl text-muted-foreground text-lg leading-8">
              Les profils pros et afters seront vérifiés par l'admin avant badge
              public. Les afters restent des liens sortants vers Shotgun,
              Weezevent, Eventbrite ou une autre billetterie externe.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
