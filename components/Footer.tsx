"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Phone, Mail, MapPin, Heart } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const sectionRef = useRef<HTMLElement>(null);
  const { activeLang } = useLanguage();
  // Viewport scroll tracking for parallax background and SVGs
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const yBg = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);
  const yCocktail = useTransform(scrollYProgress, [0, 1], [-70, 70]);
  const yCutlery = useTransform(scrollYProgress, [0, 1], [60, -60]);

  const dayByDayHours = [
    {
      day: activeLang === "de" ? "Montag" : "Monday",
      time: activeLang === "de" ? "Geschlossen" : "Closed",
    },
    {
      day: activeLang === "de" ? "Dienstag" : "Tuesday",
      time: "12:00 - 23:00",
    },
    {
      day: activeLang === "de" ? "Mittwoch" : "Wednesday",
      time: "12:00 - 23:00",
    },
    {
      day: activeLang === "de" ? "Donnerstag" : "Thursday",
      time: "12:00 - 23:00",
    },
    {
      day: activeLang === "de" ? "Freitag" : "Friday",
      time: "12:00 - 00:00",
    },
    {
      day: activeLang === "de" ? "Samstag" : "Saturday",
      time: "12:00 - 00:00",
    },
    {
      day: activeLang === "de" ? "Sonntag" : "Sunday",
      time: "12:00 - 23:00",
    },
  ];

  return (
    <footer
      ref={sectionRef}
      id="contact-footer"
      className="relative w-full overflow-hidden text-[#e6d6c3] border-t border-[#e6d6c3]/10"
    >
      {/* Parallax Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1920&q=80')`,
            y: yBg,
          }}
          className="absolute inset-x-0 -top-[15%] -bottom-[15%] bg-cover bg-center"
        />
      </div>

      {/* Dark overlay mask for legibility */}
      <div className="absolute inset-0 bg-[#050505]/95 z-0 backdrop-blur-[2px]" />

      {/* Drawing SVG: Hand-drawn Cocktail Outline (Left side) */}
      <motion.div
        style={{ y: yCocktail }}
        className="absolute left-6 top-[20%] w-[180px] h-[180px] text-[#e6d6c3] opacity-[0.04] pointer-events-none select-none z-10 hidden lg:block"
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

      {/* Drawing SVG: Hand-drawn Cutlery (Right side) */}
      <motion.div
        style={{ y: yCutlery }}
        className="absolute right-6 bottom-[20%] w-[160px] h-[160px] text-[#e6d6c3] opacity-[0.04] pointer-events-none select-none z-10 hidden lg:block"
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

      <div className="max-w-7xl mx-auto px-6 md:px-16 py-16 md:py-24 relative z-10">
        {/* Main Grid: Location, Hours, Contact */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 items-start">
          {/* Column 1: Location Block */}
          <div className="space-y-4">
            <h3 className="font-sans text-xs md:text-sm tracking-[0.25em] font-bold text-[#ab1223] uppercase border-b border-[#e6d6c3]/15 pb-2">
              {activeLang === "de" ? "Standort" : "Location"}
            </h3>
            <div className="flex gap-3 items-start font-sans text-sm text-[#e6d6c3]/85 leading-relaxed">
              <MapPin className="w-4 h-4 text-[#ab1223] shrink-0 mt-1" />
              <div>
                <p className="font-bold text-white">
                  {activeLang === "de"
                    ? "Toddy Tales Bar & Küche"
                    : "Toddy Tales Bar & Kitchen"}
                </p>
                <p className="mt-1">
                  Sonntagstraße 1,
                  <br />
                  10245 Berlin
                </p>
                <a
                  href="https://maps.google.com/?q=Sonntagstraße+1,+10245+Berlin"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-3 text-xs md:text-sm text-[#e6d6c3] underline hover:text-[#ab1223] transition-colors"
                >
                  {activeLang === "de" ? "Route anzeigen" : "Get Directions"}
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Individual Day-by-Day Hours */}
          <div className="space-y-4">
            <h3 className="font-sans text-xs md:text-sm tracking-[0.25em] font-bold text-[#ab1223] uppercase border-b border-[#e6d6c3]/15 pb-2">
              {activeLang === "de" ? "Öffnungszeiten" : "Opening Hours"}
            </h3>
            <ul className="space-y-2 font-sans text-xs md:text-sm text-[#e6d6c3]/80">
              {dayByDayHours.map((item) => (
                <li
                  key={item.day}
                  className="flex justify-between items-center py-0.5 border-b border-[#e6d6c3]/5 last:border-0"
                >
                  <span className="font-medium text-[#e6d6c3]/60">
                    {item.day}
                  </span>
                  <span className="font-mono text-[11px] md:text-sm font-semibold text-white">
                    {item.time}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact details */}
          <div className="space-y-4">
            <h3 className="font-sans text-xs md:text-sm tracking-[0.25em] font-bold text-[#ab1223] uppercase border-b border-[#e6d6c3]/15 pb-2">
              {activeLang === "de" ? "Kontakt" : "Contact Us"}
            </h3>
            <div className="space-y-3 font-sans text-sm text-[#e6d6c3]/85">
              <p className="leading-relaxed">
                {activeLang === "de"
                  ? "Für Tischreservierungen, größere Veranstaltungen oder Medienanfragen kontaktieren Sie uns:"
                  : "For table queries, larger events, or media inquiries, please connect with us:"}
              </p>
              <div className="pt-2 space-y-2.5">
                <a
                  href="tel:+493020059670"
                  className="flex items-center gap-3 hover:text-[#ab1223] transition-colors duration-300"
                >
                  <Phone className="w-4 h-4 text-[#ab1223]" />
                  <span>+49 (0) 30 2005 9670</span>
                </a>
                <a
                  href="mailto:Info@toddytales.de"
                  className="flex items-center gap-3 hover:text-[#ab1223] transition-colors duration-300"
                >
                  <Mail className="w-4 h-4 text-[#ab1223]" />
                  <span>Info@toddytales.de</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-[#e6d6c3]/10 my-12" />

        {/* Lower Section: Logo branding & Copyright Links */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-xs font-sans tracking-widest text-[#e6d6c3]/50">
          {/* Logo Branding */}
          <div className="flex flex-col items-center md:items-start gap-1 select-none">
            <img
              src="/logo/ToddyTales_Logo_white.png"
              alt="Toddy Tales Logo"
              className="h-[100px] w-auto object-contain"
            />
            <span className="text-[8px] tracking-[0.3em] uppercase opacity-60">
              {activeLang === "de"
                ? "Bar & Küche Berlin"
                : "Bar & Kitchen Berlin"}
            </span>
          </div>

          {/* Quick links */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-8 font-sans text-[10px] uppercase font-bold text-[#e6d6c3]/70">
            <a
              href="#giftcards"
              className="hover:text-[#ab1223] transition-colors duration-300"
            >
              {activeLang === "de" ? "Geschenkgutscheine" : "Gift Cards"}
            </a>
            <span>·</span>
            <a
              href="#catering"
              className="hover:text-[#ab1223] transition-colors duration-300"
            >
              {activeLang === "de" ? "Event-Catering" : "Catering For Events"}
            </a>
            <span>·</span>
            <a
              href="#gallery"
              className="hover:text-[#ab1223] transition-colors duration-300"
            >
              {activeLang === "de" ? "Galerie" : "Gallery"}
            </a>
          </div>

          <div className="text-center md:text-right">
            <p>
              &copy; {new Date().getFullYear()} Toddy Tales Bar & Kitchen.{" "}
              {activeLang === "de"
                ? "Alle Rechte vorbehalten."
                : "All rights reserved."}
            </p>
            <div className="mt-1.5 flex items-center justify-center md:justify-end gap-1.5 text-[9px] opacity-40 select-none font-sans">
              <span>
                {" "}
                {activeLang === "de" ? "Für Berlin gemacht" : "Made for Berlin"}
              </span>
              <Heart className="w-2.5 h-2.5 text-[#ab1223] fill-[#ab1223]" />
              <span>
                {" "}
                {activeLang === "de"
                  ? "mit der Seele Keralas"
                  : "with Kerala soul"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
