"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LuMail, LuLock, LuArrowRight, LuEye, LuEyeOff } from "react-icons/lu";
import { Toaster, toast } from "sonner";
import Logo from "@/components/Logo";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // Check if already logged in
  useEffect(() => {
    async function verifySession() {
      try {
        const res = await fetch("/api/auth/session");
        const data = await res.json();
        if (data.authenticated) {
          router.push("/dashboard");
        } else {
          setCheckingSession(false);
        }
      } catch (err) {
        setCheckingSession(false);
      }
    }
    verifySession();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading("Authenticating...");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("Successfully logged in!", { id: toastId });
        router.push("/dashboard");
        router.refresh();
      } else {
        toast.error(data.error || "Invalid credentials.", { id: toastId });
      }
    } catch (err) {
      toast.error("An error occurred. Please try again.", { id: toastId });
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-zinc-500 text-sm font-medium">Verifying Session...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-zinc-50 flex items-center justify-center p-4 overflow-hidden font-sans select-none text-zinc-900">
      <Toaster richColors position="top-right" theme="light" />

      {/* Floating abstract decorative background gradients (light, matching home page theme) */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md flex flex-col items-center gap-6 relative z-10">
        {/* Logo outside the box in the center */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex justify-center scale-100 sm:scale-110"
        >
          <Logo showText={true} />
        </motion.div>

        {/* Card Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="w-full bg-white/80 backdrop-blur-xl border border-zinc-200/80 rounded-3xl p-6 sm:p-10 shadow-xl shadow-zinc-200/50"
        >
          {/* Title */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900">
              Admin Portal
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-zinc-500 font-medium">
              Sign in to manage your products database
            </p>
          </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          {/* Email input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-500">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-400">
                <LuMail className="w-5 h-5" />
              </span>
              <input
                type="email"
                placeholder="admin@project.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
                className="w-full bg-white border border-zinc-200 text-zinc-900 rounded-xl py-3 sm:py-3.5 pl-11 pr-4 text-sm placeholder-zinc-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all shadow-sm"
              />
            </div>
          </div>

          {/* Password input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-500">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-400">
                <LuLock className="w-5 h-5" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
                className="w-full bg-white border border-zinc-200 text-zinc-900 rounded-xl py-3 sm:py-3.5 pl-11 pr-11 text-sm placeholder-zinc-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all shadow-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-400 hover:text-zinc-655 transition-colors cursor-pointer"
              >
                {showPassword ? <LuEyeOff className="w-5 h-5" /> : <LuEye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 sm:py-3.5 px-4 rounded-full transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
          >
            <span>{isLoading ? "Signing In..." : "Sign In"}</span>
            <LuArrowRight className="w-4 h-4" />
          </button>
        </form>
        </motion.div>
      </div>
    </div>
  );
}
