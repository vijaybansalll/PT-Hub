"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

import {
  LuPlus,
  LuPencil,
  LuTrash2,
  LuLogOut,
  LuSearch,
  LuStar,
  LuSparkles,
  LuTrendingUp,
  LuVideo,
  LuTags,
  LuLayers,
  LuUser,
  LuSlidersHorizontal,
  LuIndianRupee,
} from "react-icons/lu";
import { cn } from "@/app/utils/cn";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/app/data";
import Logo from "@/components/Logo";
import StatCard from "@/components/StatCard";
import FormInput from "@/components/FormInput";
import VideoUploadInput from "@/components/input-12";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from "@/components/ui/combobox";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function DashboardPage() {
  const router = useRouter();

  // Auth state
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminUser, setAdminUser] = useState<{
    name: string;
    email: string;
  } | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);

  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");

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
  const [formCategory, setFormCategory] = useState<
    "Utilities" | "Jewellery" | "Dresses"
  >("Utilities");
  const [formPrice, setFormPrice] = useState("");
  const [formRating, setFormRating] = useState("");
  const [formReviewsCount, setFormReviewsCount] = useState("");
  const [formVideo, setFormVideo] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formIsNew, setFormIsNew] = useState(false);
  const [formIsPopular, setFormIsPopular] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);

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

    const toastId = toast.loading(
      isEdit ? "Updating product..." : "Creating product...",
    );

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(
          isEdit
            ? "Product updated successfully!"
            : "Product created successfully!",
          { id: toastId },
        );
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
    const utilitiesCount = products.filter(
      (p) => p.category === "Utilities",
    ).length;
    const jewelleryCount = products.filter(
      (p) => p.category === "Jewellery",
    ).length;
    const dressesCount = products.filter(
      (p) => p.category === "Dresses",
    ).length;

    return {
      total,
      newItems,
      popularItems,
      utilitiesCount,
      jewelleryCount,
      dressesCount,
    };
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
          p.description.toLowerCase().includes(query),
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

  // Reusable configuration arrays for mapping UI components
  const statCardsConfig = useMemo(
    () => [
      {
        id: "total",
        title: "Total Items",
        value: stats.total,
        subtitle: "Active products in catalog",
        icon: <LuLayers className="size-6" />,
        borderColor: "border-l-blue-500",
        iconBg: "bg-blue-50",
        iconColor: "text-blue-600",
      },
      {
        id: "new",
        title: "New Arrivals",
        value: stats.newItems,
        subtitle: "Flagged as New",
        icon: <LuSparkles className="size-6" />,
        borderColor: "border-l-emerald-500",
        iconBg: "bg-emerald-50",
        iconColor: "text-emerald-600",
        subtitleColor: "text-emerald-600 font-semibold",
      },
      {
        id: "popular",
        title: "Popular Picks",
        value: stats.popularItems,
        subtitle: "Flagged as Popular",
        icon: <LuTrendingUp className="size-6" />,
        borderColor: "border-l-amber-500",
        iconBg: "bg-amber-50",
        iconColor: "text-amber-600",
        subtitleColor: "text-amber-600 font-semibold",
      },
    ],
    [stats],
  );

  const formFields = [
    {
      id: "name",
      label: "Product Name *",
      type: "text",
      placeholder: "e.g. Premium Silk Scarf",
      value: formName,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setFormName(e.target.value),
      required: true,
      span: "",
    },
    {
      id: "price",
      label: "Price*",
      type: "number",
      step: "0.01",
      placeholder: "29.99",
      value: formPrice,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setFormPrice(e.target.value),
      required: true,
      icon: <LuIndianRupee className="w-3.5 h-3.5" />,
    },
    {
      id: "rating",
      label: "Initial Rating (0-5)",
      type: "number",
      step: "0.1",
      min: "0",
      max: "5",
      placeholder: "4.5",
      value: formRating,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setFormRating(e.target.value),
    },
    {
      id: "reviewsCount",
      label: "Initial Reviews",
      type: "number",
      min: "0",
      placeholder: "15",
      value: formReviewsCount,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setFormReviewsCount(e.target.value),
    },
    {
      id: "video",
      label: "Video Resource URL",
      type: "text",
      placeholder: "e.g. /videos/utilities/01.mp4",
      value: formVideo,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setFormVideo(e.target.value),
      icon: <LuVideo className="w-3.5 h-3.5" />,
      span: "",
    },
  ];

  // Render spinner while checking authentication (Shadcn loading spinner styling)
  if (checkingSession) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-neutral-500 text-sm font-medium tracking-tight">
            Loading Portal...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] text-neutral-900 font-sans antialiased md:pb-12 selection:bg-neutral-900 selection:text-white">
      <Toaster richColors position="top-right" />
      {/* Main Navigation Header (Shadcn Style) */}
      <header className="border-b border-neutral-200 bg-white/95 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <Logo className="scale-90" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-100/80 text-neutral-650 border border-neutral-200/50">
              <LuUser className="w-3.5 h-3.5 text-neutral-500" />
              <span className="text-xs font-semibold">
                {adminUser?.name || adminUser?.email}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="hover:text-red-600 hover:bg-red-50/50 transition-all cursor-pointer h-9 rounded-lg">
              <LuLogOut className="w-3.5 h-3.5 mr-1.5" />
              <span>Log Out</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <h2 className="text-xl md:text-3xl font-semibold md:font-bold tracking-tight text-neutral-900">
              Products Database
            </h2>
            <p className="text-xs md:text-sm text-neutral-550">
              Manage your products database inventory metrics, entry details,
              and categories.
            </p>
          </div>
          <Button
            onClick={handleOpenAddModal}
            className="inline-flex items-center justify-center rounded-lg text-sm font-semibold bg-neutral-900 text-white shadow-sm hover:bg-neutral-800 h-9 px-4 py-2 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer">
            <LuPlus className="w-4 h-4 mr-2" />
            <span>Add New Product</span>
          </Button>
        </div>

        {/* Statistical Cards Panel */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-5">
          {statCardsConfig.map((card) => (
            <StatCard key={card.id} {...card} />
          ))}
        </div>

        {/* Filter and Search Panel (Shadcn Style) */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          {/* Search bar (Combobox Autocomplete) */}
          <Combobox
            value={searchQuery}
            onValueChange={(val) => setSearchQuery(val || "")}>
            <div className="relative w-full md:w-72">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-neutral-400 z-10 pointer-events-none">
                <LuSearch className="w-4 h-4" />
              </span>
              <ComboboxInput
                placeholder="Filter products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 h-9 placeholder:text-neutral-400 focus-visible:ring-1 focus-visible:ring-neutral-950 border border-neutral-200 rounded-lg bg-white text-sm"
                showTrigger={false}
              />
              <ComboboxContent className="bg-white border border-neutral-200 shadow-md rounded-lg mt-1 w-full max-h-60 overflow-y-auto">
                <ComboboxList>
                  {products
                    .filter(
                      (p) =>
                        p.name
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase()) ||
                        p.description
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase()),
                    )
                    .slice(0, 5)
                    .map((product) => (
                      <ComboboxItem
                        key={product.id}
                        value={product.name}
                        className="cursor-pointer text-neutral-700 hover:bg-neutral-50 py-1.5 px-3 text-xs">
                        {product.name}
                      </ComboboxItem>
                    ))}
                  {products.filter(
                    (p) =>
                      p.name
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                      p.description
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()),
                  ).length === 0 && (
                    <ComboboxEmpty className="py-2 text-center text-neutral-400 text-xs">
                      No matching products
                    </ComboboxEmpty>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </div>
          </Combobox>

          {/* Filtering controls */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Category selection dropdown */}
            <Select
              value={selectedCategory}
              onValueChange={(val) => setSelectedCategory(val || "All")}>
              <SelectTrigger className="w-full sm:w-auto h-9 bg-white text-neutral-700 border-neutral-200 text-xs font-semibold rounded-full px-4 flex items-center justify-between gap-2 cursor-pointer shadow-sm hover:bg-neutral-50 transition-all">
                <span className="flex items-center gap-1.5">
                  <LuLayers className="h-3.5 w-3.5 text-neutral-500" />
                  <span>Category: </span>
                  <SelectValue placeholder="All" />
                </span>
              </SelectTrigger>
              <SelectContent className="bg-white border border-neutral-200 text-neutral-700 text-xs font-semibold rounded-xl shadow-md">
                {["All", "Utilities", "Jewellery", "Dresses"].map((cat) => (
                  <SelectItem key={cat} value={cat} className="cursor-pointer">
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sorting Dropdown */}
            <Select
              value={sortBy}
              onValueChange={(val) => setSortBy(val || "default")}>
              <SelectTrigger className="w-full sm:w-auto h-9 bg-white text-neutral-700 border-neutral-200 text-xs font-semibold rounded-full px-4 flex items-center justify-between gap-2 cursor-pointer shadow-sm hover:bg-neutral-50 transition-all">
                <span className="flex items-center gap-1.5">
                  <LuSlidersHorizontal className="h-3.5 w-3.5 text-blue-500" />
                  <span>Sort: </span>
                  <SelectValue placeholder="Featured" />
                </span>
              </SelectTrigger>
              <SelectContent className="bg-white border border-neutral-200 text-neutral-700 text-xs font-semibold rounded-xl shadow-md">
                {Object.entries(sortLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key} className="cursor-pointer">
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Database List Table (Shadcn Table Style) */}
        <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden shadow-xs">
          {isLoading ? (
            <div className="p-6 space-y-4">
              <Skeleton className="h-8 w-full bg-neutral-200/80" />
              <Skeleton className="h-8 w-full bg-neutral-200/80" />
              <Skeleton className="h-8 w-full bg-neutral-200/80" />
              <Skeleton className="h-8 w-full bg-neutral-200/80" />
              <Skeleton className="h-8 w-full bg-neutral-200/80" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-8 md:py-16 text-center">
              <div className="text-neutral-400 text-sm mb-2 font-medium">
                No matching products found.
              </div>
              <Button
                variant="link"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
                className="text-xs text-neutral-900 font-semibold cursor-pointer">
                Clear all filters
              </Button>
            </div>
          ) : (
            <>
              {/* Desktop Modern Table View (Visible only on sm screens and larger) */}
              <div className="hidden sm:block">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-neutral-200 hover:bg-transparent text-[11px] font-bold text-neutral-500 bg-neutral-55/10">
                      <TableHead className="h-10 px-6 align-middle text-left font-semibold text-neutral-500">
                        Product Details
                      </TableHead>
                      <TableHead className="h-10 px-6 align-middle text-left font-semibold text-neutral-500 hidden md:table-cell">
                        Category
                      </TableHead>
                      <TableHead className="h-10 px-6 align-middle text-right font-semibold text-neutral-500">
                        Price
                      </TableHead>
                      <TableHead className="h-10 px-6 align-middle text-left font-semibold text-neutral-500 hidden lg:table-cell">
                        Rating
                      </TableHead>
                      <TableHead className="h-10 px-6 align-middle text-left font-semibold text-neutral-500 hidden xl:table-cell">
                        Status
                      </TableHead>
                      <TableHead className="h-10 px-6 align-middle text-center font-semibold text-neutral-500">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-neutral-100 text-neutral-650">
                    {filteredProducts.map((product) => (
                      <TableRow
                        key={product.id}
                        className="border-b border-neutral-200 transition-colors hover:bg-neutral-50/40">
                        <TableCell className="px-6 py-4 align-middle whitespace-normal">
                          <div>
                            <div className="font-bold text-neutral-900 leading-normal">
                              {product.name}
                            </div>
                            <div className="text-xs text-neutral-400 mt-1 max-w-md line-clamp-1">
                              {product.description ||
                                "No description provided."}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4 align-middle hidden md:table-cell">
                          <Badge
                            variant="secondary"
                            className="px-2 py-0.5 text-[11px] font-semibold text-neutral-600 bg-neutral-100 border border-neutral-200 h-auto rounded-md">
                            {product.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-6 py-4 align-middle text-right font-extrabold text-neutral-900">
                          ₹{product.price.toFixed(2)}
                        </TableCell>
                        <TableCell className="px-6 py-4 align-middle hidden lg:table-cell">
                          <div className="flex items-center gap-1">
                            <LuStar className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span className="font-bold text-neutral-800">
                              {product.rating.toFixed(1)}
                            </span>
                            <span className="text-[11px] text-neutral-400 font-medium">
                              ({product.reviewsCount})
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4 align-middle hidden xl:table-cell">
                          <div className="flex gap-2">
                            {product.isNew && (
                              <Badge className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-emerald-50 border border-emerald-200 text-emerald-600 h-auto">
                                New
                              </Badge>
                            )}
                            {product.isPopular && (
                              <Badge className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-amber-50 border border-amber-250 text-amber-600 h-auto">
                                Popular
                              </Badge>
                            )}
                            {!product.isNew && !product.isPopular && (
                              <span className="text-xs text-neutral-300 font-bold">
                                —
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4 align-middle">
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenEditModal(product)}
                              title="Edit Product"
                              className="text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50 cursor-pointer h-8 w-8 p-0">
                              <LuPencil className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenDeleteModal(product)}
                              title="Delete Product"
                              className="text-neutral-500 hover:text-red-650 hover:bg-red-55 cursor-pointer h-8 w-8 p-0">
                              <LuTrash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Modern Card List View (Visible only on mobile screens) */}
              <div className="sm:hidden flex flex-col gap-3 p-4 bg-neutral-50/50">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm hover:shadow-md transition-all duration-200">
                    {/* Header line: Name and Category badge */}
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <div>
                        <h4 className="font-bold text-neutral-900 text-sm leading-snug">
                          {product.name}
                        </h4>
                        <Badge
                          variant="secondary"
                          className="px-2 py-0.5 mt-1 rounded-md text-[10px] font-semibold bg-neutral-100 border border-neutral-200/50 text-neutral-600 h-auto">
                          {product.category}
                        </Badge>
                      </div>
                      <div className="text-sm font-extrabold text-neutral-900">
                        ${product.price.toFixed(2)}
                      </div>
                    </div>

                    {/* Description line */}
                    {product.description && (
                      <p className="text-xs text-neutral-500 line-clamp-2 mb-3 leading-relaxed">
                        {product.description}
                      </p>
                    )}

                    {/* Bottom row: Badges and Action buttons */}
                    <div className="flex flex-col gap-3 pt-3 border-t border-neutral-100 mt-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center gap-0.5 text-neutral-700 text-xs font-bold bg-neutral-55 border border-neutral-200 px-2 py-0.5 rounded">
                          <LuStar className="w-3 h-3 fill-amber-400 text-amber-455 animate-pulse-slow" />
                          <span>{product.rating.toFixed(1)}</span>
                          <span className="text-[10px] text-neutral-400 font-medium ml-0.5">
                            ({product.reviewsCount})
                          </span>
                        </div>

                        {product.isNew && (
                          <Badge className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-50 border border-emerald-250 text-emerald-600 h-auto">
                            New
                          </Badge>
                        )}
                        {product.isPopular && (
                          <Badge className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-50 border border-amber-250 text-amber-600 h-auto">
                            Popular
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-2 w-full pt-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenEditModal(product)}
                          className="flex-1 text-neutral-655 hover:text-neutral-900 hover:bg-neutral-50 h-8 text-xs font-semibold cursor-pointer border border-neutral-200">
                          <LuPencil className="w-3.5 h-3.5 mr-1" />
                          <span>Edit</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenDeleteModal(product)}
                          className="flex-1 text-red-655 hover:bg-red-55 h-8 text-xs font-semibold cursor-pointer border border-red-100 bg-red-50/50">
                          <LuTrash2 className="w-3.5 h-3.5 mr-1" />
                          <span>Delete</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      {/* Forms Modal (Add/Edit) (Shadcn Dialog Style) */}
      <Dialog open={isFormModalOpen} onOpenChange={setIsFormModalOpen}>
        <DialogContent className="max-w-lg bg-white border border-neutral-200 shadow-lg text-neutral-950 p-0 overflow-hidden flex flex-col max-h-[90vh] w-[calc(100%-2rem)] gap-0">
          <DialogHeader className="px-4 sm:px-6 pt-5 sm:pt-6 pb-4 flex flex-col space-y-1.5 relative border-b border-neutral-100">
            <DialogTitle className="text-lg font-semibold leading-none tracking-tight text-neutral-900">
              {currentProduct ? "Edit Product Details" : "Create New Product"}
            </DialogTitle>
            <DialogDescription className="text-xs text-neutral-400">
              Modify the product parameters in your database catalog.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={handleFormSubmit}
            className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 sm:py-6 space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1.5 flex flex-col justify-end">
                <label className="text-xs font-semibold tracking-tight text-neutral-500">
                  Category *
                </label>
                <Select
                  value={formCategory}
                  onValueChange={(val) => setFormCategory(val as any)}>
                  <SelectTrigger className="w-full bg-white text-neutral-700 border-neutral-200 text-xs font-semibold flex items-center justify-between cursor-pointer focus:outline-none focus:ring-1 focus:ring-neutral-950">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent className="w-fit bg-white border border-neutral-200 text-neutral-700 text-xs font-semibold rounded-lg shadow-md">
                    <SelectItem value="Utilities">Utilities</SelectItem>
                    <SelectItem value="Jewellery">Jewellery</SelectItem>
                    <SelectItem value="Dresses">Dresses</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Standard Form Inputs */}
              {formFields.filter(f => f.id !== "video").map((field) => (
                <FormInput key={field.id} {...field} />
              ))}

              {/* Secure Cloudinary Video Upload (input-12 component) */}
              <VideoUploadInput
                value={formVideo}
                onChange={setFormVideo}
                isUploading={isUploadingVideo}
                setIsUploading={setIsUploadingVideo}
              />

              {/* Description */}
              <div className="space-y-1.5 flex flex-col">
                <label className="text-xs font-semibold tracking-tight text-neutral-500">
                  Description
                </label>
                <textarea
                  rows={5}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Describe this product catalog entry..."
                  className="flex w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 resize-none"></textarea>
              </div>

              {/* Checkbox Flags */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6  pt-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <Checkbox
                    checked={formIsNew}
                    onCheckedChange={setFormIsNew}
                  />
                  <span className="text-xs text-neutral-655">
                    Mark as New Arrival
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <Checkbox
                    checked={formIsPopular}
                    onCheckedChange={setFormIsPopular}
                  />
                  <span className="text-xs text-neutral-655">
                    Mark as Popular Pick
                  </span>
                </label>
              </div>
            </div>

            <DialogFooter className="pt-4 border-t border-neutral-150 flex flex-col-reverse sm:flex-row justify-end gap-2 p-0 -mx-0 -mb-0 bg-transparent border-t-0 mt-8">
              <button
                type="button"
                onClick={() => setIsFormModalOpen(false)}
                className="w-full inline-flex items-center justify-center rounded-md text-xs font-semibold border border-neutral-200 bg-white hover:bg-neutral-50 h-8 px-4 transition-colors cursor-pointer">
                Cancel
              </button>
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center rounded-md text-xs font-semibold bg-neutral-900 text-white hover:bg-neutral-800 h-8 px-4 transition-colors cursor-pointer shadow-sm">
                {currentProduct ? "Save Changes" : "Create Product"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      {/* Delete Confirmation Modal (Shadcn Alert Dialog Style) */}
      <Dialog
        open={isDeleteModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsDeleteModalOpen(false);
            setProductToDelete(null);
          }
        }}>
        <DialogContent
          className="max-w-sm bg-white border border-neutral-200 p-4 sm:p-5 shadow-lg text-neutral-950 w-[calc(100%-2rem)]"
          showCloseButton={false}>
          <DialogHeader className="mb-2.5 flex gap-2">
            <DialogTitle className="font-semibold text-base text-neutral-900 flex items-center gap-2">
              <LuTrash2 className="text-red-655 w-4.5 h-4.5" />
              <span>Delete Catalog Entry?</span>
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-neutral-500 text-xs leading-relaxed mb-6 font-medium">
            Are you sure you want to permanently delete{" "}
            <span className="font-semibold text-neutral-800">
              &quot;{productToDelete?.name}&quot;
            </span>
            ? This action is permanent and cannot be undone.
          </DialogDescription>

          <DialogFooter className="flex flex-col-reverse sm:flex-row justify-end gap-2 p-0 -mx-0 -mb-0 bg-transparent border-t-0">
            <button
              type="button"
              onClick={() => {
                setIsDeleteModalOpen(false);
                setProductToDelete(null);
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-md text-xs font-semibold border border-neutral-200 bg-white hover:bg-neutral-50 h-8 px-4 transition-colors cursor-pointer">
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDeleteConfirm}
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-md text-xs font-semibold bg-red-600 hover:bg-red-50 text-white h-8 px-4 transition-colors cursor-pointer shadow-sm">
              Delete
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
