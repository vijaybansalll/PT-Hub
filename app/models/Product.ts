import mongoose, { Schema, Model } from "mongoose";

export interface IProduct {
  id: string;
  name: string;
  category: "Utilities" | "Jewellery" | "Dresses";
  price: number;
  rating: number;
  reviewsCount: number;
  video: string;
  description: string;
  isNew?: boolean;
  isPopular?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}


const ProductSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    category: { type: String, required: true, enum: ["Utilities", "Jewellery", "Dresses"] },
    price: { type: Number, required: true },
    rating: { type: Number, default: 0 },
    reviewsCount: { type: Number, default: 0 },
    video: { type: String, default: "" },
    description: { type: String, default: "" },
    isNew: { type: Boolean, default: false },
    isPopular: { type: Boolean, default: false },
  },
  { timestamps: true, suppressReservedKeysWarning: true }
);

export const ProductModel: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);
