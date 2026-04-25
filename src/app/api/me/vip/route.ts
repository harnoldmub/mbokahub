import { NextResponse } from "next/server";

import { isAdminEmail } from "@/lib/admin";
import { isCurrentUserVip, getOptionalDbUser } from "@/lib/auth-helpers";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const noStore = { "Cache-Control": "no-store, max-age=0" };

export async function GET() {
  const user = await getOptionalDbUser();
  if (!user) {
    return NextResponse.json(
      { isVip: false, isAdmin: false, vipUntil: null },
      { status: 401, headers: noStore },
    );
  }
  const isVip = await isCurrentUserVip();
  const isAdmin = user.role === "ADMIN" || (await isAdminEmail(user.email));
  return NextResponse.json(
    {
      isVip,
      isAdmin,
      vipUntil: user.vipUntil ? user.vipUntil.toISOString() : null,
    },
    { headers: noStore },
  );
}
