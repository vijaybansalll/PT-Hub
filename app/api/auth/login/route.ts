import { NextResponse } from "next/server";
import { createSession } from "@/app/utils/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    const staticEmail = (process.env.ADMIN_EMAIL || "ptmanager@gmail.com")
      .toLowerCase()
      .trim();
    const staticPassword = process.env.ADMIN_PASSWORD || "manager@123";

    if (
      email.toLowerCase().trim() === staticEmail &&
      password === staticPassword
    ) {
      // Create session cookie in MongoDB
      await createSession("static_admin_user");

      return NextResponse.json({
        success: true,
        user: {
          id: "static_admin_user",
          email: staticEmail,
          name: "Administrator",
        },
      });
    }

    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 },
    );
  } catch (error: any) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred" },
      { status: 500 },
    );
  }
}
