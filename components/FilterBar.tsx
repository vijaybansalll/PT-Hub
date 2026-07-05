"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LuSearch, LuSlidersHorizontal, LuChevronDown, LuCheck } from "react-icons/lu";
import { cn } from "@/app/utils/cn";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Product } from "@/app/data";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from "@/components/ui/combobox";

interface FilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  categories: string[];
  sortBy: string;
  setSortBy: (sort: string) => void;
  sortLabels: Record<string, string>;
  products?: Product[];
}

export default function FilterBar({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  categories,
  sortBy,
  setSortBy,
  sortLabels,
  products = [],
}: FilterBarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-y border-neutral-200/50 py-5">
        {/* Category selection (Mobile only) */}
        <div className="flex md:hidden items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none w-full">
          <Tabs
            value={selectedCategory}
            onValueChange={setSelectedCategory}
            className="w-full"
          >
            <TabsList className="bg-neutral-100 p-0.5 rounded-full border border-neutral-200 flex gap-0.5 w-fit">
              {categories.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className={cn(
                    "px-4 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer",
                    selectedCategory === category
                      ? "bg-neutral-900 text-white shadow-sm"
                      : "text-neutral-650 hover:text-neutral-900"
                  )}
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Search Input field (Combobox Autocomplete) */}
        <Combobox
          value={searchQuery.trim() === "" ? "" : searchQuery}
          onValueChange={(val) => setSearchQuery(val || " ")}
        >
          <div className="relative flex-1 max-w-md">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 z-10">
              <LuSearch className="h-4.5 w-4.5 text-neutral-400" />
            </div>
            <ComboboxInput
              placeholder="Search premium products..."
              value={searchQuery.trim() === "" ? "" : searchQuery}
              onChange={(e) => setSearchQuery(e.target.value || " ")}
              className="pl-10 pr-10 py-2.5 rounded-full h-10 text-sm bg-white placeholder-neutral-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 w-full"
              showTrigger={false}
              showClear={searchQuery.trim() !== ""}
            />
            {products.length > 0 && (
              <ComboboxContent className="bg-white border border-neutral-200 shadow-md rounded-lg mt-1 w-full max-h-60 overflow-y-auto">
                <ComboboxList>
                  {products
                    .filter((p) =>
                      p.name.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
                      p.description.toLowerCase().includes(searchQuery.trim().toLowerCase())
                    )
                    .slice(0, 5)
                    .map((product) => (
                      <ComboboxItem
                        key={product.id}
                        value={product.name}
                        className="cursor-pointer text-neutral-700 hover:bg-neutral-50"
                      >
                        {product.name}
                      </ComboboxItem>
                    ))}
                  {products.filter((p) =>
                    p.name.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
                    p.description.toLowerCase().includes(searchQuery.trim().toLowerCase())
                  ).length === 0 && (
                    <ComboboxEmpty className="py-2 text-center text-neutral-400 text-xs">No matching products</ComboboxEmpty>
                  )}
                </ComboboxList>
              </ComboboxContent>
            )}
          </div>
        </Combobox>

        {/* Sorting Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-700 shadow-sm hover:bg-neutral-50 transition-all w-full sm:w-auto justify-between cursor-pointer">
            <span className="flex items-center gap-1.5">
              <LuSlidersHorizontal className="h-4 w-4 text-blue-500" />
              Sort:{" "}
              <span className="text-neutral-900">
                {sortLabels[sortBy] || "Featured"}
              </span>
            </span>
            <LuChevronDown
              className={cn("h-4 w-4 text-neutral-500 transition-transform duration-200", isDropdownOpen && "rotate-180")}
            />
          </button>

          <AnimatePresence>
            {isDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsDropdownOpen(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-56 origin-top-right rounded-2xl border border-neutral-200 bg-white p-2 shadow-xl ring-1 ring-black/5 z-50 focus:outline-none">
                  {Object.entries(sortLabels).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => {
                        setSortBy(key);
                        setIsDropdownOpen(false);
                      }}
                      className={cn(
                        "flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-medium transition-colors cursor-pointer",
                        sortBy === key
                          ? "bg-blue-500 text-white"
                          : "text-neutral-700 hover:bg-neutral-100"
                      )}>
                      {label}
                      {sortBy === key && <LuCheck className="h-4 w-4" />}
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
