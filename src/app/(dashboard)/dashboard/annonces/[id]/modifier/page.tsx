import { ArrowLeft, ArrowRight, Info } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { NumberStepper } from "@/components/ui/number-stepper";
import { PhoneInput } from "@/components/ui/phone-input";
import { updateTrajetAction } from "@/lib/actions/annonces";
import { getDashboardUser } from "@/lib/dashboard";
import { prisma } from "@/lib/db/prisma";

type SearchParams = { error?: string };

export default async function EditTrajetPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const [{ id }, sp, user] = await Promise.all([
    params,
    searchParams,
    getDashboardUser(),
  ]);

  const trajet = await prisma.trajet.findUnique({ where: { id } });
  if (!trajet || trajet.userId !== user.id) {
    notFound();
  }

  // Pré-formatage de la date pour <input type="date" />
  const dateValue = trajet.date.toISOString().slice(0, 10);

  return (
    <div className="grid gap-8">
      <div>
        <Link
          href="/dashboard/annonces"
          className="text-paper-mute text-xs inline-flex items-center gap-1 hover:text-paper"
        >
          <ArrowLeft className="size-3" /> Retour aux annonces
        </Link>
        <p className="mt-3 font-mono text-blood text-xs uppercase tracking-[0.3em]">
          Modifier un trajet
        </p>
        <h1 className="mt-2 font-heading text-4xl text-paper">
          {trajet.villeDepart} → {trajet.villeArrivee}
        </h1>
        <p className="mt-3 max-w-2xl text-paper-dim leading-7">
          Toute modification renvoie ton trajet en file de validation Mboka Hub
          (visible uniquement après approbation). Les passagers déjà en contact
          ne sont pas notifiés automatiquement — préviens-les sur WhatsApp si
          tu changes l&apos;horaire ou le prix.
        </p>
      </div>

      {sp.error === "missing" ? (
        <div className="rounded-2xl border border-yellow-400/40 bg-yellow-400/10 p-4 text-yellow-200 text-sm">
          Champs obligatoires manquants ou invalides. Vérifie ville, date,
          heure, places, prix et WhatsApp.
        </div>
      ) : null}

      <form
        action={updateTrajetAction}
        className="grid gap-8 rounded-3xl border border-white/10 bg-coal/60 p-6 sm:p-8"
      >
        <input type="hidden" name="id" value={trajet.id} />

        <div className="flex items-start gap-3 rounded-2xl border border-blood/20 bg-blood/5 p-4 text-paper-dim text-xs leading-relaxed">
          <Info className="size-4 text-blood shrink-0 mt-0.5" />
          <span>
            La fiche repasse en attente de validation après chaque
            modification. Tu reçois un email dès qu&apos;elle est revalidée.
          </span>
        </div>

        <div className="grid gap-6">
          <h2 className="font-display text-lg uppercase text-paper">
            Itinéraire
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <FormField label="Ville de départ" helperText="D'où pars-tu ?">
              <Input
                name="villeDepart"
                required
                defaultValue={trajet.villeDepart}
                className="h-12 bg-smoke border-none"
              />
            </FormField>
            <FormField label="Pays de départ" helperText="Belgique, France...">
              <Input
                name="paysDepart"
                required
                defaultValue={trajet.paysDepart}
                className="h-12 bg-smoke border-none"
              />
            </FormField>
            <FormField label="Ville d'arrivée" helperText="Paris par défaut">
              <Input
                name="villeArrivee"
                required
                defaultValue={trajet.villeArrivee}
                className="h-12 bg-smoke border-none"
              />
            </FormField>
            <FormField label="Date" helperText="Jour du trajet">
              <Input
                name="date"
                type="date"
                required
                defaultValue={dateValue}
                className="h-12 bg-smoke border-none text-paper-dim"
              />
            </FormField>
            <FormField label="Heure de départ" helperText="HH:MM">
              <Input
                name="heureDepart"
                type="time"
                required
                defaultValue={trajet.heureDepart}
                className="h-12 bg-smoke border-none text-paper-dim"
              />
            </FormField>
          </div>
        </div>

        <div className="grid gap-6">
          <h2 className="font-display text-lg uppercase text-paper">
            Véhicule
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <FormField label="Modèle" helperText="Audi A3, Peugeot 3008...">
              <Input
                name="vehiculeModel"
                defaultValue={trajet.vehiculeModel ?? ""}
                className="h-12 bg-smoke border-none"
              />
            </FormField>
            <FormField label="Couleur" helperText="Noir, blanc, gris...">
              <Input
                name="vehiculeColor"
                defaultValue={trajet.vehiculeColor ?? ""}
                className="h-12 bg-smoke border-none"
              />
            </FormField>
          </div>
        </div>

        <div className="grid gap-6">
          <h2 className="font-display text-lg uppercase text-paper">
            Détails
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            <FormField label="Places" helperText="Total dispo">
              <NumberStepper
                name="placesTotal"
                defaultValue={trajet.placesTotal}
                min={1}
                max={8}
                required
                unit="places"
              />
            </FormField>
            <FormField label="Prix / place" helperText="En euros">
              <Input
                name="prix"
                type="number"
                min="0"
                step="0.5"
                required
                defaultValue={trajet.prix}
                className="h-12 bg-smoke border-none"
              />
            </FormField>
            <FormField label="WhatsApp" helperText="Contact direct">
              <PhoneInput
                name="whatsapp"
                required
                defaultValue={trajet.whatsapp}
              />
            </FormField>
          </div>

          <FormField label="Note (optionnel)" helperText="Détails utiles">
            <textarea
              name="note"
              rows={3}
              defaultValue={trajet.note ?? ""}
              className="w-full rounded-md bg-smoke px-4 py-3 text-paper text-sm placeholder:text-paper-dim focus:outline-none"
              placeholder="Je peux récupérer en gare de Bruxelles-Midi..."
            />
          </FormField>
        </div>

        <div className="flex flex-col items-stretch gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <Button asChild variant="outline" type="button">
            <Link href="/dashboard/annonces">Annuler</Link>
          </Button>
          <Button type="submit" className="shadow-glow-blood">
            Enregistrer les modifications{" "}
            <ArrowRight className="ml-2 size-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
