import {
  ArrowRight,
  AtSign,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { ContactLock } from "@/components/shared/contact-lock";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ProDemo } from "@/lib/demo-data";

type ProCardData = ProDemo & {
  photos?: string[];
  instagramHandle?: string | null;
  isVerified?: boolean;
};

type ProCardProps = {
  pro: ProCardData & { whatsappRaw?: string | null };
  unlocked?: boolean;
};

export function ProCard({ pro, unlocked }: ProCardProps) {
  const photo = pro.photos?.[0];
  const showInstagram = unlocked && !!pro.instagramHandle;

  return (
    <Card className="group relative overflow-hidden bg-coal border-white/10 rounded-[2rem] transition-all duration-500 hover:border-gold/40 hover:-translate-y-2 hover:shadow-2xl">
      {/* PHOTO / COVER SECTION */}
      <div className="relative h-56 w-full overflow-hidden">
        {photo ? (
          <Image
            src={photo}
            alt={pro.displayName}
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            unoptimized
          />
        ) : (
          <div className="h-full w-full bg-smoke flex flex-col items-center justify-center gap-2 text-paper-mute group-hover:text-gold transition-colors">
            <Sparkles className="size-10 opacity-20" />
            <span className="font-mono text-[8px] uppercase tracking-widest">
              No showcase photo
            </span>
          </div>
        )}

        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {pro.isPremium && (
            <Badge className="bg-gold text-ink shadow-glow-gold border-none font-display text-[10px] uppercase">
              <Star className="size-3 mr-1 fill-current" /> Premium
            </Badge>
          )}
          {pro.isVerified && (
            <Badge className="bg-paper/10 backdrop-blur-md border-gold/40 text-gold font-mono text-[9px] uppercase flex items-center gap-1.5">
              <ShieldCheck className="size-3" /> Certifié
            </Badge>
          )}
        </div>

        {showInstagram ? (
          <div className="absolute bottom-4 left-4">
            <div className="bg-ink/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/5 flex items-center gap-2">
              <AtSign className="size-3 text-paper-mute" />
              <span className="font-mono text-[9px] text-paper-dim">
                @{pro.instagramHandle}
              </span>
            </div>
          </div>
        ) : null}
      </div>

      <CardHeader className="pt-6">
        <div className="space-y-1">
          <Badge
            variant="outline"
            className="border-blood/40 text-blood font-mono text-[8px] uppercase tracking-widest px-2 py-0"
          >
            {pro.category.toLowerCase()}
          </Badge>
          <CardTitle className="font-display text-2xl uppercase text-paper tracking-tight">
            {pro.displayName}
          </CardTitle>
          <p className="font-body text-xs text-paper-mute">
            {pro.city}, {pro.country}
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex flex-wrap gap-2">
          {pro.specialities.map((speciality: string) => (
            <span
              key={speciality}
              className="px-2.5 py-1 rounded-lg bg-smoke border border-white/5 font-mono text-[9px] text-paper-dim uppercase tracking-wider"
            >
              {speciality}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <div className="flex flex-col">
            <span className="font-mono text-[8px] text-paper-mute uppercase">
              Taux / Presta
            </span>
            <span className="font-display text-2xl text-paper">
              {pro.priceRange}
            </span>
          </div>
          <div className="text-right">
            <p className="font-body text-xs text-paper">
              {pro.rating} <span className="text-gold">★</span>
            </p>
            <p className="font-mono text-[8px] text-paper-mute uppercase">
              {pro.reviewsCount} avis
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {unlocked ? (
            <ContactLock
              value={pro.whatsappMasked}
              unlocked={unlocked}
              rawValue={pro.whatsappRaw ?? undefined}
            />
          ) : (
            <Link
              href="/vip"
              className="flex items-center justify-center gap-2 rounded-xl border border-vip/40 bg-vip/10 px-4 py-2.5 font-mono text-[10px] uppercase tracking-widest text-vip transition hover:bg-vip/15"
            >
              <LockKeyhole className="size-3.5" />
              Débloquer avec le Pass VIP Famille
            </Link>
          )}
          <Button
            asChild
            className="w-full h-12 bg-smoke border-white/5 hover:bg-gold hover:text-ink group/btn transition-all duration-500 rounded-xl"
            variant="outline"
          >
            <Link href={`/beaute/${pro.id}`}>
              Voir le profil{" "}
              <ArrowRight className="ml-2 size-4 transition-transform group-hover/btn:translate-x-1" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
