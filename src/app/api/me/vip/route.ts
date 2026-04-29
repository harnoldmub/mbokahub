import { NextResponse } from "next/server";

import { isAdminEmail } from "@/lib/admin";
import {
  getOptionalDbUser,
  isCurrentUserVip,
  isFoundingFamilyMember,
} from "@/lib/auth-helpers";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const noStore = { "Cache-Control": "no-store, max-age=0" };

/**
 * Renvoie le statut "Famille Fondatrice" du membre courant.
 *
 * - `isFounder` : badge ⭐ à vie pour les anciens VIP qui ont payé avant la
 *   bascule (dérivé de `user.isVipActive`, pas de check d'expiration).
 * - `isVip` : conservé pour compat. avec les vieux clients (composants qui
 *   liraient encore ce champ). Tend à disparaître.
 */
export async function GET() {
  const user = await getOptionalDbUser();
  if (!user) {
    return NextResponse.json(
      { isFounder: false, isVip: false, isAdmin: false },
      { status: 401, headers: noStore },
    );
  }

  const [isFounder, isVip] = await Promise.all([
    isFoundingFamilyMember(),
    isCurrentUserVip(),
  ]);
  const isAdmin = user.role === "ADMIN" || (await isAdminEmail(user.email));

  return NextResponse.json(
    {
      isFounder,
      // alias historique → toujours égal à isFounder côté front pour le
      // badge ; conservé pour ne pas casser un éventuel ancien client.
      isVip: isFounder || isVip,
      isAdmin,
    },
    { headers: noStore },
  );
}
