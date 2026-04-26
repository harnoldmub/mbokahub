import { AtSign, Camera, CheckCircle2, IdCard, Sparkles } from "lucide-react";
import Link from "next/link";

import { PhotoUploader } from "@/components/admin/photo-uploader";
import { ScrollToTopOnMount } from "@/components/dashboard/scroll-to-top-on-mount";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { getDashboardUser } from "@/lib/dashboard";
import { prisma } from "@/lib/db/prisma";
import { PRO_CATEGORY_BY_ID } from "@/lib/pro-categories";
import { updateProProfileAction } from "@/lib/actions/public";

type SearchParams = {
  saved?: string;
  error?: string;
};

export default async function ProfilProPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const user = await getDashboardUser();
  const pro = await prisma.proProfile.findUnique({
    where: { userId: user.id },
  });

  if (!pro) {
    return (
      <div className="grid gap-6">
        <div>
          <p className="font-mono text-blood text-xs uppercase tracking-[0.3em]">
            Profil pro
          </p>
          <h1 className="mt-3 font-heading text-4xl text-paper">
            Pas encore de profil professionnel
          </h1>
          <p className="mt-3 max-w-2xl text-paper-dim leading-7">
            Tu n&apos;as pas encore inscrit ton service. Crée-le en deux
            minutes pour apparaître dans l&apos;annuaire des prestataires
            Mboka Hub.
          </p>
        </div>
        <div>
          <Button asChild>
            <Link href="/pro/inscrire">Inscrire mon service</Link>
          </Button>
        </div>
      </div>
    );
  }

  const meta = PRO_CATEGORY_BY_ID[pro.category];

  return (
    <div className="grid gap-8">
      <div>
        <p className="font-mono text-blood text-xs uppercase tracking-[0.3em]">
          Profil pro
        </p>
        <h1 className="mt-3 font-heading text-4xl text-paper">
          Modifier ma fiche pro
        </h1>
        <p className="mt-3 max-w-2xl text-paper-dim leading-7">
          Mets à jour tes infos pro à tout moment. Les changements
          apparaissent immédiatement sur ta fiche publique.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge variant="outline">
            {meta?.icon} {meta?.label ?? pro.category}
          </Badge>
          <Badge variant={pro.isVerified ? "default" : "outline"}>
            {pro.isVerified ? "Vérifié" : "En attente de vérification"}
          </Badge>
          <Badge variant={pro.isPremium ? "default" : "outline"}>
            {pro.isPremium ? "Premium" : "Gratuit"}
          </Badge>
        </div>
      </div>

      {sp.saved ? (
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-4 text-emerald-200 text-sm">
          <ScrollToTopOnMount />
          <CheckCircle2 aria-hidden className="size-5" />
          Tes modifications ont bien été enregistrées.
        </div>
      ) : null}
      {sp.error === "missing" ? (
        <div className="rounded-2xl border border-yellow-400/40 bg-yellow-400/10 p-4 text-yellow-200 text-sm">
          <ScrollToTopOnMount />
          Champs obligatoires manquants : nom, ville et WhatsApp.
        </div>
      ) : null}
      {sp.error === "contact-in-bio" ? (
        <div className="rounded-2xl border border-blood/40 bg-blood/10 p-4 text-paper text-sm">
          <ScrollToTopOnMount />
          <strong className="text-blood">Présentation refusée.</strong> Aucun
          numéro de téléphone, email, lien ni nom de réseau (WhatsApp,
          Instagram, TikTok, Snapchat, Telegram…) n&apos;est autorisé dans la
          présentation. Tes contacts sont déjà gérés par les champs WhatsApp et
          Instagram et débloqués via le Pass VIP Famille.
        </div>
      ) : null}

      <form
        action={updateProProfileAction}
        className="grid gap-8 rounded-3xl border border-white/10 bg-coal/60 p-6 sm:p-8"
      >
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-blood/15 text-blood">
            <IdCard className="size-5" />
          </span>
          <div>
            <h2 className="font-display text-xl uppercase text-paper">
              Infos publiques
            </h2>
            <p className="text-paper-mute text-xs">
              Affichées sur ta fiche prestataire
            </p>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            label="Nom professionnel"
            helperText="Le nom qui apparaîtra sur ta fiche"
          >
            <Input
              name="displayName"
              required
              defaultValue={pro.displayName}
              placeholder="Studio Liputa / Barber XY..."
              className="h-12 bg-smoke border-none"
            />
          </FormField>
          <FormField
            label="Ville / Secteur"
            helperText="Où tu exerces ce week-end là"
          >
            <Input
              name="city"
              required
              defaultValue={pro.city}
              placeholder="Saint-Denis, Paris 18..."
              className="h-12 bg-smoke border-none"
            />
          </FormField>
          <FormField label="Pays" helperText="Pays d'exercice">
            <Input
              name="country"
              required
              defaultValue={pro.country}
              className="h-12 bg-smoke border-none"
            />
          </FormField>
          <FormField
            label="WhatsApp"
            helperText="Pour que les VIP te contactent directement"
          >
            <Input
              name="whatsapp"
              required
              defaultValue={pro.whatsapp}
              placeholder="+33 6 ..."
              className="h-12 bg-smoke border-none"
            />
          </FormField>
          <FormField label="Instagram (optionnel)" helperText="@handle">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-paper-mute font-mono">
                @
              </span>
              <Input
                name="instagramHandle"
                defaultValue={pro.instagramHandle ?? ""}
                placeholder="username"
                className="h-12 bg-smoke border-none pl-8"
              />
            </div>
          </FormField>
          <FormField label="TikTok (optionnel)" helperText="@handle">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-paper-mute font-mono">
                @
              </span>
              <Input
                name="tiktokHandle"
                defaultValue={pro.tiktokHandle ?? ""}
                placeholder="username"
                className="h-12 bg-smoke border-none pl-8"
              />
            </div>
          </FormField>
          <FormField
            label="Tarifs (optionnel)"
            helperText="Ex: à partir de 50€"
          >
            <Input
              name="priceRange"
              defaultValue={pro.priceRange ?? ""}
              placeholder="à partir de 50€"
              className="h-12 bg-smoke border-none"
            />
          </FormField>
          <FormField
            label="Spécialités (optionnel)"
            helperText="Sépare par des virgules"
          >
            <Input
              name="specialities"
              defaultValue={pro.specialities.join(", ")}
              placeholder="tresses, lace front, makeup glam"
              className="h-12 bg-smoke border-none"
            />
          </FormField>
        </div>

        <FormField
          label="Présentation (optionnel)"
          helperText="Quelques lignes pour parler de ton métier. Pas de numéro, email ni nom de réseau (WhatsApp, Instagram, TikTok…) — ces contacts sont gérés par les champs dédiés."
        >
          <textarea
            name="bio"
            rows={4}
            defaultValue={pro.bio ?? ""}
            className="w-full rounded-md bg-smoke px-4 py-3 text-paper text-sm placeholder:text-paper-dim focus:outline-none"
            placeholder="Je suis maquilleuse depuis 8 ans, spécialisée en peau noire..."
          />
        </FormField>

        <div className="grid gap-4 rounded-2xl border border-white/10 bg-ink/40 p-5">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-xl bg-blood/15 text-blood">
              <Camera className="size-4" />
            </span>
            <div>
              <h3 className="font-display text-base uppercase text-paper">
                Photo de profil & galerie
              </h3>
              <p className="text-paper-mute text-xs">
                La 1ère photo est ta couverture. Survole les autres pour la
                changer ou les retirer.
              </p>
            </div>
          </div>
          <PhotoUploader
            name="photos"
            defaultUrls={pro.photos}
            multiple
            maxFiles={12}
            enableCoverActions
            helpText="JPG/PNG/WebP/GIF · 5 Mo max · jusqu'à 12 photos."
          />
        </div>

        <div className="flex flex-col items-stretch gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-paper-mute text-xs">
            <Sparkles className="mr-1 inline size-3 text-blood" />
            Pour changer ta catégorie, contacte l&apos;équipe.
          </p>
          <div className="flex gap-3">
            <Button asChild type="button" variant="outline">
              <Link href={`/pro/${pro.id}`}>Voir ma fiche publique</Link>
            </Button>
            <Button type="submit">
              <AtSign aria-hidden /> Enregistrer
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
