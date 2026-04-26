"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/db/prisma";
import { deleteMediaByUrl } from "@/lib/storage";

async function getAuthenticatedUser() {
  const { userId } = await auth();
  if (!userId) throw new Error("Non autorisé");

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) throw new Error("Utilisateur non trouvé");
  return user;
}

export async function deleteTrajetAction(trajetId: string) {
  const user = await getAuthenticatedUser();

  const trajet = await prisma.trajet.findUnique({
    where: { id: trajetId },
  });

  if (!trajet || trajet.userId !== user.id) {
    throw new Error("Action non autorisée");
  }

  await prisma.trajet.delete({
    where: { id: trajetId },
  });

  revalidatePath("/dashboard/annonces");
}

export async function toggleTrajetStatusAction(trajetId: string) {
  const user = await getAuthenticatedUser();

  const trajet = await prisma.trajet.findUnique({
    where: { id: trajetId },
  });

  if (!trajet || trajet.userId !== user.id) {
    throw new Error("Action non autorisée");
  }

  await prisma.trajet.update({
    data: { isActive: !trajet.isActive },
    where: { id: trajetId },
  });

  revalidatePath("/dashboard/annonces");
}

export async function deleteProProfileAction() {
  const user = await getAuthenticatedUser();

  const profile = await prisma.proProfile.findUnique({
    where: { userId: user.id },
    select: { photos: true },
  });

  if (profile) {
    await Promise.all(profile.photos.map((photo) => deleteMediaByUrl(photo)));
  }

  await prisma.proProfile.delete({
    where: { userId: user.id },
  });

  revalidatePath("/dashboard/annonces");
  redirect("/dashboard/annonces");
}
