"use client";

import { useRef, useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import { Heart, MessageCircle, X, ExternalLink } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

interface GalleryItem {
  id: string;
  image: string;
  caption_en: string;
  caption_de: string;
}

export default function InstagramGallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  const { activeLang } = useLanguage();

  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);

  // Track scroll position of the gallery section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Scroll transforms for vertical column parallax
  const yLeft = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const yCenter = useTransform(scrollYProgress, [0, 1], [-80, 80]);
  const yRight = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const yCutlery = useTransform(scrollYProgress, [0, 1], [-70, 70]);
  const yPepper = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const yCocktail = useTransform(scrollYProgress, [0, 1], [-50, 50]);
  const rotateRing = useTransform(scrollYProgress, [0, 1], [0, 90]);

  // 👇 ADD THE useEffect HERE
  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/home-tavern-moments`,
        );

        if (!res.ok) throw new Error("Failed");

        const result = await res.json();

        if (result.success) {
          const page = result.data;

          const items: GalleryItem[] = [
            {
              id: "1",
              image: page.image_url1,
              caption_en: page.content1_en,
              caption_de: page.content1_de,
            },
            {
              id: "2",
              image: page.image_url2,
              caption_en: page.content2_en,
              caption_de: page.content2_de,
            },
            {
              id: "3",
              image: page.image_url3,
              caption_en: page.content3_en,
              caption_de: page.content3_de,
            },
            {
              id: "4",
              image: page.image_url4,
              caption_en: page.content4_en,
              caption_de: page.content4_de,
            },
            {
              id: "5",
              image: page.image_url5,
              caption_en: page.content5_en,
              caption_de: page.content5_de,
            },
            {
              id: "6",
              image: page.image_url6,
              caption_en: page.content6_en,
              caption_de: page.content6_de,
            },
          ];

          setGalleryItems(items);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchGallery();
  }, []);

  const COLUMN_1 = galleryItems.slice(0, 2);
  const COLUMN_2 = galleryItems.slice(2, 4);
  const COLUMN_3 = galleryItems.slice(4, 6);

  const handleOpenLightbox = (e: React.MouseEvent, item: GalleryItem) => {
    e.preventDefault();
    setActiveItem(item);
  };

  const renderPost = (item: GalleryItem) => (
    <div
      key={item.id}
      onClick={(e) => handleOpenLightbox(e, item)}
      className="group relative overflow-hidden bg-black/10 block w-full aspect-[4/5] sm:aspect-[3/4] rounded-lg cursor-pointer"
    >
      <img
        src={item.image}
        alt=""
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center gap-5">
        <InstagramIcon className="w-8 h-8 text-[#e6d6c3]" />

        <span className="text-xs uppercase tracking-[0.25em] text-[#e6d6c3]">
          {activeLang === "de" ? "Details ansehen" : "View Details"}
        </span>
      </div>
    </div>
  );

  return (
    <section
      ref={containerRef}
      id="gallery"
      className="relative w-full py-24 md:py-32 bg-[#ab1223] text-[#e6d6c3] overflow-hidden"
    >
      {/* Hand-drawn Cutlery SVG (Left side background) */}
      <motion.div
        style={{ y: yCutlery, willChange: "transform" }}
        className="absolute left-6 top-[25%] w-[160px] h-[160px] text-[#e6d6c3] opacity-[0.05] pointer-events-none select-none z-0 hidden lg:block"
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          strokeLinecap="round"
          className="w-full h-full"
        >
          <path d="M35,65 L35,85" />
          <path d="M30,30 L30,50 C30,60 40,60 40,50 L40,30" />
          <path d="M35,30 L35,65" />
          <path d="M65,60 L65,85" />
          <path d="M65,30 L65,60" />
          <path d="M65,30 C60,30 58,40 58,55 L65,60" />
        </svg>
      </motion.div>

      {/* Hand-drawn Chili Pepper SVG (Right side background) */}
      <motion.div
        style={{ y: yPepper, willChange: "transform" }}
        className="absolute right-6 top-[20%] w-[180px] h-[180px] text-[#e6d6c3] opacity-[0.05] pointer-events-none select-none z-0 hidden lg:block"
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          strokeLinecap="round"
          className="w-full h-full"
        >
          <path d="M60,15 Q65,10 68,12 Q70,15 65,20 C55,32 50,50 50,70 C50,80 43,88 35,85 C28,82 30,70 38,55 C45,40 50,25 60,15 Z" />
          <path d="M63,14 Q65,8 60,6" strokeWidth="1" />
        </svg>
      </motion.div>

      {/* Drawing SVG: Hand-drawn Cocktail Outline (Background texture) */}
      <motion.div
        style={{ y: yCocktail, willChange: "transform" }}
        className="absolute right-[20%] top-[10%] w-[180px] h-[180px] text-[#e6d6c3] opacity-[0.04] pointer-events-none select-none z-0 hidden lg:block"
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-full h-full"
        >
          <path d="M30,20 L70,20 L50,55 Z" />
          <path d="M50,55 L50,85" />
          <path d="M40,85 L60,85" />
          <circle cx="68" cy="18" r="6" />
          <path d="M68,12 L68,24" />
          <path d="M62,18 L74,18" />
          <path d="M45,45 L35,12" strokeWidth="0.8" />
        </svg>
      </motion.div>

      {/* Concentric abstract rings for background texture */}
      <motion.div
        style={{ rotate: rotateRing, willChange: "transform" }}
        className="absolute left-[25%] bottom-[12%] w-[260px] h-[260px] text-[#e6d6c3] opacity-[0.03] pointer-events-none select-none z-0 hidden lg:block"
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          className="w-full h-full"
        >
          <circle cx="50" cy="50" r="45" strokeDasharray="3 3" />
          <circle cx="50" cy="50" r="33" strokeDasharray="6 6" />
          <circle cx="50" cy="50" r="21" strokeDasharray="1 4" />
        </svg>
      </motion.div>

      {/* Organic wavy line across background */}
      <div className="absolute top-0 left-0 right-0 h-24 text-[#e6d6c3] opacity-[0.04] pointer-events-none z-0">
        <svg
          viewBox="0 0 1440 100"
          fill="none"
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <path
            d="M0,50 C360,20 720,80 1080,40 C1260,20 1350,60 1440,50"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-16 relative z-10">
        {/* Header - No subheadings/labels */}
        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-3xl md:text-5xl font-heading font-black tracking-tight leading-none mb-6 uppercase text-white">
            {activeLang === "de" ? "Momente aus der Taverne" : "Tavern Moments"}
          </h2>

          <p className="font-sans text-sm md:text-base text-[#e6d6c3]/80 max-w-xl mx-auto leading-relaxed">
            {activeLang === "de"
              ? "Eine visuelle Sammlung unserer Gewürzröstungen, Cocktailkreationen und unvergesslichen Gästemomente in der Torstraße. Folgen Sie unseren täglichen Updates auf "
              : "A visual collage of our spice-roasting, cocktail pouring, and guest memories at Torstraße. Follow our daily updates on "}
            <a
              href="https://instagram.com/toddytales.de"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-bold hover:text-white transition-colors duration-300"
            >
              @toddytales.de
            </a>
          </p>
        </div>

        {/* Parallax Scroll Columns (Desktop) / Normal Grid (Mobile) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-start">
          {/* Column 1 (Left) */}
          <motion.div
            style={{ y: yLeft, willChange: "transform" }}
            className="flex flex-col gap-6 lg:gap-8"
          >
            {COLUMN_1.map(renderPost)}
          </motion.div>

          {/* Column 2 (Center) */}
          <motion.div
            style={{ y: yCenter, willChange: "transform" }}
            className="flex flex-col gap-6 lg:gap-8 md:mt-12"
          >
            {COLUMN_2.map(renderPost)}
          </motion.div>

          {/* Column 3 (Right) */}
          <motion.div
            style={{ y: yRight, willChange: "transform" }}
            className="flex flex-col gap-6 lg:gap-8"
          >
            {COLUMN_3.map(renderPost)}
          </motion.div>
        </div>
      </div>

      {/* Lightbox Modal Overlay */}
      <AnimatePresence>
        {activeItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 md:p-10 backdrop-blur-sm"
          >
            {/* Close trigger overlay */}
            <div
              className="absolute inset-0 cursor-pointer"
              onClick={() => setActiveItem(null)}
            />

            {/* Modal Card content */}
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="relative bg-[#050505] border border-[#ab1223]/30 w-full max-w-4xl rounded-lg overflow-hidden grid grid-cols-1 md:grid-cols-12 max-h-[85vh] md:max-h-[75vh] z-10"
            >
              {/* Close button */}
              <button
                onClick={() => setActiveItem(null)}
                className="absolute top-4 right-4 z-20 w-8 h-8 rounded-lg bg-black/70 flex items-center justify-center text-[#e6d6c3] hover:bg-[#ab1223] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Left Column: Image (fits modal height) */}
              <div className="md:col-span-7 bg-[#16434d]/10 flex items-center justify-center overflow-hidden h-[40vh] md:h-full">
                <img
                  src={activeItem.image}
                  alt={
                    activeLang === "de"
                      ? activeItem.caption_de || activeItem.caption_en
                      : activeItem.caption_en
                  }
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Right Column: Interaction details */}
              <div className="md:col-span-5 p-6 md:p-8 flex flex-col justify-between h-auto md:h-full bg-[#050505] text-[#e6d6c3]">
                <div className="space-y-6">
                  {/* Branding */}
                  <div className="flex items-center gap-3">
                    <img
                      src="/logo/ToddyTales_Logo_white.png"
                      alt="Toddy Tales"
                      className="h-8 w-auto object-contain"
                    />
                    <span className="text-[10px] md:text-sm tracking-widest uppercase font-sans font-bold text-[#ab1223]">
                      Berlin Mitte
                    </span>
                  </div>

                  {/* Caption */}
                  <p className="font-sans text-sm md:text-base leading-relaxed text-[#e6d6c3]/90">
                    {activeLang === "de"
                      ? activeItem.caption_de || activeItem.caption_en
                      : activeItem.caption_en}
                  </p>
                </div>

                {/* Redirect button to Instagram */}
                <div className="pt-8">
                  <a
                    href="https://instagram.com/toddytales.de"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 border border-[#ab1223] bg-[#ab1223] hover:bg-[#16434d] hover:border-[#16434d] text-white font-sans text-xs md:text-sm tracking-[0.2em] uppercase font-bold transition-all duration-300 rounded-lg flex items-center justify-center gap-2"
                  >
                    <span>
                      {" "}
                      {activeLang === "de"
                        ? "Auf Instagram ansehen"
                        : "View on Instagram"}{" "}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
