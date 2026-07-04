import React from "react";
import { LuGem } from "react-icons/lu";
import { cn } from "@/app/utils/cn";
import { HiMiniShoppingBag } from "react-icons/hi2";
import Link from "next/link";

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export default function Logo({ className = "", showText = true }: LogoProps) {
  return (
    <Link href="/">
      <div className={cn("flex items-center gap-1 select-none", className)}>
        <HiMiniShoppingBag className="size-6 md:size-8 text-blue-600" />

        {showText && (
          <span className="font-bold tracking-tight text-xl md:text-2xl text-neutral-800 font-sans">
            pt<span className="text-neutral-800 font-light">Hub</span>
          </span>
        )}
      </div>
    </Link>
  );
}
