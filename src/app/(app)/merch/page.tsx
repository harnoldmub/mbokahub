import { ExternalLink } from "lucide-react";

import { SectionHeading } from "@/components/marketing/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const merchItems = [
  {
    vendor: "Ndaku Wear",
    title: "Bomber diaspora",
    price: "65 EUR",
    category: "mode",
    url: "https://example.com",
  },
  {
    vendor: "Liputa Studio",
    title: "Pochette wax",
    price: "25 EUR",
    category: "accessoires",
    url: "https://example.com",
  },
] as const;

export default function MerchPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        number="05"
        description="Drops exclusifs et merch officiel des artistes du grand soir. Stocks limités."
        eyebrow="Merch"
        title="La Boutique"
      />
      <div className="mt-10 grid gap-4 lg:grid-cols-2">
        {merchItems.map((item) => (
          <article
            className="border border-white/10 bg-card p-6"
            key={item.title}
          >
            <Badge variant="outline">{item.category}</Badge>
            <h2 className="mt-4 font-heading text-3xl text-foreground">
              {item.title}
            </h2>
            <p className="mt-2 text-muted-foreground">{item.vendor}</p>
            <p className="mt-6 font-display text-4xl text-foreground">
              {item.price}
            </p>
            <Button asChild className="mt-6" variant="outline">
              <a href={item.url} rel="noreferrer" target="_blank">
                Boutique externe <ExternalLink aria-hidden />
              </a>
            </Button>
          </article>
        ))}
      </div>
    </main>
  );
}
