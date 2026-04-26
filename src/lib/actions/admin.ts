"use server";

import { revalidatePath } from "next/cache";
import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/admin";
import type { ProCategory, PromoCodeCategory, UserRole } from "@prisma/client";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || `entry-${Date.now()}`;
}

async function getOrCreateManagedUser(email: string, name: string) {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail) throw new Error("Email obligatoire pour créer le porteur");
  const existing = await prisma.user.findUnique({ where: { email: cleanEmail } });
  if (existing) return existing;
  return prisma.user.create({
    data: {
      email: cleanEmail,
      name: name.trim() || null,
      clerkId: `managed_${randomUUID()}`,
      role: "PRO",
    },
  });
}

function genCode(prefix: string, n: number) {
  return `${prefix}-${String(n).padStart(3, "0")}`;
}

const CATEGORY_PREFIX: Record<PromoCodeCategory, string> = {
  VIP_FAN: "FAN-VIP",
  PRO: "PRO",
};

const CATEGORY_LABEL: Record<PromoCodeCategory, string> = {
  VIP_FAN: "VIP Famille",
  PRO: "Prestataire pro",
};

export async function setUserRole(userId: string, role: UserRole) {
  await requireAdmin();
  await prisma.user.update({ where: { id: userId }, data: { role } });
  revalidatePath("/admin/users");
}

export async function toggleUserVip(userId: string, isVip: boolean) {
  await requireAdmin();
  await prisma.user.update({
    where: { id: userId },
    data: {
      isVipActive: isVip,
      vipUntil: isVip ? new Date("2026-05-31") : null,
    },
  });
  revalidatePath("/admin/users");
}

export async function deleteUser(userId: string) {
  await requireAdmin();
  await prisma.user.delete({ where: { id: userId } });
  revalidatePath("/admin/users");
}

export async function verifyProProfile(profileId: string, verified: boolean) {
  await requireAdmin();
  await prisma.proProfile.update({
    where: { id: profileId },
    data: { isVerified: verified, verifiedAt: verified ? new Date() : null },
  });
  revalidatePath("/admin/pros");
}

export async function deleteProProfile(profileId: string) {
  await requireAdmin();
  await prisma.proProfile.delete({ where: { id: profileId } });
  revalidatePath("/admin/pros");
}

export async function deleteTrajet(trajetId: string) {
  await requireAdmin();
  await prisma.trajet.delete({ where: { id: trajetId } });
  revalidatePath("/admin/trajets");
}

export async function toggleTrajetActive(trajetId: string, isActive: boolean) {
  await requireAdmin();
  await prisma.trajet.update({
    where: { id: trajetId },
    data: { isActive },
  });
  revalidatePath("/admin/trajets");
}

export async function createPromoCode(form: FormData) {
  await requireAdmin();
  const code = String(form.get("code") || "").trim().toUpperCase();
  const category = String(form.get("category") || "") as PromoCodeCategory;
  const label = String(form.get("label") || "").trim() || null;
  const discountPercent = Number(form.get("discountPercent") || 100);
  const maxUses = Number(form.get("maxUses") || 1);

  if (!code || !category) throw new Error("Code et catégorie requis");

  await prisma.promoCode.create({
    data: { code, category, label, discountPercent, maxUses },
  });
  revalidatePath("/admin/promo-codes");
}

export async function togglePromoCode(promoId: string, isActive: boolean) {
  await requireAdmin();
  await prisma.promoCode.update({
    where: { id: promoId },
    data: { isActive },
  });
  revalidatePath("/admin/promo-codes");
}

export async function deletePromoCode(promoId: string) {
  await requireAdmin();
  await prisma.promoCode.delete({ where: { id: promoId } });
  revalidatePath("/admin/promo-codes");
}

export async function generateInitialPromoCodes(): Promise<void> {
  await requireAdmin();

  const categories: PromoCodeCategory[] = ["VIP_FAN", "PRO"];

  for (const category of categories) {
    const prefix = CATEGORY_PREFIX[category];
    const label = CATEGORY_LABEL[category];
    for (let i = 1; i <= 10; i++) {
      const code = genCode(prefix, i);
      const exists = await prisma.promoCode.findUnique({ where: { code } });
      if (exists) continue;
      await prisma.promoCode.create({
        data: {
          code,
          category,
          label: `Premier inscrit ${label} #${i}`,
          discountPercent: 100,
          maxUses: 1,
        },
      });
    }
  }

  // MBKFREE — code universel pour inscription Pro gratuite (toutes catégories)
  const mbkfree = await prisma.promoCode.findUnique({
    where: { code: "MBKFREE" },
  });
  if (!mbkfree) {
    await prisma.promoCode.create({
      data: {
        code: "MBKFREE",
        category: "PRO",
        label: "Inscription Pro gratuite — toutes catégories",
        discountPercent: 100,
        maxUses: 9999,
      },
    });
  }

  revalidatePath("/admin/promo-codes");
}

