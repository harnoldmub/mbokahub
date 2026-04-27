import { ExternalLink, ShoppingBag } from "lucide-react";
import Link from "next/link";

import { SectionHeading } from "@/components/marketing/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

function formatPrice(amount: number): string {
  if (Number.isInteger(amount)) return `${amount} EUR`;
  return `${amount.toFixed(2)} EUR`;
}

export default async function MerchPage() {
  const items = await prisma.merchProduct.findMany({
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    take: 100,
  });

  return (
    <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        number="05"
        description="Mode, accessoires et créations diaspora via boutiques externes. Stocks limités."
        eyebrow="Merch"
        title="La Boutique"
      />

      {items.length === 0 ? (
        <div className="mt-16 flex flex-col items-center justify-center gap-6 rounded-[2.5rem] border border-white/10 bg-coal/60 px-8 py-20 text-center">
          <div className="flex size-16 items-center justify-center rounded-2xl border border-blood/30 bg-blood/10 text-blood">
            <ShoppingBag className="size-7" />
          </div>
          <div className="max-w-md">
            <h2 className="font-display text-3xl uppercase text-paper">
              Boutique en cours de chargement
            </h2>
            <p className="mt-3 font-body text-paper-dim">
              Nos premiers créateurs diaspora arrivent bientôt. Tu vends de la
              mode, des accessoires ou des créations ? Écris-nous pour
              référencer ta boutique.
            </p>
          </div>
          <Button asChild variant="outline" className="h-12 px-6">
            <Link href="mailto:contact@mbokahub.com?subject=Référencer%20ma%20boutique%20-%20Mboka%20Hub">
              Référencer ma boutique
            </Link>
          </Button>
        </div>
      ) : (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <article
              className="group flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-coal transition-all duration-300 hover:-translate-y-1 hover:border-blood/40"
              key={item.id}
            >
              <div className="relative aspect-square w-full overflow-hidden bg-smoke/40">
                {item.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-paper-mute">
                    <ShoppingBag className="size-10 opacity-40" />
                  </div>
                )}
                <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                  {item.isFeatured ? (
                    <Badge className="border-none bg-ember/90 font-mono text-[9px] uppercase tracking-wider text-ink">
                      À la une
                    </Badge>
                  ) : null}
                  <Badge
                    variant="outline"
                    className="border-white/20 bg-coal/80 font-mono text-[9px] uppercase backdrop-blur"
                  >
                    {item.category}
                  </Badge>
                </div>
              </div>

              <div className="flex flex-1 flex-col gap-4 p-6">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-blood">
                    {item.vendorName}
                  </p>
                  <h2 className="mt-1 font-display text-2xl uppercase leading-tight text-paper">
                    {item.title}
                  </h2>
                </div>

                {item.description ? (
                  <p className="text-sm text-paper-dim line-clamp-3">
                    {item.description}
                  </p>
                ) : null}

                <p className="mt-auto font-display text-3xl text-ember">
                  {formatPrice(item.price)}
                </p>

                <Button
                  asChild
                  variant="outline"
                  className="h-11 border-white/10 hover:bg-blood hover:border-blood hover:text-paper"
                >
                  <a
                    href={item.externalUrl}
                    rel="noreferrer noopener"
                    target="_blank"
                  >
                    Boutique externe <ExternalLink className="ml-2 size-4" />
                  </a>
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
