import { useState, useEffect } from "react";
import { toast } from "sonner";

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const savedFavs = localStorage.getItem("aura-favorites");
    if (savedFavs) {
      try {
        const parsed = JSON.parse(savedFavs);
        if (parsed && Array.isArray(parsed)) {
          setFavorites(parsed);
        }
      } catch (e) {
        console.error("Error loading favorites", e);
      }
    }
  }, []);

  const toggleFavorite = (productId: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    let updated: string[];
    if (favorites.includes(productId)) {
      updated = favorites.filter((id) => id !== productId);
      toast("Removed from Favourites", {
        icon: "💔",
      });
    } else {
      updated = [...favorites, productId];
      toast.success("Added to Favourites!", {
        icon: "💖",
      });
    }
    setFavorites(updated);
    localStorage.setItem("aura-favorites", JSON.stringify(updated));
  };

  return { favorites, setFavorites, toggleFavorite };
}
