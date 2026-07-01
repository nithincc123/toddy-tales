"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface MenuCard {
  id: string;
  tag: string;
  subtitle: string;
  title: string;
  description: string;
  highlights: string[];
  image: string | null;
}

interface MenuResponse {
  content1_en: MenuCard;
  content1_de: MenuCard;

  content2_en: MenuCard;
  content2_de: MenuCard;

  content3_en: MenuCard;
  content3_de: MenuCard;

  content4_en: MenuCard;
  content4_de: MenuCard;

  image1_url: string | null;
  image2_url: string | null;
  image3_url: string | null;
  image4_url: string | null;
}

export default function MenuShowcase() {
  const { activeLang } = useLanguage();

  const [page, setPage] = useState<MenuResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const yPlate = useTransform(scrollYProgress, [0, 1], [-80, 80]);
  const yCutlery = useTransform(scrollYProgress, [0, 1], [80, -80]);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/home-tavern-offerings`;

        console.log(url);

        const res = await fetch(url);

        console.log("Status:", res.status);
        console.log("Content-Type:", res.headers.get("content-type"));

        const text = await res.text();

        console.log("Raw Response:");
        console.log(text);

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const result = JSON.parse(text);

        if (result.success) {
          setPage(result.data);
        }
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  };

  const menus: MenuCard[] = page
    ? [
        {
          ...(activeLang === "de" ? page.content1_de : page.content1_en),
          image: page.image1_url,
        },
        {
          ...(activeLang === "de" ? page.content2_de : page.content2_en),
          image: page.image2_url,
        },
        {
          ...(activeLang === "de" ? page.content3_de : page.content3_en),
          image: page.image3_url,
        },
        {
          ...(activeLang === "de" ? page.content4_de : page.content4_en),
          image: page.image4_url,
        },
      ]
    : [];

  return (
    <section
      ref={sectionRef}
      id="menu"
      className="relative w-full py-24 md:py-32 bg-[#e6d6c3] text-[#050505] overflow-hidden"
    >
      {/* Decorative subtle ambient glows */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-[#16434d]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-[#ab1223]/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Hand-drawn Food Plate SVG (Left side background) */}
      <motion.div
        style={{ y: yPlate, willChange: "transform" }}
        className="absolute left-6 top-[20%] w-[200px] h-[200px] text-[#16434d] opacity-[0.05] pointer-events-none select-none z-0 hidden lg:block"
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          className="w-full h-full"
        >
          <path d="M15,75 L85,75" />
          <path d="M25,75 C25,45 75,45 75,75" />
          <circle cx="50" cy="40" r="4" />
          <path d="M45,30 Q47,23 44,18" />
          <path d="M52,32 Q54,25 51,20" />
        </svg>
      </motion.div>

      {/* Hand-drawn Cutlery SVG (Right side background) */}
      <motion.div
        style={{ y: yCutlery, willChange: "transform" }}
        className="absolute right-6 top-[35%] w-[160px] h-[160px] text-[#16434d] opacity-[0.05] pointer-events-none select-none z-0 hidden lg:block"
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

      <div className="max-w-7xl mx-auto px-6 md:px-16 relative z-10">
        {/* Section Header - No label above title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="overflow-hidden py-1">
            <motion.h2
              initial={{ y: "100%" }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
              className="text-3xl md:text-5xl font-heading font-black tracking-tight leading-none text-[#050505] uppercase"
            >
              {activeLang === "de"
                ? "Das Angebot der Taverne"
                : "The Tavern Offerings"}
            </motion.h2>
          </div>
          <p className="font-sans text-sm md:text-base text-[#16434d] max-w-md leading-relaxed">
            {activeLang === "de"
              ? "Mit regionalen Bio-Produkten aus Berlin und authentischen Gewürzen aus Kerala zubereitet. Wählen Sie eine Speisekarte aus, um unsere besonderen Kreationen zu entdecken."
              : "Crafted with local Berlin organic products and authentic Kerala spices. Select a menu card to preview signature creations."}
          </p>
        </div>

        {/* 2x2 Grid of Large Cards (Shadowless, borderless, rounded corners) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {menus.map((menu, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: index * 0.15 }}
              onMouseMove={handleMouseMove}
              className="group relative aspect-[4/5] overflow-hidden bg-teal/10 cursor-pointer rounded-lg"
            >
              {/* Spotlight cursor glow tracker */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20"
                style={{
                  background: `radial-gradient(circle 150px at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(230,214,195,0.12), transparent)`,
                }}
              />
              {/* Star of the card: The Image (No borders/shadows, inherits rounded corners) */}
              <div className="absolute inset-0 z-0">
                <img
                  src={menu.image || ""}
                  alt={`${menu.title} - ${menu.subtitle}`}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-85 group-hover:opacity-95 transition-opacity duration-300" />
              </div>

              {/* Tag in the top left */}
              <div className="absolute top-4 left-4 z-10">
                <span className="px-3.5 py-1 bg-wine text-beige text-[10px] md:text-sm uppercase tracking-[0.2em] font-semibold rounded-md">
                  {menu.tag}
                </span>
              </div>

              {/* Interactive arrow icon */}
              <div className="absolute top-4 right-4 z-10 w-10 h-10 rounded-lg bg-black/60 flex items-center justify-center text-beige group-hover:bg-wine transition-all duration-300">
                <ArrowUpRight className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300" />
              </div>

              {/* Card Contents (Overlay Text) */}
              <div className="absolute inset-0 z-10 flex flex-col justify-end p-6 md:p-8">
                <span className="font-sans text-xs md:text-sm uppercase tracking-[0.25em] text-[#e6d6c3]/80 font-bold mb-1">
                  {menu.subtitle}
                </span>
                <h3 className="text-2xl md:text-3xl font-heading font-black text-white mb-3 transition-colors duration-300">
                  {menu.title}
                </h3>

                {/* Description */}
                <p className="font-sans text-xs md:text-sm text-beige/70 leading-relaxed mb-4 max-w-md line-clamp-2 md:line-clamp-none">
                  {menu.description}
                </p>

                {/* Divider */}
                <div className="w-full h-px bg-beige/10 my-2" />

                {/* Highlights */}
                <div className="flex flex-wrap gap-x-6 gap-y-1.5 mt-2">
                  {menu.highlights.map((dish, i) => (
                    <span
                      key={i}
                      className="text-[10px] md:text-sm font-heading tracking-widest text-beige/90 flex items-center gap-1.5"
                    >
                      <span className="w-1.5 h-1.5 bg-wine block rounded-full" />
                      {dish}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
