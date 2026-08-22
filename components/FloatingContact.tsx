"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LuPhone, LuMessageCircle, LuX } from "react-icons/lu";
import { FaWhatsapp } from "react-icons/fa6";
import { cn } from "@/app/utils/cn";

export default function FloatingContact() {
  const [isOpen, setIsOpen] = useState(false);

  const demoCallNumber = process.env.CONTACT_PHONE || "+91 78890 28597";
  const demoWhatsAppNumber = process.env.CONTACT_WHATSAPP || "917889028597";

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 font-sans select-none">
      {/* Expandable Menu Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="flex flex-col gap-1 bg-white p-2 rounded-2xl border border-neutral-200 shadow-2xl w-60 origin-bottom-right">
            <span className="text-xs font-extrabold text-neutral-400  px-2 py-1">
              Contact Us
            </span>

            {/* Call Option */}
            <a
              href={`tel:${demoCallNumber.replace(/\s+/g, "")}`}
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-blue-50/50 text-neutral-700 transition-colors cursor-pointer group">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white shadow-md shadow-blue-600/20 group-hover:scale-105 transition-transform">
                <LuPhone className="h-4.5 w-4.5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-extrabold text-neutral-800 leading-tight group-hover:text-blue-700 transition-colors">
                  Call Support
                </span>
                <span className="text-[11px] text-neutral-400 mt-0.5">
                  {demoCallNumber}
                </span>
              </div>
            </a>

            <div className="border-t border-neutral-100 my-0.5" />

            {/* WhatsApp Option */}
            <a
              href={`https://wa.me/${demoWhatsAppNumber.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-green-50/50 text-neutral-700 transition-colors cursor-pointer group">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-600 text-white shadow-md shadow-green-600/20 group-hover:scale-105 transition-transform">
                <FaWhatsapp className="h-4.5 w-4.5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-extrabold text-neutral-800 leading-tight group-hover:text-green-700 transition-colors">
                  WhatsApp Us
                </span>
                <span className="text-[11px] text-neutral-400 mt-0.5">
                  {demoCallNumber}
                </span>
              </div>
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Floating Action Button (FAB) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Contact options"
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg cursor-pointer transition-all duration-300 active:scale-95 border",
          isOpen
            ? "bg-neutral-900 hover:bg-neutral-800 border-neutral-900 shadow-neutral-800/20"
            : "bg-blue-600 hover:bg-blue-500 border-blue-700 shadow-blue-600/30 hover:scale-110",
        )}>
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -45, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 45, opacity: 0 }}
              transition={{ duration: 0.15 }}>
              <LuX className="h-5 w-5" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 45, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -45, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-0.5">
              <LuMessageCircle className="h-5 w-5" />
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
}
