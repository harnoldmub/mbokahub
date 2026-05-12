import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

import { isAdminEmail } from "@/lib/admin";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress;
  if (!email || !(await isAdminEmail(email))) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const { id } = await params;
  const pro = await prisma.proProfile.findUnique({
    where: { id },
    select: {
      id: true,
      displayName: true,
      user: { select: { email: true } },
    },
  });
  if (!pro) return NextResponse.json({ error: "not-found" }, { status: 404 });
  return NextResponse.json(
    {
      id: pro.id,
      displayName: pro.displayName,
      ownerEmail: pro.user.email,
    },
    { headers: { "cache-control": "no-store" } },
  );
}
