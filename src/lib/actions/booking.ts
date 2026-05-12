"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { after } from "next/server";

import { isSlotStillAvailable } from "@/lib/booking-slots";
import { getDashboardUser } from "@/lib/dashboard";
import { prisma } from "@/lib/db/prisma";
import { sendBookingRequestedEmail } from "@/lib/email";

async function ensureOwnedProfile() {
  const user = await getDashboardUser();
  const pro = await prisma.proProfile.findUnique({
    where: { userId: user.id },
  });
  if (!pro) redirect("/pro/inscrire");
  return { user, pro };
}

async function ensureOwnedTeamMember(teamMemberId: string) {
  const { pro } = await ensureOwnedProfile();
  const member = await prisma.teamMember.findUnique({
    where: { id: teamMemberId },
  });
  if (!member || member.proProfileId !== pro.id) {
    redirect("/dashboard/profil-pro/equipe?error=forbidden");
  }
  return { pro, member };
}

async function ensureDefaultTeamMember(
  proProfileId: string,
  defaultName: string,
) {
  const existing = await prisma.teamMember.findFirst({
    where: { proProfileId },
    orderBy: { position: "asc" },
  });
  if (existing) return existing;
  return prisma.teamMember.create({
    data: { proProfileId, displayName: defaultName, position: 0 },
  });
}

// ────────────────── Services ──────────────────
export async function createServiceAction(form: FormData) {
  const { pro } = await ensureOwnedProfile();
  const name = String(form.get("name") || "").trim();
  const durationMin = Number(form.get("durationMin") || 0);
  const priceCents = Math.round(Number(form.get("priceEuros") || 0) * 100);
  const description = String(form.get("description") || "").trim() || null;
  const isOnlineBookable = form.get("isOnlineBookable") === "on";
  if (!name || durationMin <= 0 || priceCents < 0) {
    redirect("/dashboard/profil-pro/prestations?error=missing");
  }

  const lastPos = await prisma.service.aggregate({
    where: { proProfileId: pro.id },
    _max: { position: true },
  });
  const created = await prisma.service.create({
    data: {
      proProfileId: pro.id,
      name,
      durationMin,
      priceCents,
      description,
      isOnlineBookable,
      position: (lastPos._max.position ?? -1) + 1,
    },
  });

  // Auto-assign to all existing team members (or create the default one)
  const member = await ensureDefaultTeamMember(pro.id, pro.displayName);
  const allMembers = await prisma.teamMember.findMany({
    where: { proProfileId: pro.id },
    select: { id: true },
  });
  const ids = allMembers.length ? allMembers.map((m) => m.id) : [member.id];
  await prisma.serviceMember.createMany({
    data: ids.map((tid) => ({ serviceId: created.id, teamMemberId: tid })),
    skipDuplicates: true,
  });

  revalidatePath("/dashboard/profil-pro/prestations");
  redirect("/dashboard/profil-pro/prestations?saved=1");
}

export async function updateServiceAction(form: FormData) {
  const { pro } = await ensureOwnedProfile();
  const id = String(form.get("id") || "").trim();
  const service = await prisma.service.findUnique({ where: { id } });
  if (!service || service.proProfileId !== pro.id) {
    redirect("/dashboard/profil-pro/prestations?error=forbidden");
  }
  const name = String(form.get("name") || "").trim();
  const durationMin = Number(form.get("durationMin") || 0);
  const priceCents = Math.round(Number(form.get("priceEuros") || 0) * 100);
  const description = String(form.get("description") || "").trim() || null;
  const isOnlineBookable = form.get("isOnlineBookable") === "on";
  const submittedMemberIds = form.getAll("memberIds").map((v) => String(v));

  if (!name || durationMin <= 0 || priceCents < 0) {
    redirect("/dashboard/profil-pro/prestations?error=missing");
  }

  // Whitelist: only keep team-member ids that actually belong to this pro.
  // Prevents cross-tenant assignment via crafted form payloads.
  const ownedMembers = submittedMemberIds.length
    ? await prisma.teamMember.findMany({
        where: { proProfileId: pro.id, id: { in: submittedMemberIds } },
        select: { id: true },
      })
    : [];
  const safeMemberIds = ownedMembers.map((m) => m.id);

  await prisma.$transaction([
    prisma.service.update({
      where: { id },
      data: { name, durationMin, priceCents, description, isOnlineBookable },
    }),
    prisma.serviceMember.deleteMany({ where: { serviceId: id } }),
    ...(safeMemberIds.length
      ? [
          prisma.serviceMember.createMany({
            data: safeMemberIds.map((tid) => ({
              serviceId: id,
              teamMemberId: tid,
            })),
            skipDuplicates: true,
          }),
        ]
      : []),
  ]);

  revalidatePath("/dashboard/profil-pro/prestations");
  revalidatePath(`/pro/${pro.id}`);
  redirect("/dashboard/profil-pro/prestations?saved=1");
}

