"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { LuArrowRight, LuShoppingBag } from "react-icons/lu";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import ProductModal from "@/components/ProductModal";
import Footer from "@/components/Footer";
import Faqs from "@/components/Faqs";
import Cta from "@/components/Cta";
import Testimonials from "@/components/Testimonials";
import FloatingContact from "@/components/FloatingContact";
import { Toaster } from "@/components/ui/sonner";
import { Product } from "./data";
import { getProducts } from "@/app/utils/products";
import { useFavorites } from "@/app/hooks/useFavorites";
import { handleBuyNow } from "@/app/utils/checkout";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const { favorites, toggleFavorite } = useFavorites();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Initialize products
  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  // Get the latest top 6 products (using isNew and slicing to 6)
  const latestProducts = useMemo(() => {
    return products.filter((product) => product.isNew).slice(0, 6);
  }, [products]);

  return (
    <div className="animate-fade-in">
      <div className="min-h-screen bg-neutral-50 text-neutral-900 transition-colors duration-300 font-sans">
        {/* Navigation bar component */}
        <Navbar favoritesCount={favorites.length} />

        {/* Hero marketing banner component */}
        <Hero />

        {/* Latest Arrivals section */}
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-16">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600 border border-blue-200/20 mb-2 md:mb-3">
                <span>New Arrivals</span>
              </div>
              <h2 className="text-lg md:text-3xl font-semibold md:font-extrabold tracking-tight text-neutral-900 sm:text-4xl">
                Latest Arrivals
              </h2>
              <p className="mt-3 text-sm md:text-lg text-neutral-500 max-w-2xl">
                Discover our latest viral smart Chinese gadgets, daily
                life-saving utilities, and premium handcrafted jewellery.
              </p>
            </div>
            <Link
              href="/products"
              className="mt-6 sm:mt-0 inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-bold text-white hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/20 cursor-pointer self-start">
              <span>Explore All Products</span>
              <LuArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-y-4 sm:gap-y-10 gap-x-3.5 sm:gap-x-6 lg:grid-cols-3 xl:gap-x-8">
            {latestProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isFavorite={favorites.includes(product.id)}
                onToggleFavorite={toggleFavorite}
                onClick={() => setSelectedProduct(product)}
              />
            ))}
          </div>

          {/* Centered secondary CTA button */}
          <div className="mt-8 md:mt-16 text-center">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white hover:bg-neutral-100 px-8 py-4 text-base font-semibold text-neutral-700 transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-sm">
              <LuShoppingBag className="h-5 w-5 text-blue-600" />
              <span>View Full Catalog ({products.length} items)</span>
            </Link>
          </div>
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

        {/* Testimonials section */}
        <Testimonials />

        {/* FAQs section */}
        <Faqs />

        {/* Call to Action section */}
        {/* <Cta /> */}

        {/* Footer component */}
        <Footer />

        {/* Floating Call & WhatsApp Contact FAB */}
        <FloatingContact />

        {/* Shadcn Sonner Toaster */}
        <Toaster richColors position="bottom-right" />
      </div>
    </div>
  );
}
