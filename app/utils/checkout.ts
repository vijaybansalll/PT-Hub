import { toast } from "sonner";
import { Product } from "@/app/data";

export function handleBuyNow(product: Product, callback?: () => void) {
  const message = `Hello! I would like to purchase the *${product.name}* (${product.category}) for *₹${product.price.toFixed(2)}*.`;
  const whatsappNum = process.env.NEXT_PUBLIC_CONTACT_WHATSAPP || "919417212422";
  const whatsappUrl = `https://wa.me/${whatsappNum}?text=${encodeURIComponent(message)}`;
  
  toast.success("Redirecting to WhatsApp Checkout...", {
    description: `Opening chat to buy ${product.name}.`,
    icon: "🛍️",
  });
  
  setTimeout(() => {
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    if (callback) callback();
  }, 600);
}
