"use client";

import { createContext, useContext, useState } from "react";

type Language = "en" | "de";

type LanguageContextType = {
  activeLang: Language;
  setActiveLang: (lang: Language) => void;
};

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [activeLang, setActiveLang] = useState<Language>("en");

  return (
    <LanguageContext.Provider value={{ activeLang, setActiveLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }

  return context;
}
