"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

const IMAGES = [
  "https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=200&h=200&q=30&fm=webp", // Cheers cocktail glass
  "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=200&h=200&q=30&fm=webp", // Toasting wine
  "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=200&h=200&q=30&fm=webp", // Cocktail mixology pour
  "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=200&h=200&q=30&fm=webp", // Food and bar table atmosphere
  "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=200&h=200&q=30&fm=webp", // Cozy group celebration
  "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=200&h=200&q=30&fm=webp", // Ambient bar counter
];

// Double the images array to enable seamless infinite scrolling loop
const scrollColumn1 = [...IMAGES, ...IMAGES];
const scrollColumn2 = [...IMAGES.slice(2), ...IMAGES, ...IMAGES.slice(0, 2)];
const scrollColumn3 = [...IMAGES.slice(4), ...IMAGES, ...IMAGES.slice(0, 4)];

interface StoryItem {
  id: number;
  title_en: string;
  title_de: string;
  content_en: string;
  content_de: string;
}

export default function StoryTellingSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { activeLang } = useLanguage();

  const [story, setStory] = useState<StoryItem | null>(null);
  const [loading, setLoading] = useState(true);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/home-toddy-desc`,
        );

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const result = await res.json();

        if (result.success) {
          setStory(result.data);
        }
      } catch (error) {
        console.error("Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStory();
  }, []);

  const isInView = useInView(sectionRef, { margin: "200px 0px" });

  // Track scroll progress of this section

  const { scrollYProgress } = useScroll(
    mounted
      ? {
          target: sectionRef,
          offset: ["start end", "end start"],
        }
      : {},
  );

  // Parallax translation transforms for background SVGs
  const yLeaf = useTransform(scrollYProgress, [0, 1], [-80, 80]);
  const ySprig = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const rotateRing = useTransform(scrollYProgress, [0, 1], [0, 120]);

  return (
    <section
      ref={sectionRef}
      id="story"
      className="relative w-full py-32 md:py-48 overflow-hidden flex items-center justify-center min-h-[650px] bg-[#0b2126]"
    >
      {/* Morphing Background Blob 1 */}
      <div className="absolute top-[10%] left-[10%] w-[450px] h-[450px] rounded-full bg-[#16434d]/25 blur-[100px] pointer-events-none z-0">
        <motion.svg
          viewBox="0 0 200 200"
          className="w-full h-full text-[#16434d]"
        >
          <motion.path
            fill="currentColor"
            animate={
              isInView
                ? {
                    d: [
                      "M45,-65.2C58.8,-57.8,70.8,-46.3,77.5,-32C84.2,-17.7,85.6,-0.6,81.1,14.6C76.6,29.9,66.1,43.2,53.4,54.7C40.6,66.1,25.6,75.7,8.6,76.5C-8.4,77.3,-27.3,69.3,-41.8,58.3C-56.3,47.3,-66.4,33.3,-72,17.4C-77.5,1.5,-78.6,-16.3,-72.6,-31C-66.5,-45.8,-53.4,-57.5,-39,-64.5C-24.6,-71.5,-9,-73.8,4.2,-79.6C17.4,-85.4,29,-72.5,45,-65.2Z",
                      "M52.3,-73.2C67.4,-65.3,79,-50.2,84.1,-33.1C89.3,-16,88.1,3,83.5,20.4C78.9,37.8,70.9,53.6,57.7,64.2C44.6,74.7,26.3,80.1,7.9,79C-10.5,77.9,-29.4,70.3,-44.8,59.3C-60.3,48.2,-72.2,33.6,-77.2,16.7C-82.3,-0.3,-80.4,-19.7,-72.7,-35C-65,-50.4,-51.5,-61.8,-36.8,-69.8C-22,-77.8,-6,-82.5,10.6,-83.9C27.2,-85.4,44,-81,52.3,-73.2Z",
                      "M45,-65.2C58.8,-57.8,70.8,-46.3,77.5,-32C84.2,-17.7,85.6,-0.6,81.1,14.6C76.6,29.9,66.1,43.2,53.4,54.7C40.6,66.1,25.6,75.7,8.6,76.5C-8.4,77.3,-27.3,69.3,-41.8,58.3C-56.3,47.3,-66.4,33.3,-72,17.4C-77.5,1.5,-78.6,-16.3,-72.6,-31C-66.5,-45.8,-53.4,-57.5,-39,-64.5C-24.6,-71.5,-9,-73.8,4.2,-79.6C17.4,-85.4,29,-72.5,45,-65.2Z",
                    ],
                  }
                : {}
            }
            transition={{
              duration: 15,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
            }}
            transform="translate(100 100)"
          />
        </motion.svg>
      </div>

      {/* Morphing Background Blob 2 */}
      <div className="absolute bottom-[5%] right-[10%] w-[500px] h-[500px] rounded-full bg-[#ab1223]/15 blur-[110px] pointer-events-none z-0">
        <motion.svg
          viewBox="0 0 200 200"
          className="w-full h-full text-[#ab1223]"
        >
          <motion.path
            fill="currentColor"
            animate={
              isInView
                ? {
                    d: [
                      "M39.9,-54.6C52.7,-47.4,64.8,-37.6,72,-24.8C79.2,-12,81.4,3.7,78.2,18.7C75.1,33.7,66.5,47.9,54.1,57C41.7,66.2,25.5,70.3,9.5,71.5C-6.5,72.6,-22.3,70.8,-36.8,63.9C-51.4,57.1,-64.7,45.2,-71.3,30.3C-77.8,15.5,-77.6,-2.4,-72.6,-18.2C-67.7,-34,-57.9,-47.8,-44.9,-54.8C-31.9,-61.7,-16,-62,-0.5,-61.3C15,-60.6,30.1,-62.7,39.9,-54.6Z",
                      "M47.7,-60.8C60.2,-51.7,67.6,-35.6,71.2,-19C74.8,-2.4,74.7,14.6,68.5,29.3C62.3,43.9,50,56.1,35.5,63.8C21.1,71.5,7,74.7,-7.1,73.8C-21.2,73,-35.3,68.1,-46.8,59.3C-58.3,50.6,-67.2,37.9,-71.6,23.5C-75.9,9.1,-75.8,-7,-71,-21.8C-66.2,-36.5,-56.9,-49.9,-44.3,-58.9C-31.8,-67.9,-15.9,-72.5,0.7,-73.4C17.3,-74.3,34.7,-71.4,47.7,-60.8Z",
                      "M39.9,-54.6C52.7,-47.4,64.8,-37.6,72,-24.8C79.2,-12,81.4,3.7,78.2,18.7C75.1,33.7,66.5,47.9,54.1,57C41.7,66.2,25.5,70.3,9.5,71.5C-6.5,72.6,-22.3,70.8,-36.8,63.9C-51.4,57.1,-64.7,45.2,-71.3,30.3C-77.8,15.5,-77.6,-2.4,-72.6,-18.2C-67.7,-34,-57.9,-47.8,-44.9,-54.8C-31.9,-61.7,-16,-62,-0.5,-61.3C15,-60.6,30.1,-62.7,39.9,-54.6Z",
                    ],
                  }
                : {}
            }
            transition={{
              duration: 18,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
            }}
            transform="translate(100 100)"
          />
        </motion.svg>
      </div>

      {/* 
        Background Continuous Upward Scroll Carousel 
        Features client memories of tavern cheers and toasts.
      */}
      <div className="absolute inset-0 z-0 opacity-25 flex gap-4 md:gap-6 px-4 overflow-hidden pointer-events-none select-none">
        {/* Column 1 - Slow Upward Scroll */}
        <div
          className={`flex-1 flex flex-col gap-4 md:gap-6 will-change-transform ${isInView ? "animate-scroll-up-slow" : ""}`}
        >
          {scrollColumn1.map((src, i) => (
            <img
              key={`c1-${i}`}
              src={src}
              alt="Client memory moment"
              className="w-full aspect-square object-cover rounded-lg"
              loading="lazy"
            />
          ))}
        </div>

        {/* Column 2 - Medium Upward Scroll */}
        <div
          className={`flex-1 flex flex-col gap-4 md:gap-6 will-change-transform mt-12 ${isInView ? "animate-scroll-up-medium" : ""}`}
        >
          {scrollColumn2.map((src, i) => (
            <img
              key={`c2-${i}`}
              src={src}
              alt="Client memory moment"
              className="w-full aspect-square object-cover rounded-lg"
              loading="lazy"
            />
          ))}
        </div>

        {/* Column 3 - Fast Upward Scroll */}
        <div
          className={`flex-1 flex flex-col gap-4 md:gap-6 will-change-transform ${isInView ? "animate-scroll-up-fast" : ""}`}
        >
          {scrollColumn3.map((src, i) => (
            <img
              key={`c3-${i}`}
              src={src}
              alt="Client memory moment"
              className="w-full aspect-square object-cover rounded-lg"
              loading="lazy"
            />
          ))}
        </div>
      </div>

      {/* Dark Overlay Mask for High Contrast Readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0b2126]/95 via-[#0b2126]/85 to-[#0b2126]/95 z-10" />

      {/* Hand-drawn Palm Leaf Left (Linked to Scroll Parallax yLeaf) */}
      <motion.div
        style={{ y: yLeaf, willChange: "transform" }}
        className="absolute left-[-100px] top-[10%] w-[350px] h-[350px] text-[#e6d6c3] opacity-[0.06] pointer-events-none select-none z-10"
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
          <path d="M10,90 C40,70 50,50 60,10" />
          <path d="M60,10 C52,25 35,40 20,45" />
          <path d="M60,10 C55,30 42,48 28,52" />
          <path d="M60,10 C58,35 48,56 36,60" />
          <path d="M60,10 C61,42 54,64 44,68" />
          <path d="M60,10 C68,25 80,40 90,45" />
          <path d="M60,10 C65,30 75,48 82,52" />
          <path d="M60,10 C62,35 70,56 76,60" />
          <path d="M60,10 C59,42 66,64 70,68" />
        </svg>
      </motion.div>

      {/* Hand-drawn botanical sprig right (Linked to Scroll Parallax ySprig) */}
      <motion.div
        style={{ y: ySprig, willChange: "transform" }}
        className="absolute right-[-80px] bottom-[10%] w-[300px] h-[300px] text-[#e6d6c3] opacity-[0.06] pointer-events-none select-none z-10"
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          strokeLinecap="round"
          className="w-full h-full"
        >
          <path d="M90,90 Q50,70 30,20" />
          <path d="M30,20 Q20,30 15,35 C12,38 15,42 20,40 C25,38 30,30 30,20" />
          <path d="M42,38 Q30,48 22,50 C18,52 20,56 25,54 C30,52 38,45 42,38" />
          <path d="M54,54 Q40,64 32,65 C28,66 30,70 35,68 C40,66 50,58 54,54" />
          <path d="M66,70 Q55,78 48,78 C44,78 45,82 50,80 C55,78 62,72 66,70" />
        </svg>
      </motion.div>

      {/* Hand-drawn abstract lines centered background (Linked to Scroll Parallax rotateRing) */}
      <motion.div
        style={{ rotate: rotateRing, willChange: "transform" }}
        className="absolute left-[10%] top-[35%] w-[150px] h-[150px] text-[#e6d6c3] opacity-[0.05] pointer-events-none select-none z-10"
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          className="w-full h-full"
        >
          <circle cx="50" cy="50" r="45" strokeDasharray="3 3" />
          <circle cx="50" cy="50" r="30" strokeDasharray="5 5" />
          <circle cx="50" cy="50" r="15" strokeDasharray="1 4" />
        </svg>
      </motion.div>

      {/* Page 3: About Us Content */}
      <div className="relative z-20 max-w-4xl mx-auto text-center px-6 md:px-12 flex flex-col items-center">
        {/* Header - Page title and main headline */}
        <div className="flex flex-col items-center mb-8">
          <div className="overflow-hidden py-1">
            <motion.h2
              initial={{ y: "100%" }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-black tracking-tight leading-tight text-white uppercase"
            >
              {activeLang === "de"
                ? story?.title_de || story?.title_en
                : story?.title_en}
            </motion.h2>
          </div>
        </div>

        {/* Toddy Description, Style, Inspiration, and Quality (Centered & Minimal) */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="font-sans text-base sm:text-lg md:text-xl leading-relaxed text-[#e6d6c3]/90 max-w-3xl"
        >
          {activeLang === "de"
            ? story?.content_de || story?.content_en
            : story?.content_en}
        </motion.p>

        {/* Navigation Cue */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-12"
        >
          <a
            href="#reservations-page"
            className="inline-flex items-center gap-3 font-heading text-xs md:text-sm tracking-[0.25em] text-white hover:text-wine uppercase font-bold transition-colors duration-300 group"
          >
            {activeLang === "de"
              ? "Buchen Sie Ihr Erlebnis"
              : "Book Your Experience"}
            <span className="w-8 h-px bg-white group-hover:bg-wine group-hover:w-12 transition-all duration-300" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