export async function ensureMbkFreeCode(): Promise<void> {
  await requireAdmin();
  const existing = await prisma.promoCode.findUnique({
    where: { code: "MBKFREE" },
  });
  if (existing) {
    await prisma.promoCode.update({
      where: { id: existing.id },
      data: {
        category: "PRO",
        discountPercent: 100,
        maxUses: Math.max(existing.maxUses, 9999),
        isActive: true,
        label: existing.label ?? "Inscription Pro gratuite — toutes catégories",
      },
    });
  } else {
    await prisma.promoCode.create({
      data: {
        code: "MBKFREE",
        category: "PRO",
        label: "Inscription Pro gratuite — toutes catégories",
        discountPercent: 100,
        maxUses: 9999,
      },
    });
  }
  revalidatePath("/admin/promo-codes");
}

export async function deleteNewsletterSubscriber(id: string) {
  await requireAdmin();
  await prisma.newsletterSubscriber.delete({ where: { id } });
  revalidatePath("/admin/newsletter");
}

export async function updateReportStatus(
  reportId: string,
  status: "PENDING" | "REVIEWING" | "RESOLVED" | "DISMISSED",
  adminNotes?: string,
) {
  await requireAdmin();
  await prisma.report.update({
    where: { id: reportId },
    data: {
      status,
      adminNotes: adminNotes ?? undefined,
      resolvedAt: status === "RESOLVED" || status === "DISMISSED" ? new Date() : null,
    },
  });
  revalidatePath("/admin/signalements");
}

export async function deleteReport(reportId: string) {
  await requireAdmin();
  await prisma.report.delete({ where: { id: reportId } });
  revalidatePath("/admin/signalements");
}

export async function deleteReportedTarget(
  reportId: string,
  targetType: "TRAJET" | "PRO_PROFILE" | "AFTER" | "USER" | "MERCH_PRODUCT",
  targetId: string,
) {
  await requireAdmin();

  switch (targetType) {
    case "TRAJET":
      await prisma.trajet.delete({ where: { id: targetId } }).catch(() => null);
      break;
    case "PRO_PROFILE":
      await prisma.proProfile.delete({ where: { id: targetId } }).catch(() => null);
      break;
    case "AFTER":
      await prisma.after.delete({ where: { id: targetId } }).catch(() => null);
      break;
    case "USER":
      await prisma.user.delete({ where: { id: targetId } }).catch(() => null);
      break;
    case "MERCH_PRODUCT":
      await prisma.merchProduct.delete({ where: { id: targetId } }).catch(() => null);
      break;
  }

  await prisma.report.update({
    where: { id: reportId },
    data: { status: "RESOLVED", resolvedAt: new Date() },
  });
  revalidatePath("/admin/signalements");
}

export async function deleteAllTestData() {
  await requireAdmin();
  await prisma.$transaction([
    prisma.quizResult.deleteMany({
      where: { email: { contains: "test", mode: "insensitive" } },
    }),
    prisma.gameScore.deleteMany({
      where: { pseudo: { contains: "test", mode: "insensitive" } },
    }),
    prisma.newsletterSubscriber.deleteMany({
      where: { email: { contains: "test", mode: "insensitive" } },
    }),
    prisma.trajet.deleteMany({
      where: {
        OR: [
          { note: { contains: "test", mode: "insensitive" } },
          { villeDepart: { contains: "test", mode: "insensitive" } },
        ],
      },
    }),
  ]);
  revalidatePath("/admin");
}

// ============================================================================
// MODERATORS & WHATSAPP COMMUNITIES
// ============================================================================

export async function approveModerator(moderatorId: string) {
  await requireAdmin();
  await prisma.moderator.update({
    where: { id: moderatorId },
    data: { status: "APPROVED", approvedAt: new Date() },
  });
  revalidatePath("/admin/moderateurs");
}

export async function suspendModerator(moderatorId: string) {
  await requireAdmin();
  await prisma.moderator.update({
    where: { id: moderatorId },
    data: { status: "SUSPENDED" },
  });
  revalidatePath("/admin/moderateurs");
}

export async function deleteModerator(moderatorId: string) {
  await requireAdmin();
  await prisma.moderator.delete({ where: { id: moderatorId } });
  revalidatePath("/admin/moderateurs");
}

