import type { Metadata } from "next";
import { Outfit, Playfair_Display } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/context/LanguageContext";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Toddy Tales Bar & Kitchen | Berlin",
  description:
    "Germany's First Toddy Shop Inspired Cocktail Bar. Where Kerala tavern legacy meets modern European craft mixology in Torstraße, Berlin.",
  keywords: [
    "Toddy Tales",
    "Berlin",
    "Cocktail Bar",
    "Kerala Tavern",
    "Toddy Shop",
    "Craft Mixology",
    "Torstraße",
    "Coastal Tapas",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#e6d6c3] text-[#050505] font-sans antialiased selection:bg-[#ab1223] selection:text-[#e6d6c3] flex flex-col">
        <LanguageProvider>
          <Header />
          {children}
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
