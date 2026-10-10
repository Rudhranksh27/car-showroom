import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "../../../lib/auth";

export async function GET() {
  try {
    const user = await getAuthenticatedUser();
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ error: "Unable to read the current session" }, { status: 500 });
  }
}
