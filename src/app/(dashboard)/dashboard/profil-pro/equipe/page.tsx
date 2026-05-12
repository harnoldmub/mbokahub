import Image from "next/image";
import Link from "next/link";

import { PhotoUploader } from "@/components/admin/photo-uploader";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import {
  createTeamMemberAction,
  deleteTeamMemberAction,
  updateTeamMemberAction,
} from "@/lib/actions/booking";
import { prisma } from "@/lib/db/prisma";
import { resolveProTarget } from "@/lib/pro-context";
import { ProfilProTabs } from "../_nav";

export default async function EquipePage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string; as?: string }>;
}) {
  const sp = await searchParams;
  const ctx = await resolveProTarget(sp.as);
  const pro = await prisma.proProfile.findUnique({
    where: { userId: ctx.proUserId },
    include: { teamMembers: { orderBy: { position: "asc" } } },
  });
  if (!pro) {
    return (
      <div className="grid gap-6">
        <p className="text-paper-dim">Crée d&apos;abord ta fiche pro.</p>
        <Button asChild>
          <Link href="/pro/inscrire">Inscrire mon service</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-6">

      <div>
        <p className="font-mono text-blood text-xs uppercase tracking-[0.3em]">
          Profil pro
        </p>
        <h1 className="mt-3 font-heading text-4xl text-paper">Équipe</h1>
        <p className="mt-3 max-w-2xl text-paper-dim leading-7">
          Tu travailles seul·e ? Laisse un seul membre (toi). Si tu as une
          équipe, ajoute chaque personne ici, le client pourra choisir avec qui
          réserver.
        </p>
      </div>

      <ProfilProTabs
        active="/dashboard/profil-pro/equipe"
        actingAs={ctx.actingAsProId}
      />

      {sp.saved ? (
        <div className="rounded-2xl border border-success/30 bg-success/10 p-4 text-success text-sm">
          Modifications enregistrées.
        </div>
      ) : null}
      {sp.error ? (
        <div className="rounded-2xl border border-warning/40 bg-warning/10 p-4 text-paper text-sm">
          Vérifie les champs obligatoires.
        </div>
      ) : null}

      <form
        action={createTeamMemberAction}
        className="grid gap-4 rounded-3xl border border-white/10 bg-coal p-6"
      >
        {ctx.actingAsProId ? (
          <input type="hidden" name="_actingAs" value={ctx.actingAsProId} />
        ) : null}
        <h2 className="font-display text-xl uppercase text-paper">
          Ajouter un membre
        </h2>
        <FormField label="Nom du membre">
          <Input
            name="displayName"
            required
            placeholder="Sarah, Tony…"
            className="h-11 bg-smoke border-none"
          />
        </FormField>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-paper-mute mb-2">
            Photo (optionnel)
          </p>
          <PhotoUploader
            name="photoUrl"
            multiple={false}
            maxFiles={1}
            helpText="JPG/PNG · 5 Mo max."
          />
        </div>
        <div>
          <Button type="submit">Ajouter le membre</Button>
        </div>
      </form>

      <div className="grid gap-4">
        {pro.teamMembers.length === 0 ? (
          <p className="rounded-2xl border border-white/10 bg-coal p-6 text-center text-paper-dim">
            Aucun membre pour l&apos;instant. Ajoute-toi en premier membre
            ci-dessus.
          </p>
        ) : (
          pro.teamMembers.map((m) => (
            <form
              action={updateTeamMemberAction}
              key={m.id}
              className="grid gap-4 rounded-3xl border border-white/10 bg-coal p-5"
            >
              {ctx.actingAsProId ? (
                <input
                  type="hidden"
                  name="_actingAs"
                  value={ctx.actingAsProId}
                />
              ) : null}
              <input type="hidden" name="id" value={m.id} />
              <div className="flex items-center gap-4">
                <div className="relative size-14 overflow-hidden rounded-full bg-smoke">
                  {m.photoUrl ? (
                    <Image
                      src={m.photoUrl}
                      alt={m.displayName}
                      fill
                      className="object-cover"
                      sizes="56px"
                      unoptimized
                    />
                  ) : (
                    <div className="grid h-full place-items-center text-paper-dim">
                      {m.displayName.slice(0, 1)}
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-display text-lg text-paper">
                    {m.displayName}
                  </p>
                  <p className="text-paper-mute text-xs">
                    {m.isActive ? "Actif" : "Désactivé"}
                  </p>
                </div>
              </div>
              <FormField label="Nom">
                <Input
                  name="displayName"
                  required
                  defaultValue={m.displayName}
                  className="h-11 bg-smoke border-none"
                />
              </FormField>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-paper-mute mb-2">
                  Photo
                </p>
                <PhotoUploader
                  name="photoUrl"
                  multiple={false}
                  maxFiles={1}
                  defaultUrls={m.photoUrl ? [m.photoUrl] : []}
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-paper-dim">
                <input
                  type="checkbox"
                  name="isActive"
                  defaultChecked={m.isActive}
                  className="size-4"
                />
                Membre actif (visible dans la prise de RDV)
              </label>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <Button type="submit">Enregistrer</Button>
                <Button
                  formAction={deleteTeamMemberAction}
                  variant="outline"
                  type="submit"
                >
                  Supprimer
                </Button>
              </div>
            </form>
          ))
        )}
      </div>
    </div>
  );
}
