import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';

// Simple i18n context with localStorage persistence
const LanguageContext = createContext({
  lang: 'en',
  t: (key, vars) => key,
  setLang: () => {},
});

const translations = {
  en: {
    logout: 'Logout',
    welcome: 'Welcome {{name}} from {{location}}',
    feature_market_prices: 'Market Price',
    feature_weather: 'Weather',
    feature_ai_advisory: 'AI-Based Crop Advisory',
    feature_quick_tips: 'Quick Tips',
    feature_marketplace: 'Marketplace',
    change_language: 'Language',
    lang_en: 'English',
    lang_hi: 'Hindi',
  },
  hi: {
    logout: 'लॉगआउट',
    welcome: '{{location}} से {{name}} जी आपका स्वागत है',
    feature_market_prices: 'बाजार भाव',
    feature_weather: 'मौसम',
    feature_ai_advisory: 'एआई आधारित फसल सलाह',
    feature_quick_tips: 'त्वरित सुझाव',
    feature_marketplace: 'मार्केटप्लेस',
    change_language: 'भाषा',
    lang_en: 'अंग्रेज़ी',
    lang_hi: 'हिंदी',
  },
};

function interpolate(template, vars = {}) {
  if (typeof template !== 'string') return template;
  return template.replace(/\{\{(.*?)\}\}/g, (_, k) => {
    const key = String(k).trim();
    return vars[key] != null ? String(vars[key]) : '';
  });
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en');

  useEffect(() => {
    const saved = localStorage.getItem('lang');
    if (saved) setLang(saved);
  }, []);

  const value = useMemo(() => ({
    lang,
    setLang: (l) => {
      localStorage.setItem('lang', l);
      setLang(l);
    },
    t: (key, vars) => {
      const dict = translations[lang] || translations.en;
      const str = dict[key] || translations.en[key] || key;
      return interpolate(str, vars);
    },
  }), [lang]);

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
