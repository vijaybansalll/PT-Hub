import { NextResponse } from "next/server";
import { connectDB } from "@/app/utils/db";
import { ProductModel } from "@/app/models/Product";
import { checkSession } from "@/app/utils/auth";

// GET /api/products - Get all products
export async function GET() {
  try {
    await connectDB();
    const products = await ProductModel.find({}).lean();
    
    // Map internal mongo fields to frontend Product fields if needed
    const formattedProducts = products.map((p: any) => ({
      id: p.id || p._id.toString(),
      name: p.name || "",
      category: p.category || "Utilities",
      price: p.price || 0,
      rating: p.rating || 0,
      reviewsCount: p.reviewsCount || 0,
      video: p.video || "",
      description: p.description || "",
      isNew: p.isNew ?? false,
      isPopular: p.isPopular ?? false,
    }));
    
    return NextResponse.json(formattedProducts);
  } catch (error: any) {
    console.error("GET /api/products error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch products" }, { status: 500 });
  }
}

// POST /api/products - Create a new product (Protected)
export async function POST(request: Request) {
  try {
    const isAuthed = await checkSession();
    if (!isAuthed) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const body = await request.json();
    const { name, category, price, rating, reviewsCount, video, description, isNew, isPopular } = body;
    
    if (!name || !category || price === undefined) {
      return NextResponse.json({ error: "Name, category, and price are required" }, { status: 400 });
    }
    
    await connectDB();
    
    // Generate a unique string ID for consistency with static structure
    const randomId = "prod_" + Math.random().toString(36).substring(2, 11);
    
    const newProduct = await ProductModel.create({
      id: randomId,
      name,
      category,
      price: Number(price),
      rating: Number(rating || 0),
      reviewsCount: Number(reviewsCount || 0),
      video: video || "",
      description: description || "",
      isNew: !!isNew,
      isPopular: !!isPopular,
    });
    
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/products error:", error);
    return NextResponse.json({ error: error.message || "Failed to create product" }, { status: 500 });
  }
}
