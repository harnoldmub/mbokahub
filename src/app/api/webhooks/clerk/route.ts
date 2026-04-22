import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Clerk webhook not implemented yet" },
    { status: 501 },
  );
}
