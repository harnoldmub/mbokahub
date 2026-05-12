import { Crown } from "lucide-react";

import { isFoundingFamilyMember } from "@/lib/auth-helpers";

type Props = {
  message?: string;
};

/**
 * Bannière "⭐ Famille Fondatrice" — visible pour les anciens VIP qui ont payé
 * avant la bascule vers le modèle 100% gratuit (badge à vie, pas de
 * remboursement).
 */
export async function VipMemberBanner({ message }: Props) {
  const isFounding = await isFoundingFamilyMember();
  if (!isFounding) return null;

  return (
    <div className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-400/40 bg-gradient-to-r from-amber-500/15 via-amber-400/10 to-amber-500/15 px-5 py-3">
      <div className="flex items-center gap-3">
        <span className="flex size-9 items-center justify-center rounded-full bg-amber-400/20 text-amber-300">
          <Crown aria-hidden className="size-5" />
        </span>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-amber-200">
            ⭐ Famille Fondatrice
          </p>
          <p className="font-body text-paper text-sm">
            {message ??
              "Merci d'avoir cru en Nevent avant tout le monde. Badge à vie."}
          </p>
        </div>
      </div>
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-amber-200/80">
        Membre fondateur
      </p>
    </div>
  );
}
