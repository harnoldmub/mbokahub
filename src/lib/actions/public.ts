"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import type { ProBookingStatus, ProCategory } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { after } from "next/server";
import { findCity, suggestPrice } from "@/lib/data/cities";
import { prisma } from "@/lib/db/prisma";
import { sendTrajetPriceSuggestionEmail } from "@/lib/email";
import { PRO_CATEGORY_IDS } from "@/lib/pro-categories";
import {
  detectContactInBio,
  normalizePriceRangeInput,
} from "@/lib/pro-display";

const VALID_PRO_CATEGORIES: ProCategory[] = PRO_CATEGORY_IDS;

async function ensureUser(redirectAfterSignIn: string) {
  const { userId } = await auth();
  if (!userId) {
    redirect(
      `/sign-in?redirect_url=${encodeURIComponent(redirectAfterSignIn)}`,
    );
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
  const placesDispo = Number.isFinite(placesDispoRaw)
    ? placesDispoRaw
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
    redirect("/trajets/publier?error=missing");
  }

  const created = await prisma.trajet.create({
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
      isApproved: false,
    },
  });

  try {
    const fromCity = findCity(villeDepart);
    const toCity = findCity(villeArrivee);
    if (fromCity && toCity && user.email && prix > 0) {
      const suggestion = suggestPrice(fromCity, toCity, placesTotal);
      const overpricedThreshold = suggestion.perPlaceMax * 1.2;
      if (prix > overpricedThreshold) {
        const userEmail = user.email;
        const userName = user.name;
        const trajetId = created.id;
        after(async () => {
          try {
            await sendTrajetPriceSuggestionEmail({
              to: userEmail,
              displayName: userName,
              villeDepart,
              villeArrivee,
              prixPublie: prix,
              perPlaceFair: suggestion.perPlaceFair,
              perPlaceMax: suggestion.perPlaceMax,
              trajetId,
            });
          } catch (e) {
            console.error("[trajet] price-suggestion email failed:", e);
          }
        });
      }
    }
  } catch (e) {
    console.error("[trajet] price-suggestion compute failed:", e);
  }

  revalidatePath("/trajets");
  revalidatePath("/dashboard/annonces");
  revalidatePath("/admin/trajets");
  redirect("/dashboard/annonces?published=trajet&pending=1");
}

