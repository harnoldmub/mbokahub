import { ArrowRight, Check, ShieldCheck } from "lucide-react";
import Link from "next/link";

import { SectionHeading } from "@/components/marketing/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { proOffer, proProofPoints } from "@/lib/marketing-data";

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
              <Link href="/sign-up?redirect_url=/pro/inscrire">
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
            description={proOffer.description}
            eyebrow="Pricing"
            title="Une seule inscription — tous les pros"
          />
          <div className="mt-10 mx-auto max-w-3xl">
            <Card className="rounded-2xl border-primary/30 bg-gradient-to-br from-primary/10 to-transparent shadow-[var(--glow-red)]">
              <CardHeader className="border-white/10 border-b pb-6">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <CardTitle className="font-heading text-3xl">
                      {proOffer.title}
                    </CardTitle>
                    <p className="mt-2 text-muted-foreground">
                      Beauté · Merch · Afters — même tarif pour tout le monde
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-5xl text-foreground sm:text-6xl">
                      {proOffer.price}
                    </p>
                    <p className="text-muted-foreground text-xs uppercase tracking-widest">
                      forfait week-end
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="grid gap-8 pt-6">
                <div>
                  <p className="mb-3 font-mono text-muted-foreground text-xs uppercase tracking-widest">
                    Pour qui
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {proOffer.audiences.map((a) => (
                      <div
                        className="rounded-xl border border-white/10 bg-card/50 p-4"
                        key={a.label}
                      >
                        <p className="font-heading text-foreground text-lg">
                          {a.label}
                        </p>
                        <p className="mt-1 text-muted-foreground text-sm">
                          {a.detail}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-3 font-mono text-muted-foreground text-xs uppercase tracking-widest">
                    Inclus
                  </p>
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {proOffer.benefits.map((benefit) => (
                      <li className="flex items-center gap-3" key={benefit}>
                        <Check aria-hidden className="size-4 text-primary" />
                        <span className="text-muted-foreground">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button asChild size="lg" className="w-full">
                  <Link href="/sign-up?redirect_url=/pro/inscrire">
                    Devenir prestataire Mboka Hub <ArrowRight aria-hidden />
                  </Link>
                </Button>
                <p className="text-center text-muted-foreground text-xs">
                  Une seule inscription, valable pour n'importe quel service.
                </p>
              </CardContent>
            </Card>
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
