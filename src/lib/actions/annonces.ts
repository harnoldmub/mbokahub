"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/db/prisma";

async function getAuthenticatedUser() {
  const { userId } = await auth();
  if (!userId) throw new Error("Non autorisé");

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) throw new Error("Utilisateur non trouvé");
  return user;
}

export async function updateTrajetAction(form: FormData) {
  const user = await getAuthenticatedUser();

  const trajetId = String(form.get("id") || "").trim();
  if (!trajetId) throw new Error("Trajet introuvable");

  const trajet = await prisma.trajet.findUnique({ where: { id: trajetId } });
  if (!trajet || trajet.userId !== user.id) {
    throw new Error("Action non autorisée");
  }

  const villeDepart = String(form.get("villeDepart") || "").trim();
  const paysDepart = String(form.get("paysDepart") || "Belgique").trim();
  const villeArrivee = String(form.get("villeArrivee") || "Paris").trim();
  const dateStr = String(form.get("date") || "").trim();
  const heureDepart = String(form.get("heureDepart") || "").trim();
  const placesTotal = Number(form.get("placesTotal") || 0);
  const placesDispoRaw = Number(form.get("placesDispo") || placesTotal);
  const placesDispo = Number.isFinite(placesDispoRaw)
    ? Math.min(Math.max(placesDispoRaw, 0), placesTotal)
    : placesTotal;
  const prix = Number(form.get("prix") || 0);
  const vehiculeModel = String(form.get("vehiculeModel") || "").trim() || null;
  const vehiculeColor = String(form.get("vehiculeColor") || "").trim() || null;
  const whatsapp = String(form.get("whatsapp") || "").trim();
  const note = String(form.get("note") || "").trim() || null;

  const dateObj = new Date(dateStr);
  const dateValid = dateStr && !Number.isNaN(dateObj.getTime());

  if (
    !villeDepart ||
    !dateValid ||
    !heureDepart ||
    !whatsapp ||
    !Number.isFinite(placesTotal) ||
    placesTotal <= 0 ||
    placesTotal > 8 ||
    !Number.isFinite(prix) ||
    prix < 0
  ) {
    redirect(`/dashboard/annonces/${trajetId}/modifier?error=missing`);
  }

  // Toute modification d'un trajet déjà publié repasse en file de
  // re-validation pour éviter qu'un fan modifie après approbation.
  await prisma.trajet.update({
    where: { id: trajetId },
    data: {
      villeDepart,
      paysDepart,
      villeArrivee,
      date: new Date(dateStr),
      heureDepart,
      placesTotal,
      placesDispo,
      prix,
      vehiculeModel,
      vehiculeColor,
      whatsapp,
      note,
      isApproved: false,
      approvedAt: null,
    },
  });

  revalidatePath("/trajets");
  revalidatePath(`/trajets/${trajetId}`);
  revalidatePath("/dashboard/annonces");
  revalidatePath("/admin/trajets");
  redirect("/dashboard/annonces?updated=trajet&pending=1");
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

  await prisma.proProfile.delete({
    where: { userId: user.id },
  });

  revalidatePath("/dashboard/annonces");
  redirect("/dashboard/annonces");
}
