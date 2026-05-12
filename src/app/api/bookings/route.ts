import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function POST(req: NextRequest) {
  const form = await req.formData();

  const proProfileId = String(form.get("proProfileId") ?? "").trim();
  const clientName = String(form.get("clientName") ?? "").trim();
  const clientPhone = String(form.get("clientPhone") ?? "").trim();
  const clientEmail = String(form.get("clientEmail") ?? "").trim() || null;
  const requestedAtRaw = String(form.get("requestedAt") ?? "").trim();
  const note = String(form.get("note") ?? "").trim() || null;
  const serviceId = String(form.get("serviceId") ?? "").trim() || null;

  if (!proProfileId || !clientName || !clientPhone || !requestedAtRaw) {
    return NextResponse.json({ error: "Champs obligatoires manquants." }, { status: 400 });
  }

  const pro = await prisma.proProfile.findUnique({
    where: { id: proProfileId },
    select: { id: true },
  });
  if (!pro) {
    return NextResponse.json({ error: "Prestataire introuvable." }, { status: 404 });
  }

  const requestedAt = new Date(requestedAtRaw);
  if (Number.isNaN(requestedAt.getTime())) {
    return NextResponse.json({ error: "Date invalide." }, { status: 400 });
  }

  let serviceName: string | null = null;
  let durationMinutes: number | null = null;

  if (serviceId) {
    const svc = await prisma.proService.findUnique({
      where: { id: serviceId },
      select: { name: true, durationMinutes: true },
    });
    if (svc) {
      serviceName = svc.name;
      durationMinutes = svc.durationMinutes;
    }
  }

  await prisma.proBooking.create({
    data: {
      proProfileId,
      clientName,
      clientPhone,
      clientEmail,
      requestedAt,
      note,
      serviceId,
      serviceName,
      durationMinutes,
    },
  });

  return NextResponse.json({ ok: true });
}
