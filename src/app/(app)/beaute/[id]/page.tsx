import { ArrowLeft, LockKeyhole, Star } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ContactLock } from "@/components/shared/contact-lock";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { canSeePrivateProInfo } from "@/lib/auth-helpers";
import { demoPros } from "@/lib/demo-data";
import { publicProName } from "@/lib/pro-display";

type ProDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProDetailsPage({ params }: ProDetailsPageProps) {
  const { id } = await params;
  const pro = demoPros.find((item) => item.id === id);

  if (!pro) {
    notFound();
  }

  const unlocked = await canSeePrivateProInfo();
  const displayedName = publicProName({
    category: pro.category,
    city: pro.city,
    displayName: pro.displayName,
    unlocked,
  });

  return (
    <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <Button asChild size="sm" variant="ghost">
        <Link href="/beaute/maquilleuses">
          <ArrowLeft aria-hidden /> Retour aux profils
        </Link>
      </Button>
      <section className="mt-8 border border-white/10 bg-card p-6">
        <div className="flex flex-wrap gap-2">
          {pro.isPremium ? (
            <Badge className="bg-accent text-accent-foreground">
              <Star aria-hidden /> Premium
            </Badge>
          ) : null}
          <Badge variant="outline">{pro.category.toLowerCase()}</Badge>
        </div>
        <h1
          className={`mt-5 font-heading text-4xl text-foreground sm:text-5xl ${
            unlocked ? "" : "italic text-muted-foreground"
          }`}
        >
          {displayedName}
        </h1>
        <p className="mt-3 text-muted-foreground">
          {pro.city}, {pro.country}
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="border border-white/10 bg-background/70 p-4">
            <p className="text-muted-foreground text-sm">Tarifs</p>
            <p className="mt-1 font-heading text-2xl">{pro.priceRange}</p>
          </div>
          <div className="border border-white/10 bg-background/70 p-4">
            <p className="text-muted-foreground text-sm">Note</p>
            <p className="mt-1 font-heading text-2xl">
              {pro.rating}/5 · {pro.reviewsCount} avis
            </p>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {pro.specialities.map((speciality) => (
            <Badge key={speciality} variant="secondary">
              {speciality}
            </Badge>
          ))}
        </div>
        <div className="mt-8 border border-primary/30 bg-background/80 p-4">
          <p className="mb-3 text-muted-foreground text-sm">Contact WhatsApp</p>
          <ContactLock value={pro.whatsappMasked} unlocked={unlocked} />
        </div>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          {unlocked ? null : (
            <Button asChild className="shadow-[var(--glow-red)]">
              <Link href="/vip">
                <LockKeyhole aria-hidden /> Rejoindre la Famille
              </Link>
            </Button>
          )}
          <Button asChild variant="outline">
            <Link href="/pro">Je suis professionnel</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
