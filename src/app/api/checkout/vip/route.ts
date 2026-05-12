import { NextResponse } from "next/server";

/**
 * Le pass VIP a été supprimé : Nevent est désormais 100% gratuit pour les
 * fans. Cette route reste en place et renvoie 410 Gone pour clore proprement
 * tout client (front, marque-page) qui tenterait encore d'acheter.
 *
 * Les anciens VIP qui ont payé conservent leur badge ⭐ Famille Fondatrice à
 * vie (cf. `isFoundingFamilyMember()`).
 */
export async function POST() {
  return NextResponse.json(
    {
      error:
        "Le pass VIP n'est plus en vente. Nevent est désormais gratuit pour tous les fans.",
      redirect: "/vip",
    },
    { status: 410 },
  );
}
