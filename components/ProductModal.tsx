"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  LuX,
  LuPlay,
  LuPause,
  LuVolumeX,
  LuVolume2,
  LuStar,
  LuCheck,
  LuHeart,
  LuShoppingBag,
} from "react-icons/lu";
import { Product } from "@/app/data";
import { cn } from "@/app/utils/cn";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onBuyNow: () => void;
}

export default function ProductModal({
  product,
  onClose,
  isFavorite,
  onToggleFavorite,
  onBuyNow,
}: ProductModalProps) {
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Sync internal state when product changes
  useEffect(() => {
    if (product) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsVideoMuted(false);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsVideoPlaying(true);
    }
  }, [product]);

  return (
    <AnimatePresence>
      {product && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
          {/* Blur Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-md"
          />

          {/* Modal Container Card */}
          <motion.div
            layoutId={`card-${product.id}`}
            className="relative z-10 w-full max-w-5xl md:overflow-hidden rounded-xl md:rounded-2xl bg-white shadow-2xl border border-neutral-200/80 h-fit md:h-[80vh] max-h-[750px] flex flex-col md:flex-row transition-colors duration-300">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="absolute top-3.5 right-3.5 md:top-4 md:right-4 z-20 flex h-7 w-7 md:h-9 md:w-9 items-center justify-center rounded-lg bg-neutral-100/85 text-neutral-700 hover:text-neutral-900 shadow-md hover:scale-105 active:scale-95 transition-all backdrop-blur-md cursor-pointer border-0">
              <LuX className="h-4 w-4 md:h-4.5 md:w-4.5" />
            </Button>

            {/* Inner Content Container */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.25 }}
              className="flex flex-col md:flex-row w-full h-full">
              {/* Left Side Media Section: Only video lookbook */}
              <div className="w-full md:w-1/2 p-2 md:p-6 flex flex-col border-b md:border-b-0 md:border-r border-neutral-100">
                {/* Main Media Preview Box */}
                <div className="relative aspect-square md:aspect-auto md:flex-grow h-full w-full overflow-hidden rounded-xl md:rounded-lg bg-neutral-900 flex items-center justify-center shadow-inner group/video">
                  <video
                    key={product.id}
                    ref={videoRef}
                    src={product.video}
                    autoPlay
                    loop
                    muted={isVideoMuted}
                    playsInline
                    onPlay={() => setIsVideoPlaying(true)}
                    onPause={() => setIsVideoPlaying(false)}
                    className="h-full w-full object-cover bg-neutral-950"
                  />

                  {/* Video & Category Badges */}
                  <div className="absolute top-3 left-3 z-20 flex flex-wrap gap-2 pointer-events-none">
                    {/* Category Badge (Mobile Only) */}
                    <Badge className="inline-flex md:hidden items-center rounded-full bg-blue-600 px-3 py-1.5 text-[10px] font-bold text-white shadow-lg shadow-blue-600/30 border-0 h-auto">
                      {product.category}
                    </Badge>
                  </div>

                  {/* Big Play/Pause Toggle Button in the Center */}
                  <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                    <button
                      onClick={() => {
                        if (videoRef.current) {
                          if (videoRef.current.paused) {
                            videoRef.current.play();
                          } else {
                            videoRef.current.pause();
                          }
                        }
                      }}
                      className={cn(
                        "flex h-16 w-16 items-center justify-center rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-md transition-all duration-300 shadow-2xl border border-white/10 cursor-pointer pointer-events-auto hover:scale-110 active:scale-95",
                        isVideoPlaying
                          ? "opacity-0 group-hover/video:opacity-100 scale-90 group-hover/video:scale-100"
                          : "opacity-100 scale-100",
                      )}
                      aria-label={
                        isVideoPlaying ? "Pause video" : "Play video"
                      }>
                      {isVideoPlaying ? (
                        <LuPause className="h-7 w-7 fill-white text-white" />
                      ) : (
                        <LuPlay className="h-7 w-7 fill-white text-white translate-x-0.5" />
                      )}
                    </button>
                  </div>

                  {/* Video specific controls */}
                  <div className="absolute bottom-4 right-4 z-10 flex gap-2">
                    <button
                      onClick={() => setIsVideoMuted(!isVideoMuted)}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition-all shadow-md cursor-pointer hover:scale-105 active:scale-95">
                      {isVideoMuted ? (
                        <LuVolumeX className="h-4.5 w-4.5" />
                      ) : (
                        <LuVolume2 className="h-4.5 w-4.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Side Info Section */}
              <div className="w-full md:w-1/2 p-3 md:p-6 flex flex-col justify-between overflow-y-auto max-h-[45vh] md:max-h-full font-sans">
                <div>
                  {/* Category Tag */}
                  <Badge variant="secondary" className="hidden md:inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-600 border border-blue-200/10 h-auto">
                    {product.category}
                  </Badge>

                  {/* Title & Price */}
                  <div className="mt-2 flex flex-col md:flex-row items-start justify-between gap-0 md:gap-4">
                    <h2 className="text-base md:text-xl font-bold md:font-extrabold text-neutral-900 tracking-tight flex-1">
                      {product.name}
                    </h2>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-lg md:text-xl font-bold md:font-black text-blue-600">
                        ₹{product.price.toFixed(2)}
                      </span>
                      {/* Favorite Button next to Price */}
                      <button
                        onClick={onToggleFavorite}
                        className={cn(
                          "inline-block md:hidden p-2 rounded-lg border transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer",
                          isFavorite
                            ? "bg-blue-500/10 text-blue-600 border-blue-500/30"
                            : "bg-neutral-55 text-neutral-400 border-neutral-200 hover:text-neutral-600",
                        )}
                        aria-label={
                          isFavorite
                            ? "Remove from favorites"
                            : "Add to favorites"
                        }>
                        <LuHeart
                          className={cn(
                            "h-4 w-4 md:h-4.5 md:w-4.5",
                            isFavorite && "fill-blue-500 text-blue-600",
                          )}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Rating summary */}
                  <div className="mt-2 flex items-center gap-1">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <LuStar
                          key={i}
                          className={cn(
                            "h-3 w-3 md:h-4 md:w-4",
                            i < Math.floor(product.rating)
                              ? "fill-amber-400 text-amber-400"
                              : "text-neutral-300",
                          )}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] md:text-xs font-bold text-neutral-700 ml-1">
                      {product.rating}
                    </span>
                    <span className="text-[10px] md:text-xs text-neutral-400">
                      ({product.reviewsCount} verified reviews)
                    </span>
                  </div>

                  <div className="border-b border-neutral-100 md:my-3 my-1" />

                  {/* Description text */}
                  <p className="text-[11px] md:text-xs text-neutral-500 md:leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Bottom Action buttons */}
                <div className="mt-3 md:mt-6 pt-3 border-t border-neutral-100 flex flex-col sm:flex-row gap-2.5">
                  {/* Buy now trigger */}
                  <Button
                    onClick={onBuyNow}
                    className="flex-1 py-2 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold text-xs md:text-sm shadow-md shadow-blue-600/20 hover:shadow-blue-600/40 hover:scale-[1.01] active:scale-95 transition-all text-center flex items-center justify-center gap-2 cursor-pointer h-10 md:h-11">
                    <LuShoppingBag className="h-4 w-4" />
                    Buy Now
                  </Button>

                  {/* Add to favorites trigger */}
                  <Button
                    variant={isFavorite ? "secondary" : "outline"}
                    onClick={onToggleFavorite}
                    className={cn(
                      "hidden md:flex py-2 px-4 rounded-xl font-bold text-xs md:text-sm items-center justify-center gap-2 hover:scale-[1.01] active:scale-95 transition-all cursor-pointer h-10 md:h-11 border border-neutral-200",
                      isFavorite
                        ? "bg-blue-500/10 text-blue-600 border-blue-500/30 hover:bg-blue-500/20"
                        : "bg-white text-neutral-700 hover:bg-neutral-50",
                    )}>
                    <LuHeart
                      className={cn(
                        "h-4 w-4",
                        isFavorite && "fill-blue-500 text-blue-600",
                      )}
                    />
                    {isFavorite ? "Favorited" : "Add to Favourites"}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
