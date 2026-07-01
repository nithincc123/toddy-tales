"use client";

import { useRef, useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import { Gift, ArrowRight, CheckCircle, RefreshCw } from "lucide-react";
import Button from "./Button";
import { useLanguage } from "@/context/LanguageContext";

interface Voucher {
  id: number;
  title_en: string;
  title_de: string;
  subtitle_en: string;
  subtitle_de: string;
  content_en: string;
  content_de: string;
  amount: number;
  status: number;
}

interface CouponCard {
  id: number;
  title_en: string;
  title_de: string;
  subtitle_en: string;
  subtitle_de: string;
  content_en: string;
  content_de: string;
  amount: number;
  color: string;
}

export default function GiftCardSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { activeLang } = useLanguage();
  const [amount, setAmount] = useState("50");
  const [customAmount, setCustomAmount] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [senderName, setSenderName] = useState("");
  const [message, setMessage] = useState("");
  const [isPurchased, setIsPurchased] = useState(false);

  const [hoveredCardId, setHoveredCardId] = useState<number | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleCardMouseMove = (
    e: React.MouseEvent<HTMLDivElement>,
    cardId: number,
    isTop: boolean,
  ) => {
    if (!isTop) return;
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate tilt angles relative to card center
    const tiltX = -((y - rect.height / 2) / (rect.height / 2)) * 6; // Max 6 degrees tilt
    const tiltY = ((x - rect.width / 2) / (rect.width / 2)) * 6; // Max 6 degrees tilt

    setTilt({ x: tiltX, y: tiltY });

    card.style.setProperty("--card-mouse-x", `${x}px`);
    card.style.setProperty("--card-mouse-y", `${y}px`);
  };

  const handleCardMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setHoveredCardId(null);
  };

  // Viewport scroll tracking for parallax background and SVGs
  const { scrollYProgress } = useScroll(
    sectionRef.current
      ? {
          target: sectionRef,
          offset: ["start end", "end start"],
        }
      : {},
  );

  const yBg = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);
  const yPepper = useTransform(scrollYProgress, [0, 1], [-60, 60]);
  const ySpice = useTransform(scrollYProgress, [0, 1], [50, -50]);

  const colors = [
    "from-[#16434d] to-[#0e2a30]",
    "from-[#ab1223] to-[#730c17]",
    "from-[#9a7b56] to-[#6a5338]",
  ];

  const [cards, setCards] = useState<CouponCard[]>([]);

  useEffect(() => {
    const fetchGiftCards = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/home-gift-vouchers`,
        );

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const result = await res.json();

        if (result.success) {
          const mapped: CouponCard[] = result.data.map(
            (item: Voucher, index: number) => ({
              id: item.id,
              title_en: item.title_en,
              title_de: item.title_de,
              subtitle_en: item.subtitle_en,
              subtitle_de: item.subtitle_de,
              content_en: item.content_en,
              content_de: item.content_de,
              amount: item.amount,
              color: colors[index % colors.length],
            }),
          );

          setCards(mapped);

          if (mapped.length > 0) {
            setAmount(mapped[mapped.length - 1].amount.toString());
          }
        }
      } catch (error) {
        console.error("Fetch Error:", error);
      }
    };

    fetchGiftCards();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  };

  // Bring a specific card to the top of the stack
  const bringCardToTop = (cardId: number) => {
    setCards((prev) => {
      const idx = prev.findIndex((c) => c.id === cardId);
      if (idx === -1 || idx === prev.length - 1) return prev; // Already at the top

      const next = [...prev];
      const [target] = next.splice(idx, 1);
      next.push(target);
      return next;
    });
  };

  // Shuffle deck on card click, and update form value to match the new top card
  const handleShuffle = () => {
    setTilt({ x: 0, y: 0 });
    setHoveredCardId(null);
    setCards((prev) => {
      const next = [...prev];
      const top = next.pop(); // Take the top card
      if (top) {
        next.unshift(top); // Move to back
      }

      // Update form value based on new top card
      const newTop = next[next.length - 1];
      if (newTop) {
        setAmount(newTop.amount.toString());
        setCustomAmount("");
      }

      return next;
    });
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();

    const finalAmount = amount === "custom" ? customAmount : amount;

    const payload = {
      sender_name: senderName,
      recipient_name: recipientName,
      recipient_email: recipientEmail,
      amount: Number(finalAmount),
      personal_message: message,
    };

    try {
      setIsSubmitting(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/purchase-voucher`,
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
        throw new Error(result.message || "Failed to submit.");
      }

      setIsPurchased(true);

      console.log(result);
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const finalAmount = amount === "custom" ? customAmount : amount;

  return (
    <section
      ref={sectionRef}
      id="giftcards"
      className="relative w-full py-24 md:py-32 overflow-hidden text-[#e6d6c3]"
    >
      {/* Scroll Parallax Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1560512823-829485b8bf24?auto=format&fit=crop&w=1920&q=80')`,
            y: yBg,
          }}
          className="absolute inset-x-0 -top-[15%] -bottom-[15%] bg-cover bg-center"
        />
      </div>

      {/* Dark semi-transparent overlay mask for premium feel */}
      <div className="absolute inset-0 bg-[#050505]/85 z-0" />

      {/* Background radial glows */}
      <div className="absolute top-1/2 left-1/4 w-[350px] h-[350px] bg-[#ab1223]/10 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[350px] h-[350px] bg-[#16434d]/10 rounded-full blur-[90px] pointer-events-none" />

      {/* Drawing SVG: Hand-drawn Chili Pepper (Left side) */}
      <motion.div
        style={{ y: yPepper }}
        className="absolute left-6 top-[25%] w-[180px] h-[180px] text-[#e6d6c3] opacity-[0.05] pointer-events-none select-none z-10 hidden lg:block"
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          strokeLinecap="round"
          className="w-full h-full"
        >
          <path d="M60,15 Q65,10 68,12 Q70,15 65,20 C55,32 50,50 50,70 C50,80 43,88 35,85 C28,82 30,70 38,55 C45,40 50,25 60,15 Z" />
          <path d="M63,14 Q65,8 60,6" strokeWidth="1" />
        </svg>
      </motion.div>

      {/* Drawing SVG: Hand-drawn Star Anise (Right side) */}
      <motion.div
        style={{ y: ySpice }}
        className="absolute right-6 bottom-[15%] w-[160px] h-[160px] text-[#e6d6c3] opacity-[0.04] pointer-events-none select-none z-10 hidden lg:block"
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

      <div className="max-w-6xl mx-auto px-6 relative z-10">
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
                ? "Verschenken Sie das Tavernen-Erlebnis"
                : "Gift the Tavern Experience"}
            </motion.h2>
          </div>
          <p className="font-sans text-sm md:text-base text-[#e6d6c3]/80 max-w-lg mx-auto leading-relaxed">
            {activeLang === "de"
              ? "Teilen Sie die Geschichten, die süßen Palmfermente und die würzigen Aromen von Toddy Tales. Versenden Sie sofort einen hochwertigen digitalen Tavernengutschein."
              : "Share the stories, sweet palm ferments, and spiced flavors of Toddy Tales. Send a premium digital tavern voucher instantly."}
          </p>
        </div>

        {/* Layout: Balanced 50-50 columns for card mockup and form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-stretch">
          {/* Card Mockup (Left Side) - Shuffle Deck */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center w-full min-h-[350px] md:min-h-[420px]">
            {/* The Stacked Coupon Area */}
            <div
              className="relative w-full max-w-[520px] aspect-[1.58/1] cursor-pointer"
              onClick={handleShuffle}
            >
              {cards.map((card, index) => {
                const isTop = index === cards.length - 1;
                const isMiddle = index === cards.length - 2;

                // Position/rotation offsets based on depth index
                let scale = 0.88;
                let y = -24;
                let rotate = -4;
                let opacity = 0.5;

                if (isTop) {
                  scale = 1.0;
                  y = 0;
                  rotate = 0;
                  opacity = 1.0;
                } else if (isMiddle) {
                  scale = 0.94;
                  y = -12;
                  rotate = 2;
                  opacity = 0.85;
                }

                return (
                  <motion.div
                    key={card.id}
                    style={{
                      zIndex: index,
                      transformStyle: "preserve-3d",
                      perspective: 1000,
                    }}
                    onMouseEnter={() => {
                      if (isTop) setHoveredCardId(card.id);
                    }}
                    onMouseLeave={() => {
                      if (isTop) handleCardMouseLeave();
                    }}
                    onMouseMove={(e) => {
                      if (isTop) handleCardMouseMove(e, card.id, isTop);
                    }}
                    animate={{
                      scale: isTop
                        ? hoveredCardId === card.id
                          ? 1.04
                          : 1.0
                        : scale,
                      y: isTop ? (hoveredCardId === card.id ? -10 : 0) : y,
                      rotate: isTop
                        ? hoveredCardId === card.id
                          ? tilt.y * 0.5
                          : 0
                        : rotate,
                      rotateX: isTop
                        ? hoveredCardId === card.id
                          ? tilt.x
                          : 0
                        : 0,
                      rotateY: isTop
                        ? hoveredCardId === card.id
                          ? tilt.y
                          : 0
                        : 0,
                      opacity,
                    }}
                    transition={{ type: "spring", stiffness: 350, damping: 28 }}
                    className={`absolute inset-0 w-full h-full bg-gradient-to-br ${card.color} border border-[#e6d6c3]/20 shadow-2xl rounded-lg p-8 md:p-10 flex flex-col justify-between overflow-hidden select-none`}
                  >
                    {/* Inner Dashed Border for Ticket Aesthetic */}
                    <div className="absolute inset-2 border border-dashed border-[#e6d6c3]/20 rounded-md pointer-events-none" />

                    {/* Sweeping diagonal shine highlight */}
                    {isTop && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-[#e6d6c3]/15 to-transparent z-25 pointer-events-none"
                        initial={{ x: "-100%", skewX: -20 }}
                        animate={
                          hoveredCardId === card.id
                            ? { x: "100%" }
                            : { x: "-100%" }
                        }
                        transition={{ duration: 0.75, ease: "easeInOut" }}
                      />
                    )}

                    {/* Mouse-following glare spotlight */}
                    {isTop && hoveredCardId === card.id && (
                      <div
                        className="absolute inset-0 pointer-events-none z-30 opacity-40 mix-blend-color-dodge transition-opacity duration-300"
                        style={{
                          background: `radial-gradient(circle 160px at var(--card-mouse-x, 50%) var(--card-mouse-y, 50%), rgba(230, 214, 195, 0.35), transparent)`,
                        }}
                      />
                    )}

                    {/* Left and Right notches (Coupon Ticket Cutouts) */}
                    <div className="absolute left-[-10px] top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#050505] z-10 border-r border-[#e6d6c3]/20" />
                    <div className="absolute right-[-10px] top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#050505] z-10 border-l border-[#e6d6c3]/20" />

                    {/* Ticket Stub Dashed Dividing Line (140px from right) */}
                    <div className="absolute right-[140px] top-2 bottom-2 border-r border-dashed border-[#e6d6c3]/20 z-20" />

                    {/* Left Section: Main Details (Left-aligned) */}
                    <div className="pr-[140px] flex flex-col justify-between h-full relative z-10 text-left items-start">
                      <div className="text-left items-start flex flex-col">
                        {/* Logo */}
                        <img
                          src="/logo/ToddyTales_Logo_white.png"
                          alt="Toddy Tales"
                          className="h-10 md:h-12 w-auto object-contain block"
                        />
                        <h4 className="text-base md:text-lg font-heading font-black text-white uppercase mt-3 tracking-wide text-left">
                          {activeLang === "de"
                            ? card.title_de || card.title_en
                            : card.title_en}
                        </h4>
                        <p className="text-[10px] md:text-sm uppercase tracking-[0.25em] text-[#e6d6c3]/70 font-sans mt-1 text-left">
                          {activeLang === "de"
                            ? card.subtitle_de || card.subtitle_en
                            : card.subtitle_en}
                        </p>
                      </div>

                      <p className="text-xs md:text-sm font-sans text-[#e6d6c3]/70 leading-relaxed hidden sm:block text-left">
                        {activeLang === "de"
                          ? card.content_de || card.content_en
                          : card.content_en}
                      </p>
                    </div>

                    {/* Right Section: Highlighted Coupon Stub (Amount) */}
                    <div className="absolute right-0 top-0 bottom-0 w-[140px] bg-black/25 backdrop-blur-[1px] flex flex-col items-center justify-center z-10 text-center">
                      <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-[#e6d6c3]/60 font-sans block mb-1">
                        {activeLang === "de" ? "WERT" : "VALUE"}
                      </span>
                      <span className="text-2xl md:text-3xl font-heading font-black text-white bg-[#ab1223] px-3.5 py-1.5 rounded-md border border-[#e6d6c3]/20 shadow-md block my-1">
                        €{finalAmount || "0"}
                      </span>
                      <span className="text-[9px] md:text-xs uppercase tracking-widest text-[#e6d6c3]/60 border border-[#e6d6c3]/20 px-2.5 py-0.5 rounded mt-2 font-sans">
                        {activeLang === "de" ? "GUTSCHEIN" : "PASS"}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Click to shuffle label */}
            <div className="mt-8 flex items-center gap-2 text-xs md:text-sm uppercase tracking-widest text-[#e6d6c3]/60 select-none">
              <RefreshCw className="w-3.5 h-3.5 animate-spin-slow text-[#ab1223]" />
              <span>
                {activeLang === "de"
                  ? "Klicken Sie auf den Gutscheinstapel, um ihn zu mischen."
                  : "Click coupon stack to shuffle"}
              </span>
            </div>
          </div>

          {/* Form Widget (Right Side) */}
          <div
            onMouseMove={handleMouseMove}
            className="lg:col-span-6 bg-[#16434d]/10 border border-[#ab1223]/25 p-8 rounded-lg flex flex-col justify-center relative z-10 group overflow-hidden"
          >
            {/* Spotlight overlay tracking the mouse cursor */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0"
              style={{
                background: `radial-gradient(circle 180px at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(171,18,35,0.08), transparent)`,
              }}
            />
            <AnimatePresence mode="wait">
              {!isPurchased ? (
                <motion.form
                  key="gift-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handlePurchase}
                  className="space-y-6 relative z-10"
                >
                  {/* Select Amount Row */}
                  <div className="space-y-2.5">
                    <label className="text-[10px] md:text-sm uppercase tracking-[0.15em] font-sans font-bold text-[#e6d6c3]/70 block">
                      {activeLang === "de"
                        ? "Gutscheinwert auswählen"
                        : "Select Voucher Value"}
                    </label>

                    <div className="grid grid-cols-4 gap-2.5">
                      {cards.map((card) => (
                        <button
                          key={card.id}
                          type="button"
                          onClick={() => {
                            setAmount(card.amount.toString());
                            setCustomAmount("");
                            bringCardToTop(card.id);
                          }}
                          className={`py-3 rounded-lg border text-xs md:text-sm font-sans font-bold transition-all duration-300 ${
                            amount === card.amount.toString()
                              ? "bg-[#ab1223] border-[#ab1223] text-white"
                              : "bg-transparent border-[#ab1223]/25 text-[#e6d6c3] hover:border-[#ab1223]"
                          }`}
                        >
                          €{card.amount}
                        </button>
                      ))}

                      <button
                        type="button"
                        onClick={() => setAmount("custom")}
                        className={`py-3 rounded-lg border text-xs md:text-sm font-sans font-bold transition-all duration-300 ${
                          amount === "custom"
                            ? "bg-[#ab1223] border-[#ab1223] text-white"
                            : "bg-transparent border-[#ab1223]/25 text-[#e6d6c3] hover:border-[#ab1223]"
                        }`}
                      >
                        {activeLang === "de" ? "Eigener Betrag" : "Custom"}
                      </button>
                    </div>
                  </div>

                  {/* Custom input element */}
                  {amount === "custom" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="flex flex-col gap-1.5"
                    >
                      <input
                        type="number"
                        placeholder={
                          activeLang === "de"
                            ? "Eigenen Betrag eingeben (€)"
                            : "Enter custom amount (€)"
                        }
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        required={amount === "custom"}
                        min="10"
                        className="bg-[#16434d]/20 border border-[#ab1223]/30 p-3 rounded-lg text-xs md:text-sm text-[#e6d6c3] placeholder-[#e6d6c3]/40 focus:outline-none focus:border-[#ab1223] font-sans w-full"
                      />
                    </motion.div>
                  )}

                  {/* Personal details fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <input
                        type="text"
                        placeholder={
                          activeLang === "de"
                            ? "Name des Empfängers"
                            : "Recipient's Name"
                        }
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                        required
                        className="bg-[#16434d]/20 border border-[#ab1223]/30 p-3 rounded-lg text-xs md:text-sm text-[#e6d6c3] placeholder-[#e6d6c3]/40 focus:outline-none focus:border-[#ab1223] font-sans w-full"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <input
                        type="email"
                        placeholder={
                          activeLang === "de"
                            ? "E-Mail des Empfängers"
                            : "Recipient's Email"
                        }
                        value={recipientEmail}
                        onChange={(e) => setRecipientEmail(e.target.value)}
                        required
                        className="bg-[#16434d]/20 border border-[#ab1223]/30 p-3 rounded-lg text-xs md:text-sm text-[#e6d6c3] placeholder-[#e6d6c3]/40 focus:outline-none focus:border-[#ab1223] font-sans w-full"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <input
                        type="text"
                        placeholder={
                          activeLang === "de"
                            ? "Ihr Name (Absender)"
                            : "Your Name (Sender)"
                        }
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                        required
                        className="bg-[#16434d]/20 border border-[#ab1223]/30 p-3 rounded-lg text-xs md:text-sm text-[#e6d6c3] placeholder-[#e6d6c3]/40 focus:outline-none focus:border-[#ab1223] font-sans w-full"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <textarea
                        placeholder={
                          activeLang === "de"
                            ? "Personalisierte Nachricht (optional)"
                            : "Personalized Message (Optional)"
                        }
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={2}
                        className="bg-[#16434d]/20 border border-[#ab1223]/30 p-3 rounded-lg text-xs md:text-sm text-[#e6d6c3] placeholder-[#e6d6c3]/40 focus:outline-none focus:border-[#ab1223] font-sans w-full resize-none"
                      />
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full py-4"
                    disabled={isSubmitting}
                  >
                    <span>
                      {isSubmitting
                        ? activeLang === "de"
                          ? "Wird gesendet..."
                          : "Submitting..."
                        : activeLang === "de"
                          ? "Gutschein kaufen"
                          : "Purchase Gift Card"}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </motion.form>
              ) : (
                <motion.div
                  key="purchase-success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-6 space-y-5 relative z-10"
                >
                  <div className="flex justify-center">
                    <CheckCircle className="w-12 h-12 text-[#e6d6c3]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-heading font-black text-white uppercase tracking-wider">
                      {activeLang === "de"
                        ? "Gutschein versendet"
                        : "Gift Card Dispatched"}
                    </h3>
                    <p className="font-sans text-xs sm:text-sm text-[#e6d6c3]/85 mt-2 max-w-sm mx-auto leading-relaxed">
                      {activeLang === "de" ? (
                        <>
                          Ihr Tavernengutschein im Wert von €{finalAmount} wurde
                          erfolgreich an <strong>{recipientEmail}</strong>{" "}
                          gesendet.
                        </>
                      ) : (
                        <>
                          Your €{finalAmount} tavern voucher has been emailed
                          successfully to <strong>{recipientEmail}</strong>.
                        </>
                      )}
                    </p>
                  </div>
                  <Button
                    onClick={() => {
                      setIsPurchased(false);
                      setRecipientName("");
                      setRecipientEmail("");
                      setSenderName("");
                      setMessage("");
                    }}
                    variant="secondary"
                    className="px-5 py-2 mx-auto"
                  >
                    {activeLang === "de"
                      ? "Weiteren Gutschein versenden"
                      : "Send Another Voucher"}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
