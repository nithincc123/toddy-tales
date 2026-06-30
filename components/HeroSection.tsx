"use client";

import { motion } from "framer-motion";
import { ChevronDown, MapPin, Calendar, Compass } from "lucide-react";
import Button from "./Button";
import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

interface HeroSectionProps {
  onReservationClick: () => void;
}

interface Banner {
  id: number;
  title_en: string;
  content_en: string;
  title_de: string;
  content_de: string;
  video_url: string;
}

export default function HeroSection({ onReservationClick }: HeroSectionProps) {
  const { activeLang } = useLanguage();
  const [banner, setBanner] = useState<Banner | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBanner() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/home-banner`,
        );

        const result = await response.json();

        if (result.success) {
          setBanner(result.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchBanner();
  }, []);

  return (
    <section className="relative h-screen max-h-[700px] sm:max-h-none w-full overflow-hidden flex flex-col justify-between select-none bg-black">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          key={banner?.video_url}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-60"
        >
          <source src={banner?.video_url} type="video/mp4" />
        </video>
        {/* Dark overlay gradients for contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/85 via-[#050505]/45 to-[#050505]/95 z-10" />
      </div>

      {/* Main Content Area: Brand Logo & Title Centered */}
      <div className="relative z-10 px-6 md:px-16 text-center flex-grow flex flex-col justify-center items-center w-full max-w-5xl mx-auto">
        {/* Hero Title */}
        <div className="overflow-hidden py-1">
          <motion.h1
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
            className="text-3xl sm:text-5xl md:text-6xl font-heading font-black text-[#e6d6c3] leading-none tracking-[0.1em] uppercase"
          >
            {loading
              ? ""
              : activeLang === "en"
                ? banner?.title_en
                : banner?.title_de}
          </motion.h1>
        </div>

        {/* Hero Subtitle */}
        <div className="overflow-hidden py-1">
          <motion.p
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
            className="mt-6 text-xs md:text-sm text-[#e6d6c3]/90 max-w-2xl font-sans tracking-[0.3em] uppercase leading-relaxed"
          >
            {loading
              ? ""
              : activeLang === "en"
                ? banner?.content_en
                : banner?.content_de}
          </motion.p>
        </div>

        {/* Symmetrical CTA Buttons (No shadows, rounded corners) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.0 }}
          className="mt-10 flex flex-wrap gap-4 items-center justify-center"
        >
          <Button
            onClick={onReservationClick}
            variant="primary"
            className="px-6 py-3.5"
          >
            <Calendar className="w-4 h-4" />
            <span>
              {" "}
              {activeLang === "en" ? "Reservations" : "Reservierungen"}
            </span>
          </Button>

          <Button href="#story" variant="secondary" className="px-6 py-3.5">
            {activeLang === "en" ? "Explore Story" : "Geschichte entdecken"}
          </Button>
        </motion.div>
      </div>

      {/* Footer Info */}
      <div className="relative z-10 px-6 py-8 md:px-16 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs md:text-sm font-sans tracking-widest text-[#e6d6c3]/70 border-t border-[#e6d6c3]/10 bg-gradient-to-t from-black/60 to-transparent">
        <div className="flex gap-6 items-center">
          <span className="flex items-center gap-1.5 uppercase">
            <MapPin className="w-3.5 h-3.5 text-[#ab1223]" /> Berlin Mitte
          </span>
          <span className="hidden sm:inline">|</span>
          <span className="uppercase tracking-[0.15em] font-semibold">
            {activeLang === "en"
              ? "Palm Nectar Mixology"
              : "Palmnektar-Mixologie"}
          </span>
        </div>

        <div className="hidden sm:block uppercase">EST. 2026</div>
      </div>
    </section>
  );
}
