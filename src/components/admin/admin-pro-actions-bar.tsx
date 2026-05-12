import { ConfirmActionForm } from "@/components/admin/confirm-action-form";
import { EditProForm } from "@/components/admin/edit-pro-form";
import {
  certifyProProfile,
  deleteProProfile,
  verifyProProfile,
} from "@/lib/actions/admin";

export type AdminProActionsPro = {
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
  isVerified: boolean;
  isPremium: boolean;
};

type AdminProActionsBarProps = {
  pro: AdminProActionsPro;
  className?: string;
};

export function AdminProActionsBar({ pro, className }: AdminProActionsBarProps) {
  return (
    <div className={className ?? "flex flex-wrap gap-2"}>
      <EditProForm
        pro={{
          id: pro.id,
          displayName: pro.displayName,
          category: pro.category,
          city: pro.city,
          country: pro.country,
          whatsapp: pro.whatsapp,
          bio: pro.bio,
          priceRange: pro.priceRange,
          instagramHandle: pro.instagramHandle,
          tiktokHandle: pro.tiktokHandle,
          specialities: pro.specialities,
          photos: pro.photos,
        }}
      />
      <ConfirmActionForm
        action={verifyProProfile.bind(null, pro.id, !pro.isVerified)}
        triggerLabel={pro.isVerified ? "Dévalider" : "Valider"}
<<<<<<< HEAD
        triggerClassName="rounded-md bg-green-500/15 px-2 py-1 text-green-700 text-xs hover:bg-green-500/25"
=======
        triggerClassName="inline-flex items-center rounded-md bg-emerald-600 px-3 py-1.5 font-medium text-white text-xs shadow-sm transition hover:bg-emerald-700"
>>>>>>> 8c9a45fe819424003bf860e709a24cf9836ec106
        title={
          pro.isVerified
            ? "Dévalider ce profil ?"
            : "Valider ce profil ?"
        }
        description={
          pro.isVerified ? (
            <>
              <span className="font-semibold text-foreground">
                {pro.displayName}
              </span>{" "}
              disparaîtra de l'annuaire public et ne sera plus visible par les
              utilisateurs. Tu pourras le re-valider à tout moment.
            </>
          ) : (
            <>
              <span className="font-semibold text-foreground">
                {pro.displayName}
              </span>{" "}
              sera publié sur l'annuaire et visible par tous les visiteurs.
              Vérifie bien que les coordonnées et la bio sont propres avant de
              valider.
            </>
          )
        }
        confirmLabel={pro.isVerified ? "Dévalider" : "Publier le profil"}
        variant={pro.isVerified ? "warning" : "default"}
      />
      <ConfirmActionForm
        action={certifyProProfile.bind(null, pro.id, !pro.isPremium)}
        triggerLabel={pro.isPremium ? "Retirer premium" : "Premium"}
<<<<<<< HEAD
        triggerClassName="rounded-md bg-amber-500/15 px-2 py-1 text-amber-700 text-xs hover:bg-amber-500/25"
=======
        triggerClassName="inline-flex items-center rounded-md bg-amber-500 px-3 py-1.5 font-medium text-black text-xs shadow-sm transition hover:bg-amber-600"
>>>>>>> 8c9a45fe819424003bf860e709a24cf9836ec106
        title={
          pro.isPremium
            ? "Retirer le statut Premium ?"
            : "Passer ce profil en Premium ?"
        }
        description={
          pro.isPremium ? (
            <>
              <span className="font-semibold text-foreground">
                {pro.displayName}
              </span>{" "}
              perdra le badge ★ Certifié et son boost dans l'ordre d'affichage.
            </>
          ) : (
            <>
              <span className="font-semibold text-foreground">
                {pro.displayName}
              </span>{" "}
              recevra le badge ★ Certifié et sera mis en avant jusqu'au 31 déc.
              2026.
            </>
          )
        }
        confirmLabel={pro.isPremium ? "Retirer Premium" : "Activer Premium"}
        variant="warning"
      />
      <ConfirmActionForm
        action={deleteProProfile.bind(null, pro.id)}
        triggerLabel="Supprimer"
<<<<<<< HEAD
        triggerClassName="rounded-md bg-red-500/15 px-2 py-1 text-red-700 text-xs hover:bg-red-500/25"
=======
        triggerClassName="inline-flex items-center rounded-md bg-red-600 px-3 py-1.5 font-medium text-white text-xs shadow-sm transition hover:bg-red-700"
>>>>>>> 8c9a45fe819424003bf860e709a24cf9836ec106
        title="Supprimer ce profil pro ?"
        description={
          <>
            Tu vas supprimer le profil de{" "}
            <span className="font-semibold text-foreground">
              {pro.displayName}
            </span>{" "}
            ({pro.category}). Le compte utilisateur reste, mais le profil
            public et toutes ses photos seront supprimés.
          </>
        }
        confirmLabel="Supprimer le profil"
      />
    </div>
  );
}
