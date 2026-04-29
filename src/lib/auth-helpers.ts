import { auth, currentUser } from "@clerk/nextjs/server";

import { prisma } from "@/lib/db/prisma";
import { syncClerkUser } from "@/lib/user-sync";

export async function getOptionalDbUser() {
  const { userId } = await auth();
  if (!userId) return null;

  const existing = await prisma.user.findUnique({
    where: { clerkId: userId },
  });
  if (existing) return existing;

  const clerkUser = await currentUser();
  const email = clerkUser?.primaryEmailAddress?.emailAddress;
  if (!email) return null;

  const name =
    [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ").trim() ||
    null;

  return syncClerkUser({ clerkId: userId, email, name });
}

export async function isCurrentUserVip(): Promise<boolean> {
  const user = await getOptionalDbUser();
  if (!user) return false;
  if (!user.isVipActive) return false;
  if (user.vipUntil && user.vipUntil < new Date()) return false;
  return true;
}

export async function isCurrentUserAdmin(): Promise<boolean> {
  const user = await getOptionalDbUser();
  return user?.role === "ADMIN";
}

export async function canSeePrivateProInfo(): Promise<boolean> {
  // Modèle Mboka Hub : 100% gratuit pour les fans.
  // Les noms et contacts des prestataires sont visibles par tout le monde.
  return true;
}

/**
 * Anciens VIP (qui ont payé 6,99€ / 9,99€ avant la bascule) : badge à vie.
 * Détection via le flag `isVipActive` historique. Plus aucun paiement possible.
 */
export async function isFoundingFamilyMember(): Promise<boolean> {
  const user = await getOptionalDbUser();
  if (!user) return false;
  return user.isVipActive === true;
}
