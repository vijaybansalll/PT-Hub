import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PT Hub - Smart Gadgets & Premium Jewellery",
  description: "Shop incredibly useful Chinese gadgets, smart utilities, life-hacks, and exquisite handcrafted premium jewellery at PT Hub.",
};

import { cn } from "@/app/utils/cn";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(inter.variable, geistMono.variable, "h-full antialiased")}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
