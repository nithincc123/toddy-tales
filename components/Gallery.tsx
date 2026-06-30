"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Play, Pause } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const AUTOPLAY_INTERVAL = 2500;

interface GalleryImage {
  id: number;
  image_url: string;
}

export default function Gallery() {
  const [[currentIndex, direction], setTuple] = useState([0, 1]);
  const { activeLang } = useLanguage();
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [images, setImages] = useState<GalleryImage[]>([]);

  // Handle mobile responsiveness for 3D spread
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Fetch gallery images from Laravel
  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/tavern-gallery`,
        );

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const result = await res.json();

        if (result.success) {
          setImages(result.data);
        }
      } catch (err) {
        console.error("Gallery fetch error:", err);
      }
    };

    fetchGallery();
  }, []);

  // Auto-play loop logic
  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      paginate(1);
    }, AUTOPLAY_INTERVAL);
    return () => clearInterval(timer);
  }, [currentIndex, isAutoPlaying]);

  const paginate = (newDirection: number) => {
    setTuple([currentIndex + newDirection, newDirection]);
  };

  // 3D Concave Math (Re-calculated for smaller image heights)
  const getPosition = (offset: number) => {
    // Tighter horizontal offsets to match the reduced image widths
    const xOffset = isMobile ? 140 : 280;
    const xFarOffset = isMobile ? 260 : 520;

    if (offset === 0)
      return { x: 0, z: -50, rotateY: 0, scale: 1, opacity: 1, zIndex: 10 };
    if (offset === 1)
      return {
        x: xOffset,
        z: 150,
        rotateY: -35,
        scale: 0.85,
        opacity: 0.8,
        zIndex: 9,
      };
    if (offset === -1)
      return {
        x: -xOffset,
        z: 150,
        rotateY: 35,
        scale: 0.85,
        opacity: 0.8,
        zIndex: 9,
      };
    if (offset === 2)
      return {
        x: xFarOffset,
        z: 350,
        rotateY: -60,
        scale: 0.7,
        opacity: 0.3,
        zIndex: 8,
      };
    if (offset === -2)
      return {
        x: -xFarOffset,
        z: 350,
        rotateY: 60,
        scale: 0.7,
        opacity: 0.3,
        zIndex: 8,
      };

    // Positions for items entering/exiting off-screen
    if (offset > 2)
      return {
        x: xFarOffset + 150,
        z: 500,
        rotateY: -75,
        scale: 0.5,
        opacity: 0,
        zIndex: 7,
      };
    if (offset < -2)
      return {
        x: -(xFarOffset + 150),
        z: 500,
        rotateY: 75,
        scale: 0.5,
        opacity: 0,
        zIndex: 7,
      };

    return { x: 0, z: 0, rotateY: 0, scale: 0, opacity: 0 };
  };

  // Don't render carousel until images are loaded
  if (images.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505] text-white">
        Loading gallery...
      </div>
    );
  }

  // Determine the visible window of items (-2 to +2 relative to current index)
  const visibleOffsets = [-2, -1, 0, 1, 2];

  const items = visibleOffsets.map((offset) => {
    const absoluteIndex = currentIndex + offset;

    const imageIndex =
      ((absoluteIndex % images.length) + images.length) % images.length;

    return {
      key: absoluteIndex,
      src: images[imageIndex].image_url,
      offset,
    };
  });

  return (
    // Changed to min-h-screen and added pb-32 for bottom padding
    <div className="min-h-screen w-full relative bg-[#050505] overflow-hidden flex flex-col items-center justify-center pt-32 pb-32">
      {/* Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#ab1223]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#16434d]/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Edge Fades */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-[#050505] z-20 pointer-events-none opacity-80" />

      {/* Title */}
      <div className="w-full text-center z-30 pointer-events-none mb-12">
        <h1 className="text-3xl md:text-5xl font-heading font-black tracking-tight text-[#e6d6c3] uppercase">
          {activeLang === "de" ? "Tavernen-Galerie" : "Tavern Gallery"}
        </h1>
        <p className="text-[#e6d6c3]/60 font-sans tracking-[0.3em] uppercase mt-3 text-[10px] md:text-xs">
          {activeLang === "de"
            ? "Cocktails & Ambiente"
            : "Cocktails & Aesthetics"}
        </p>
      </div>

      {/* 3D Concave Carousel (Reduced container height) */}
      <div
        className="relative w-full h-[260px] md:h-[360px] flex items-center justify-center z-10"
        style={{ perspective: 1200 }}
      >
        <AnimatePresence initial={false} mode="popLayout">
          {items.map((item) => (
            <motion.div
              key={item.key}
              initial={{ ...getPosition(direction > 0 ? 3 : -3), opacity: 0 }}
              animate={getPosition(item.offset)}
              exit={{
                ...getPosition(direction > 0 ? -3 : 3),
                opacity: 0,
                zIndex: 0,
              }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="absolute inset-0 flex items-center justify-center"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Reduced image card dimensions */}
              <div className="w-[180px] h-[260px] md:w-[260px] md:h-[360px] relative rounded-xl overflow-hidden border border-[#e6d6c3]/15 shadow-[0_0_40px_rgba(0,0,0,0.6)]">
                <img
                  src={item.src}
                  alt={`Gallery ${item.key}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Controls & Progress Bar */}
      <div className="relative z-30 mt-16 flex flex-col items-center gap-6">
        {/* Control Buttons */}
        <div className="flex items-center gap-8">
          <button
            onClick={() => {
              setIsAutoPlaying(false);
              paginate(-1);
            }}
            className="text-[#e6d6c3]/60 hover:text-[#e6d6c3] transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>

          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="w-12 h-12 flex items-center justify-center rounded-full border border-[#e6d6c3]/30 text-[#e6d6c3] hover:border-[#ab1223] hover:text-[#ab1223] transition-all"
          >
            {isAutoPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 ml-1" />
            )}
          </button>

          <button
            onClick={() => {
              setIsAutoPlaying(false);
              paginate(1);
            }}
            className="text-[#e6d6c3]/60 hover:text-[#e6d6c3] transition-colors"
          >
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-64 h-1 bg-[#e6d6c3]/10 rounded-full overflow-hidden relative">
          <motion.div
            key={currentIndex + (isAutoPlaying ? "play" : "pause")}
            initial={{ width: "0%" }}
            animate={{ width: isAutoPlaying ? "100%" : "0%" }}
            transition={{
              duration: AUTOPLAY_INTERVAL / 1000,
              ease: "linear",
            }}
            className="absolute top-0 left-0 h-full bg-[#ab1223]"
          />
        </div>
      </div>
    </div>
  );
}
