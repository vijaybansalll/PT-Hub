import React from "react";
import { FaInstagram, FaFacebookF, FaWhatsapp } from "react-icons/fa6";
import { LuPhone } from "react-icons/lu";
import Logo from "./Logo";

export default function Footer() {
  const phone = process.env.CONTACT_PHONE || "+91 78890 28597";
  const whatsapp = process.env.CONTACT_WHATSAPP || "917889028597";
  const cleanPhone = phone.replace(/\s+/g, "");

  const navLinks = [
    { label: "Shop All", href: "/products" },
    { label: "Smart Gadgets", href: "/products?category=Utilities" },
    { label: "Luxury Jewellery", href: "/products?category=Jewellery" },
  ];

  const socialLinks = [
    {
      label: "Instagram",
      href: "https://www.instagram.com/goel.hub__2412/",
      icon: <FaInstagram className="h-5 w-5" />,
    },
    {
      label: "Facebook",
      href: "https://facebook.com",
      icon: <FaFacebookF className="h-5 w-5" />,
    },
    {
      label: "WhatsApp",
      href: `https://wa.me/${whatsapp}`,
      icon: <FaWhatsapp className="h-5 w-5" />,
    },
    {
      label: "Phone Call",
      href: `tel:${cleanPhone}`,
      icon: <LuPhone className="h-5 w-5" />,
    },
  ];

  return (
    <footer className="mt-auto border-t border-neutral-200/50 bg-white text-neutral-600 transition-colors duration-300 w-full font-sans py-6 md:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Upper footer grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-center pb-4 md:pb-8 border-b border-neutral-200/30">
          {/* Left Side: Logo */}
          <div className="flex justify-center md:justify-start">
            <Logo />
          </div>

          {/* Center: Useful Links */}
          <div className="flex justify-center">
            <nav>
              <ul className="flex flex-wrap justify-center gap-4 md:gap-6 text-xs md:text-sm font-medium md:font-semibold text-neutral-500">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="hover:text-blue-600 transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Right Side: Social Icons */}
          <div className="flex justify-center md:justify-end gap-3.5">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                aria-label={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-full border border-neutral-200 bg-white hover:bg-neutral-50 hover:text-blue-600 transition-all hover:scale-105 shadow-sm cursor-pointer">
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Lower footer copyright */}
        <div className="pt-6 text-center text-neutral-400 text-xs">
          <p>&copy; {new Date().getFullYear()} PT Hub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
