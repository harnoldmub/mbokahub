import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/db/prisma";

export async function POST(req: NextRequest) {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { targetId?: string; targetType?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { targetId, targetType } = body;
  if (!targetId || !targetType) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  if (targetType !== "TRAJET" && targetType !== "PRO_PROFILE") {
    return NextResponse.json({ error: "Invalid targetType" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { clerkId },
    select: { id: true },
  });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const existing = await prisma.unlockedContact.findUnique({
    where: {
      userId_targetId_targetType: {
        userId: user.id,
        targetId,
        targetType,
      },
    },
  });
  if (existing) {
    return NextResponse.json({ success: true });
  }

  const totalUnlocks = await prisma.unlockedContact.count({
    where: { userId: user.id },
  });
  if (totalUnlocks > 0) {
    return NextResponse.json(
      { error: "Offre découverte déjà utilisée" },
      { status: 403 },
    );
  }

  await prisma.unlockedContact.create({
    data: { userId: user.id, targetId, targetType },
  });

  return NextResponse.json({ success: true });
}
