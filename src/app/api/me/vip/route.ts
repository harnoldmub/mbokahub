import { NextResponse } from "next/server";

import { isCurrentUserVip, getOptionalDbUser } from "@/lib/auth-helpers";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const noStore = { "Cache-Control": "no-store, max-age=0" };

export async function GET() {
  const user = await getOptionalDbUser();
  if (!user) {
    return NextResponse.json(
      { isVip: false, vipUntil: null },
      { status: 401, headers: noStore },
    );
  }
  const isVip = await isCurrentUserVip();
  return NextResponse.json(
    {
      isVip,
      vipUntil: user.vipUntil ? user.vipUntil.toISOString() : null,
    },
    { headers: noStore },
  );
}