export async function deleteServiceAction(form: FormData) {
  const { pro } = await ensureOwnedProfile();
  const id = String(form.get("id") || "").trim();
  const service = await prisma.service.findUnique({ where: { id } });
  if (!service || service.proProfileId !== pro.id) {
    redirect("/dashboard/profil-pro/prestations?error=forbidden");
  }
  await prisma.service.delete({ where: { id } });
  revalidatePath("/dashboard/profil-pro/prestations");
  revalidatePath(`/pro/${pro.id}`);
  redirect("/dashboard/profil-pro/prestations?saved=1");
}

// ────────────────── Team members ──────────────────
export async function createTeamMemberAction(form: FormData) {
  const { pro } = await ensureOwnedProfile();
  const displayName = String(form.get("displayName") || "").trim();
  const photoUrlRaw = String(form.get("photoUrl") || "").trim();
  const photoUrl =
    photoUrlRaw &&
    (/^https?:\/\//i.test(photoUrlRaw) || photoUrlRaw.startsWith("/api/files/"))
      ? photoUrlRaw.split("\n")[0].trim()
      : null;
  if (!displayName) {
    redirect("/dashboard/profil-pro/equipe?error=missing");
  }
  const lastPos = await prisma.teamMember.aggregate({
    where: { proProfileId: pro.id },
    _max: { position: true },
  });
  const member = await prisma.teamMember.create({
    data: {
      proProfileId: pro.id,
      displayName,
      photoUrl,
      position: (lastPos._max.position ?? -1) + 1,
    },
  });
  // Assign to every existing service so a new member is bookable on all
  const services = await prisma.service.findMany({
    where: { proProfileId: pro.id },
    select: { id: true },
  });
  if (services.length) {
    await prisma.serviceMember.createMany({
      data: services.map((s) => ({
        serviceId: s.id,
        teamMemberId: member.id,
      })),
      skipDuplicates: true,
    });
  }
  revalidatePath("/dashboard/profil-pro/equipe");
  redirect("/dashboard/profil-pro/equipe?saved=1");
}

export async function updateTeamMemberAction(form: FormData) {
  const teamMemberId = String(form.get("id") || "").trim();
  const { pro } = await ensureOwnedTeamMember(teamMemberId);
  const displayName = String(form.get("displayName") || "").trim();
  const photoUrlRaw = String(form.get("photoUrl") || "").trim();
  const photoUrl =
    photoUrlRaw &&
    (/^https?:\/\//i.test(photoUrlRaw) || photoUrlRaw.startsWith("/api/files/"))
      ? photoUrlRaw.split("\n")[0].trim()
      : null;
  const isActive = form.get("isActive") === "on";
  if (!displayName) {
    redirect("/dashboard/profil-pro/equipe?error=missing");
  }
  await prisma.teamMember.update({
    where: { id: teamMemberId },
    data: { displayName, photoUrl, isActive },
  });
  revalidatePath("/dashboard/profil-pro/equipe");
  revalidatePath(`/pro/${pro.id}`);
  redirect("/dashboard/profil-pro/equipe?saved=1");
}

export async function deleteTeamMemberAction(form: FormData) {
  const teamMemberId = String(form.get("id") || "").trim();
  const { pro } = await ensureOwnedTeamMember(teamMemberId);
  await prisma.teamMember.delete({ where: { id: teamMemberId } });
  revalidatePath("/dashboard/profil-pro/equipe");
  revalidatePath(`/pro/${pro.id}`);
  redirect("/dashboard/profil-pro/equipe?saved=1");
}

// ────────────────── Working hours ──────────────────
function parseHHMM(value: string): number | null {
  const m = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
  if (!m) return null;
  const h = Number(m[1]);
  const mm = Number(m[2]);
  if (h < 0 || h > 23 || mm < 0 || mm > 59) return null;
  return h * 60 + mm;
}

export async function saveWorkingHoursAction(form: FormData) {
  const teamMemberId = String(form.get("teamMemberId") || "").trim();
  const { pro } = await ensureOwnedTeamMember(teamMemberId);
  // For each day 0-6, read open/close and isOpen
  const ops: { dayOfWeek: number; openMinute: number; closeMinute: number }[] =
    [];
  for (let d = 0; d < 7; d++) {
    const isOpen = form.get(`day_${d}_open`) === "on";
    if (!isOpen) continue;
    const openMin = parseHHMM(String(form.get(`day_${d}_from`) || ""));
    const closeMin = parseHHMM(String(form.get(`day_${d}_to`) || ""));
    if (openMin === null || closeMin === null || closeMin <= openMin) continue;
    ops.push({ dayOfWeek: d, openMinute: openMin, closeMinute: closeMin });
  }
  await prisma.$transaction([
    prisma.workingHours.deleteMany({ where: { teamMemberId } }),
    ...(ops.length
      ? [
          prisma.workingHours.createMany({
            data: ops.map((o) => ({ teamMemberId, ...o })),
          }),
        ]
      : []),
  ]);
  revalidatePath("/dashboard/profil-pro/horaires");
  revalidatePath(`/pro/${pro.id}`);
  redirect("/dashboard/profil-pro/horaires?saved=1");
}

export async function addTimeOffAction(form: FormData) {
  const teamMemberId = String(form.get("teamMemberId") || "").trim();
  const { pro } = await ensureOwnedTeamMember(teamMemberId);
  const startsAtStr = String(form.get("startsAt") || "").trim();
  const endsAtStr = String(form.get("endsAt") || "").trim();
  const reason = String(form.get("reason") || "").trim() || null;
  const startsAt = new Date(startsAtStr);
  const endsAt = new Date(endsAtStr);
  if (
    Number.isNaN(startsAt.getTime()) ||
    Number.isNaN(endsAt.getTime()) ||
    endsAt <= startsAt
  ) {
    redirect("/dashboard/profil-pro/horaires?error=date");
  }
  await prisma.timeOff.create({
    data: { teamMemberId, startsAt, endsAt, reason },
  });
  revalidatePath("/dashboard/profil-pro/horaires");
  revalidatePath(`/pro/${pro.id}`);
  redirect("/dashboard/profil-pro/horaires?saved=1");
}

export async function deleteTimeOffAction(form: FormData) {
  const id = String(form.get("id") || "").trim();
  const off = await prisma.timeOff.findUnique({
    where: { id },
    include: { teamMember: true },
  });
  if (!off) redirect("/dashboard/profil-pro/horaires");
  await ensureOwnedTeamMember(off.teamMemberId);
  await prisma.timeOff.delete({ where: { id } });
  revalidatePath("/dashboard/profil-pro/horaires");
  redirect("/dashboard/profil-pro/horaires?saved=1");
}

// ────────────────── Onboarding wizard ──────────────────
export async function createServiceOnboardingAction(form: FormData) {
  const { pro } = await ensureOwnedProfile();
  const name = String(form.get("name") || "").trim();
  const durationMin = Number(form.get("durationMin") || 0);
  const priceCents = Math.round(Number(form.get("priceEuros") || 0) * 100);
  const description = String(form.get("description") || "").trim() || null;
  if (!name || durationMin <= 0 || priceCents < 0) {
    redirect("/dashboard/profil-pro/onboarding?step=1&error=missing");
  }

  const lastPos = await prisma.service.aggregate({
    where: { proProfileId: pro.id },
    _max: { position: true },
  });
  const created = await prisma.service.create({
    data: {
      proProfileId: pro.id,
      name,
      durationMin,
      priceCents,
      description,
      isOnlineBookable: true,
      position: (lastPos._max.position ?? -1) + 1,
    },
  });

  const member = await ensureDefaultTeamMember(pro.id, pro.displayName);
  const allMembers = await prisma.teamMember.findMany({
    where: { proProfileId: pro.id },
    select: { id: true },
  });
  const ids = allMembers.length ? allMembers.map((m) => m.id) : [member.id];
  await prisma.serviceMember.createMany({
    data: ids.map((tid) => ({ serviceId: created.id, teamMemberId: tid })),
    skipDuplicates: true,
  });

  revalidatePath("/dashboard/profil-pro/onboarding");
  redirect("/dashboard/profil-pro/onboarding?step=2");
}

export async function saveWorkingHoursOnboardingAction(form: FormData) {
  const teamMemberId = String(form.get("teamMemberId") || "").trim();
  const { pro } = await ensureOwnedTeamMember(teamMemberId);
  const ops: { dayOfWeek: number; openMinute: number; closeMinute: number }[] =
    [];
  for (let d = 0; d < 7; d++) {
    const isOpen = form.get(`day_${d}_open`) === "on";
    if (!isOpen) continue;
    const openMin = parseHHMM(String(form.get(`day_${d}_from`) || ""));
    const closeMin = parseHHMM(String(form.get(`day_${d}_to`) || ""));
    if (openMin === null || closeMin === null || closeMin <= openMin) continue;
    ops.push({ dayOfWeek: d, openMinute: openMin, closeMinute: closeMin });
  }
  await prisma.$transaction([
    prisma.workingHours.deleteMany({ where: { teamMemberId } }),
    ...(ops.length
      ? [
          prisma.workingHours.createMany({
            data: ops.map((o) => ({ teamMemberId, ...o })),
          }),
        ]
      : []),
  ]);
  revalidatePath("/dashboard/profil-pro/onboarding");
  revalidatePath(`/pro/${pro.id}`);
  redirect("/dashboard/profil-pro/onboarding?step=3");
}

export async function completeProOnboardingAction() {
  const user = await getDashboardUser();
  await prisma.user.update({
    where: { id: user.id },
    data: { onboardingProBookingDoneAt: new Date() },
  });
  revalidatePath("/dashboard");
  redirect("/dashboard?onboarding=done");
}

export async function skipProOnboardingAction() {
  const user = await getDashboardUser();
  await prisma.user.update({
    where: { id: user.id },
    data: { onboardingProBookingDoneAt: new Date() },
  });
  revalidatePath("/dashboard");
  redirect("/dashboard?onboarding=skipped");
}

// ────────────────── Customer booking on a slot ──────────────────
export async function createSlotBookingAction(form: FormData) {
  const proProfileId = String(form.get("proProfileId") || "").trim();
  const serviceId = String(form.get("serviceId") || "").trim();
  const teamMemberId = String(form.get("teamMemberId") || "").trim();
  const startsAtStr = String(form.get("startsAt") || "").trim();
  const clientName = String(form.get("clientName") || "").trim();
  const clientPhone = String(form.get("clientPhone") || "").trim();
  const clientEmail = String(form.get("clientEmail") || "").trim() || null;
  const note = String(form.get("note") || "").trim() || null;

  const failHref = proProfileId
    ? `/pro/${proProfileId}?booking=missing`
    : "/prestataires";
  if (
    !proProfileId ||
    !serviceId ||
    !teamMemberId ||
    !startsAtStr ||
    !clientName ||
    !clientPhone
  ) {
    redirect(failHref);
  }

  const startsAt = new Date(startsAtStr);
  if (Number.isNaN(startsAt.getTime())) {
    redirect(`/pro/${proProfileId}?booking=date`);
  }

  const service = await prisma.service.findUnique({
    where: { id: serviceId },
    select: { id: true, name: true, durationMin: true, proProfileId: true },
  });
  if (!service || service.proProfileId !== proProfileId) {
    redirect(`/pro/${proProfileId}?booking=missing`);
  }

  const [proInfo, memberInfo] = await Promise.all([
    prisma.proProfile.findUnique({
      where: { id: proProfileId },
      select: { displayName: true, whatsapp: true },
    }),
    prisma.teamMember.findUnique({
      where: { id: teamMemberId },
      select: { displayName: true, proProfileId: true },
    }),
  ]);
  if (
    !proInfo ||
    !memberInfo ||
    memberInfo.proProfileId !== proProfileId
  ) {
    redirect(`/pro/${proProfileId}?booking=missing`);
  }

  // Concurrency-safe write: re-check availability and insert inside the same
  // serializable transaction so two clients racing on the same slot can never
  // both succeed. On serialization failure we retry once, then fail the user.
  let conflict = false;
  let serializationFailure = false;
  const attempt = async () => {
    try {
      await prisma.$transaction(
        async (tx) => {
          const free = await isSlotStillAvailable(
            { serviceId, teamMemberId, startsAt },
            tx,
          );
          if (!free) {
            conflict = true;
            return;
          }
          await tx.proBooking.create({
            data: {
              proProfileId,
              serviceId,
              teamMemberId,
              clientName,
              clientPhone,
              clientEmail,
              requestedAt: startsAt,
              durationMin: service.durationMin,
              note,
            },
          });
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
      );
    } catch (err) {
      // Postgres serialization_failure → retry signal
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        (err.code === "P2034" || err.code === "40001")
      ) {
        serializationFailure = true;
        return;
      }
      throw err;
    }
  };

  await attempt();
  if (serializationFailure) {
    serializationFailure = false;
    await attempt();
  }
  if (conflict || serializationFailure) {
    redirect(`/pro/${proProfileId}?booking=taken&serviceId=${serviceId}`);
  }

  if (clientEmail) {
    const emailTo = clientEmail;
    const emailArgs = {
      to: emailTo,
      clientName,
      proDisplayName: proInfo.displayName,
      proWhatsapp: proInfo.whatsapp,
      serviceName: service.name,
      teamMemberName: memberInfo.displayName,
      startsAt,
      durationMin: service.durationMin,
      proId: proProfileId,
    };
    after(async () => {
      try {
        await sendBookingRequestedEmail(emailArgs);
      } catch (e) {
        console.error("[booking] requested email failed:", e);
      }
    });
  }

  revalidatePath(`/pro/${proProfileId}`);
  revalidatePath("/dashboard/planning");
  redirect(`/pro/${proProfileId}?booking=requested`);
}
