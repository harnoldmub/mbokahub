import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ unread: 0 }, { headers: { "cache-control": "no-store" } });
  }
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { id: true },
  });
  if (!user) {
    return NextResponse.json({ unread: 0 }, { headers: { "cache-control": "no-store" } });
  }
  const [asClient, asPro] = await Promise.all([
    prisma.conversation.aggregate({
      where: { clientId: user.id },
      _sum: { clientUnread: true },
    }),
    prisma.conversation.aggregate({
      where: { proId: user.id },
      _sum: { proUnread: true },
    }),
  ]);
  const unread =
    (asClient._sum.clientUnread ?? 0) + (asPro._sum.proUnread ?? 0);
  return NextResponse.json(
    { unread },
    { headers: { "cache-control": "no-store" } },
  );
}
