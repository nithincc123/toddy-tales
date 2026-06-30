"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Globe } from "lucide-react";
import Button from "./Button";
import { useLanguage } from "@/context/LanguageContext";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { activeLang, setActiveLang } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent background scrolling when menu drawer is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 w-full transition-all duration-300 px-6 md:px-16 bg-gradient-to-b from-[#050505]/95 via-[#050505]/60 to-transparent ${scrolled ? "py-3 backdrop-blur-[3px]" : "py-6"}`}
    >
      <div className="grid grid-cols-3 xl:grid-cols-[1fr_auto_1fr] items-center w-full max-w-7xl mx-auto gap-x-4">
        {/* Column 1: Symmetrical Nav (Left-aligned) */}
        <div className="flex items-center justify-start">
          {/* Desktop Nav */}
          <nav className="hidden xl:flex items-center gap-6 text-[#e6d6c3] font-sans text-[12px] tracking-[0.2em] font-bold">
            <a href="/#story">
              {activeLang === "en" ? "THE STORY" : "DIE GESCHICHTE"}
            </a>

            <a href="/#menu">
              {activeLang === "en" ? "MENUS" : "SPEISEKARTEN"}
            </a>

            <a href="/#reservations-page">
              {activeLang === "en" ? "CATERING" : "CATERING"}
            </a>

            <a href="/gallery">{activeLang === "en" ? "GALLERY" : "GALERIE"}</a>
          </nav>

          {/* Mobile Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="xl:hidden"
          >
            <a href="/">
              <img
                src="/logo/ToddyTales_Logo_white.png"
                alt="Toddy Tales Logo"
                className={`w-auto object-contain transition-all duration-300 ${scrolled ? "h-10 md:h-12" : "h-12 md:h-16"}`}
              />
            </a>
          </motion.div>
        </div>

        {/* Column 2: Logo 3x size, mathematically centered */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex justify-center"
        >
          {/* Desktop Logo */}
          <a href="/" className="hidden xl:block">
            <img
              src="/logo/ToddyTales_Logo_white.png"
              alt="Toddy Tales Logo"
              className={`w-auto object-contain transition-all duration-300 ${scrolled ? "h-14 md:h-16" : "h-20 md:h-24"}`}
            />
          </a>
        </motion.div>

        {/* Column 3: Symmetrical Reservation button & Links (Right-aligned) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex justify-end items-center gap-3 md:gap-4 xl:gap-6"
        >
          <nav className="hidden xl:flex items-center gap-6 text-[#e6d6c3] font-sans text-[12px] tracking-[0.2em] font-bold">
            <a href="/events">
              {activeLang === "en" ? "EVENTS" : "VERANSTALTUNGEN"}
            </a>

            <a href="/#giftcards">
              {activeLang === "en" ? "GIFT CARDS" : "GUTSCHEINE"}
            </a>
          </nav>

          <button
            onClick={() => setActiveLang(activeLang === "en" ? "de" : "en")}
            className="hover:text-[#ab1223] transition-colors duration-300 flex items-center gap-1.5 cursor-pointer font-bold font-sans text-[10px] md:text-[12px] tracking-[0.15em] md:tracking-[0.2em] bg-transparent border-none text-[#e6d6c3] outline-none"
            aria-label="Switch Language"
          >
            <Globe className="w-3 h-3 md:w-3.5 md:h-3.5 opacity-80" />
            <span
              className={
                activeLang === "en" ? "text-white font-black" : "opacity-50"
              }
            >
              EN
            </span>
            <span className="opacity-30">/</span>
            <span
              className={
                activeLang === "de" ? "text-white font-black" : "opacity-50"
              }
            >
              DE
            </span>
          </button>

          <Button
            href="/#reservations-page"
            variant="secondary"
            className="px-4 py-2.5 md:px-6 md:py-3 shrink-0 whitespace-nowrap"
          >
            {activeLang === "en" ? "Book Table" : "Tisch reservieren"}
          </Button>

          {/* Mobile Hamburger Menu */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="xl:hidden p-2 -mr-2 text-[#e6d6c3] hover:text-[#ab1223] transition-colors"
            aria-label="Open Menu"
          >
            <Menu className="w-6 h-6 md:w-8 md:h-8" />
          </button>
        </motion.div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-50 flex flex-col bg-[#050505]/95 px-6 py-6 md:px-16 h-screen overflow-y-auto"
          >
            {/* Drawer Header */}
            <div className="grid grid-cols-3 items-center w-full max-w-7xl mx-auto gap-x-4 shrink-0">
              <div className="flex justify-start">
                <a href="/" onClick={() => setIsMenuOpen(false)}>
                  <img
                    src="/logo/ToddyTales_Logo_white.png"
                    alt="Toddy Tales Logo"
                    className="h-10 md:h-12 w-auto object-contain"
                  />
                </a>
              </div>
              <div className="flex justify-center" />
              <div className="flex justify-end">
                <button
                  className="text-[#e6d6c3] p-2 hover:text-[#ab1223] transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                  aria-label="Close Menu"
                >
                  <X className="w-6 h-6 md:w-8 md:h-8" />
                </button>
              </div>
            </div>

            {/* Drawer Links */}
            <nav className="flex flex-col items-center justify-center flex-grow gap-8 my-10 text-[#e6d6c3] font-heading text-2xl tracking-[0.1em] uppercase font-bold text-center">
              {[
                {
                  name: activeLang === "en" ? "The Story" : "Die Geschichte",
                  href: "/#story",
                },
                {
                  name: activeLang === "en" ? "Menus" : "Speisekarten",
                  href: "/#menu",
                },
                {
                  name: activeLang === "en" ? "Reservations" : "Reservierungen",
                  href: "/#reservations-page",
                },
                {
                  name: activeLang === "en" ? "Gallery" : "Galerie",
                  href: "/gallery",
                },
                {
                  name: activeLang === "en" ? "Events" : "Veranstaltungen",
                  href: "/events",
                },
                {
                  name: activeLang === "en" ? "Gift Cards" : "Gutscheine",
                  href: "/#giftcards",
                },
                {
                  name: activeLang === "en" ? "Catering" : "Catering",
                  href: "/#catering",
                },
              ].map((item, i) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.05 }}
                  className="hover:text-[#ab1223] transition-colors duration-300"
                >
                  {item.name}
                </motion.a>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + 7 * 0.05 }}
                className="mt-4 flex items-center justify-center gap-2.5"
              >
                <Globe className="w-5 h-5 opacity-80 text-[#e6d6c3]" />

                <button
                  onClick={() => setActiveLang("en")}
                  className={`transition-all duration-300 bg-transparent border-none outline-none cursor-pointer ${
                    activeLang === "en"
                      ? "text-white font-black"
                      : "text-[#e6d6c3] opacity-50 hover:opacity-100"
                  }`}
                  aria-label="Switch to English"
                >
                  EN
                </button>

                <span className="opacity-30 text-[#e6d6c3]">/</span>

                <button
                  onClick={() => setActiveLang("de")}
                  className={`transition-all duration-300 bg-transparent border-none outline-none cursor-pointer ${
                    activeLang === "de"
                      ? "text-white font-black"
                      : "text-[#e6d6c3] opacity-50 hover:opacity-100"
                  }`}
                  aria-label="Switch to German"
                >
                  DE
                </button>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
