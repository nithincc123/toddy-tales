"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import HeroSection from "@/components/HeroSection";
import MarqueeRibbon from "@/components/MarqueeRibbon";
import MenuShowcase from "@/components/MenuShowcase";
import RecommendedDrinks from "@/components/RecommendedDrinks";
import StoryTellingSection from "@/components/StoryTellingSection";
import ReservationSection from "@/components/ReservationSection";
import InstagramGallery from "@/components/InstagramGallery";
import GiftCardSection from "@/components/GiftCardSection";
import CateringSection from "@/components/CateringSection";
import CustomCursor from "@/components/CustomCursor";
import LoadingScreen from "@/components/LoadingScreen";

export default function HomeClient() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2600);
    return () => clearTimeout(timer);
  }, []);

  const scrollToReservations = () => {
    const element = document.getElementById("reservations-page");
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && <LoadingScreen key="loader" />}
      </AnimatePresence>

      <main className="flex-grow flex flex-col w-full min-h-screen">
        <CustomCursor />

        <HeroSection onReservationClick={scrollToReservations} />
        <MarqueeRibbon />
        <MenuShowcase />
        <RecommendedDrinks />
        <StoryTellingSection />
        <ReservationSection />
        <InstagramGallery />
        <GiftCardSection />
        <CateringSection />
      </main>
    </>
  );
}