export async function createCommunityAction(form: FormData) {
  await requireAdmin();
  const name = String(form.get("name") || "").trim();
  const region = String(form.get("region") || "").trim();
  const country = String(form.get("country") || "France").trim();
  const inviteLink = String(form.get("inviteLink") || "").trim();
  const description = String(form.get("description") || "").trim() || null;
  const rules = String(form.get("rules") || "").trim() || null;
  const moderatorId = String(form.get("moderatorId") || "").trim() || null;
  const isFeatured = form.get("isFeatured") === "on";

  if (!name || !region || !inviteLink) {
    throw new Error("Nom, région et lien WhatsApp obligatoires");
  }
  if (!/^https?:\/\/(chat\.whatsapp\.com|wa\.me)\//i.test(inviteLink)) {
    throw new Error("Lien WhatsApp invalide");
  }

  await prisma.whatsAppCommunity.create({
    data: {
      name,
      region,
      country,
      inviteLink,
      description,
      rules,
      isFeatured,
      moderatorId: moderatorId ?? undefined,
    },
  });
  revalidatePath("/admin/communautes");
  revalidatePath("/communaute");
}

export async function updateCommunityAction(id: string, form: FormData) {
  await requireAdmin();
  const name = String(form.get("name") || "").trim();
  const region = String(form.get("region") || "").trim();
  const country = String(form.get("country") || "France").trim();
  const inviteLink = String(form.get("inviteLink") || "").trim();
  const description = String(form.get("description") || "").trim() || null;
  const rules = String(form.get("rules") || "").trim() || null;
  const moderatorId = String(form.get("moderatorId") || "").trim() || null;

  if (!name || !region || !inviteLink) {
    throw new Error("Nom, région et lien WhatsApp obligatoires");
  }
  if (!/^https?:\/\/(chat\.whatsapp\.com|wa\.me)\//i.test(inviteLink)) {
    throw new Error("Lien WhatsApp invalide");
  }

  await prisma.whatsAppCommunity.update({
    where: { id },
    data: {
      name,
      region,
      country,
      inviteLink,
      description,
      rules,
      moderatorId: moderatorId,
    },
  });
  revalidatePath("/admin/communautes");
  revalidatePath("/communaute");
}

export async function toggleCommunityActive(id: string, isActive: boolean) {
  await requireAdmin();
  await prisma.whatsAppCommunity.update({
    where: { id },
    data: { isActive },
  });
  revalidatePath("/admin/communautes");
  revalidatePath("/communaute");
}

export async function toggleCommunityFeatured(id: string, isFeatured: boolean) {
  await requireAdmin();
  await prisma.whatsAppCommunity.update({
    where: { id },
    data: { isFeatured },
  });
  revalidatePath("/admin/communautes");
  revalidatePath("/communaute");
}

export async function deleteCommunity(id: string) {
  await requireAdmin();
  await prisma.whatsAppCommunity.delete({ where: { id } });
  revalidatePath("/admin/communautes");
  revalidatePath("/communaute");
}

export async function certifyProProfile(profileId: string, certified: boolean) {
  await requireAdmin();
  await prisma.proProfile.update({
    where: { id: profileId },
    data: { isPremium: certified },
  });
  revalidatePath("/admin/pros");
}

// ===== ADMIN CONTENT CREATION =====

export async function createTrajetAdmin(form: FormData) {
  await requireAdmin();
  const driverEmail = String(form.get("driverEmail") || "").trim().toLowerCase();
  const driverName = String(form.get("driverName") || "").trim();
  const villeDepart = String(form.get("villeDepart") || "").trim();
  const paysDepart = String(form.get("paysDepart") || "").trim();
  const villeArrivee = String(form.get("villeArrivee") || "Paris").trim();
  const dateStr = String(form.get("date") || "").trim();
  const heureDepart = String(form.get("heureDepart") || "").trim();
  const placesTotal = parseInt(String(form.get("placesTotal") || "0"), 10);
  const prix = parseFloat(String(form.get("prix") || "0"));
  const whatsapp = String(form.get("whatsapp") || "").trim();
  const vehicule = String(form.get("vehicule") || "").trim() || null;
  const vehiculeModel = String(form.get("vehiculeModel") || "").trim() || null;
  const vehiculeColor = String(form.get("vehiculeColor") || "").trim() || null;
  const note = String(form.get("note") || "").trim() || null;

  if (!driverEmail || !villeDepart || !paysDepart || !dateStr || !heureDepart || !whatsapp) {
    throw new Error("Champs obligatoires manquants (email, départ, pays, date, heure, WhatsApp)");
  }
  if (!Number.isFinite(placesTotal) || placesTotal < 1) throw new Error("Nombre de places invalide");
  if (!Number.isFinite(prix) || prix < 0) throw new Error("Prix invalide");

  const user = await getOrCreateManagedUser(driverEmail, driverName);

  await prisma.trajet.create({
    data: {
      userId: user.id,
      villeDepart,
      paysDepart,
      villeArrivee,
      date: new Date(dateStr),
      heureDepart,
      placesDispo: placesTotal,
      placesTotal,
      prix,
      vehicule,
      vehiculeModel,
      vehiculeColor,
      note,
      whatsapp,
      isActive: true,
    },
  });
  revalidatePath("/admin/trajets");
  revalidatePath("/trajets");
}

