"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LuPlus,
  LuPencil,
  LuTrash2,
  LuLogOut,
  LuSearch,
  LuStar,
  LuSparkles,
  LuTrendingUp,
  LuX,
  LuVideo,
  LuTags,
  LuLayers,
  LuDollarSign,
  LuUser,
  LuChevronDown,
  LuCheck,
  LuSlidersHorizontal
} from "react-icons/lu";
import { cn } from "@/app/utils/cn";
import { Toaster, toast } from "sonner";
import { Product } from "@/app/data";
import Logo from "@/components/Logo";

export default function DashboardPage() {
  const router = useRouter();
  
  // Auth state
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminUser, setAdminUser] = useState<{ name: string; email: string } | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);

  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  const sortLabels: Record<string, string> = {
    default: "Featured",
    "price-asc": "Price: Low to High",
    "price-desc": "Price: High to Low",
    rating: "Rating",
    reviews: "Reviews Count",
  };

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Form inputs state
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState<"Utilities" | "Jewellery" | "Dresses">("Utilities");
  const [formPrice, setFormPrice] = useState("");
  const [formRating, setFormRating] = useState("");
  const [formReviewsCount, setFormReviewsCount] = useState("");
  const [formVideo, setFormVideo] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formIsNew, setFormIsNew] = useState(false);
  const [formIsPopular, setFormIsPopular] = useState(false);

  // Verify authentication on mount
  useEffect(() => {
    async function verifyAuth() {
      try {
        const res = await fetch("/api/auth/session");
        const data = await res.json();
        if (data.authenticated && data.user) {
          setIsAdmin(true);
          setAdminUser(data.user);
          setCheckingSession(false);
          // Fetch products once authenticated
          fetchProducts();
        } else {
          router.push("/login");
        }
      } catch (err) {
        console.error("Auth check failed", err);
        router.push("/login");
      }
    }
    verifyAuth();
  }, [router]);

  // Fetch all products
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/products", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      } else {
        toast.error("Failed to load products database.");
      }
    } catch (err) {
      toast.error("Error loading products.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Open modal for Adding a new product
  const handleOpenAddModal = () => {
    setCurrentProduct(null);
    setFormName("");
    setFormCategory("Utilities");
    setFormPrice("");
    setFormRating("4.5");
    setFormReviewsCount("15");
    setFormVideo("");
    setFormDescription("");
    setFormIsNew(true);
    setFormIsPopular(false);
    setIsFormModalOpen(true);
  };

  // Open modal for Editing a product
  const handleOpenEditModal = (product: Product) => {
    setCurrentProduct(product);
    setFormName(product.name);
    setFormCategory(product.category);
    setFormPrice(product.price.toString());
    setFormRating(product.rating.toString());
    setFormReviewsCount(product.reviewsCount.toString());
    setFormVideo(product.video);
    setFormDescription(product.description);
    setFormIsNew(!!product.isNew);
    setFormIsPopular(!!product.isPopular);
    setIsFormModalOpen(true);
  };

  // Open Delete Confirmation
  const handleOpenDeleteModal = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  // Submit Add or Edit Form
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formName || !formCategory || !formPrice) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const priceNum = parseFloat(formPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      toast.error("Price must be a valid positive number.");
      return;
    }

    const ratingNum = parseFloat(formRating || "0");
    if (isNaN(ratingNum) || ratingNum < 0 || ratingNum > 5) {
      toast.error("Rating must be a number between 0 and 5.");
      return;
    }

    const reviewsNum = parseInt(formReviewsCount || "0", 10);
    if (isNaN(reviewsNum) || reviewsNum < 0) {
      toast.error("Reviews count must be a non-negative integer.");
      return;
    }

    const payload = {
      name: formName,
      category: formCategory,
      price: priceNum,
      rating: ratingNum,
      reviewsCount: reviewsNum,
      video: formVideo,
      description: formDescription,
      isNew: formIsNew,
      isPopular: formIsPopular,
    };

    const isEdit = !!currentProduct;
    const url = isEdit ? `/api/products/${currentProduct.id}` : "/api/products";
    const method = isEdit ? "PUT" : "POST";

    const toastId = toast.loading(isEdit ? "Updating product..." : "Creating product...");

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(isEdit ? "Product updated successfully!" : "Product created successfully!", { id: toastId });
        setIsFormModalOpen(false);
        fetchProducts(); // Refresh list
      } else {
        toast.error(data.error || "Operation failed", { id: toastId });
      }
    } catch (err) {
      toast.error("Connection failed.", { id: toastId });
      console.error(err);
    }
  };

  // Delete product
  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;

    const toastId = toast.loading("Deleting product...");
    try {
      const res = await fetch(`/api/products/${productToDelete.id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Product deleted successfully!", { id: toastId });
        setIsDeleteModalOpen(false);
        setProductToDelete(null);
        fetchProducts(); // Refresh list
      } else {
        toast.error(data.error || "Deletion failed.", { id: toastId });
      }
    } catch (err) {
      toast.error("Connection failed.", { id: toastId });
      console.error(err);
    }
  };

  // Logout admin
  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        toast.success("Logged out successfully.");
        router.push("/login");
      } else {
        toast.error("Logout failed.");
      }
    } catch (err) {
      toast.error("Error logging out.");
      console.error(err);
    }
  };

  // Compute stats
  const stats = useMemo(() => {
    const total = products.length;
    const newItems = products.filter((p) => p.isNew).length;
    const popularItems = products.filter((p) => p.isPopular).length;
    const utilitiesCount = products.filter((p) => p.category === "Utilities").length;
    const jewelleryCount = products.filter((p) => p.category === "Jewellery").length;
    const dressesCount = products.filter((p) => p.category === "Dresses").length;

    return { total, newItems, popularItems, utilitiesCount, jewelleryCount, dressesCount };
  }, [products]);

  // Filter & Sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (selectedCategory !== "All") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Sort products
    if (sortBy === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "reviews") {
      result.sort((a, b) => b.reviewsCount - a.reviewsCount);
    }

    return result;
  }, [products, searchQuery, selectedCategory, sortBy]);

  // Render spinner while checking authentication (Shadcn loading spinner styling)
  if (checkingSession) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-zinc-500 text-sm font-medium tracking-tight">Loading Portal...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950 font-sans pb-12 antialiased selection:bg-zinc-900 selection:text-white">
      <Toaster richColors position="top-right" theme="light" />

      {/* Main Navigation Header (Shadcn Style) */}
      <header className="border-b border-zinc-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo showText={false} className="scale-90" />
            <div className="h-4 w-[1px] bg-zinc-200"></div>
            <div>
              <h1 className="text-sm font-semibold tracking-tight text-zinc-900 leading-none">Admin Portal</h1>
              <span className="text-[10px] font-medium text-zinc-400 block mt-0.5 tracking-wider">dashboard</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-md bg-zinc-100 text-zinc-600 border border-zinc-200/50">
              <LuUser className="w-3.5 h-3.5 text-zinc-500" />
              <span className="text-xs font-semibold">{adminUser?.name || adminUser?.email}</span>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center rounded-md text-xs font-semibold border border-zinc-200 bg-white shadow-sm hover:bg-zinc-50 hover:text-red-650 h-8 px-3 transition-colors cursor-pointer"
            >
              <LuLogOut className="w-3.5 h-3.5 mr-1.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
              Products Database
            </h2>
            <p className="mt-1 text-sm text-zinc-550">
              Manage inventory metrics, list entries, edit and delete catalog products.
            </p>
          </div>
          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center justify-center rounded-md text-sm font-semibold bg-zinc-900 text-white shadow hover:bg-zinc-800 h-9 px-4 py-2 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            <LuPlus className="w-4 h-4 mr-2" />
            <span>Add New Product</span>
          </button>
        </div>

        {/* Statistical Cards Panel (Enhanced & User Friendly) */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Total Items Card */}
          <div className="rounded-xl border border-zinc-200 bg-white text-zinc-950 shadow-sm p-5 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 border-l-4 border-l-blue-500">
            <div className="flex items-center justify-between mb-2">
              <span className="text-zinc-550 text-xs font-bold">Total Items</span>
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                <LuLayers className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight text-zinc-900">{stats.total}</div>
            <p className="text-[10px] text-zinc-400 mt-1 font-medium">Active products in catalog</p>
          </div>

          {/* New Arrivals Card */}
          <div className="rounded-xl border border-zinc-200 bg-white text-zinc-950 shadow-sm p-5 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 border-l-4 border-l-emerald-500">
            <div className="flex items-center justify-between mb-2">
              <span className="text-zinc-550 text-xs font-bold">New Arrivals</span>
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                <LuSparkles className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight text-zinc-900">{stats.newItems}</div>
            <p className="text-[10px] text-emerald-600 mt-1 font-semibold">Flagged as New</p>
          </div>

          {/* Popular Picks Card */}
          <div className="rounded-xl border border-zinc-200 bg-white text-zinc-950 shadow-sm p-5 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 border-l-4 border-l-amber-500">
            <div className="flex items-center justify-between mb-2">
              <span className="text-zinc-550 text-xs font-bold">Popular Picks</span>
              <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
                <LuTrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight text-zinc-900">{stats.popularItems}</div>
            <p className="text-[10px] text-amber-600 mt-1 font-semibold">Flagged as Popular</p>
          </div>

          {/* Categories Card with Visual Progress Bars */}
          <div className="rounded-xl border border-zinc-200 bg-white text-zinc-950 shadow-sm p-5 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 border-l-4 border-l-indigo-500">
            <div className="flex items-center justify-between mb-2">
              <span className="text-zinc-550 text-xs font-bold">Categories</span>
              <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                <LuTags className="w-4 h-4" />
              </div>
            </div>
            
            <div className="space-y-2 mt-1">
              {/* Utilities progress */}
              <div className="space-y-0.5">
                <div className="flex items-center justify-between text-[10px] font-bold text-zinc-650">
                  <span>Utilities</span>
                  <span>{stats.utilitiesCount}</span>
                </div>
                <div className="w-full bg-zinc-100 h-1 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full animate-pulse-slow" style={{ width: `${(stats.utilitiesCount / (stats.total || 1)) * 100}%` }}></div>
                </div>
              </div>

              {/* Jewellery progress */}
              <div className="space-y-0.5">
                <div className="flex items-center justify-between text-[10px] font-bold text-zinc-650">
                  <span>Jewellery</span>
                  <span>{stats.jewelleryCount}</span>
                </div>
                <div className="w-full bg-zinc-100 h-1 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full animate-pulse-slow" style={{ width: `${(stats.jewelleryCount / (stats.total || 1)) * 100}%` }}></div>
                </div>
              </div>

              {/* Dresses progress */}
              <div className="space-y-0.5">
                <div className="flex items-center justify-between text-[10px] font-bold text-zinc-650">
                  <span>Dresses</span>
                  <span>{stats.dressesCount}</span>
                </div>
                <div className="w-full bg-zinc-100 h-1 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full rounded-full animate-pulse-slow" style={{ width: `${(stats.dressesCount / (stats.total || 1)) * 100}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Filter and Search Panel (Shadcn Style) */}
        <section className="bg-white border border-zinc-200 rounded-xl p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
          {/* Search bar */}
          <div className="relative w-full md:max-w-xs">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-400">
              <LuSearch className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search product database..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex h-9 w-full rounded-md border border-zinc-200 bg-white px-3 py-1 pl-9 text-sm shadow-sm transition-colors placeholder:text-zinc-405 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          {/* Filtering controls */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Category selection tabs (Homepage Pill Style) */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none w-full sm:w-auto">
              {["All", "Utilities", "Jewellery", "Dresses"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "flex-shrink-0 px-4 py-2 text-xs font-semibold rounded-full border transition-all cursor-pointer",
                    selectedCategory === cat
                      ? "bg-zinc-900 text-white border-zinc-900 shadow-sm"
                      : "bg-white text-zinc-600 border-zinc-200"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Sorting Dropdown (Homepage Custom Style) */}
            <div className="relative w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                className="flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50 transition-all w-full sm:w-auto justify-between cursor-pointer h-9"
              >
                <span className="flex items-center gap-1.5">
                  <LuSlidersHorizontal className="h-3.5 w-3.5 text-blue-500" />
                  Sort:{" "}
                  <span className="text-zinc-900 font-bold">
                    {sortLabels[sortBy] || "Featured"}
                  </span>
                </span>
                <LuChevronDown
                  className={cn(
                    "h-3.5 w-3.5 text-zinc-500 transition-transform duration-200",
                    isSortDropdownOpen && "rotate-180"
                  )}
                />
              </button>

              <AnimatePresence>
                {isSortDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsSortDropdownOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-56 origin-top-right rounded-2xl border border-zinc-200 bg-white p-2 shadow-xl z-50 focus:outline-none"
                    >
                      {Object.entries(sortLabels).map(([key, label]) => (
                        <button
                          type="button"
                          key={key}
                          onClick={() => {
                            setSortBy(key);
                            setIsSortDropdownOpen(false);
                          }}
                          className={cn(
                            "flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-colors cursor-pointer",
                            sortBy === key
                              ? "bg-blue-500 text-white"
                              : "text-zinc-700 hover:bg-zinc-100"
                          )}
                        >
                          {label}
                          {sortBy === key && <LuCheck className="h-3.5 w-3.5" />}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* Database List Table (Shadcn Table Style) */}
        <section className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
          {isLoading ? (
            <div className="py-20 text-center">
              <div className="w-6 h-6 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <span className="text-zinc-500 text-xs font-medium">Fetching catalog items...</span>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-16 text-center">
              <div className="text-zinc-400 text-sm mb-2 font-medium">No matching products found.</div>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
                className="text-xs text-zinc-900 hover:underline font-semibold cursor-pointer"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              {/* Desktop Modern Table View (Visible only on sm screens and larger) */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full caption-bottom text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-200 bg-zinc-50/50 text-[10px] font-bold text-zinc-500">
                      <th className="h-10 px-6 align-middle text-left font-semibold">Product Details</th>
                      <th className="h-10 px-6 align-middle text-left font-semibold hidden md:table-cell">Category</th>
                      <th className="h-10 px-6 align-middle text-right font-semibold">Price</th>
                      <th className="h-10 px-6 align-middle text-left font-semibold hidden lg:table-cell">Rating</th>
                      <th className="h-10 px-6 align-middle text-left font-semibold hidden xl:table-cell">Status</th>
                      <th className="h-10 px-6 align-middle text-center font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 text-zinc-650">
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="border-b border-zinc-200 transition-colors hover:bg-zinc-50/40">
                        <td className="px-6 py-4 align-middle">
                          <div>
                            <div className="font-bold text-zinc-900 leading-normal">{product.name}</div>
                            <div className="text-xs text-zinc-400 mt-1 max-w-md line-clamp-1">
                              {product.description || "No description provided."}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 align-middle hidden md:table-cell">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-zinc-100 border border-zinc-205 text-zinc-600">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 align-middle text-right font-extrabold text-zinc-900">
                          ${product.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 align-middle hidden lg:table-cell">
                          <div className="flex items-center gap-1">
                            <LuStar className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span className="font-bold text-zinc-800">{product.rating.toFixed(1)}</span>
                            <span className="text-[11px] text-zinc-400 font-medium">({product.reviewsCount})</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 align-middle hidden xl:table-cell">
                          <div className="flex gap-2">
                            {product.isNew && (
                              <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-emerald-50 border border-emerald-200 text-emerald-600">
                                New
                              </span>
                            )}
                            {product.isPopular && (
                              <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-amber-50 border border-amber-250 text-amber-600">
                                Popular
                              </span>
                            )}
                            {!product.isNew && !product.isPopular && (
                              <span className="text-xs text-zinc-300 font-bold">—</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 align-middle">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleOpenEditModal(product)}
                              title="Edit Product"
                              className="inline-flex items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 h-8 w-8 transition-colors cursor-pointer"
                            >
                              <LuPencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleOpenDeleteModal(product)}
                              title="Delete Product"
                              className="inline-flex items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-500 hover:text-red-650 hover:bg-red-50 h-8 w-8 transition-colors cursor-pointer"
                            >
                              <LuTrash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Modern Card List View (Visible only on mobile screens) */}
              <div className="sm:hidden flex flex-col gap-3 p-4 bg-zinc-50/50">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    {/* Header line: Name and Category badge */}
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <div>
                        <h4 className="font-bold text-zinc-900 text-sm leading-snug">{product.name}</h4>
                        <span className="inline-flex items-center px-2 py-0.5 mt-1 rounded-md text-[10px] font-semibold bg-zinc-100 border border-zinc-200/50 text-zinc-655">
                          {product.category}
                        </span>
                      </div>
                      <div className="text-sm font-extrabold text-zinc-900">${product.price.toFixed(2)}</div>
                    </div>

                    {/* Description line */}
                    {product.description && (
                      <p className="text-xs text-zinc-500 line-clamp-2 mb-3 leading-relaxed">
                        {product.description}
                      </p>
                    )}

                    {/* Bottom row: Badges and Action buttons */}
                    <div className="flex flex-col gap-3 pt-3 border-t border-zinc-100 mt-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center gap-0.5 text-zinc-700 text-xs font-bold bg-zinc-50 border border-zinc-200 px-2 py-0.5 rounded">
                          <LuStar className="w-3 h-3 fill-amber-400 text-amber-450 animate-pulse-slow" />
                          <span>{product.rating.toFixed(1)}</span>
                          <span className="text-[10px] text-zinc-400 font-medium ml-0.5">({product.reviewsCount})</span>
                        </div>

                        {product.isNew && (
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-50 border border-emerald-250 text-emerald-600">
                            New
                          </span>
                        )}
                        {product.isPopular && (
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-50 border border-amber-250 text-amber-600">
                            Popular
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 w-full pt-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(product)}
                          className="flex-1 inline-flex items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-650 hover:text-zinc-900 hover:bg-zinc-50 h-8 text-xs font-semibold transition-colors cursor-pointer"
                        >
                          <LuPencil className="w-3.5 h-3.5 mr-1" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenDeleteModal(product)}
                          className="flex-1 inline-flex items-center justify-center rounded-md border border-red-100 bg-red-50/50 text-red-650 hover:bg-red-50 h-8 text-xs font-semibold transition-colors cursor-pointer"
                        >
                          <LuTrash2 className="w-3.5 h-3.5 mr-1" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      </main>

      {/* Forms Modal (Add/Edit) (Shadcn Dialog Style) */}
      <AnimatePresence>
        {isFormModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFormModalOpen(false)}
              className="absolute inset-0 bg-zinc-950/20 backdrop-blur-xs"
            ></motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 5 }}
              className="bg-white border border-zinc-200 w-full max-w-lg rounded-lg overflow-hidden shadow-lg relative z-10 flex flex-col max-h-[90vh]"
            >
              <div className="px-6 pt-6 pb-4 flex flex-col space-y-1.5 relative">
                <h3 className="text-lg font-semibold leading-none tracking-tight text-zinc-900">
                  {currentProduct ? "Edit Product Details" : "Create New Product"}
                </h3>
                <p className="text-xs text-zinc-400">
                  Modify the product parameters in your database catalog.
                </p>
                <button
                  onClick={() => setIsFormModalOpen(false)}
                  className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 transition-opacity hover:bg-zinc-100 p-1 cursor-pointer"
                >
                  <LuX className="w-4 h-4 text-zinc-500" />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto px-6 pb-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-semibold tracking-tight text-zinc-500">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="e.g. Premium Silk Scarf"
                      className="flex h-9 w-full rounded-md border border-zinc-200 bg-white px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950"
                    />
                  </div>

                  {/* Category */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold tracking-tight text-zinc-500">
                      Category *
                    </label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value as any)}
                      className="flex h-9 w-full items-center justify-between rounded-md border border-zinc-200 bg-white px-3 py-1 text-xs font-semibold text-zinc-700 shadow-sm focus:outline-none focus:ring-1 focus:ring-zinc-950 cursor-pointer"
                    >
                      <option value="Utilities">Utilities</option>
                      <option value="Jewellery">Jewellery</option>
                      <option value="Dresses">Dresses</option>
                    </select>
                  </div>

                  {/* Price */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold tracking-tight text-zinc-500">
                      Price ($) *
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-450">
                        <LuDollarSign className="w-3.5 h-3.5" />
                      </span>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={formPrice}
                        onChange={(e) => setFormPrice(e.target.value)}
                        placeholder="29.99"
                        className="flex h-9 w-full rounded-md border border-zinc-200 bg-white px-3 py-1 pl-8 text-sm shadow-sm transition-colors placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950"
                      />
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold tracking-tight text-zinc-500">
                      Initial Rating (0-5)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      value={formRating}
                      onChange={(e) => setFormRating(e.target.value)}
                      placeholder="4.5"
                      className="flex h-9 w-full rounded-md border border-zinc-200 bg-white px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950"
                    />
                  </div>

                  {/* Reviews Count */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold tracking-tight text-zinc-500">
                      Initial Reviews
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formReviewsCount}
                      onChange={(e) => setFormReviewsCount(e.target.value)}
                      placeholder="15"
                      className="flex h-9 w-full rounded-md border border-zinc-200 bg-white px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950"
                    />
                  </div>

                  {/* Video URL */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-semibold tracking-tight text-zinc-500">
                      Video Resource URL
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-450">
                        <LuVideo className="w-3.5 h-3.5" />
                      </span>
                      <input
                        type="text"
                        value={formVideo}
                        onChange={(e) => setFormVideo(e.target.value)}
                        placeholder="e.g. /videos/utilities/01.mp4"
                        className="flex h-9 w-full rounded-md border border-zinc-200 bg-white px-3 py-1 pl-8 text-sm shadow-sm transition-colors placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-semibold tracking-tight text-zinc-500">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      placeholder="Describe this product catalog entry..."
                      className="flex w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 resize-none"
                    ></textarea>
                  </div>

                  {/* Checkbox Flags */}
                  <div className="flex gap-6 sm:col-span-2 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={formIsNew}
                        onChange={(e) => setFormIsNew(e.target.checked)}
                        className="w-4 h-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-950 bg-white"
                      />
                      <span className="text-xs font-semibold text-zinc-650">Mark as New Arrival</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={formIsPopular}
                        onChange={(e) => setFormIsPopular(e.target.checked)}
                        className="w-4 h-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-950 bg-white"
                      />
                      <span className="text-xs font-semibold text-zinc-650">Mark as Popular Pick</span>
                    </label>
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-150 flex flex-col-reverse sm:flex-row justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsFormModalOpen(false)}
                    className="w-full sm:w-auto inline-flex items-center justify-center rounded-md text-xs font-semibold border border-zinc-200 bg-white hover:bg-zinc-50 h-8 px-4 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-full sm:w-auto inline-flex items-center justify-center rounded-md text-xs font-semibold bg-zinc-900 text-white hover:bg-zinc-800 h-8 px-4 transition-colors cursor-pointer shadow-sm"
                  >
                    {currentProduct ? "Save Changes" : "Create Product"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal (Shadcn Alert Dialog Style) */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDeleteModalOpen(false)}
              className="absolute inset-0 bg-zinc-950/20 backdrop-blur-xs"
            ></motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              className="bg-white border border-zinc-200 w-full max-w-sm rounded-lg p-5 shadow-lg relative z-10"
            >
              <h3 className="font-semibold text-base text-zinc-900 mb-2.5 flex items-center gap-2">
                <LuTrash2 className="text-red-650 w-4.5 h-4.5" />
                <span>Delete Catalog Entry?</span>
              </h3>
              <p className="text-zinc-500 text-xs leading-relaxed mb-6 font-medium">
                Are you sure you want to permanently delete <span className="font-semibold text-zinc-800">"{productToDelete?.name}"</span>? This action is permanent and cannot be undone.
              </p>

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setProductToDelete(null);
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center rounded-md text-xs font-semibold border border-zinc-200 bg-white hover:bg-zinc-50 h-8 px-4 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  className="w-full sm:w-auto inline-flex items-center justify-center rounded-md text-xs font-semibold bg-red-600 hover:bg-red-50 text-white h-8 px-4 transition-colors cursor-pointer shadow-sm"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
