import { NextResponse } from "next/server";
import { deleteSession } from "@/app/utils/auth";

export async function POST() {
  try {
    await deleteSession();
    return NextResponse.json({ success: true, message: "Logged out successfully" });
  } catch (error: any) {
    console.error("Logout API error:", error);
    return NextResponse.json({ error: error.message || "An unexpected error occurred" }, { status: 500 });
  }
}