export async function createAfterAction(form: FormData) {
  const user = await ensureUser("/afters/organiser");

  const name = String(form.get("name") || "").trim();
  const description = String(form.get("description") || "").trim();
  const dateStr = String(form.get("date") || "").trim();
  const heureDepart = String(form.get("heureDepart") || "").trim();
  const venue = String(form.get("venue") || "").trim();
  const address = String(form.get("address") || "").trim() || venue;
  const city = String(form.get("city") || "Paris").trim();
  const priceFromRaw = Number(form.get("priceFrom") || 0);
  const priceFrom = Number.isFinite(priceFromRaw) ? priceFromRaw : 0;
  const ticketUrl = String(form.get("ticketUrl") || "").trim();
  const flyerUrlRaw = String(form.get("flyerUrl") || "").trim();
  const flyerUrl =
    flyerUrlRaw &&
    (/^https?:\/\//i.test(flyerUrlRaw) || flyerUrlRaw.startsWith("/api/files/"))
      ? flyerUrlRaw
      : null;
  const capacityStr = String(form.get("capacity") || "").trim();
  const capacityRaw = capacityStr ? parseInt(capacityStr, 10) : null;
  const capacity =
    capacityRaw && Number.isFinite(capacityRaw) && capacityRaw > 0
      ? capacityRaw
      : null;

  if (
    !name ||
    !description ||
    !dateStr ||
    !venue ||
    !city ||
    !ticketUrl ||
    priceFrom < 0
  ) {
    redirect("/afters/organiser?error=missing");
  }

  if (!/^https?:\/\//i.test(ticketUrl)) {
    redirect("/afters/organiser?error=ticketurl");
  }

  // Combine date + optional time into a single Date
  const isoCandidate = heureDepart
    ? `${dateStr}T${heureDepart}:00`
    : `${dateStr}T22:00:00`;
  const dateObj = new Date(isoCandidate);
  if (Number.isNaN(dateObj.getTime())) {
    redirect("/afters/organiser?error=date");
  }

  // Generate unique slug
  const baseSlug = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
  let slug = baseSlug || `after-${Date.now()}`;
  let i = 2;
  while (await prisma.after.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${i++}`;
  }

  await prisma.after.create({
    data: {
      slug,
      name,
      description,
      date: dateObj,
      venue,
      address,
      city,
      capacity,
      priceFrom,
      ticketUrl,
      flyerUrl,
      organizerId: user.id,
      isActive: true,
      isApproved: false,
    },
  });

  revalidatePath("/afters");
  revalidatePath("/admin/afters");
  redirect("/afters/organiser?published=after&pending=1");
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
  const instagramHandle =
    String(form.get("instagramHandle") || "").trim() || null;
  const tiktokHandle = String(form.get("tiktokHandle") || "").trim() || null;
  const priceRange = normalizePriceRangeInput(
    String(form.get("priceRange") || ""),
  );
  const specialitiesRaw = String(form.get("specialities") || "").trim();
  const specialities = specialitiesRaw
    ? specialitiesRaw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  if (!category || !displayName || !city || !whatsapp) {
    redirect("/pro/inscrire?error=missing");
  }

  if (detectContactInBio(bio)) {
    redirect("/pro/inscrire?error=contact-in-bio");
  }

  const existing = await prisma.proProfile.findUnique({
    where: { userId: user.id },
  });
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

export async function updateProProfileAction(form: FormData) {
  const user = await ensureUser("/dashboard/profil-pro");

  const existing = await prisma.proProfile.findUnique({
    where: { userId: user.id },
  });
  if (!existing) {
    redirect("/pro/inscrire");
  }

  const displayName = String(form.get("displayName") || "").trim();
  const city = String(form.get("city") || "").trim();
  const country = String(form.get("country") || "France").trim();
  const bio = String(form.get("bio") || "").trim() || null;
  const whatsapp = String(form.get("whatsapp") || "").trim();
  const instagramHandle =
    String(form.get("instagramHandle") || "")
      .trim()
      .replace(/^@/, "") || null;
  const tiktokHandle =
    String(form.get("tiktokHandle") || "")
      .trim()
      .replace(/^@/, "") || null;
  const priceRange = normalizePriceRangeInput(
    String(form.get("priceRange") || ""),
  );
  const specialitiesRaw = String(form.get("specialities") || "").trim();
  const specialities = specialitiesRaw
    ? specialitiesRaw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  const photosRaw = String(form.get("photos") || "");
  const photos = photosRaw
    .split("\n")
    .map((s) => s.trim())
    .filter((s) => /^https?:\/\//i.test(s) || s.startsWith("/api/files/"))
    .slice(0, 12);

  if (!displayName || !city || !whatsapp) {
    redirect("/dashboard/profil-pro?error=missing");
  }

  if (detectContactInBio(bio)) {
    redirect("/dashboard/profil-pro?error=contact-in-bio");
  }

  await prisma.proProfile.update({
    where: { userId: user.id },
    data: {
      displayName,
      city,
      country,
      bio,
      whatsapp,
      instagramHandle,
      tiktokHandle,
      priceRange,
      specialities,
      photos,
    },
  });

  revalidatePath("/dashboard/profil-pro");
  revalidatePath("/dashboard/annonces");
  revalidatePath("/prestataires");
  revalidatePath(`/pro/${existing.id}`);
  redirect("/dashboard/profil-pro?saved=1");
}

export async function createProBookingAction(form: FormData) {
  const proProfileId = String(form.get("proProfileId") || "").trim();
  const clientName = String(form.get("clientName") || "").trim();
  const clientEmail = String(form.get("clientEmail") || "").trim() || null;
  const clientPhone = String(form.get("clientPhone") || "").trim();
  const requestedAtRaw = String(form.get("requestedAt") || "").trim();
  const note = String(form.get("note") || "").trim() || null;

  const failHref = proProfileId
    ? `/pro/${proProfileId}?booking=missing`
    : "/prestataires";

  if (!proProfileId || !clientName || !clientPhone || !requestedAtRaw) {
    redirect(failHref);
  }

  const pro = await prisma.proProfile.findUnique({
    where: { id: proProfileId },
    select: { id: true },
  });
  if (!pro) redirect("/prestataires");

  const requestedAt = new Date(requestedAtRaw);
  if (Number.isNaN(requestedAt.getTime())) {
    redirect(`/pro/${proProfileId}?booking=date`);
  }

  await prisma.proBooking.create({
    data: {
      proProfileId,
      clientName,
      clientEmail,
      clientPhone,
      requestedAt,
      note,
    },
  });

  revalidatePath(`/pro/${proProfileId}`);
  revalidatePath("/dashboard/planning");
  redirect(`/pro/${proProfileId}?booking=requested`);
}

export async function updateProBookingStatusAction(form: FormData) {
  const user = await ensureUser("/dashboard/planning");
  const bookingId = String(form.get("bookingId") || "").trim();
  const statusRaw = String(form.get("status") || "").trim();
  const validStatuses: ProBookingStatus[] = [
    "PENDING",
    "CONFIRMED",
    "CANCELLED",
    "COMPLETED",
  ];

  if (!bookingId || !validStatuses.includes(statusRaw as ProBookingStatus)) {
    redirect("/dashboard/planning?error=missing");
  }

  const booking = await prisma.proBooking.findUnique({
    where: { id: bookingId },
    select: {
      id: true,
      proProfile: { select: { userId: true } },
    },
  });

  if (!booking || booking.proProfile.userId !== user.id) {
    redirect("/dashboard/planning?error=forbidden");
  }

  await prisma.proBooking.update({
    where: { id: bookingId },
    data: { status: statusRaw as ProBookingStatus },
  });

  revalidatePath("/dashboard/planning");
  redirect("/dashboard/planning?updated=1");
}

export async function applyAsModeratorAction(form: FormData) {
  const user = await ensureUser("/communaute/devenir-moderateur");

  const region = String(form.get("region") || "").trim();
  const country = String(form.get("country") || "France").trim();
  const motivation = String(form.get("motivation") || "").trim() || null;
  const bio = String(form.get("bio") || "").trim() || null;
  const whatsappLink = String(form.get("whatsappLink") || "").trim() || null;

  if (!region) {
    redirect("/communaute/devenir-moderateur?error=missing");
  }

  if (
    whatsappLink &&
    !/^https?:\/\/(chat\.whatsapp\.com|wa\.me)\//i.test(whatsappLink)
  ) {
    redirect("/communaute/devenir-moderateur?error=whatsapp");
  }

  const existing = await prisma.moderator.findUnique({
    where: { userId: user.id },
  });

  if (existing) {
    await prisma.moderator.update({
      where: { id: existing.id },
      data: { region, country, motivation, bio, whatsappLink },
    });
  } else {
    await prisma.moderator.create({
      data: {
        userId: user.id,
        region,
        country,
        motivation,
        bio,
        whatsappLink,
        status: "PENDING",
      },
    });
  }

  revalidatePath("/communaute/devenir-moderateur");
  revalidatePath("/dashboard");
  redirect("/communaute/devenir-moderateur?success=1");
}
