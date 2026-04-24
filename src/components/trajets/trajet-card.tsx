import { ArrowRight, Car, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { ContactLock } from "@/components/shared/contact-lock";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TrajetDemo } from "@/lib/demo-data";

type TrajetCardProps = {
  trajet: TrajetDemo & {
    carPhoto?: string | null;
    vehiculeColor?: string | null;
    vehiculeModel?: string | null;
    whatsappRaw?: string | null;
  };
  unlocked?: boolean;
};

export function TrajetCard({ trajet, unlocked }: TrajetCardProps) {
  const carPhoto = trajet.carPhoto;

  return (
    <Card className="group relative overflow-hidden bg-coal border-white/10 rounded-[2rem] transition-all duration-500 hover:border-blood/40 hover:-translate-y-2 hover:shadow-2xl">
      {/* PHOTO SECTION */}
      <div className="relative h-48 w-full overflow-hidden">
        {carPhoto ? (
          <Image
            src={carPhoto}
            alt={trajet.vehiculeModel || "Vehicule"}
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            unoptimized
          />
        ) : (
          <div className="h-full w-full bg-smoke flex flex-col items-center justify-center gap-2 text-paper-mute group-hover:text-blood transition-colors">
            <Car className="size-10 opacity-20" />
            <span className="font-mono text-[8px] uppercase tracking-widest">
              No car photo
            </span>
          </div>
        )}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {trajet.isBoosted && (
            <Badge className="bg-blood text-paper shadow-glow-blood border-none font-display text-[10px] uppercase">
              <Star className="size-3 mr-1 fill-current" /> Vedette
            </Badge>
          )}
          <Badge
            variant="outline"
            className="bg-ink/60 backdrop-blur-md border-white/10 text-paper font-mono text-[9px] uppercase"
          >
            {trajet.paysDepart}
          </Badge>
        </div>
      </div>

      <CardHeader className="pt-6">
        <div className="space-y-1">
          <p className="font-mono text-[10px] text-blood uppercase tracking-widest">
            {trajet.dateLabel} à {trajet.heureDepart}
          </p>
          <CardTitle className="font-display text-2xl uppercase text-paper tracking-tight">
            {trajet.villeDepart} <span className="text-paper-mute">→</span>{" "}
            Paris
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="font-mono text-[8px] text-paper-mute uppercase">
              Véhicule
            </p>
            <p className="font-body text-sm text-paper truncate">
              {trajet.vehiculeModel || trajet.vehicule}
              {trajet.vehiculeColor && (
                <span className="text-paper-mute ml-2 italic">
                  ({trajet.vehiculeColor})
                </span>
              )}
            </p>
          </div>
          <div className="space-y-1 text-right">
            <p className="font-mono text-[8px] text-paper-mute uppercase">
              Places
            </p>
            <p className="font-body text-sm text-paper">
              {trajet.placesDispo} / {trajet.placesTotal} libres
            </p>
          </div>
        </div>

        <p className="font-body text-sm text-paper-dim leading-relaxed line-clamp-2 italic">
          "{trajet.note}"
        </p>

        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <div className="flex flex-col">
            <span className="font-mono text-[8px] text-paper-mute uppercase">
              Prix / place
            </span>
            <span className="font-display text-3xl text-paper">
              {trajet.prix}
              <span className="text-sm ml-1 text-paper-mute">EUR</span>
            </span>
          </div>
          <ContactLock
            value={trajet.whatsappMasked}
            unlocked={unlocked}
            rawValue={trajet.whatsappRaw ?? undefined}
          />
        </div>

        <Button
          asChild
          className="w-full h-12 bg-smoke border-white/5 hover:bg-blood hover:text-paper group/btn transition-all duration-500 rounded-xl"
          variant="outline"
        >
          <Link href={`/trajets/${trajet.id}`}>
            Détails{" "}
            <ArrowRight className="ml-2 size-4 transition-transform group-hover/btn:translate-x-1" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
