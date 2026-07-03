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
  LuEye
} from "react-icons/lu";
import { Toaster, toast } from "sonner";
import { Product } from "@/app/data";

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

  // Render spinner while checking authentication
  if (checkingSession) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-zinc-400 text-sm font-medium">Verifying Credentials...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-indigo-500 selection:text-white pb-12">
      <Toaster richColors position="top-right" theme="dark" />

      {/* Background radial highlight */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-indigo-600/5 blur-[150px] pointer-events-none"></div>

      {/* Main Navigation Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/60 backdrop-blur-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white font-bold tracking-wider shadow-md shadow-indigo-500/20">
              PT
            </div>
            <div>
              <h1 className="text-base font-semibold leading-none text-zinc-100">PT Hub Portal</h1>
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">Administrator</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-800 border border-zinc-700/50">
              <LuUser className="w-4 h-4 text-indigo-400" />
              <span className="text-xs text-zinc-300 font-medium">
                {adminUser?.name || adminUser?.email}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-800 hover:border-red-500/40 hover:bg-red-500/10 text-xs text-zinc-400 hover:text-red-400 transition-all duration-200 cursor-pointer"
            >
              <LuLogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Products Database
            </h2>
            <p className="mt-1.5 text-sm text-zinc-400">
              Monitor inventory stats, create, update and delete products live.
            </p>
          </div>
          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-3 text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-lg shadow-indigo-600/15"
          >
            <LuPlus className="w-4.5 h-4.5" />
            <span>Add New Product</span>
          </button>
        </div>

        {/* Statistical Cards Panel */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between text-zinc-400 text-xs uppercase font-semibold tracking-wider mb-2">
              <span>Total Items</span>
              <LuLayers className="text-indigo-400 w-4.5 h-4.5" />
            </div>
            <div className="text-3xl font-extrabold text-white">{stats.total}</div>
            <div className="text-[10px] text-zinc-500 mt-1 font-mono">Products in Catalog</div>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between text-zinc-400 text-xs uppercase font-semibold tracking-wider mb-2">
              <span>New Arrivals</span>
              <LuSparkles className="text-emerald-400 w-4.5 h-4.5" />
            </div>
            <div className="text-3xl font-extrabold text-white">{stats.newItems}</div>
            <div className="text-[10px] text-emerald-400/80 mt-1 font-mono">Flagged as New</div>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between text-zinc-400 text-xs uppercase font-semibold tracking-wider mb-2">
              <span>Popular Picks</span>
              <LuTrendingUp className="text-amber-400 w-4.5 h-4.5" />
            </div>
            <div className="text-3xl font-extrabold text-white">{stats.popularItems}</div>
            <div className="text-[10px] text-amber-400/80 mt-1 font-mono">Flagged as Popular</div>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between text-zinc-400 text-xs uppercase font-semibold tracking-wider mb-2">
              <span>Categories</span>
              <LuTags className="text-blue-400 w-4.5 h-4.5" />
            </div>
            <div className="flex items-end gap-3">
              <div>
                <span className="text-sm font-bold text-white">{stats.utilitiesCount}</span>
                <span className="text-[10px] text-zinc-500 block">Util</span>
              </div>
              <div className="h-6 w-[1px] bg-zinc-800 self-center"></div>
              <div>
                <span className="text-sm font-bold text-white">{stats.jewelleryCount}</span>
                <span className="text-[10px] text-zinc-500 block">Jewel</span>
              </div>
              <div className="h-6 w-[1px] bg-zinc-800 self-center"></div>
              <div>
                <span className="text-sm font-bold text-white">{stats.dressesCount}</span>
                <span className="text-[10px] text-zinc-500 block">Dress</span>
              </div>
            </div>
          </div>
        </section>

        {/* Filter and Search Panel */}
        <section className="bg-zinc-900/30 border border-zinc-800/60 rounded-2xl p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search bar */}
          <div className="relative w-full md:max-w-xs">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500">
              <LuSearch className="w-4.5 h-4.5" />
            </span>
            <input
              type="text"
              placeholder="Search product database..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-950/80 border border-zinc-850 text-white rounded-xl py-2 pl-9.5 pr-4 text-sm placeholder-zinc-500 focus:outline-none focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/80 transition-all"
            />
          </div>

          {/* Filtering controls */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Category selection tabs */}
            <div className="flex bg-zinc-950 border border-zinc-850 p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
              {["All", "Utilities", "Jewellery", "Dresses"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer whitespace-nowrap ${
                    selectedCategory === cat
                      ? "bg-indigo-650 text-white shadow-md shadow-indigo-600/10"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-900/60"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-zinc-950 border border-zinc-850 text-xs font-semibold text-zinc-300 rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500 cursor-pointer w-full sm:w-auto"
            >
              <option value="default">Sort by: Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Sort by: Rating</option>
              <option value="reviews">Sort by: Reviews</option>
            </select>
          </div>
        </section>

        {/* Database List Table */}
        <section className="bg-zinc-900/20 border border-zinc-800/80 rounded-2xl overflow-hidden shadow-xl">
          {isLoading ? (
            <div className="py-24 text-center">
              <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <span className="text-zinc-500 text-sm font-medium">Fetching catalog items...</span>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-20 text-center">
              <div className="text-zinc-600 mb-2">No matching products found.</div>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
                className="text-xs text-indigo-400 hover:text-indigo-300 underline font-semibold cursor-pointer"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-900/40 text-xs uppercase font-bold tracking-wider text-zinc-400">
                    <th className="px-6 py-4">Product Details</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4 text-right">Price</th>
                    <th className="px-6 py-4">Rating</th>
                    <th className="px-6 py-4">Status Flags</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800 text-sm text-zinc-300">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-zinc-900/10 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-semibold text-zinc-100">{product.name}</div>
                          <div className="text-xs text-zinc-500 mt-1 max-w-sm truncate">
                            {product.description || "No description provided."}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-zinc-800 border border-zinc-700/50 text-zinc-300">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-semibold text-zinc-100">
                        ${product.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <LuStar className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{product.rating.toFixed(1)}</span>
                          <span className="text-xs text-zinc-500">({product.reviewsCount})</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {product.isNew && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                              New
                            </span>
                          )}
                          {product.isPopular && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 border border-amber-500/20 text-amber-400">
                              Popular
                            </span>
                          )}
                          {!product.isNew && !product.isPopular && (
                            <span className="text-xs text-zinc-650">—</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenEditModal(product)}
                            title="Edit Product"
                            className="p-2 rounded-lg bg-zinc-800 hover:bg-indigo-650 hover:text-white text-zinc-400 transition-colors cursor-pointer"
                          >
                            <LuPencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenDeleteModal(product)}
                            title="Delete Product"
                            className="p-2 rounded-lg bg-zinc-800 hover:bg-red-650 hover:text-white text-zinc-400 transition-colors cursor-pointer"
                          >
                            <LuTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      {/* Forms Modal (Add/Edit) */}
      <AnimatePresence>
        {isFormModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFormModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            ></motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-zinc-900 border border-zinc-800 w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl relative z-10 flex flex-col max-h-[90vh]"
            >
              <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
                <h3 className="font-bold text-lg text-white">
                  {currentProduct ? "Edit Product Details" : "Create New Product"}
                </h3>
                <button
                  onClick={() => setIsFormModalOpen(false)}
                  className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  <LuX className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="e.g. Premium Silk Scarf"
                      className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                  </div>

                  {/* Category */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                      Category *
                    </label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value as any)}
                      className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer"
                    >
                      <option value="Utilities">Utilities</option>
                      <option value="Jewellery">Jewellery</option>
                      <option value="Dresses">Dresses</option>
                    </select>
                  </div>

                  {/* Price */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                      Price ($) *
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500">
                        <LuDollarSign className="w-4 h-4" />
                      </span>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={formPrice}
                        onChange={(e) => setFormPrice(e.target.value)}
                        placeholder="29.99"
                        className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl py-2.5 pl-8 pr-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                      />
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
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
                      className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                  </div>

                  {/* Reviews Count */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                      Initial Reviews Count
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formReviewsCount}
                      onChange={(e) => setFormReviewsCount(e.target.value)}
                      placeholder="15"
                      className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                  </div>

                  {/* Video URL */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                      Video Resource URL
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500">
                        <LuVideo className="w-4 h-4" />
                      </span>
                      <input
                        type="text"
                        value={formVideo}
                        onChange={(e) => setFormVideo(e.target.value)}
                        placeholder="e.g. /videos/utilities/01.mp4 or online URL"
                        className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl py-2.5 pl-8 pr-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      placeholder="Describe this product catalog entry..."
                      className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none"
                    ></textarea>
                  </div>

                  {/* Checkbox Flags */}
                  <div className="flex gap-6 sm:col-span-2 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={formIsNew}
                        onChange={(e) => setFormIsNew(e.target.checked)}
                        className="w-4.5 h-4.5 rounded text-indigo-600 bg-zinc-950 border-zinc-800 focus:ring-indigo-500"
                      />
                      <span className="text-sm font-semibold text-zinc-300">Mark as New Arrival</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={formIsPopular}
                        onChange={(e) => setFormIsPopular(e.target.checked)}
                        className="w-4.5 h-4.5 rounded text-indigo-600 bg-zinc-950 border-zinc-800 focus:ring-indigo-500"
                      />
                      <span className="text-sm font-semibold text-zinc-300">Mark as Popular Pick</span>
                    </label>
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-800 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsFormModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-zinc-800 hover:bg-zinc-800 text-zinc-300 font-semibold text-sm transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-indigo-650 hover:bg-indigo-600 text-white font-semibold text-sm transition-all cursor-pointer shadow-md shadow-indigo-650/15"
                  >
                    {currentProduct ? "Save Changes" : "Create Product"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDeleteModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            ></motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-zinc-905 border border-zinc-800 w-full max-w-md rounded-2xl p-6 shadow-2xl relative z-10"
            >
              <h3 className="font-bold text-lg text-white mb-2 flex items-center gap-2">
                <LuTrash2 className="text-red-500" />
                <span>Delete Product?</span>
              </h3>
              <p className="text-zinc-400 text-sm mb-6">
                Are you sure you want to delete <span className="font-semibold text-zinc-200">"{productToDelete?.name}"</span>? This action is permanent and cannot be undone.
              </p>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setProductToDelete(null);
                  }}
                  className="px-4 py-2 rounded-xl border border-zinc-800 hover:bg-zinc-800 text-zinc-300 font-semibold text-sm transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  className="px-5 py-2 rounded-xl bg-red-650 hover:bg-red-650/90 text-white font-semibold text-sm transition-all cursor-pointer shadow-md shadow-red-650/15"
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
