import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Boost checkout not implemented yet" },
    { status: 501 },
  );
}
