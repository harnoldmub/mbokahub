import { NextResponse } from "next/server";

import { isAdminEmail } from "@/lib/admin";
import {
  getOptionalDbUser,
  isFoundingFamilyMember,
} from "@/lib/auth-helpers";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const noStore = { "Cache-Control": "no-store, max-age=0" };

/**
 * Renvoie le statut "Famille Fondatrice" du membre courant.
 *
 * - `isFounder` : badge ⭐ à vie pour les anciens VIP (dérivé de
 *   `user.isVipActive`, pas d'expiration).
 * - `isVip` : alias historique = `isFounder`. Conservé pour ne pas casser
 *   un éventuel ancien client qui lirait encore ce champ.
 */
export async function GET() {
  const user = await getOptionalDbUser();
  if (!user) {
    return NextResponse.json(
      { isFounder: false, isVip: false, isAdmin: false },
      { status: 401, headers: noStore },
    );
  }

  const isFounder = await isFoundingFamilyMember();
  const isAdmin = user.role === "ADMIN" || (await isAdminEmail(user.email));

  return NextResponse.json(
    {
      isFounder,
      isVip: isFounder,
      isAdmin,
    },
    { headers: noStore },
  );
}
