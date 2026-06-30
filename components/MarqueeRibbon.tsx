"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

export default function MarqueeRibbon() {
  const { activeLang } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);

  const text =
    activeLang === "en"
      ? "Germany's First Toddy Shop Inspired Cocktail Bar  ·  Kerala Tavern Legacy Meets Modern European Craft Mixology  ·  Palm Nectar Fermentations  ·  Elevated Coastal Tapas  ·  Torstraße 104, Berlin  ·  "
      : "Deutschlands erste von Toddy Shops inspirierte Cocktailbar  ·  Das Erbe der Kerala-Taverne trifft auf moderne europäische Cocktailkunst  ·  Palmnektar-Fermentationen  ·  Gehobene Küstentapas  ·  Torstraße 104, Berlin  ·  ";

  return (
    <div
      className="relative w-full overflow-hidden whitespace-nowrap bg-wine text-beige py-4 border-y border-beige/10 cursor-pointer select-none z-10"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        animate={{ x: [0, "-50%"] }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: isHovered ? 60 : 25,
            ease: "linear",
          },
        }}
        className="flex whitespace-nowrap font-heading text-sm md:text-base tracking-[0.15em] uppercase font-bold"
      >
        <span>{text}</span>
        <span>{text}</span>
      </motion.div>
    </div>
  );
}
