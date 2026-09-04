"use server";

import type { VerificationStatus, VerificationType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/admin";
import { getDashboardUser } from "@/lib/dashboard";
import { prisma } from "@/lib/db/prisma";

async function createVerificationRequest(
  type: VerificationType,
  proProfileId?: string,
) {
  const user = await getDashboardUser();
  const pending = await prisma.verificationRequest.findFirst({
    where: { userId: user.id, type, status: "PENDING" },
    select: { id: true },
  });

  if (!pending) {
    await prisma.verificationRequest.create({
      data: { userId: user.id, proProfileId, type },
    });
  }
}

export async function requestAccountVerificationAction() {
  await createVerificationRequest("ACCOUNT");
  revalidatePath("/dashboard/parametres");
  redirect("/dashboard/parametres?verification=requested");
}

export async function requestProfessionalCertificationAction() {
  const user = await getDashboardUser();
  const pro = await prisma.proProfile.findUnique({
    where: { userId: user.id },
    select: { id: true },
  });
  if (!pro) redirect("/pro/inscrire");

  const pending = await prisma.verificationRequest.findFirst({
    where: {
      userId: user.id,
      type: "PROFESSIONAL",
      status: "PENDING",
    },
    select: { id: true },
  });
  if (!pending) {
    await prisma.verificationRequest.create({
      data: {
        userId: user.id,
        proProfileId: pro.id,
        type: "PROFESSIONAL",
      },
    });
  }

  revalidatePath("/dashboard/profil-pro");
  redirect("/dashboard/profil-pro?verification=requested");
}

export async function reviewVerificationRequestAction(
  requestId: string,
  decision: Extract<VerificationStatus, "APPROVED" | "REJECTED">,
) {
  const admin = await requireAdmin();
  const request = await prisma.verificationRequest.findUnique({
    where: { id: requestId },
  });
  if (!request || request.status !== "PENDING") return;

  const approved = decision === "APPROVED";
  if (request.type === "ACCOUNT") {
    await prisma.user.update({
      where: { id: request.userId },
      data: {
        accountVerified: approved,
        accountVerifiedAt: approved ? new Date() : null,
      },
    });
  } else if (request.proProfileId) {
    await prisma.proProfile.update({
      where: { id: request.proProfileId },
      data: {
        isCertified: approved,
        certifiedAt: approved ? new Date() : null,
      },
    });
  }

  await prisma.verificationRequest.update({
    where: { id: request.id },
    data: {
      status: decision,
      reviewedAt: new Date(),
      reviewerEmail: admin.email,
    },
  });

  revalidatePath("/admin/verifications");
  revalidatePath("/dashboard/parametres");
  revalidatePath("/dashboard/profil-pro");
  revalidatePath("/prestataires");
}
