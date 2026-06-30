"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue } from "framer-motion";

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse Coordinates
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  useEffect(() => {
    // Disable custom cursor on touch devices
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;

    setIsVisible(true);
    document.documentElement.classList.add("custom-cursor-active");

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    let currentHoverState = false;
    // Event delegation to check if mouse is over interactive element
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      const hoverable = target.closest(
        "a, button, select, input, textarea, [role='button'], .cursor-pointer"
      );
      const nextHoverState = !!hoverable;
      if (nextHoverState !== currentHoverState) {
        currentHoverState = nextHoverState;
        setIsHovered(nextHoverState);
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave, { passive: true });
    document.addEventListener("mouseenter", handleMouseEnter, { passive: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      window.removeEventListener("mouseover", handleMouseOver);
      document.documentElement.classList.remove("custom-cursor-active");
    };
  }, [mouseX, mouseY]);

  if (!isVisible) return null;

  return (
    <motion.div
      style={{
        x: mouseX,
        y: mouseY,
        // Offsetting so the top-left tip of the tumbler rim (25, 20) is exactly the mouse click point
        translateX: "-25%",
        translateY: "-20%",
        willChange: "transform",
      }}
      className="fixed top-0 left-0 w-12 h-12 pointer-events-none z-[9999]"
    >
      {/* Drink Glass SVG without heavy filter dropshadows */}
      <svg
        viewBox="0 0 100 100"
        fill="none"
        className="w-full h-full text-[#e6d6c3]"
      >
        <defs>
          {/* Clip path to keep liquid strictly inside the glass bowl */}
          <clipPath id="cursor-glass-clip">
            <path d="M 28 25 L 72 25 L 66 74 L 34 74 Z" />
          </clipPath>
        </defs>

        {/* Liquid Fill that scales up vertically on hover */}
        <motion.rect
          x="20"
          y="25"
          width="60"
          height="50"
          fill="#ab1223"
          clipPath="url(#cursor-glass-clip)"
          initial={{ scaleY: 0.15 }}
          animate={{ scaleY: isHovered ? 1 : 0.15 }}
          style={{ originY: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />

        {/* Actual Glass Outline */}
        <path
          // Rocks/Tumbler Glass Outline with a thick base line
          d="M 25 20 L 35 85 L 65 85 L 75 20 M 33 75 L 67 75"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </motion.div>
  );
}
