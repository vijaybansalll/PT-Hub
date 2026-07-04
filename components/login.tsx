"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Logo from "@/components/Logo";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

const Login = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

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

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    const toastId = toast.loading("Authenticating...");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, password: data.password }),
      });

      const resData = await res.json();

      if (res.ok && resData.success) {
        toast.success("Successfully logged in!", { id: toastId });
        router.push("/dashboard");
        router.refresh();
      } else {
        toast.error(resData.error || "Invalid credentials.", { id: toastId });
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
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-zinc-500 text-sm font-medium">
            Verifying Session...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-zinc-50 font-sans p-4 select-none overflow-hidden text-zinc-900">
      <Toaster richColors position="top-right" />

      {/* Floating abstract decorative background gradients (light, matching home page theme) */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none"></div>

      <div className="relative w-full max-w-sm overflow-hidden rounded-xl border border-zinc-200 bg-white px-8 py-8 shadow-md z-10">

        <div className="relative isolate flex flex-col items-center">
          <Logo showText={false} className="scale-100" />
          <p className="mt-4 font-bold text-zinc-900 text-lg">
            Log in to Admin Panel
          </p>

          <form
            className="w-full space-y-4 mt-6"
            onSubmit={form.handleSubmit(onSubmit)}>
            <Controller
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Email</FieldLabel>
                  <Input
                    aria-invalid={fieldState.invalid}
                    className="w-full bg-white h-9 text-xs"
                    placeholder="admin@project.com"
                    type="email"
                    disabled={isLoading}
                    {...field}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="password"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Password</FieldLabel>
                  <Input
                    aria-invalid={fieldState.invalid}
                    className="w-full bg-white h-9 text-xs"
                    placeholder="••••••••"
                    type="password"
                    disabled={isLoading}
                    {...field}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <Button
              className="w-full h-9 mt-2 text-xs font-semibold cursor-pointer"
              type="submit"
              disabled={isLoading}>
              Continue
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
