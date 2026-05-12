import Link from "next/link";

import { AdminProActionsBar } from "@/components/admin/admin-pro-actions-bar";
import { PhotoUploader } from "@/components/admin/photo-uploader";
import { PhoneInput } from "@/components/ui/phone-input";
import { prisma } from "@/lib/db/prisma";
import { createProProfileAdmin } from "@/lib/actions/admin";

export const dynamic = "force-dynamic";

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

export default async function AdminProsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const where =
    status === "pending"
      ? { isVerified: false }
      : status === "verified"
        ? { isVerified: true }
        : {};

  const pros = await prisma.proProfile.findMany({
    where,
    orderBy: [{ isVerified: "asc" }, { createdAt: "desc" }],
    include: { user: { select: { email: true, name: true } } },
    take: 200,
  });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-heading text-2xl text-foreground">
          Profils pros & beauté ({pros.length})
        </h2>
        <p className="mt-1 text-muted-foreground text-sm">
          Créer, valider, certifier ou supprimer les profils prestataires (toutes catégories : maquilleuses, coiffeurs, photographes, DJ, traiteurs…).
        </p>
        <div className="mt-4 flex gap-2">
          <a href="/admin/pros" className="rounded-full border border-white/20 px-3 py-1 text-foreground text-xs hover:bg-white/10">Tous</a>
          <a href="/admin/pros?status=pending" className="rounded-full border border-yellow-500/40 bg-yellow-500/10 px-3 py-1 text-yellow-700 text-xs hover:bg-yellow-500/20">En attente</a>
          <a href="/admin/pros?status=verified" className="rounded-full border border-green-500/40 bg-green-500/10 px-3 py-1 text-green-700 text-xs hover:bg-green-500/20">Validés</a>
        </div>
      </div>

      <details className="rounded-2xl border border-red-500/30 bg-red-500/5 p-5 open:bg-red-500/10">
        <summary className="cursor-pointer font-heading text-foreground text-lg">
          ➕ Créer un prestataire (Pro / Beauté)
        </summary>
        <form
          action={createProProfileAdmin}
          className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2"
        >
          <input
            name="proEmail"
            type="email"
            required
            placeholder="Email du pro (existant ou nouveau)"
            className="rounded-md border border-white/10 bg-smoke px-3 py-2 text-foreground text-sm placeholder:text-muted-foreground"
          />
          <input
            name="displayName"
            required
            placeholder="Nom affiché (ex: Studio Mboka)"
            className="rounded-md border border-white/10 bg-smoke px-3 py-2 text-foreground text-sm placeholder:text-muted-foreground"
          />
          <select
            name="category"
            required
            defaultValue=""
            className="rounded-md border border-white/10 bg-smoke px-3 py-2 text-foreground text-sm"
          >
            <option value="" disabled>— Catégorie —</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <input
            name="city"
            required
            placeholder="Ville (ex: Paris)"
            className="rounded-md border border-white/10 bg-smoke px-3 py-2 text-foreground text-sm placeholder:text-muted-foreground"
          />
          <input
            name="country"
            defaultValue="France"
            placeholder="Pays"
            className="rounded-md border border-white/10 bg-smoke px-3 py-2 text-foreground text-sm placeholder:text-muted-foreground"
          />
          <PhoneInput name="whatsapp" required />
          <input
            name="instagramHandle"
            placeholder="Instagram (@handle)"
            className="rounded-md border border-white/10 bg-smoke px-3 py-2 text-foreground text-sm placeholder:text-muted-foreground"
          />
          <input
            name="tiktokHandle"
            placeholder="TikTok (@handle)"
            className="rounded-md border border-white/10 bg-smoke px-3 py-2 text-foreground text-sm placeholder:text-muted-foreground"
          />
          <input
            name="priceRange"
            placeholder="Tarif (ex: 80-150€)"
            className="rounded-md border border-white/10 bg-smoke px-3 py-2 text-foreground text-sm placeholder:text-muted-foreground"
          />
          <input
            name="specialities"
            placeholder="Spécialités (séparées par virgule)"
            className="rounded-md border border-white/10 bg-smoke px-3 py-2 text-foreground text-sm placeholder:text-muted-foreground"
          />
          <textarea
            name="bio"
            rows={3}
            placeholder="Bio / présentation"
            className="sm:col-span-2 rounded-md border border-white/10 bg-smoke px-3 py-2 text-foreground text-sm placeholder:text-muted-foreground"
          />
          <div className="sm:col-span-2">
            <PhotoUploader
              name="photos"
              label="Photos du prestataire"
              multiple
              maxFiles={12}
              helpText="La première photo devient la couverture sur l'annuaire."
            />
          </div>
          <label className="flex items-center gap-2 text-foreground text-sm">
            <input type="checkbox" name="isVerified" defaultChecked />
            Marquer comme validé
          </label>
          <label className="flex items-center gap-2 text-foreground text-sm">
            <input type="checkbox" name="isPremium" />
            Marquer comme Premium
          </label>
          <button
            type="submit"
            className="sm:col-span-2 rounded-md bg-red-500 px-4 py-2 font-semibold text-white text-sm transition hover:bg-red-600"
          >
            Créer ce prestataire
          </button>
        </form>
      </details>

      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="min-w-full divide-y divide-white/10 text-sm">
          <thead className="bg-white/5 text-left text-muted-foreground text-xs uppercase">
            <tr>
              <th className="px-4 py-3">Nom affiché</th>
              <th className="px-4 py-3">Catégorie</th>
              <th className="px-4 py-3">Ville</th>
              <th className="px-4 py-3">WhatsApp</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Premium</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {pros.map((p) => (
              <tr key={p.id} className="hover:bg-white/5">
                <td className="px-4 py-3 text-foreground">
                  <Link
                    href={`/pro/${p.id}`}
                    className="hover:text-blood hover:underline"
                  >
                    {p.displayName}
                  </Link>
                </td>
                <td className="px-4 py-3 text-muted-foreground text-xs">{p.category}</td>
                <td className="px-4 py-3 text-muted-foreground">{p.city}, {p.country}</td>
                <td className="px-4 py-3 font-mono text-muted-foreground text-xs">{p.whatsapp}</td>
                <td className="px-4 py-3 font-mono text-muted-foreground text-xs">{p.user.email}</td>
                <td className="px-4 py-3 text-muted-foreground text-xs">
                  {p.isPremium ? "✓" : "—"}
                </td>
                <td className="px-4 py-3">
                  {p.isVerified ? (
                    <span className="rounded-full bg-green-500/20 px-2 py-1 text-green-700 text-xs">Validé</span>
                  ) : (
                    <span className="rounded-full bg-yellow-500/20 px-2 py-1 text-yellow-700 text-xs">En attente</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex flex-wrap justify-end gap-2">
                    <Link
                      href={`/pro/${p.id}?from=admin`}
                      className="rounded-md bg-blue-500/20 px-2 py-1 text-blue-700 text-xs hover:bg-blue-500/30"
                    >
                      Voir la fiche
                    </Link>
                    <AdminProActionsBar
                      pro={{
                        id: p.id,
                        displayName: p.displayName,
                        category: p.category,
                        city: p.city,
                        country: p.country,
                        whatsapp: p.whatsapp,
                        bio: p.bio,
                        priceRange: p.priceRange,
                        instagramHandle: p.instagramHandle,
                        tiktokHandle: p.tiktokHandle,
                        specialities: p.specialities,
                        photos: p.photos,
                        isVerified: p.isVerified,
                        isPremium: p.isPremium,
                      }}
                    />
                  </div>
                </td>
              </tr>
            ))}
            {pros.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">
                  Aucun profil pro pour le moment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
