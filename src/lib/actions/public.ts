"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import type { ProCategory } from "@prisma/client";

const VALID_PRO_CATEGORIES: ProCategory[] = [
  "MAQUILLEUSE",
  "COIFFEUR",
  "BARBIER",
  "PHOTOGRAPHE",
  "VENDEUR_MERCH",
  "ORGANISATEUR_AFTER",
];

async function ensureUser(redirectAfterSignIn: string) {
  const { userId } = await auth();
  if (!userId) {
    redirect(`/sign-in?redirect_url=${encodeURIComponent(redirectAfterSignIn)}`);
  }

  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress;
  if (!email) throw new Error("Email manquant");

  const existing = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (existing) return existing;

  return prisma.user.create({
    data: {
      clerkId: userId,
      email,
      name: user.fullName ?? null,
    },
  });
}

export async function createTrajetAction(form: FormData) {
  const user = await ensureUser("/trajets/publier");

  const villeDepart = String(form.get("villeDepart") || "").trim();
  const paysDepart = String(form.get("paysDepart") || "Belgique").trim();
  const villeArrivee = String(form.get("villeArrivee") || "Paris").trim();
  const dateStr = String(form.get("date") || "").trim();
  const heureDepart = String(form.get("heureDepart") || "").trim();
  const placesTotal = Number(form.get("placesTotal") || 0);
  const placesDispoRaw = Number(form.get("placesDispo") || placesTotal);
  const placesDispo = Number.isFinite(placesDispoRaw) ? placesDispoRaw : placesTotal;
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
    redirect("/trajets/publier?error=missing");
  }

  await prisma.trajet.create({
    data: {
      userId: user.id,
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
      isActive: true,
    },
  });

  revalidatePath("/trajets");
  revalidatePath("/dashboard/annonces");
  redirect("/dashboard/annonces?published=trajet");
}

export async function createProProfileAction(form: FormData) {
  const user = await ensureUser("/pro/inscrire");

  const categoryRaw = String(form.get("category") || "");
  if (!VALID_PRO_CATEGORIES.includes(categoryRaw as ProCategory)) {
    redirect("/pro/inscrire?error=missing");
  }
  const category = categoryRaw as ProCategory;
  const displayName = String(form.get("displayName") || "").trim();
  const city = String(form.get("city") || "").trim();
  const country = String(form.get("country") || "Belgique").trim();
  const bio = String(form.get("bio") || "").trim() || null;
  const whatsapp = String(form.get("whatsapp") || "").trim();
  const instagramHandle = String(form.get("instagramHandle") || "").trim() || null;
  const tiktokHandle = String(form.get("tiktokHandle") || "").trim() || null;
  const priceRange = String(form.get("priceRange") || "").trim() || null;
  const specialitiesRaw = String(form.get("specialities") || "").trim();
  const specialities = specialitiesRaw
    ? specialitiesRaw.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  if (!category || !displayName || !city || !whatsapp) {
    redirect("/pro/inscrire?error=missing");
  }

  const existing = await prisma.proProfile.findUnique({ where: { userId: user.id } });
  if (existing) {
    redirect("/dashboard/annonces?error=profile-exists");
  }

  const baseSlug = `${displayName}-${city}`
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
  const slug = `${baseSlug}-${Math.random().toString(36).slice(2, 6)}`;

  await prisma.proProfile.create({
    data: {
      userId: user.id,
      category,
      displayName,
      slug,
      city,
      country,
      bio,
      whatsapp,
      instagramHandle,
      tiktokHandle,
      priceRange,
      specialities,
      photos: [],
    },
  });

  await prisma.user.update({
    where: { id: user.id },
    data: { role: "PRO" },
  });

  revalidatePath("/pro");
  revalidatePath("/dashboard/annonces");
  redirect("/dashboard/annonces?published=pro");
}
