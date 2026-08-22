"use client";

import { motion } from "framer-motion";
import { LuHeart, LuStar, LuArrowRight } from "react-icons/lu";
import { Product } from "@/app/data";
import { cn } from "@/app/utils/cn";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  product: Product;
  isFavorite: boolean;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onClick: () => void;
}

export default function ProductCard({
  product,
  isFavorite,
  onToggleFavorite,
  onClick,
}: ProductCardProps) {
  return (
    <motion.div
      layoutId={`card-${product.id}`}
      onClick={onClick}
      className="group inflected-card flex flex-col justify-between border border-neutral-200/50 bg-white p-2.5 sm:p-3 hover:shadow-lg hover:shadow-blue-950/5 cursor-pointer transition-all duration-300"
      style={{ contentVisibility: "auto" }}>
      {/* Badges indicators */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1 font-sans">
        {[
          product.isNew && { text: "NEW", className: "bg-blue-600" },
          product.isPopular && {
            text: "BESTSELLER",
            className: "bg-amber-500",
          },
        ]
          .filter(
            (badge): badge is { text: string; className: string } => !!badge,
          )
          .map((badge, idx) => (
            <Badge
              key={idx}
              className={cn(
                "px-2 py-0.5 text-[9px] md:text-[10px] font-bold text-white shadow-sm rounded-full tracking-wider border-0 h-auto",
                badge.className
              )}
            >
              {badge.text}
            </Badge>
          ))}
      </div>

      {/* Heart Favourites Toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => onToggleFavorite(product.id, e)}
        className="absolute top-3 right-3 z-10 flex h-8 w-8 md:h-9 md:w-9 items-center justify-center rounded-full bg-white/85 border border-neutral-200/50 text-neutral-500 hover:text-neutral-900 shadow-sm hover:scale-110 active:scale-95 transition-all backdrop-blur-md cursor-pointer">
        <LuHeart
          className={cn(
            "h-4 w-4 md:h-4.5 md:w-4.5 transition-colors",
            isFavorite ? "fill-red-500 text-red-500" : "text-neutral-500",
          )}
        />
      </Button>

      {/* Thumbnail Area - Inflected style */}
      <div className="inflected-card-inner aspect-video md:aspect-square w-full">
        <div className="inflected-box">
          <div className="inflected-img-box">
            <video
              src={`${product.video}#t=0.1`}
              preload="metadata"
              playsInline
              muted
              className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="mt-2 md:mt-3 flex flex-1 flex-col px-1 pb-0.5 justify-between font-sans">
        <div>
          <span className="text-[10px] md:text-xs font-bold text-blue-500">
            {product.category}
          </span>
          <h3 className="mt-0.5 text-sm md:text-base font-bold text-neutral-900 group-hover:text-blue-600 transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* Review Stats */}
          <div className="mt-1 flex items-center gap-1">
            <LuStar className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="text-[10px] md:text-xs font-bold text-neutral-700">
              {product.rating}
            </span>
            <span className="text-[10px] md:text-xs text-neutral-400">
              ({product.reviewsCount} reviews)
            </span>
          </div>
        </div>

        {/* Footer Area with Price */}
        <div className="mt-2.5 md:mt-3 flex items-center justify-between border-t border-neutral-100 pt-2">
          <span className="text-base md:text-lg font-extrabold text-neutral-900">
            ₹{product.price.toFixed(2)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

