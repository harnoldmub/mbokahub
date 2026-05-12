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

  let durationMin: number | null = null;
  let resolvedServiceId: string | null = null;

  if (serviceId) {
    const svc = await prisma.service.findFirst({
      where: { id: serviceId, proProfileId },
      select: { id: true, durationMin: true },
    });
    if (svc) {
      resolvedServiceId = svc.id;
      durationMin = svc.durationMin;
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
      serviceId: resolvedServiceId,
      durationMin,
    },
  });

  return NextResponse.json({ ok: true });
}
