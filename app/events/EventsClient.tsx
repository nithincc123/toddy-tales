"use client";

import { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import {
  Calendar,
  Clock,
  Ticket,
  X,
  CheckCircle,
  User,
  Mail,
  Users,
} from "lucide-react";
import Button from "@/components/Button";
import { useLanguage } from "@/context/LanguageContext";

interface EventItem {
  id: number;
  title_en: string;
  title_de: string;
  content_en: string;
  content_de: string;
  event_date: string;
  door_hours_en: string;
  door_hours_de: string;
}

export default function EventsPage() {
  const sectionRef = useRef<HTMLElement>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const { activeLang } = useLanguage();
  const [isBooked, setIsBooked] = useState(false);
  const [guests, setGuests] = useState("1");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [events, setEvents] = useState<EventItem[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`);

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const result = await res.json();

        if (result.success) {
          setEvents(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch events:", error);
      }
    };

    fetchEvents();
  }, []);

  const handleBookSpot = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email) {
      setIsBooked(true);
    }
  };

  const closeModal = () => {
    setSelectedEvent(null);
    setTimeout(() => {
      setIsBooked(false);
      setName("");
      setEmail("");
      setGuests("1");
    }, 300); // Reset form state after exit animation
  };

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const yBg = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);
  const ySpice = useTransform(scrollYProgress, [0, 1], [-70, 70]);
  const yShaker = useTransform(scrollYProgress, [0, 1], [60, -60]);

  const formatMonth = (date: string) => {
    return new Date(date)
      .toLocaleString("en-US", {
        month: "short",
      })
      .toUpperCase();
  };

  const formatDay = (date: string) => {
    return new Date(date).getDate();
  };

  return (
    <main className="flex-grow flex flex-col w-full min-h-screen bg-[#050505]">
      <section
        ref={sectionRef}
        id="events-page"
        className="relative w-full py-32 md:py-40 overflow-hidden text-[#e6d6c3]"
      >
        {/* Parallax Background */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <motion.div
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1920&q=80')`,
              y: yBg,
            }}
            className="absolute inset-x-0 -top-[15%] -bottom-[15%] bg-cover bg-center"
          />
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-[#050505]/85 z-0" />

        {/* Decorative SVGs */}
        <motion.div
          style={{ y: ySpice }}
          className="absolute left-6 top-[25%] w-[180px] h-[180px] text-[#e6d6c3] opacity-[0.05] pointer-events-none select-none z-0 hidden lg:block"
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
        <motion.div
          style={{ y: yShaker }}
          className="absolute right-6 top-[20%] w-[200px] h-[200px] text-[#e6d6c3] opacity-[0.05] pointer-events-none select-none z-0 hidden lg:block"
        >
          <svg
            viewBox="0 0 100 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            strokeLinecap="round"
            className="w-full h-full"
          >
            <path d="M35,25 L65,25 L60,80 L40,80 Z" />
            <path d="M32,25 L68,25" />
            <path d="M42,25 L42,15 L58,15 L58,25" />
            <path d="M48,15 L48,10 L52,10 L52,15" />
            <path d="M48,40 L48,65" strokeDasharray="2 2" />
            <path d="M52,40 L52,65" strokeDasharray="2 2" />
          </svg>
        </motion.div>

        <div className="max-w-4xl mx-auto px-6 relative z-10">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="overflow-hidden py-1">
              <motion.h1
                initial={{ y: "100%" }}
                whileInView={{ y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
                className="text-3xl md:text-5xl font-heading font-black tracking-tight leading-none mb-6 uppercase text-white"
              >
                {activeLang === "de" ? "Tavernen-Momente" : "Tavern Gatherings"}
              </motion.h1>
            </div>
            <p className="font-sans text-sm md:text-base text-[#e6d6c3]/80 max-w-2xl mx-auto leading-relaxed">
              {activeLang === "de"
                ? "Von intimen Masterclasses bis hin zu lebendigen Kulturabenden – entdecken Sie die exklusiven Veranstaltungen im Toddy Tales. Erleben Sie einzigartige Momente, die unser kulturelles Erbe feiern."
                : "From intimate masterclasses to vibrant cultural nights, discover the exclusive events hosted at Toddy Tales. Join us for unique experiences that celebrate our heritage."}
            </p>
          </div>

          {/* Events List */}
          <div className="space-y-8">
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: index * 0.15 }}
                className="flex flex-col md:flex-row items-start gap-6 md:gap-8 bg-[#050505]/40 border border-[#e6d6c3]/15 p-6 md:p-8 rounded-lg backdrop-blur-sm"
              >
                {/* Date Block */}
                <div className="flex-shrink-0 text-center bg-[#ab1223] text-white rounded-lg p-4 w-full md:w-auto">
                  <span className="block font-heading text-sm md:text-base tracking-widest uppercase">
                    {formatMonth(event.event_date)}
                  </span>

                  <span className="block font-heading text-3xl md:text-4xl font-black leading-none">
                    {formatDay(event.event_date)}
                  </span>
                </div>

                {/* Event Details */}
                <div className="flex-grow">
                  <h2 className="text-xl md:text-2xl font-heading font-black text-white uppercase tracking-wide mb-2">
                    {event[activeLang === "en" ? "title_en" : "title_de"] ||
                      event.title_en}
                  </h2>
                  <p className="font-sans text-sm text-[#e6d6c3]/80 leading-relaxed mb-4">
                    {event[`content_${activeLang}` as keyof EventItem] ||
                      event.content_en}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs md:text-sm font-sans text-[#e6d6c3]/70 border-t border-[#e6d6c3]/10 pt-4">
                    <span className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-[#ab1223]" />
                      {event[
                        activeLang === "en" ? "door_hours_en" : "door_hours_de"
                      ] || event.door_hours_en}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* No Events Message */}
          {events.length === 0 && (
            <div className="text-center py-16 border border-dashed border-[#e6d6c3]/20 rounded-lg">
              <Calendar className="w-12 h-12 mx-auto text-[#e6d6c3]/40 mb-4" />
              <h3 className="text-xl font-heading font-bold text-white">
                {activeLang === "de"
                  ? "Keine bevorstehenden Veranstaltungen"
                  : "No Upcoming Events"}
              </h3>
              <p className="text-sm text-[#e6d6c3]/60 mt-2">
                {activeLang === "de"
                  ? "Schauen Sie bald wieder vorbei, um unsere nächste Veranstaltung zu entdecken."
                  : "Please check back soon for our next gathering."}
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
