"use client";

import { useState, useTransition } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PhotoUploader } from "@/components/admin/photo-uploader";
import { updateProProfileAdmin } from "@/lib/actions/admin";

const CATEGORIES = [
  "MAQUILLEUSE",
  "COIFFEUR",
  "BARBIER",
  "PHOTOGRAPHE",
  "VIDEASTE",
  "VENDEUR_MERCH",
  "ORGANISATEUR_AFTER",
  "SECURITE",
  "CHAUFFEUR_VTC",
  "DJ",
  "ANIMATEUR",
  "CUISINIER",
  "TRAITEUR",
  "DECORATEUR",
  "COUTURIER",
  "BIJOUTIER",
  "BABYSITTER",
  "AUTRE",
] as const;

type EditProFormProps = {
  pro: {
    id: string;
    displayName: string;
    category: string;
    city: string;
    country: string;
    whatsapp: string;
    bio: string | null;
    priceRange: string | null;
    instagramHandle: string | null;
    tiktokHandle: string | null;
    specialities: string[];
    photos: string[];
  };
};

export function EditProForm({ pro }: EditProFormProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      try {
        await updateProProfileAdmin(pro.id, formData);
        setOpen(false);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Erreur inconnue");
      }
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-md bg-blue-500/20 px-2 py-1 text-blue-300 text-xs hover:bg-blue-500/30"
      >
        Modifier
      </button>

      <Dialog
        open={open}
        onOpenChange={(v) => (!isPending ? setOpen(v) : null)}
      >
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier le prestataire</DialogTitle>
            <DialogDescription>
              Mets à jour les infos publiques de {pro.displayName}. Le pro verra
              ces changements immédiatement.
            </DialogDescription>
          </DialogHeader>

          <form
            action={handleSubmit}
            className="grid grid-cols-1 gap-3 sm:grid-cols-2"
          >
            <label className="sm:col-span-2 flex flex-col gap-1 text-xs text-muted-foreground">
              Nom affiché
              <input
                name="displayName"
                required
                defaultValue={pro.displayName}
                className="rounded-md border border-white/10 bg-black/30 px-3 py-2 text-foreground text-sm"
              />
            </label>

            <label className="flex flex-col gap-1 text-xs text-muted-foreground">
              Catégorie
              <select
                name="category"
                required
                defaultValue={pro.category}
                className="rounded-md border border-white/10 bg-black/30 px-3 py-2 text-foreground text-sm"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1 text-xs text-muted-foreground">
              Ville
              <input
                name="city"
                required
                defaultValue={pro.city}
                className="rounded-md border border-white/10 bg-black/30 px-3 py-2 text-foreground text-sm"
              />
            </label>

            <label className="flex flex-col gap-1 text-xs text-muted-foreground">
              Pays
              <input
                name="country"
                defaultValue={pro.country}
                className="rounded-md border border-white/10 bg-black/30 px-3 py-2 text-foreground text-sm"
              />
            </label>

            <label className="flex flex-col gap-1 text-xs text-muted-foreground">
              WhatsApp
              <input
                name="whatsapp"
                required
                defaultValue={pro.whatsapp}
                placeholder="+33…"
                className="rounded-md border border-white/10 bg-black/30 px-3 py-2 text-foreground text-sm"
              />
            </label>

            <label className="flex flex-col gap-1 text-xs text-muted-foreground">
              Tarif
              <input
                name="priceRange"
                defaultValue={pro.priceRange ?? ""}
                placeholder="ex: 80-150€"
                className="rounded-md border border-white/10 bg-black/30 px-3 py-2 text-foreground text-sm"
              />
            </label>

            <label className="flex flex-col gap-1 text-xs text-muted-foreground">
              Instagram (@handle)
              <input
                name="instagramHandle"
                defaultValue={pro.instagramHandle ?? ""}
                placeholder="@studio_mboka"
                className="rounded-md border border-white/10 bg-black/30 px-3 py-2 text-foreground text-sm"
              />
            </label>

            <label className="flex flex-col gap-1 text-xs text-muted-foreground">
              TikTok (@handle)
              <input
                name="tiktokHandle"
                defaultValue={pro.tiktokHandle ?? ""}
                placeholder="@studio_mboka"
                className="rounded-md border border-white/10 bg-black/30 px-3 py-2 text-foreground text-sm"
              />
            </label>

            <label className="sm:col-span-2 flex flex-col gap-1 text-xs text-muted-foreground">
              Spécialités (séparées par virgules)
              <input
                name="specialities"
                defaultValue={pro.specialities.join(", ")}
                placeholder="ex: Box braids, Locks, Twists"
                className="rounded-md border border-white/10 bg-black/30 px-3 py-2 text-foreground text-sm"
              />
            </label>

            <label className="sm:col-span-2 flex flex-col gap-1 text-xs text-muted-foreground">
              Bio
              <textarea
                name="bio"
                rows={3}
                defaultValue={pro.bio ?? ""}
                className="rounded-md border border-white/10 bg-black/30 px-3 py-2 text-foreground text-sm"
              />
            </label>

            <div className="sm:col-span-2">
              <PhotoUploader
                name="photos"
                label="Photos du prestataire"
                defaultUrls={pro.photos}
                multiple
                maxFiles={12}
                helpText="Glisse-dépose ou clique pour ajouter. La première photo est la couverture."
              />
            </div>

            {error && (
              <div className="sm:col-span-2 rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-red-300 text-xs">
                {error}
              </div>
            )}

            <DialogFooter className="sm:col-span-2 gap-2 sm:gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={isPending}
                className="inline-flex h-9 items-center justify-center rounded-full border border-white/15 bg-transparent px-4 text-sm text-foreground hover:bg-white/10 disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex h-9 items-center justify-center rounded-full bg-red-500 px-4 text-sm font-medium text-white transition hover:bg-red-600 disabled:opacity-50"
              >
                {isPending ? "Enregistrement…" : "Enregistrer"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
