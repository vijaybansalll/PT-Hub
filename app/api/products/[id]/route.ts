import { NextResponse } from "next/server";
import { connectDB } from "@/app/utils/db";
import { ProductModel } from "@/app/models/Product";
import { checkSession } from "@/app/utils/auth";

type Params = Promise<{ id: string }>;

// PUT /api/products/[id] - Update a product (Protected)
export async function PUT(
  request: Request,
  segmentData: { params: Params }
) {
  try {
    const isAuthed = await checkSession();
    if (!isAuthed) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const params = await segmentData.params;
    const { id } = params;
    const body = await request.json();
    const { name, category, price, rating, reviewsCount, video, description, isNew, isPopular } = body;
    
    if (!name || !category || price === undefined) {
      return NextResponse.json({ error: "Name, category, and price are required" }, { status: 400 });
    }
    
    await connectDB();
    
    // Find product by custom string id
    const product = await ProductModel.findOne({ id });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    
    product.name = name;
    product.category = category;
    product.price = Number(price);
    product.rating = Number(rating || 0);
    product.reviewsCount = Number(reviewsCount || 0);
    product.video = video || "";
    product.description = description || "";
    product.isNew = !!isNew;
    product.isPopular = !!isPopular;
    
    await product.save();
    
    return NextResponse.json(product);
  } catch (error: any) {
    console.error(`PUT /api/products/ error:`, error);
    return NextResponse.json({ error: error.message || "Failed to update product" }, { status: 500 });
  }
}

// DELETE /api/products/[id] - Delete a product (Protected)
export async function DELETE(
  request: Request,
  segmentData: { params: Params }
) {
  try {
    const isAuthed = await checkSession();
    if (!isAuthed) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const params = await segmentData.params;
    const { id } = params;
    
    await connectDB();
    
    const product = await ProductModel.findOne({ id });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    
    await ProductModel.deleteOne({ id });
    
    return NextResponse.json({ message: "Product deleted successfully", id });
  } catch (error: any) {
    console.error(`DELETE /api/products/ error:`, error);
    return NextResponse.json({ error: error.message || "Failed to delete product" }, { status: 500 });
  }
}
