import { NextResponse } from "next/server";
import { getSessionUser } from "@/app/utils/auth";

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ authenticated: false, user: null });
    }
    return NextResponse.json({ authenticated: true, user });
  } catch (error: any) {
    console.error("Session API error:", error);
    return NextResponse.json({ authenticated: false, error: error.message }, { status: 500 });
  }
}
