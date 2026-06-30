"use client";

import { useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import { Calendar, Users, Clock, CheckCircle } from "lucide-react";
import Button from "./Button";
import { useLanguage } from "@/context/LanguageContext";

export default function ReservationSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { activeLang } = useLanguage();
  const [guests, setGuests] = useState("2");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("18:00");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isBooked, setIsBooked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Viewport scroll tracking for parallax background
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const yBg = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);
  const ySpice = useTransform(scrollYProgress, [0, 1], [-70, 70]);
  const yShaker = useTransform(scrollYProgress, [0, 1], [60, -60]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  };

  const timeOptions = [
    { value: "12:00", label: "12:00 Noon" },
    { value: "12:30", label: "12:30 PM" },
    { value: "13:00", label: "01:00 PM" },
    { value: "13:30", label: "01:30 PM" },
    { value: "14:00", label: "02:00 PM" },
    { value: "14:30", label: "02:30 PM" },
    { value: "15:00", label: "03:00 PM" },
    { value: "15:30", label: "03:30 PM" },
    { value: "16:00", label: "04:00 PM" },
    { value: "16:30", label: "04:30 PM" },
    { value: "17:00", label: "05:00 PM" },
    { value: "17:30", label: "05:30 PM" },
    { value: "18:00", label: "06:00 PM" },
    { value: "18:30", label: "06:30 PM" },
    { value: "19:00", label: "07:00 PM" },
    { value: "19:30", label: "07:30 PM" },
    { value: "20:00", label: "08:00 PM" },
    { value: "20:30", label: "08:30 PM" },
    { value: "21:00", label: "09:00 PM" },
    { value: "21:30", label: "09:30 PM" },
    { value: "22:00", label: "10:00 PM" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("HANDLE SUBMIT CALLED");

    const url = `${process.env.NEXT_PUBLIC_API_URL}/reservation`;

    console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);
    console.log("FINAL URL:", url);

    const payload = {
      name: name,
      email: email,
      phone: phone,
      guests: guests,
      reservation_date: date,
      reservation_time: time,
    };

    console.log("PAYLOAD:", payload);

    try {
      setIsSubmitting(true);

      const response = await fetch(url, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log("STATUS:", response.status);
      console.log("OK:", response.ok);

      const text = await response.text();

      console.log("RAW RESPONSE:", text);

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(`Invalid JSON response: ${text}`);
      }

      console.log("PARSED RESPONSE:", data);

      if (!response.ok) {
        throw new Error(data.message || `HTTP Error ${response.status}`);
      }

      setIsBooked(true);
    } catch (error) {
      console.error("FULL ERROR:", error);
      alert(String(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="reservations-page"
      className="relative w-full py-24 md:py-32 overflow-hidden text-[#e6d6c3]"
    >
      {/* Scroll Parallax Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=1920&q=80')`,
            y: yBg,
          }}
          className="absolute inset-x-0 -top-[15%] -bottom-[15%] bg-cover bg-center"
        />
      </div>

      {/* Dark semi-transparent overlay mask for legibility */}
      <div className="absolute inset-0 bg-[#050505]/80 z-0" />

      {/* Hand-drawn Star Anise SVG (Left side background) */}
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

      {/* Hand-drawn Cocktail Shaker SVG (Right side background) */}
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

      {/* Background ambient accents */}
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-[#ab1223]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-[#050505]/30 rounded-full blur-[100px] pointer-events-none" />

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
                ? "Tischreservierungen"
                : "Table Reservations"}
            </motion.h2>
          </div>
          <p className="font-sans text-sm md:text-base text-[#e6d6c3]/80 max-w-lg mx-auto leading-relaxed">
            {activeLang === "de"
              ? "Reservieren Sie Ihren Tisch für frisch gezapfte Palmnektar-Cocktails und moderne Küstenspezialitäten. Verfügbare Reservierungszeiten sind täglich von 12:00 Uhr bis 22:00 Uhr."
              : "Reserve your table for freshly tapped palm nectar cocktails and modern coastal tapas. Selected timings run from 12:00 Noon to 10:00 PM daily."}
          </p>
        </div>

        {/* Speakeasy-style booking card (subtle rounded corners, saturated brand colors) */}
        <div
          onMouseMove={handleMouseMove}
          className="bg-[#050505] border border-[#ab1223]/40 p-8 md:p-12 rounded-lg max-w-2xl mx-auto relative group overflow-hidden"
        >
          {/* Spotlight hover element */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0"
            style={{
              background: `radial-gradient(circle 180px at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(171,18,35,0.08), transparent)`,
            }}
          />

          <AnimatePresence mode="wait">
            {!isBooked ? (
              <motion.form
                key="booking-form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                onSubmit={handleSubmit}
                className="space-y-6 relative z-10"
              >
                {/* Booking parameters row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Guests */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] md:text-sm uppercase tracking-[0.2em] font-sans font-bold text-[#e6d6c3]/60 flex items-center gap-2">
                      <Users className="w-3 h-3 text-[#ab1223]" />{" "}
                      {activeLang === "de" ? "Gäste" : "Guests"}
                    </label>
                    <select
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      className="bg-[#16434d]/20 border border-[#ab1223]/30 p-3 rounded-lg text-xs md:text-sm text-[#e6d6c3] focus:outline-none focus:border-[#ab1223] transition-colors font-sans w-full cursor-pointer"
                    >
                      <option value="1" className="bg-[#050505]">
                        {activeLang === "de" ? "1 Gast" : "1 Guest"}
                      </option>

                      <option value="2" className="bg-[#050505]">
                        {activeLang === "de" ? "2 Gäste" : "2 Guests"}
                      </option>

                      <option value="3" className="bg-[#050505]">
                        {activeLang === "de" ? "3 Gäste" : "3 Guests"}
                      </option>

                      <option value="4" className="bg-[#050505]">
                        {activeLang === "de" ? "4 Gäste" : "4 Guests"}
                      </option>

                      <option value="5" className="bg-[#050505]">
                        {activeLang === "de" ? "5 Gäste" : "5 Guests"}
                      </option>

                      <option value="6" className="bg-[#050505]">
                        {activeLang === "de" ? "6 Gäste" : "6 Guests"}
                      </option>

                      <option value="8" className="bg-[#050505]">
                        {activeLang === "de" ? "8 Gäste" : "8 Guests"}
                      </option>
                    </select>
                  </div>

                  {/* Date */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] md:text-sm uppercase tracking-[0.2em] font-sans font-bold text-[#e6d6c3]/60 flex items-center gap-2">
                      <Calendar className="w-3 h-3 text-[#ab1223]" />{" "}
                      {activeLang === "de" ? "Datum" : "Date"}
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                      className="bg-[#16434d]/20 border border-[#ab1223]/30 p-3 rounded-lg text-xs md:text-sm text-[#e6d6c3] focus:outline-none focus:border-[#ab1223] transition-colors font-sans w-full"
                    />
                  </div>

                  {/* Time Selector: Noon 12:00 to Night 10:00 PM */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] md:text-sm uppercase tracking-[0.2em] font-sans font-bold text-[#e6d6c3]/60 flex items-center gap-2">
                      <Clock className="w-3 h-3 text-[#ab1223]" />{" "}
                      {activeLang === "de" ? "Uhrzeit" : "Time"}
                    </label>
                    <select
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="bg-[#16434d]/20 border border-[#ab1223]/30 p-3 rounded-lg text-xs md:text-sm text-[#e6d6c3] focus:outline-none focus:border-[#ab1223] transition-colors font-sans w-full cursor-pointer"
                    >
                      {timeOptions.map((opt) => (
                        <option
                          key={opt.value}
                          value={opt.value}
                          className="bg-[#050505]"
                        >
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Personal Information */}
                <div className="space-y-4 pt-4 border-t border-[#e6d6c3]/10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <input
                        type="text"
                        placeholder={
                          activeLang === "de" ? "Ihr Name" : "Your Name"
                        }
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="bg-[#16434d]/20 border border-[#ab1223]/30 p-3 rounded-lg text-xs md:text-sm text-[#e6d6c3] placeholder-[#e6d6c3]/40 focus:outline-none focus:border-[#ab1223] transition-colors font-sans w-full"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <input
                        type="email"
                        placeholder={
                          activeLang === "de"
                            ? "E-Mail-Adresse"
                            : "Email Address"
                        }
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="bg-[#16434d]/20 border border-[#ab1223]/30 p-3 rounded-lg text-xs md:text-sm text-[#e6d6c3] placeholder-[#e6d6c3]/40 focus:outline-none focus:border-[#ab1223] transition-colors font-sans w-full"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <input
                      type="tel"
                      placeholder={
                        activeLang === "de"
                          ? "Telefonnummer (optional)"
                          : "Phone Number (Optional)"
                      }
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="bg-[#16434d]/20 border border-[#ab1223]/30 p-3 rounded-lg text-xs md:text-sm text-[#e6d6c3] placeholder-[#e6d6c3]/40 focus:outline-none focus:border-[#ab1223] transition-colors font-sans w-full"
                    />
                  </div>
                </div>

                {/* Book Button */}
                <Button type="submit" variant="primary" className="w-full py-4">
                  {activeLang === "de" ? "Tisch reservieren" : "Secure Table"}
                </Button>
              </motion.form>
            ) : (
              <motion.div
                key="booking-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center py-10 space-y-6 relative z-10"
              >
                <div className="flex justify-center">
                  <CheckCircle className="w-16 h-16 text-[#e6d6c3]" />
                </div>
                <div>
                  <h3 className="text-2xl font-heading font-black text-white uppercase tracking-wider">
                    {activeLang === "de"
                      ? "Ihr Tisch ist reserviert"
                      : "Tavern Table Secured"}
                  </h3>

                  <p className="font-sans text-sm text-[#e6d6c3]/80 mt-3 max-w-md mx-auto leading-relaxed">
                    {activeLang === "de" ? (
                      <>
                        Vielen Dank, <strong>{name}</strong>. Ihre Reservierung
                        für <strong>{guests}</strong>{" "}
                        {parseInt(guests) === 1 ? "Gast" : "Gäste"} am{" "}
                        <strong>{date}</strong> um{" "}
                        <strong>
                          {timeOptions.find((o) => o.value === time)?.label ||
                            time}
                        </strong>{" "}
                        wurde bestätigt. Eine Bestätigung wurde an{" "}
                        <strong>{email}</strong> gesendet.
                      </>
                    ) : (
                      <>
                        Thank you, <strong>{name}</strong>. Your booking for{" "}
                        <strong>{guests}</strong>{" "}
                        {parseInt(guests) === 1 ? "guest" : "guests"} on{" "}
                        <strong>{date}</strong> at{" "}
                        <strong>
                          {timeOptions.find((o) => o.value === time)?.label ||
                            time}
                        </strong>{" "}
                        is confirmed. A receipt has been dispatched to{" "}
                        <strong>{email}</strong>.
                      </>
                    )}
                  </p>
                </div>
                <Button
                  onClick={() => {
                    setIsBooked(false);
                    setName("");
                    setEmail("");
                    setPhone("");
                  }}
                  variant="secondary"
                  className="px-6 py-2.5 mx-auto"
                >
                  {activeLang === "de"
                    ? "Weiteren Tisch reservieren"
                    : "Book Another Table"}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
