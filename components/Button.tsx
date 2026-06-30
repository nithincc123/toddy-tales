"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface ButtonProps {
  variant?: "primary" | "secondary";
  onClick?: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  href?: string;
  children: React.ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export default function Button({
  variant = "primary",
  onClick,
  href,
  children,
  className = "",
  type = "button",
  disabled = false,
}: ButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Tailwind styling base classes
  const baseStyle =
    "relative overflow-hidden rounded-lg font-heading text-xs font-bold tracking-[0.15em] uppercase transition-all duration-300 flex items-center justify-center gap-2 select-none border cursor-pointer";

  const variantStyles = {
    primary: "bg-[#16434d] border-[#16434d] text-white",
    secondary: "bg-transparent border-[#e6d6c3]/80 text-[#e6d6c3]",
  };

  const currentStyles = `${baseStyle} ${variantStyles[variant]} ${className}`;

  // Content rendered inside the button (including animated liquid overlays and rising bubbles)
  const buttonContent = (
    <>
      {/* Rising Liquid Overlay */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 bg-[#ab1223] pointer-events-none z-0"
        initial={{ height: "0%" }}
        animate={{ height: isHovered ? "100%" : "0%" }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        style={{ originY: 1 }}
      >
        {/* Wavy surface on top of the rising liquid */}
        {isHovered && (
          <div className="absolute top-[-10px] left-0 w-full h-[12px] overflow-hidden">
            <svg
              viewBox="0 0 120 28"
              className="w-[200%] h-full fill-[#ab1223] animate-wave-flow"
              preserveAspectRatio="none"
            >
              <path d="M0 15 Q 30 0, 60 15 T 120 15 T 180 15 T 240 15 L 240 28 L 0 28 Z" />
            </svg>
          </div>
        )}
      </motion.div>

      {/* Rising Bubbles/Particles inside the button frame */}
      {isHovered && (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-[#e6d6c3] rounded-full opacity-60"
              style={{
                left: `${15 + i * 14}%`,
                bottom: 0,
              }}
              initial={{ y: 0, opacity: 0 }}
              animate={{
                y: -45,
                opacity: [0, 0.7, 0.7, 0],
              }}
              transition={{
                duration: 1.1 + i * 0.1,
                repeat: Infinity,
                delay: i * 0.12,
                ease: "easeOut",
              }}
            />
          ))}
        </div>
      )}

      {/* Foreground content: text, icon, children (kept above animation layers) */}
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
    </>
  );

  // If href is present, render as Link/Anchor
  if (href) {
    if (href.startsWith("http") || href.startsWith("#")) {
      return (
        <a
          href={href}
          onClick={onClick as any}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={currentStyles}
        >
          {buttonContent}
        </a>
      );
    }
    return (
      <Link
        href={href}
        onClick={onClick as any}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={currentStyles}
      >
        {buttonContent}
      </Link>
    );
  }

  // Otherwise, render as HTML button
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`${currentStyles} disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {buttonContent}
    </button>
  );
}
