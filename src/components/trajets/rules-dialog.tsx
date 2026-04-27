"use client";

import {
  AlertTriangle,
  CheckCircle2,
  HandshakeIcon,
  Info,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Props = {
  triggerLabel?: string;
};

export function RulesDialog({
  triggerLabel = "Voir les règles de mise en relation",
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">{triggerLabel}</Button>
      </DialogTrigger>
      <DialogContent
        className="max-w-2xl border border-white/10 bg-coal p-0 sm:max-w-2xl"
      >
        <div className="border-b border-white/10 bg-gradient-to-b from-blood/15 via-blood/5 to-transparent px-6 pt-6 pb-5 sm:px-8 sm:pt-7">
          <DialogHeader>
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-blood/40 bg-blood/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.3em] text-blood">
              <ShieldCheck aria-hidden className="size-3" />
              À lire avant de contacter
            </span>
            <DialogTitle className="mt-3 font-display text-2xl uppercase leading-tight text-paper sm:text-3xl">
              Règles de mise en relation
            </DialogTitle>
            <DialogDescription className="text-paper-dim">
              Mboka Hub est un site indépendant qui met en relation des membres
              de la diaspora. Nous ne vendons rien, nous ne transportons
              personne, nous ne gérons pas les paiements entre vous.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="max-h-[60vh] overflow-y-auto px-6 py-6 sm:px-8">
          <ol className="space-y-5">
            <Rule
              icon={<Info aria-hidden className="size-4" />}
              title="1. Vérifie l'identité avant de partir"
            >
              Demande la pièce d&apos;identité du conducteur ou du passager au
              moment du rendez-vous. Si quelque chose te semble suspect,
              n&apos;y vas pas et signale le profil sur la fiche du trajet.
            </Rule>

            <Rule
              icon={<HandshakeIcon aria-hidden className="size-4" />}
              title="2. Le paiement se règle entre vous"
            >
              Le prix indicatif (carburant + péage divisés) reste un repère.
              Aucun paiement ne passe par Mboka Hub : tu paies directement le
              conducteur sur place, en liquide ou via l&apos;application qu&apos;il
              accepte.
            </Rule>

            <Rule
              icon={<CheckCircle2 aria-hidden className="size-4" />}
              title="3. Confirme la place dès que c'est ok"
            >
              Échange en WhatsApp pour confirmer le lieu, l&apos;heure et le
              nombre de places. Préviens au moins 24h à l&apos;avance en cas
              d&apos;annulation, par respect pour les autres passagers et le
              conducteur.
            </Rule>

            <Rule
              icon={<ShieldCheck aria-hidden className="size-4" />}
              title="4. Reste prudent(e) — voyage en groupe"
            >
              Privilégie un point de rendez-vous public (gare, station-service,
              parking d&apos;hôtel). Préviens un proche du trajet, partage la
              géolocalisation pendant le voyage.
            </Rule>

            <Rule
              icon={<AlertTriangle aria-hidden className="size-4" />}
              title="5. Strictement interdit"
            >
              Pas de transport de colis, d&apos;argent ou de produits pour le
              compte d&apos;un tiers. Pas de mineur(e) sans accompagnant légal.
              Pas de comportement irrespectueux, raciste ou violent —
              utilisation immédiate du bouton « Signaler » sur la fiche du
              trajet.
            </Rule>
          </ol>

          <div className="mt-6 rounded-2xl border border-white/10 bg-smoke/60 p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-paper-mute">
              Responsabilité
            </p>
            <p className="mt-2 text-sm text-paper-dim leading-relaxed">
              Mboka Hub est un service d&apos;intermédiation gratuit. Le site
              n&apos;est pas partie au contrat de transport et n&apos;est pas
              responsable des trajets effectués, des paiements échangés, ni
              du comportement des utilisateurs. En contactant un membre, tu
              acceptes ces règles et nos{" "}
              <a
                href="/cgu"
                className="text-blood underline underline-offset-2 hover:text-blood/80"
              >
                conditions générales d&apos;utilisation
              </a>
              .
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-white/10 bg-smoke/40 px-6 py-4 sm:px-8">
          <Button onClick={() => setOpen(false)}>
            J&apos;ai compris
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Rule({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex gap-4">
      <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-xl border border-blood/30 bg-blood/10 text-blood">
        {icon}
      </span>
      <div className="space-y-1">
        <p className="font-heading text-base text-paper">{title}</p>
        <p className="text-sm leading-relaxed text-paper-dim">{children}</p>
      </div>
    </li>
  );
}
