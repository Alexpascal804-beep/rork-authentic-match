import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "@/locales/en";
import fr from "@/locales/fr";
import es from "@/locales/es";
import pt from "@/locales/pt";
import ar from "@/locales/ar";
import zh from "@/locales/zh";
import de from "@/locales/de";
import ja from "@/locales/ja";

export const languages = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "fr", name: "French", nativeName: "Français" },
  { code: "es", name: "Spanish", nativeName: "Español" },
  { code: "pt", name: "Portuguese", nativeName: "Português" },
  { code: "ar", name: "Arabic", nativeName: "العربية" },
  { code: "zh", name: "Chinese", nativeName: "中文" },
  { code: "de", name: "German", nativeName: "Deutsch" },
  { code: "ja", name: "Japanese", nativeName: "日本語" },
];

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    fr: { translation: fr },
    es: { translation: es },
    pt: { translation: pt },
    ar: { translation: ar },
    zh: { translation: zh },
    de: { translation: de },
    ja: { translation: ja },
  },
  lng: "en",
  fallbackLng: "en",
  compatibilityJSON: "v4",
  interpolation: {
    escapeValue: false,
  },
}).catch((err) => {
  console.error("Failed to initialize i18n", err);
});

export default i18n;
