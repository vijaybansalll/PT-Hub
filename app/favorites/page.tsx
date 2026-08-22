"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { LuArrowLeft, LuHeart, LuShoppingBag } from "react-icons/lu";
import { Toaster } from "@/components/ui/sonner";
import { Product } from "../data";
import { getProducts } from "@/app/utils/products";
import { useFavorites } from "@/app/hooks/useFavorites";
import { handleBuyNow } from "@/app/utils/checkout";
import ProductCard from "@/components/ProductCard";
import ProductModal from "@/components/ProductModal";
import Footer from "@/components/Footer";

export default function FavoritesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const { favorites, toggleFavorite } = useFavorites();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Initialize products
  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  // Close modal if the currently selected product is removed from favorites
  useEffect(() => {
    if (selectedProduct && !favorites.includes(selectedProduct.id)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedProduct(null);
    }
  }, [favorites, selectedProduct]);

  // Filter products that are in the favorites list
  const favoriteProducts = useMemo(() => {
    return products.filter((product) => favorites.includes(product.id));
  }, [favorites, products]);

  return (
    <div className="animate-fade-in">
      <div className="min-h-screen bg-neutral-50 text-neutral-900 transition-colors duration-300 font-sans">
        {/* Navigation Header */}
        <header className="sticky top-0 z-40 w-full border-b border-neutral-200/50 bg-white/70 backdrop-blur-xl transition-colors duration-300">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200/50 bg-white hover:bg-neutral-100 transition-colors cursor-pointer"
                title="Back to Shop">
                <LuArrowLeft className="h-5 w-5 text-neutral-600" />
              </Link>
              <span className="bg-gradient-to-r from-neutral-900 to-neutral-600 bg-clip-text text-lg font-bold tracking-tight text-transparent">
                Favourites Collection
              </span>
            </div>
          </div>
        </header>

        {/* Hero Title */}
        <section className="relative overflow-hidden pt-6 pb-0 sm:pt-16 sm:pb-8">
          <div className="absolute inset-0 -z-10 flex items-center justify-center opacity-25 blur-3xl">
            <div className="h-72 w-72 rounded-full bg-sky-300 animate-pulse" />
            <div className="h-96 w-96 rounded-full bg-blue-600 ml-12 animate-bounce duration-10000" />
          </div>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center sm:text-left">
            <h1 className="text-lg font-semibold md:font-extrabold tracking-tight sm:text-5xl bg-gradient-to-r from-neutral-900 via-blue-950 to-blue-800 bg-clip-text text-transparent">
              Your Loved Items
            </h1>
            <p className="mt-1 md:mt-2 max-w-xl text-sm md:text-lg text-neutral-500">
              Manage your personal favorites collection here. Click any card to
              explore further options or proceed to purchase.
            </p>
          </div>
        </section>

        {/* Favorite Products Listing */}
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {favoriteProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 md:py-24 text-center border-2 border-dashed border-neutral-200 rounded-3xl p-4 md:p-12 bg-white/30 backdrop-blur-sm">
              <div className="flex size-10 md:size-16 items-center justify-center rounded-full bg-blue-100/50 text-blue-500 mb-6 relative">
                <LuHeart className="size-6 md:size-8 fill-blue-500/20 animate-pulse" />
                <div className="absolute inset-0 rounded-full border border-blue-500/30 animate-ping" />
              </div>
              <h3 className="text-base md:text-xl font-semibold md:font-bold text-neutral-900">
                Your list is looking empty
              </h3>
              <p className="mt-2 text-xs md:text-sm text-neutral-500 max-w-sm">
                Add items to your favorites while shopping and they will appear
                here.
              </p>
              <Link
                href="/products"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-bold text-white hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/30 cursor-pointer">
                <LuShoppingBag className="h-4.5 w-4.5" />
                Explore Shop
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-y-4 sm:gap-y-10 gap-x-3.5 sm:gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
              {favoriteProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isFavorite={true}
                  onToggleFavorite={toggleFavorite}
                  onClick={() => setSelectedProduct(product)}
                />
              ))}
            </div>
          )}
        </main>

        {/* Media-rich layout-animated details popup modal component */}
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          isFavorite={
            selectedProduct ? favorites.includes(selectedProduct.id) : false
          }
          onToggleFavorite={() =>
            selectedProduct && toggleFavorite(selectedProduct.id)
          }
          onBuyNow={() => {
            if (selectedProduct) {
              handleBuyNow(selectedProduct, () => setSelectedProduct(null));
            }
          }}
        />

        {/* Footer component */}
        <Footer />

        {/* Shadcn Sonner Toaster */}
        <Toaster richColors position="bottom-right" />
      </div>
    </div>
  );
}
