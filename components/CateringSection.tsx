"use client";

import { useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  Coffee,
  DollarSign,
  Calendar,
  Users,
  FileText,
  CheckCircle,
} from "lucide-react";
import Button from "./Button";
import { useLanguage } from "@/context/LanguageContext";

export default function CateringSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { activeLang } = useLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [guests, setGuests] = useState("");
  const [budget, setBudget] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Viewport scroll tracking for parallax background and SVGs
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const yBg = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);
  const yPlate = useTransform(scrollYProgress, [0, 1], [-80, 80]);
  const yShaker = useTransform(scrollYProgress, [0, 1], [60, -60]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      full_name: name,
      email: email,
      phone: phone,
      event_date: eventDate || null,
      guests_count: guests ? Number(guests) : null,
      budget_range: budget || null,
      special_requirements: notes || null,
    };

    try {
      setIsSubmitting(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/event-enquiry`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        if (result.errors) {
          console.log(result.errors);
          alert(Object.values(result.errors).flat().join("\n"));
        } else {
          throw new Error(result.message || "Failed to submit enquiry.");
        }
        return;
      }

      setIsSubmitted(true);

      // Optional: Clear the form
      setName("");
      setEmail("");
      setPhone("");
      setEventDate("");
      setGuests("");
      setBudget("");
      setNotes("");
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="catering"
      className="relative w-full py-24 md:py-32 overflow-hidden text-[#e6d6c3]"
    >
      {/* Scroll Parallax Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1920&q=80')`,
            y: yBg,
          }}
          className="absolute inset-x-0 -top-[15%] -bottom-[15%] bg-cover bg-center"
        />
      </div>

      {/* Dark semi-transparent overlay mask for legibility */}
      <div className="absolute inset-0 bg-[#050505]/80 z-0" />

      {/* Background ambient accents */}
      <div className="absolute top-1/3 left-0 w-[450px] h-[450px] bg-[#ab1223]/10 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-0 w-[450px] h-[450px] bg-black/45 rounded-full blur-[110px] pointer-events-none" />

      {/* Drawing SVG: Hand-drawn Food Plate (Left side) */}
      <motion.div
        style={{ y: yPlate }}
        className="absolute left-6 top-[20%] w-[180px] h-[180px] text-[#e6d6c3] opacity-[0.05] pointer-events-none select-none z-10 hidden lg:block"
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

      {/* Drawing SVG: Hand-drawn Cocktail Shaker (Right side) */}
      <motion.div
        style={{ y: yShaker }}
        className="absolute right-6 bottom-[15%] w-[180px] h-[180px] text-[#e6d6c3] opacity-[0.04] pointer-events-none select-none z-10 hidden lg:block"
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
        {/* Header - No subheadings/labels */}
        <div className="text-center mb-16">
          <div className="overflow-hidden py-1">
            <motion.h2
              initial={{ y: "100%" }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
              className="text-3xl md:text-5xl font-heading font-black tracking-tight leading-none mb-6 uppercase text-white"
            >
              {activeLang === "de"
                ? "Catering & Veranstaltungen"
                : "Catering & Events"}
            </motion.h2>
          </div>
          <p className="font-sans text-sm md:text-base text-[#e6d6c3]/80 max-w-lg mx-auto leading-relaxed">
            {activeLang === "de" ? (
              <>
                Bringe die einzigartige Atmosphäre, Palmfermente und Küstenküche
                von Toddy Tales zu deiner privaten Feier. Fülle unser
                individuelles Anfrageformular aus.
              </>
            ) : (
              <>
                Bring the unique atmosphere, palm ferments, and coastal food of{" "}
                Toddy Tales to your private celebration. Fill out our custom
                inquiries form.
              </>
            )}
          </p>
        </div>

        {/* Bellboy-style inquiry form container (subtle rounded-lg corners, saturated colors, no drop shadows) */}
        <div
          onMouseMove={handleMouseMove}
          className="relative bg-[#050505] border border-[#ab1223]/40 p-8 md:p-12 rounded-lg max-w-2xl mx-auto group overflow-hidden"
        >
          {/* Spotlight overlay tracking the mouse cursor */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0"
            style={{
              background: `radial-gradient(circle 180px at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(171,18,35,0.08), transparent)`,
            }}
          />
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.form
                key="catering-form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                onSubmit={handleSubmit}
                className="space-y-6 relative z-10"
              >
                {/* Visual Header Note */}
                <div className="border-b border-[#e6d6c3]/15 pb-4 mb-2">
                  <span className="text-[10px] md:text-sm uppercase tracking-[0.25em] text-[#e6d6c3] font-sans font-bold">
                    {activeLang === "de"
                      ? "VERANSTALTUNGSDETAILS (ALLE FELDER OPTIONAL)"
                      : "EVENT DETAILS (ALL FIELDS OPTIONAL)"}
                  </span>
                </div>

                {/* Section 1: Contact Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] md:text-sm uppercase tracking-wider text-[#e6d6c3]/60 font-sans font-semibold">
                      {activeLang === "de" ? "Vollständiger Name" : "Full Name"}
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-[#16434d]/20 border border-[#ab1223]/30 p-3 rounded-lg text-xs md:text-sm text-[#e6d6c3] placeholder-[#e6d6c3]/50 focus:outline-none focus:border-[#ab1223] font-sans w-full"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] md:text-sm uppercase tracking-wider text-[#e6d6c3]/60 font-sans font-semibold">
                      {activeLang === "de" ? "E-Mail-Adresse" : "Email Address"}
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-[#16434d]/20 border border-[#ab1223]/30 p-3 rounded-lg text-xs md:text-sm text-[#e6d6c3] placeholder-[#e6d6c3]/50 focus:outline-none focus:border-[#ab1223] font-sans w-full"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] md:text-sm uppercase tracking-wider text-[#e6d6c3]/60 font-sans font-semibold">
                      {activeLang === "de" ? "Telefonnummer" : "Phone Number"}
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. +49 170 1234567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="bg-[#16434d]/20 border border-[#ab1223]/30 p-3 rounded-lg text-xs md:text-sm text-[#e6d6c3] placeholder-[#e6d6c3]/50 focus:outline-none focus:border-[#ab1223] font-sans w-full"
                    />
                  </div>
                </div>

                {/* Section 2: Event Parameters */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Event Date */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] md:text-sm uppercase tracking-wider text-[#e6d6c3]/60 font-sans font-semibold flex items-center gap-1.5">
                      <Calendar className="w-3 h-3 text-[#ab1223]" />{" "}
                      {activeLang === "de"
                        ? "Veranstaltungsdatum"
                        : "Event Date"}
                    </label>
                    <input
                      type="date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="bg-[#16434d]/20 border border-[#ab1223]/30 p-3 rounded-lg text-xs md:text-sm text-[#e6d6c3] focus:outline-none focus:border-[#ab1223] font-sans w-full"
                    />
                  </div>

                  {/* Guest Count */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] md:text-sm uppercase tracking-wider text-[#e6d6c3]/60 font-sans font-semibold flex items-center gap-1.5">
                      <Users className="w-3 h-3 text-[#ab1223]" />{" "}
                      {activeLang === "de"
                        ? "Anzahl der Gäste"
                        : "Guests Count"}
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 50"
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      min="1"
                      className="bg-[#16434d]/20 border border-[#ab1223]/30 p-3 rounded-lg text-xs md:text-sm text-[#e6d6c3] placeholder-[#e6d6c3]/50 focus:outline-none focus:border-[#ab1223] font-sans w-full"
                    />
                  </div>

                  {/* Budget Selector - inspired by Bellboy */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] md:text-sm uppercase tracking-wider text-[#e6d6c3]/60 font-sans font-semibold flex items-center gap-1.5">
                      <DollarSign className="w-3 h-3 text-[#ab1223]" />{" "}
                      {activeLang === "de" ? "Budgetbereich" : "Budget Range"}
                    </label>
                    <select
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="bg-[#16434d]/20 border border-[#ab1223]/30 p-3 rounded-lg text-xs md:text-sm text-[#e6d6c3] focus:outline-none focus:border-[#ab1223] font-sans w-full cursor-pointer"
                    >
                      <option value="" className="bg-[#050505]">
                        {activeLang === "de"
                          ? "Budgetbereich auswählen"
                          : "Select Budget Range"}
                      </option>
                      <option value="under-1k" className="bg-[#050505]">
                        {activeLang === "de" ? "Unter 500 €" : "Under €500"}
                      </option>
                      <option value="1k-3k" className="bg-[#050505]">
                        €500 - €1,000
                      </option>
                      <option value="1k-3k" className="bg-[#050505]">
                        €1,000 - €3,000
                      </option>
                      <option value="3k-5k" className="bg-[#050505]">
                        €3,000 - €5,000
                      </option>
                    </select>
                  </div>
                </div>

                {/* Section 3: Notes / Special Requirements */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] md:text-sm uppercase tracking-wider text-[#e6d6c3]/60 font-sans font-semibold flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#ab1223]" />{" "}
                    {activeLang === "de"
                      ? "Sonderwünsche & Aufbau-Details"
                      : "Special Demands & Setup Details"}
                  </label>
                  <textarea
                    placeholder={
                      activeLang === "de"
                        ? "Erzählen Sie uns etwas über den Stil Ihrer Veranstaltung, spezielle Getränkewünsche oder das gewünschte Speise-Setup..."
                        : "Tell us about the style of your event, specific drinks preferences, or food setups..."
                    }
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    className="bg-[#16434d]/20 border border-[#ab1223]/30 p-3 rounded-lg text-xs md:text-sm text-[#e6d6c3] placeholder-[#e6d6c3]/50 focus:outline-none focus:border-[#ab1223] font-sans w-full resize-none"
                  />
                </div>

                {/* Submit button */}
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full py-4"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? activeLang === "de"
                      ? "Wird gesendet..."
                      : "Submitting..."
                    : activeLang === "de"
                      ? "Anfrage senden"
                      : "Send Event Inquiry"}
                </Button>
              </motion.form>
            ) : (
              <motion.div
                key="catering-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10 space-y-6 relative z-10"
              >
                <div className="flex justify-center">
                  <CheckCircle className="w-16 h-16 text-[#e6d6c3]" />
                </div>
                <div>
                  <h3 className="text-2xl font-heading font-black text-white uppercase tracking-wider">
                    {activeLang === "de"
                      ? "Anfrage erhalten"
                      : "Inquiry Received"}
                  </h3>
                  <p className="font-sans text-sm text-[#e6d6c3]/80 mt-3 max-w-md mx-auto leading-relaxed">
                    {activeLang === "de" ? (
                      <>
                        Wir haben Ihre Veranstaltungsdaten erhalten. Unser
                        Buchungsteam wird Ihre Anfrage prüfen und sich in Kürze
                        mit Ihnen in Verbindung setzen, um Ihr individuelles
                        Toddy Tales Erlebnis zu gestalten.
                      </>
                    ) : (
                      <>
                        We have received your event parameters. Our booking team
                        will review your requests and get in touch shortly to
                        craft your custom Toddy Tales experience.
                      </>
                    )}
                  </p>
                </div>
                <Button
                  onClick={() => {
                    setIsSubmitted(false);
                    setName("");
                    setEmail("");
                    setPhone("");
                    setEventDate("");
                    setGuests("");
                    setBudget("");
                    setNotes("");
                  }}
                  variant="secondary"
                  className="px-6 py-2.5 mx-auto"
                >
                  {activeLang === "de"
                    ? "Weitere Anfrage senden"
                    : "Submit Another Inquiry"}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
