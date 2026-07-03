import { Product } from "@/app/data";

export async function getProducts(): Promise<Product[]> {
  if (typeof window === "undefined") {
    // Server-Side Execution (SSR or Build)
    try {
      const { connectDB } = await import("@/app/utils/db");
      await connectDB();
      const { ProductModel } = await import("@/app/models/Product");
      const products = await ProductModel.find({}).lean();
      
      return products.map((p: any) => ({
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
      })) as Product[];
    } catch (error) {
      console.error("Error retrieving products from Mongoose during SSR", error);
      return [];
    }
  } else {
    // Client-Side Execution (Browser)
    try {
      const res = await fetch("/api/products", { cache: "no-store" });
      if (!res.ok) {
        throw new Error("Failed to fetch products from API");
      }
      return await res.json();
    } catch (error) {
      console.error("Error fetching products from API, returning empty list", error);
      return [];
    }
  }
}