export async function createProProfileAdmin(form: FormData) {
  await requireAdmin();
  const proEmail = String(form.get("proEmail") || "").trim().toLowerCase();
  const displayName = String(form.get("displayName") || "").trim();
  const category = String(form.get("category") || "") as ProCategory;
  const city = String(form.get("city") || "").trim();
  const country = String(form.get("country") || "France").trim();
  const whatsapp = String(form.get("whatsapp") || "").trim();
  const bio = String(form.get("bio") || "").trim() || null;
  const specialitiesStr = String(form.get("specialities") || "").trim();
  const specialities = specialitiesStr
    ? specialitiesStr.split(",").map((s) => s.trim()).filter(Boolean)
    : [];
  const photosStr = String(form.get("photos") || "").trim();
  const photos = photosStr
    ? photosStr.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean)
    : [];
  const instagramHandle = String(form.get("instagramHandle") || "").trim() || null;
  const tiktokHandle = String(form.get("tiktokHandle") || "").trim() || null;
  const priceRange = String(form.get("priceRange") || "").trim() || null;
  const isPremium = form.get("isPremium") === "on";
  const isVerified = form.get("isVerified") === "on";

  if (!proEmail || !displayName || !category || !city || !whatsapp) {
    throw new Error("Email, nom, catégorie, ville et WhatsApp obligatoires");
  }

  const user = await getOrCreateManagedUser(proEmail, displayName);
  const existingProfile = await prisma.proProfile.findUnique({ where: { userId: user.id } });
  if (existingProfile) throw new Error("Cet email a déjà un profil pro");

  let baseSlug = slugify(displayName);
  let slug = baseSlug;
  let i = 2;
  while (await prisma.proProfile.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${i++}`;
  }

  await prisma.proProfile.create({
    data: {
      userId: user.id,
      category,
      displayName,
      slug,
      city,
      country,
      bio,
      specialities,
      photos,
      instagramHandle,
      tiktokHandle,
      whatsapp,
      priceRange,
      isPremium,
      premiumUntil: isPremium ? new Date("2026-12-31") : null,
      isVerified,
      verifiedAt: isVerified ? new Date() : null,
    },
  });
  revalidatePath("/admin/pros");
  revalidatePath("/prestataires");
  revalidatePath("/beaute");
}

// ===== AFTERS =====

export async function createAfterAdmin(form: FormData) {
  await requireAdmin();
  const name = String(form.get("name") || "").trim();
  const description = String(form.get("description") || "").trim();
  const dateStr = String(form.get("date") || "").trim();
  const venue = String(form.get("venue") || "").trim();
  const address = String(form.get("address") || "").trim();
  const city = String(form.get("city") || "Paris").trim();
  const capacityStr = String(form.get("capacity") || "").trim();
  const capacity = capacityStr ? parseInt(capacityStr, 10) : null;
  const priceFrom = parseFloat(String(form.get("priceFrom") || "0"));
  const ticketUrl = String(form.get("ticketUrl") || "").trim();
  const flyerUrl = String(form.get("flyerUrl") || "").trim() || null;
  const isVerified = form.get("isVerified") === "on";

  if (!name || !description || !dateStr || !venue || !address || !ticketUrl) {
    throw new Error("Nom, description, date, lieu, adresse et URL billetterie obligatoires");
  }

  let baseSlug = slugify(name);
  let slug = baseSlug;
  let i = 2;
  while (await prisma.after.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${i++}`;
  }

  await prisma.after.create({
    data: {
      slug,
      name,
      description,
      date: new Date(dateStr),
      venue,
      address,
      city,
      capacity: capacity && Number.isFinite(capacity) ? capacity : null,
      priceFrom: Number.isFinite(priceFrom) ? priceFrom : 0,
      ticketUrl,
      flyerUrl,
      isVerified,
      isActive: true,
    },
  });
  revalidatePath("/admin/afters");
  revalidatePath("/afters");
}

