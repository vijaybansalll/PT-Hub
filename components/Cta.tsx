"use client";

import React from "react";
import { LuSparkles, LuPhone, LuMessageSquare } from "react-icons/lu";
import { cn } from "@/app/utils/cn";

interface CtaProps {
  title?: string;
  description?: string;
}

const PlusIcon = ({
  position,
}: {
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}) => {
  const classes = {
    "top-left": "absolute -top-2.5 -left-2.5",
    "top-right": "absolute -top-2.5 -right-2.5",
    "bottom-left": "absolute -bottom-2.5 -left-2.5",
    "bottom-right": "absolute -bottom-2.5 -right-2.5",
  };
  return (
    <span
      className={cn(
        "text-neutral-300 text-base font-semibold select-none pointer-events-none z-10",
        classes[position],
      )}>
      +
    </span>
  );
};

export default function Cta({
  title = "Get Smarter Gadgets & Exquisite Jewellery First",
  description = "Subscribe to the PT Hub club to receive 15% off your first import order, weekly drops of viral smart utilities, and early access to handcrafted jewellery collections.",
}: CtaProps) {
  const phone = process.env.CONTACT_PHONE || "+91 78890 28597";
  const whatsapp = process.env.CONTACT_WHATSAPP || "917889028597";
  const cleanPhone = phone.replace(/\s+/g, "");
  return (
    <section className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8 py-12 font-sans">
      <div className="relative mx-auto flex w-full flex-col justify-between gap-y-5 border-y border-neutral-200 px-8 py-10 bg-white/40 backdrop-blur-sm">
        {/* Corner Plus Grid Accents */}
        <PlusIcon position="top-left" />
        <PlusIcon position="top-right" />
        <PlusIcon position="bottom-left" />
        <PlusIcon position="bottom-right" />

        {/* Layout Border Accents */}
        <div className="pointer-events-none absolute -inset-y-6 -left-px w-px border-l border-neutral-200" />
        <div className="pointer-events-none absolute -inset-y-6 -right-px w-px border-r border-neutral-200" />
        <div className="absolute top-0 left-1/2 -z-10 h-full border-l border-dashed border-neutral-200/50" />

        <div className="flex flex-col items-center gap-1">
          <div className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-600 border border-blue-200/10">
            <LuSparkles className="h-3 w-3" /> PT HUB PRIVILEGES
          </div>
          <h2 className="text-center font-extrabold text-2xl md:text-3xl text-neutral-900 tracking-tight mt-3">
            {title}
          </h2>
        </div>

        <p className="text-balance text-center text-sm md:text-base text-neutral-500 max-w-xl mx-auto leading-relaxed">
          {description}
        </p>

        <div className="flex items-center justify-center gap-3">
          {/* Call now! */}
          <a
            href={`tel:${cleanPhone}`}
            className="px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/30 hover:shadow-blue-600/50 flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer">
            <LuPhone className="h-3.5 w-3.5" />
            <span>Call now!</span>
          </a>

          {/* Connect with us! */}
          <a
            href={`https://wa.me/${whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-full border border-neutral-200 text-neutral-700 font-semibold text-xs hover:bg-neutral-50 active:scale-95 transition-all cursor-pointer bg-white/60 flex items-center gap-1.5 shadow-sm">
            <LuMessageSquare className="h-3.5 w-3.5 text-blue-500" />
            <span>Connect with us!</span>
          </a>
        </div>
      </div>
    </section>
  );
}
