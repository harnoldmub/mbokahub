import { ArrowRight, ExternalLink, Star } from "lucide-react";
import Link from "next/link";

import { SectionHeading } from "@/components/marketing/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { demoAfters } from "@/lib/demo-data";

export default function AftersPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        number="03"
        description="Mboka Hub ne revend aucun billet. Chaque soirée renvoie vers une billetterie ou une page externe."
        eyebrow="Afters"
        title="Sorties autour du week-end"
      />
      <div className="mt-10 grid gap-4 lg:grid-cols-2">
        {demoAfters.map((after) => (
          <Card className="rounded-lg border-white/10" key={after.slug}>
            <CardHeader>
              <div className="flex flex-wrap gap-2">
                {after.isBoosted ? (
                  <Badge className="bg-accent text-accent-foreground">
                    <Star aria-hidden /> Vedette
                  </Badge>
                ) : null}
                <Badge variant="outline">{after.city}</Badge>
              </div>
              <CardTitle className="font-heading text-2xl">
                {after.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-5">
              <div className="grid gap-2 text-muted-foreground">
                <p>{after.dateLabel}</p>
                <p>{after.venue}</p>
                <p>A partir de {after.priceFrom} EUR</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild>
                  <Link href={`/afters/${after.slug}`}>
                    Details <ArrowRight aria-hidden />
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <a href={after.ticketUrl} rel="noreferrer" target="_blank">
                    Billetterie externe <ExternalLink aria-hidden />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
