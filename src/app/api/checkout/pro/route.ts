import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Pro checkout not implemented yet" },
    { status: 501 },
  );
}
