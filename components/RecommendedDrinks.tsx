"use client";

import { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  animate,
} from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface DrinkItem {
  id: number;
  tag_en: string;
  tag_de: string;
  title_en: string;
  title_de: string;
  content_en: string;
  content_de: string;
  price: string;
  image_url: string;
}

export default function RecommendedDrinks() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [maxScroll, setMaxScroll] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  const { activeLang } = useLanguage();

  const [drinks, setDrinks] = useState<DrinkItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Track position using Framer Motion's useMotionValue
  const x = useMotionValue(0);

  // Viewport scroll tracking for parallax background and SVGs
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const yBg = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  // Parallax transforms for drawing SVGs
  const yCocktail = useTransform(scrollYProgress, [0, 1], [-70, 70]);
  const rotateSpice = useTransform(scrollYProgress, [0, 1], [0, 110]);

  useEffect(() => {
    const fetchDrinks = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/home-tavern-blends`,
        );

        const text = await res.text();

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const result = JSON.parse(text);

        if (result.success) {
          setDrinks(result.data);
        }
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDrinks();
  }, []);

  useEffect(() => {
    const updateBounds = () => {
      if (containerRef.current && trackRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const trackWidth = trackRef.current.scrollWidth;

        setMaxScroll(Math.max(0, trackWidth - containerWidth));
      }
    };

    // Wait until DOM is updated
    requestAnimationFrame(updateBounds);

    window.addEventListener("resize", updateBounds);

    return () => {
      window.removeEventListener("resize", updateBounds);
    };
  }, [drinks]);

  // Listen to drag coordinate changes and update custom progress bar
  useEffect(() => {
    return x.on("change", (latest) => {
      if (maxScroll > 0) {
        const pct = Math.min(100, Math.max(0, (-latest / maxScroll) * 100));
        setScrollProgress(pct);
      } else {
        setScrollProgress(0);
      }
    });
  }, [maxScroll, x]);

  // Step carousel offset on navigation clicks
  const handlePrev = () => {
    const currentX = x.get();
    const nextX = Math.min(0, currentX + 384); // Card width (360) + gap (24)
    animate(x, nextX, { type: "spring", stiffness: 300, damping: 30 });
  };

  const handleNext = () => {
    const currentX = x.get();
    const nextX = Math.max(-maxScroll, currentX - 384);
    animate(x, nextX, { type: "spring", stiffness: 300, damping: 30 });
  };

  if (loading) {
    return (
      <section className="py-24 text-center text-white">Loading...</section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-24 md:py-32 overflow-hidden text-[#e6d6c3] border-t border-[#e6d6c3]/15"
    >
      {/* Scroll Parallax Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1920&q=80')`,
            y: yBg,
            willChange: "transform",
          }}
          className="absolute inset-x-0 -top-[15%] -bottom-[15%] bg-cover bg-center"
        />
      </div>

      {/* Dark semi-transparent overlay mask */}
      <div className="absolute inset-0 bg-[#050505]/85 z-0" />

      {/* Drawing SVG: Hand-drawn Cocktail Outline (Left side) */}
      <motion.div
        style={{ y: yCocktail, willChange: "transform" }}
        className="absolute left-4 top-[15%] w-[220px] h-[220px] text-[#e6d6c3] opacity-[0.05] pointer-events-none select-none z-10 hidden lg:block"
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

      {/* Drawing SVG: Hand-drawn Star Anise (Right side) */}
      <motion.div
        style={{ rotate: rotateSpice, willChange: "transform" }}
        className="absolute right-6 bottom-[10%] w-[180px] h-[180px] text-[#e6d6c3] opacity-[0.04] pointer-events-none select-none z-10 hidden lg:block"
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          strokeLinecap="round"
          className="w-full h-full"
        >
          <path d="M50,50 L50,15 Q45,25 50,50 Q55,25 50,15" />
          <path d="M50,50 L85,50 Q75,45 50,50 Q75,55 85,50" />
          <path d="M50,50 L50,85 Q45,75 50,50 Q55,75 50,85" />
          <path d="M50,50 L15,50 Q25,45 50,50 Q25,55 15,50" />
          <path d="M50,50 L25,25 Q35,32 50,50 Q32,35 25,25" />
          <path d="M50,50 L75,75 Q65,68 50,50 Q68,65 75,75" />
          <path d="M50,50 L25,75 Q32,65 50,50 Q35,68 25,75" />
          <path d="M50,50 L75,25 Q68,32 50,50 Q65,35 75,25" />
          <circle cx="50" cy="50" r="3" />
        </svg>
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 md:px-16 relative z-10">
        {/* Section Header with Desktop Navigation Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="overflow-hidden py-1">
              <motion.h2
                initial={{ y: "100%" }}
                whileInView={{ y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
                className="text-3xl md:text-5xl font-heading font-black tracking-tight leading-none text-white uppercase mb-6"
              >
                {activeLang === "de"
                  ? "Unsere Tavernen-Spezialitäten"
                  : "Signature Tavern Blends"}
              </motion.h2>
            </div>
            <p className="font-sans text-sm md:text-base text-[#e6d6c3]/80 leading-relaxed">
              {activeLang === "de"
                ? "Ziehen Sie durch die Galerie oder nutzen Sie die Navigationssteuerung, um die Gewürze, Spirituosen und Geschichten hinter unseren beliebtesten Kreationen zu entdecken."
                : "Drag the gallery or use the navigation controls to explore the spices, spirits, and stories behind our most recommended creations."}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4 self-end md:self-auto">
            <button
              onClick={handlePrev}
              className="w-12 h-12 rounded-lg border border-[#e6d6c3]/20 bg-[#050505]/60 hover:bg-[#ab1223] hover:border-[#ab1223] text-white flex items-center justify-center transition-all duration-300 group cursor-pointer"
              aria-label="Previous Drink"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={handleNext}
              className="w-12 h-12 rounded-lg border border-[#e6d6c3]/20 bg-[#050505]/60 hover:bg-[#ab1223] hover:border-[#ab1223] text-white flex items-center justify-center transition-all duration-300 group cursor-pointer"
              aria-label="Next Drink"
            >
              <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Draggable Gallery Container */}
        <div
          ref={containerRef}
          className="w-full overflow-hidden cursor-grab active:cursor-grabbing"
        >
          <motion.div
            ref={trackRef}
            drag="x"
            dragConstraints={{ left: -maxScroll, right: 0 }}
            dragElastic={0.1}
            style={{ x }}
            className="flex gap-6 w-max py-4"
          >
            {drinks.map((drink) => (
              <div
                key={drink.id}
                className="relative flex-shrink-0 w-[280px] sm:w-[320px] md:w-[360px] h-[450px] rounded-lg overflow-hidden group border border-[#e6d6c3]/15 flex flex-col justify-end p-8 select-none"
              >
                {/* Full-bleed Card Background Image */}
                <div className="absolute inset-0 z-0">
                  <img
                    src={drink.image_url}
                    alt={
                      activeLang === "de"
                        ? drink.title_de || drink.title_en
                        : drink.title_en
                    }
                    draggable="false"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 pointer-events-none select-none"
                  />
                  {/* Linear mask for typography readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent opacity-85 group-hover:opacity-95 transition-opacity duration-300" />
                </div>

                {/* Top Overlay category tag */}
                <div className="absolute top-6 left-6 z-20">
                  <span className="px-3.5 py-1 bg-[#ab1223] text-white text-xs md:text-sm uppercase tracking-[0.15em] font-sans font-bold rounded">
                    {activeLang === "de"
                      ? drink.tag_de || drink.tag_en
                      : drink.tag_en}
                  </span>
                </div>

                {/* Price tag in top right */}
                <div className="absolute top-6 right-6 z-20">
                  <span className="text-sm md:text-base font-mono font-bold text-[#e6d6c3] bg-black/60 px-2.5 py-1 rounded-md border border-[#e6d6c3]/15">
                    €{drink.price}
                  </span>
                </div>

                {/* Bottom Overlay text stack */}
                <div className="relative z-10 w-full flex flex-col items-start">
                  <h3 className="text-xl md:text-2xl font-heading font-black text-white uppercase tracking-wide leading-tight transition-colors duration-300 group-hover:text-[#e6d6c3]">
                    {activeLang === "de"
                      ? drink.title_de || drink.title_en
                      : drink.title_en}
                  </h3>

                  {/* Elegant vertical divider */}
                  <div className="w-8 h-[2px] bg-[#ab1223] my-3 group-hover:w-16 transition-all duration-500" />

                  {/* Description revealed on hover */}
                  <div className="font-sans text-xs md:text-sm text-[#e6d6c3]/80 leading-relaxed max-h-0 opacity-0 group-hover:max-h-[120px] group-hover:opacity-100 transition-all duration-500 ease-out overflow-hidden">
                    <div
                      dangerouslySetInnerHTML={{
                        __html:
                          activeLang === "de"
                            ? drink.content_de || drink.content_en
                            : drink.content_en,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Progress Bar */}
        <div className="mt-12 w-full max-w-md mx-auto h-[2px] bg-[#e6d6c3]/10 relative rounded-full overflow-hidden">
          <motion.div
            className="absolute left-0 top-0 bottom-0 bg-[#ab1223]"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      </div>
    </section>
  );
}
