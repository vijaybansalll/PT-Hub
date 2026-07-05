import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { checkSession } from "@/app/utils/auth";

// Configure Cloudinary backend SDK
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    // 1. Authorize session
    const isAuthed = await checkSession();
    if (!isAuthed) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Generate Cloudinary signature for client-side direct upload
    const timestamp = Math.round(new Date().getTime() / 1000);
    const folder = "pt-hub-videos";

    // Cloudinary signature parameters (must be sorted alphabetically for signing)
    const paramsToSign = {
      folder,
      timestamp,
    };

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET!
    );

    return NextResponse.json({
      signature,
      timestamp,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      folder,
    });
  } catch (error: any) {
    console.error("Cloudinary signature generation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate upload signature" },
      { status: 500 }
    );
  }
}
