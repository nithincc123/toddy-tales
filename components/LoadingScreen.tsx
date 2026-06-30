"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function LoadingScreen() {
  const phrases = [
    "Tapping fresh palm sap...",
    "Roasting Malabar chilies...",
    "Smoking cardamoms...",
    "Setting the tavern table...",
    "Chilling the claypots..."
  ];

  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % phrases.length);
    }, 700);
    return () => clearInterval(interval);
  }, [phrases.length]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
      className="fixed inset-0 z-50 flex flex-col justify-center items-center bg-[#050505] text-[#e6d6c3]"
    >
      {/* Brand Logo & Name */}
      <motion.div
        initial={{ opacity: 0, y: -25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center mb-10 select-none text-center"
      >
        <img
          src="/logo/ToddyTales_Logo_white.png"
          alt="Toddy Tales Logo"
          className="h-16 w-auto object-contain mb-4"
        />
        <h1 className="text-xl md:text-2xl font-heading font-black tracking-[0.2em] text-white uppercase">
          TODDY TALES
        </h1>
        <p className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-[#e6d6c3]/60 mt-1.5 font-sans font-bold">
          BAR &amp; KITCHEN BERLIN
        </p>
      </motion.div>

      {/* Cocktail Glass filling up */}
      <div className="relative w-24 h-24 flex items-center justify-center">
        <svg viewBox="0 0 100 100" fill="none" className="w-full h-full text-[#e6d6c3]/90">
          <defs>
            {/* Clip path inside the glass bowl */}
            <clipPath id="glass-clip">
              <path d="M 30 35 L 70 35 L 50 65 Z" />
            </clipPath>
          </defs>

          {/* Liquid (Animates filling upwards from the bottom vertex) */}
          <motion.rect
            x="25"
            y="35"
            width="50"
            height="30"
            fill="#ab1223" // Saturated wine-crimson brand color
            clipPath="url(#glass-clip)"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            style={{ originY: 1 }}
            transition={{ duration: 2.2, ease: "easeInOut" }}
          />

          {/* Animated bubbles floating upwards inside the liquid */}
          {[...Array(5)].map((_, i) => (
            <motion.circle
              key={i}
              cx={42 + i * 4}
              cy={60}
              r={1.2}
              fill="#e6d6c3"
              initial={{ y: 0, opacity: 0 }}
              animate={{
                y: -22 - i * 2,
                opacity: [0, 0.7, 0.7, 0]
              }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeOut"
              }}
            />
          ))}

          {/* Glass Outline (Coupe style, open top) */}
          {/* Bowl */}
          <path d="M 28 35 L 50 65 L 72 35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          {/* Stem */}
          <path d="M 50 65 L 50 85" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          {/* Base */}
          <path d="M 36 85 L 64 85" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>

      {/* Cycling status text */}
      <div className="h-6 flex items-center justify-center mt-8 overflow-hidden">
        <motion.div
          key={textIndex}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="text-xs font-sans uppercase tracking-[0.25em] text-[#e6d6c3]/80 font-bold"
        >
          {phrases[textIndex]}
        </motion.div>
      </div>
    </motion.div>
  );
}
