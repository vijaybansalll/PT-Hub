"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LuShoppingBag, LuHeart, LuUser } from "react-icons/lu";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import Logo from "./Logo";
import { cn } from "@/app/utils/cn";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface NavbarProps {
  selectedCategory?: string;
  setSelectedCategory?: (category: string) => void;
  categories?: string[];
  favoritesCount: number;
}

const DEFAULT_CATEGORIES = ["All", "Utilities", "Jewellery", "Dresses"];

export default function Navbar({
  selectedCategory = "All",
  setSelectedCategory,
  categories = DEFAULT_CATEGORIES,
  favoritesCount,
}: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/session");
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated) {
            setIsLoggedIn(true);
          }
        }
      } catch (err) {
        console.error("Failed to check auth status in navbar:", err);
      }
    }
    checkAuth();
  }, []);


  const handleCategoryClick = (category: string) => {
    if (pathname === "/products") {
      if (setSelectedCategory) {
        setSelectedCategory(category);
      }
    } else {
      router.push(`/products?category=${encodeURIComponent(category)}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200/50 bg-white/70 backdrop-blur-xl transition-colors duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Logo />

        {/* Category Navigation (Desktop) */}
        <Tabs
          value={selectedCategory}
          onValueChange={handleCategoryClick}
          className="hidden md:flex">
          <TabsList className="bg-neutral-100/80 p-0.5 rounded-full border border-neutral-200/35 flex gap-0.5">
            {categories.map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                className={cn(
                  "px-4 py-1.5 text-sm font-medium rounded-full cursor-pointer transition-all",
                  selectedCategory === category
                    ? "bg-white text-blue-600 font-semibold shadow-sm"
                    : "text-neutral-600 hover:text-neutral-900",
                )}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Action Controls */}
        <div className="flex items-center gap-4">
          {/* Favorites Button */}
          <Link
            href="/favorites"
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white hover:bg-neutral-100 transition-colors cursor-pointer"
            title="View Favorites">
            <LuHeart
              className={cn(
                "h-5 w-5",
                favoritesCount > 0
                  ? "fill-red-500 text-red-500"
                  : "text-neutral-500",
              )}
            />
            {favoritesCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white shadow-sm shadow-blue-600/30 animate-pulse">
                {favoritesCount}
              </span>
            )}
          </Link>

          {/* User Dashboard Button (visible if logged in) */}
          {isLoggedIn && (
            <Link
              href="/dashboard"
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white hover:bg-neutral-100 hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-sm"
              title="Go to Dashboard">
              <LuUser className="h-5 w-5 text-neutral-500 hover:text-blue-600 transition-colors" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