export async function toggleAfterActive(id: string, isActive: boolean) {
  await requireAdmin();
  await prisma.after.update({ where: { id }, data: { isActive } });
  revalidatePath("/admin/afters");
  revalidatePath("/afters");
}

export async function toggleAfterBoosted(id: string, isBoosted: boolean) {
  await requireAdmin();
  await prisma.after.update({ where: { id }, data: { isBoosted } });
  revalidatePath("/admin/afters");
  revalidatePath("/afters");
}

export async function deleteAfter(id: string) {
  await requireAdmin();
  await prisma.after.delete({ where: { id } });
  revalidatePath("/admin/afters");
  revalidatePath("/afters");
}

// ===== MERCH =====

export async function createMerchAdmin(form: FormData) {
  await requireAdmin();
  const vendorName = String(form.get("vendorName") || "").trim();
  const title = String(form.get("title") || "").trim();
  const description = String(form.get("description") || "").trim() || null;
  const imageUrl = String(form.get("imageUrl") || "").trim();
  const price = parseFloat(String(form.get("price") || "0"));
  const externalUrl = String(form.get("externalUrl") || "").trim();
  const category = String(form.get("category") || "").trim();
  const isFeatured = form.get("isFeatured") === "on";

  if (!vendorName || !title || !imageUrl || !externalUrl || !category) {
    throw new Error("Vendeur, titre, image, URL et catégorie obligatoires");
  }
  if (!Number.isFinite(price) || price < 0) throw new Error("Prix invalide");

  await prisma.merchProduct.create({
    data: { vendorName, title, description, imageUrl, price, externalUrl, category, isFeatured },
  });
  revalidatePath("/admin/merch");
  revalidatePath("/merch");
}

export async function toggleMerchFeatured(id: string, isFeatured: boolean) {
  await requireAdmin();
  await prisma.merchProduct.update({ where: { id }, data: { isFeatured } });
  revalidatePath("/admin/merch");
  revalidatePath("/merch");
}

export async function deleteMerch(id: string) {
  await requireAdmin();
  await prisma.merchProduct.delete({ where: { id } });
  revalidatePath("/admin/merch");
  revalidatePath("/merch");
}

// ===== PARIS CLASSICS =====

export async function createParisAdmin(form: FormData) {
  await requireAdmin();
  const name = String(form.get("name") || "").trim();
  const category = String(form.get("category") || "").trim();
  const description = String(form.get("description") || "").trim();
  const address = String(form.get("address") || "").trim();
  const arrondStr = String(form.get("arrondissement") || "").trim();
  const arrondissement = arrondStr ? parseInt(arrondStr, 10) : null;
  const priceLevelStr = String(form.get("priceLevel") || "2").trim();
  const priceLevel = parseInt(priceLevelStr, 10) || 2;
  const externalUrl = String(form.get("externalUrl") || "").trim() || null;
  const googleMapsUrl = String(form.get("googleMapsUrl") || "").trim() || null;
  const phone = String(form.get("phone") || "").trim() || null;
  const imageUrl = String(form.get("imageUrl") || "").trim() || null;
  const tagsStr = String(form.get("tags") || "").trim();
  const tags = tagsStr ? tagsStr.split(",").map((s) => s.trim()).filter(Boolean) : [];
  const isSponsored = form.get("isSponsored") === "on";
  const orderStr = String(form.get("order") || "0").trim();
  const order = parseInt(orderStr, 10) || 0;

  if (!name || !category || !description || !address) {
    throw new Error("Nom, catégorie, description et adresse obligatoires");
  }

  await prisma.parisClassic.create({
    data: {
      name,
      category,
      description,
      address,
      arrondissement: arrondissement && Number.isFinite(arrondissement) ? arrondissement : null,
      priceLevel,
      externalUrl,
      googleMapsUrl,
      phone,
      imageUrl,
      tags,
      isSponsored,
      order,
    },
  });
  revalidatePath("/admin/paris");
  revalidatePath("/classiques-paris");
}

export async function deleteParis(id: string) {
  await requireAdmin();
  await prisma.parisClassic.delete({ where: { id } });
  revalidatePath("/admin/paris");
  revalidatePath("/classiques-paris");
}

export async function toggleParisSponsored(id: string, isSponsored: boolean) {
  await requireAdmin();
  await prisma.parisClassic.update({ where: { id }, data: { isSponsored } });
  revalidatePath("/admin/paris");
  revalidatePath("/classiques-paris");
}
