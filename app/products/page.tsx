"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { LuSearch, LuChevronLeft, LuChevronRight } from "react-icons/lu";
import Navbar from "@/components/Navbar";
import FilterBar from "@/components/FilterBar";
import ProductCard from "@/components/ProductCard";
import ProductModal from "@/components/ProductModal";
import Footer from "@/components/Footer";
import FloatingContact from "@/components/FloatingContact";
import { Toaster } from "sonner";
import { Product } from "../data";
import { getProducts } from "@/app/utils/products";
import { cn } from "@/app/utils/cn";
import { useFavorites } from "@/app/hooks/useFavorites";
import { handleBuyNow } from "@/app/utils/checkout";

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("default");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { favorites, toggleFavorite } = useFavorites();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 36;

  // Initialize selectedCategory from searchParams when it loads
  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  // Initialize products
  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  const categories = ["All", "Utilities", "Jewellery", "Dresses"];

  const sortLabels: Record<string, string> = {
    default: "Featured",
    "price-asc": "Price: Low to High",
    "price-desc": "Price: High to Low",
    rating: "Highest Rating",
    reviews: "Most Reviewed",
  };

  // Filter & Sort products using memoization and standard array methods
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const matchesCategory =
          selectedCategory === "All" || product.category === selectedCategory;
        const matchesSearch =
          product.name
            .toLowerCase()
            .includes(searchQuery.trim().toLowerCase()) ||
          product.description
            .toLowerCase()
            .includes(searchQuery.trim().toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        if (sortBy === "rating") return b.rating - a.rating;
        if (sortBy === "reviews") return b.reviewsCount - a.reviewsCount;
        return 0;
      });
  }, [selectedCategory, sortBy, searchQuery, products]);

  // Reset pagination to first page when search filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery, sortBy]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const getPageNumbers = () => {
    if (totalPages <= 4) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    return [1, 2, "...", totalPages - 1, totalPages];
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 transition-colors duration-300 font-sans flex flex-col animate-fade-in">
      {/* Navigation bar component */}
      <Navbar
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
        favoritesCount={favorites.length}
      />

      {/* Hero Header */}
      <section className="relative overflow-hidden pt-6 pb-0 sm:pt-16 sm:pb-8">
        <div className="absolute inset-0 -z-10 flex items-center justify-center opacity-25 blur-3xl">
          <div className="h-72 w-72 rounded-full bg-sky-300 animate-pulse" />
          <div className="h-96 w-96 rounded-full bg-blue-600 ml-12 animate-bounce duration-10000" />
        </div>
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center justify-center">
          <h1 className="text-lg font-semibold md:font-extrabold tracking-tight sm:text-5xl bg-gradient-to-r from-zinc-900 via-blue-950 to-blue-800 bg-clip-text text-transparent">
            Explore All Products
          </h1>
          <p className="mt-1 md:mt-2 max-w-xl text-sm md:text-lg text-zinc-500 mx-auto">
            Browse our curated collection of useful smart Chinese imports,
            innovative daily utilities, and premium handcrafted jewellery.
          </p>
        </div>
      </section>

      {/* Filter and sorting control bar component */}
      <FilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortLabels={sortLabels}
      />

      {/* Product Grid listing */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 md:py-8 flex-grow w-full">
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400 mb-4">
              <LuSearch className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900">
              No products found
            </h3>
            <p className="mt-1 text-sm text-zinc-500 max-w-xs">
              We couldn&apos;t find any premium products matching &quot;
              {searchQuery.trim()}&quot; in category {selectedCategory}.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
                setSortBy("default");
              }}
              className="mt-4 rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500 transition-colors cursor-pointer">
              Reset all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-y-6 md:gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {paginatedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isFavorite={favorites.includes(product.id)}
                onToggleFavorite={toggleFavorite}
                onClick={() => setSelectedProduct(product)}
              />
            ))}
          </div>
        )}

        {/* Pagination Controls bar */}
        {totalPages > 1 && (
          <div className="mt-6 md:mt-12 flex flex-col items-center justify-center gap-4 border-t border-zinc-200/50 pt-6 md:pt-8 font-sans">
            <div className="flex items-center gap-2">
              {/* Prev Page */}
              <button
                disabled={currentPage === 1}
                onClick={() => {
                  setCurrentPage((prev) => Math.max(prev - 1, 1));
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="h-9 w-9 flex items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-500 transition-all cursor-pointer hover:bg-zinc-50 disabled:opacity-40 disabled:pointer-events-none active:scale-95"
                title="Previous Page">
                <LuChevronLeft className="h-4.5 w-4.5" />
              </button>

              {/* Number Buttons */}
              <div className="hidden sm:flex items-center gap-1.5">
                {getPageNumbers().map((page, idx) => {
                  if (page === "...") {
                    return (
                      <span
                        key={`ellipsis-${idx}`}
                        className="px-2 text-zinc-400 font-bold select-none">
                        ...
                      </span>
                    );
                  }
                  return (
                    <button
                      key={page}
                      onClick={() => {
                        setCurrentPage(page as number);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className={cn(
                        "h-9 w-9 text-xs font-bold rounded-full transition-all cursor-pointer",
                        currentPage === page
                          ? "bg-blue-600 text-white shadow-md shadow-blue-600/20 scale-105"
                          : "border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50",
                      )}>
                      {page}
                    </button>
                  );
                })}
              </div>

              {/* Next Page */}
              <button
                disabled={currentPage === totalPages}
                onClick={() => {
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="h-9 w-9 flex items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-500 transition-all cursor-pointer hover:bg-zinc-50 disabled:opacity-40 disabled:pointer-events-none active:scale-95"
                title="Next Page">
                <LuChevronRight className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Pagination stats status text */}
            <span className="text-xs text-zinc-400 font-medium">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} -{" "}
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)}{" "}
              of {filteredProducts.length} items
            </span>
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

      {/* Floating Call & WhatsApp Contact FAB */}
      <FloatingContact />

      {/* Shadcn Sonner Toaster */}
      <Toaster richColors position="bottom-right" theme="light" />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-zinc-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      }>
      <ProductsContent />
    </Suspense>
  );
}
