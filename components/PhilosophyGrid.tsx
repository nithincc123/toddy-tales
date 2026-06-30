"use client";

import { motion } from "framer-motion";

interface PhilosophyItem {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export default function PhilosophyGrid() {
  const items: PhilosophyItem[] = [
    {
      number: "01",
      title: "Inspiration",
      description:
        "Drawing raw energy from the open-air coastal taverns of Kerala, where travelers gathered to swap stories over freshly tapped palm nectar.",
      icon: (
        <svg
          viewBox="0 0 100 100"
          className="w-16 h-16 text-wine hover:scale-110 transition-transform duration-300"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        >
          {/* Hand-drawn sun outline */}
          <path d="M50,25 C63.8,25 75,36.2 75,50 C75,63.8 63.8,75 50,75 C36.2,75 25,63.8 25,50 C25,36.2 36.2,25 50,25 Z" strokeDasharray="3 3" />
          {/* Organic inner core */}
          <path d="M50,32 C59.9,32 68,40.1 68,50 C68,59.9 59.9,68 50,68 C40.1,68 32,59.9 32,50 C32,40.1 40.1,32 50,32 Z" />
          {/* Sketched rays */}
          <path d="M50,12 L50,20" />
          <path d="M50,80 L50,88" />
          <path d="M12,50 L20,50" />
          <path d="M80,50 L88,50" />
          <path d="M23,23 L29,29" />
          <path d="M71,71 L77,77" />
          <path d="M23,77 L29,71" />
          <path d="M71,23 L77,29" />
        </svg>
      ),
    },
    {
      number: "02",
      title: "Design Style",
      description:
        "A translation of rustic elements into minimalist Bauhaus aesthetics. Clean concrete grids meet warm hand-woven coir accents.",
      icon: (
        <svg
          viewBox="0 0 100 100"
          className="w-16 h-16 text-teal hover:scale-110 transition-transform duration-300"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        >
          {/* Hand-drawn Bauhaus arches & lines */}
          <path d="M15,85 L85,85" strokeWidth="2" />
          <path d="M25,85 L25,45 C25,30 40,20 50,20 C60,20 75,30 75,45 L75,85" />
          {/* Inner details */}
          <path d="M38,85 L38,55 C38,48 45,42 50,42 C55,42 62,48 62,55 L62,85" />
          {/* Geometric lines */}
          <path d="M50,20 L50,85" strokeWidth="0.8" strokeDasharray="2 2" />
          <circle cx="50" cy="31" r="3" fill="currentColor" />
        </svg>
      ),
    },
    {
      number: "03",
      title: "Spirit Quality",
      description:
        "Strictly premium. We combine house-distilled local ingredients with imported Kerala spices, ensuring every sip is pure art.",
      icon: (
        <svg
          viewBox="0 0 100 100"
          className="w-16 h-16 text-wine hover:scale-110 transition-transform duration-300"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        >
          {/* Hand-drawn botanical leaf / twig */}
          <path d="M50,85 Q50,55 75,20" />
          <path d="M50,85 Q48,60 25,25" />
          {/* Leaves */}
          <path d="M60,45 C65,40 70,42 75,46 C70,52 62,50 60,45 Z" fill="currentColor" opacity="0.1" />
          <path d="M60,45 C65,40 70,42 75,46 C70,52 62,50 60,45 Z" />
          
          <path d="M37,50 C32,45 28,47 25,52 C30,57 37,55 37,50 Z" fill="currentColor" opacity="0.1" />
          <path d="M37,50 C32,45 28,47 25,52 C30,57 37,55 37,50 Z" />

          <path d="M65,28 Q68,22 75,20 T78,25 C75,31 68,32 65,28 Z" fill="currentColor" opacity="0.1" />
          <path d="M65,28 C68,22 75,20 78,25 C75,31 68,32 65,28 Z" />

          {/* Droplet representing distilled nectar */}
          <path d="M50,85 C52,89 48,89 50,85 Z" strokeWidth="2" />
        </svg>
      ),
    },
    {
      number: "04",
      title: "The Experience",
      description:
        "A warm, high-vibe atmosphere. More than drinking and dining—an invitation to sit together and build lasting memories.",
      icon: (
        <svg
          viewBox="0 0 100 100"
          className="w-16 h-16 text-teal hover:scale-110 transition-transform duration-300"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        >
          {/* Clinking glasses style abstract tavern sparks */}
          <path d="M35,65 Q50,75 65,65" strokeWidth="2" />
          <path d="M35,65 L20,35 C15,25 35,15 45,25 L35,65" />
          <path d="M65,65 L80,35 C85,25 65,15 55,25 L65,65" />
          {/* Spark lines */}
          <path d="M50,12 L50,22" />
          <path d="M42,15 L46,20" />
          <path d="M58,15 L54,20" />
          {/* Heart/flame spark */}
          <path d="M50,40 Q53,35 50,30 Q47,35 50,40 Z" fill="currentColor" />
        </svg>
      ),
    },
  ];

  return (
    <section
      id="philosophy"
      className="relative w-full py-24 md:py-32 bg-beige text-black overflow-hidden border-t border-teal/10"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-16 relative z-10">
        
        {/* Section Header - No label above title */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-3xl md:text-5xl font-heading font-black tracking-tight leading-none mb-6 uppercase">
            The Pillars of Toddy Tales
          </h2>
          <p className="font-sans text-sm md:text-base text-black/75 leading-relaxed">
            We preserve coastal heritage while pushing modern boundaries. Our philosophy translates raw elements into sensory realities.
          </p>
        </div>

        {/* 4-Column Grid (No shadows, rounded icon frames) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {items.map((item, index) => (
            <motion.div
              key={item.number}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: index * 0.1 }}
              className="flex flex-col items-start text-left group"
            >
              {/* Hand-drawn Icon wrapper (Rounded corners, no shadow) */}
              <div className="mb-6 p-4 bg-white/30 backdrop-blur-sm relative transition-all duration-300 rounded-lg">
                {item.icon}
                <div className="absolute -top-2 -left-2 bg-wine text-beige font-heading font-bold text-xs md:text-sm w-6 h-6 md:w-7 md:h-7 flex items-center justify-center rounded-lg border border-beige/10">
                  {item.number}
                </div>
              </div>

              {/* Title */}
              <h3 className="text-xl md:text-2xl font-heading font-black tracking-wide text-black mb-3 group-hover:text-wine transition-colors duration-300">
                {item.title}
              </h3>

              {/* Divider */}
              <div className="w-12 h-[2px] bg-teal/20 group-hover:w-20 group-hover:bg-wine transition-all duration-300 mb-4" />

              {/* Description */}
              <p className="font-sans text-sm text-black/75 leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Background hand-drawn detail lines */}
      <div className="absolute bottom-0 left-0 right-0 h-16 text-teal/5 opacity-60 pointer-events-none">
        <svg viewBox="0 0 1440 50" fill="none" className="w-full h-full" preserveAspectRatio="none">
          <path d="M0,25 C300,10 600,40 900,20 C1200,5 1350,30 1440,25" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </div>
    </section>
  );
}
