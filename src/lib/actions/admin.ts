"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/admin";
import type { PromoCodeCategory, UserRole } from "@prisma/client";

function genCode(prefix: string, n: number) {
  return `${prefix}-${String(n).padStart(3, "0")}`;
}

const CATEGORY_PREFIX: Record<PromoCodeCategory, string> = {
  VIP_FAN: "FAN-VIP",
  PRO_MAQUILLEUSE: "PRO-MUA",
  PRO_COIFFEUR: "PRO-COIF",
  PRO_BARBIER: "PRO-BARB",
  PRO_PHOTOGRAPHE: "PRO-PHOTO",
  PRO_VENDEUR_MERCH: "PRO-MERCH",
  PRO_ORGANISATEUR_AFTER: "PRO-AFTER",
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

  const categories: PromoCodeCategory[] = [
    "VIP_FAN",
    "PRO_MAQUILLEUSE",
    "PRO_COIFFEUR",
    "PRO_BARBIER",
    "PRO_PHOTOGRAPHE",
    "PRO_VENDEUR_MERCH",
    "PRO_ORGANISATEUR_AFTER",
  ];

  let created = 0;
  for (const category of categories) {
    const prefix = CATEGORY_PREFIX[category];
    for (let i = 1; i <= 10; i++) {
      const code = genCode(prefix, i);
      const exists = await prisma.promoCode.findUnique({ where: { code } });
      if (exists) continue;
      await prisma.promoCode.create({
        data: {
          code,
          category,
          label: `Premier inscrit ${category} #${i}`,
          discountPercent: 100,
          maxUses: 1,
        },
      });
      created++;
    }
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
