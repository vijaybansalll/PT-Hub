"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { LuChevronDown, LuCircleHelp } from "react-icons/lu";
import { cn } from "@/app/utils/cn";

interface FAQItem {
  id: string;
  title: string;
  content: string;
}

const FAQ_QUESTIONS: FAQItem[] = [
  {
    id: "item-1",
    title: "What does PT Hub specialize in?",
    content:
      "PT Hub is a specialized boutique based in Barnala, Punjab, dealing in highly useful Chinese smart gadgets, home utilities, premium luxury jewellery, and high-quality unstitched ladies' suit fabrics/dress materials.",
  },
  {
    id: "item-2",
    title: "How do I place an order?",
    content:
      "Simply browse our catalog and click the 'Buy Now' button on any product. This will instantly redirect you to our WhatsApp DM with a pre-filled message of the product details. We will confirm your order and discuss shipping options directly in the chat.",
  },
  {
    id: "item-3",
    title: "How do you handle delivery and payments?",
    content:
      "Since all orders are finalized directly in our WhatsApp DM, we arrange custom delivery options. We accept online UPI payments, bank transfers, and Cash on Delivery (COD) for Barnala and neighboring regions. No complex online checkouts or payment gateways needed!",
  },
  {
    id: "item-4",
    title:
      "Can I see real photos/videos of unstitched suit materials before buying?",
    content:
      "Yes, absolutely! Once you connect with us in our WhatsApp DM, we can send you real-time photos, fabric videos, and answer any texture or quality queries you have before confirming.",
  },
  {
    id: "item-5",
    title: "What kinds of gadgets and jewellery do you offer?",
    content:
      "We offer innovative smart Chinese utilities (like sonic cleaners, automated dispensers, compact heaters) and premium handcrafted traditional and modern jewellery. Since we coordinate in WhatsApp, you can even request custom items not listed on the catalog!",
  },
];

export default function Faqs() {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleQuestion = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="mx-auto w-full max-w-3xl space-y-7 px-4 sm:px-6 lg:px-8 py-6 md:py-12 border-t border-neutral-200/30 font-sans">
      <div className="space-y-3 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600 border border-blue-200/20">
          <LuCircleHelp className="h-3.5 w-3.5" /> Support Center
        </div>
        <h2 className="font-semibold md:font-extrabold text-lg md:text-4xl text-neutral-900 tracking-tight">
          Frequently Asked Questions
        </h2>
        <p className="max-w-2xl text-sm text-neutral-500 md:leading-relaxed">
          Here are some common queries and responses from our customers. If you
          don&apos;t find the answer you&apos;re looking for, feel free to reach
          out to our team.
        </p>
      </div>

      <div className="rounded-2xl border border-neutral-200/60 bg-white/50 divide-y divide-neutral-200/50 overflow-hidden shadow-sm backdrop-blur-sm">
        {FAQ_QUESTIONS.map((item) => {
          const isOpen = openId === item.id;
          return (
            <div key={item.id} className="transition-colors duration-200">
              <button
                onClick={() => toggleQuestion(item.id)}
                className="flex w-full items-center justify-between px-6 py-4.5 text-left text-sm sm:text-base font-medium md:font-bold text-neutral-800 hover:text-blue-600 focus:outline-none transition-colors cursor-pointer">
                <span>{item.title}</span>
                <LuChevronDown
                  className={cn(
                    "h-4.5 w-4.5 text-neutral-400 transition-transform duration-250",
                    isOpen && "rotate-180 text-blue-500",
                  )}
                />
              </button>

              <motion.div
                initial={false}
                animate={{
                  height: isOpen ? "auto" : 0,
                  opacity: isOpen ? 1 : 0,
                }}
                transition={{ duration: 0.25, ease: [0.04, 0.62, 0.23, 0.98] }}
                className="overflow-hidden px-6">
                <div className="pb-4.5 text-xs sm:text-sm text-neutral-500 leading-relaxed">
                  {item.content}
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
