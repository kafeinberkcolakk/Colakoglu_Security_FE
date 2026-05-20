import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enJson from "./locales/en.json";
import trJson from "./locales/tr.json";

const resources = {
  en: { translation: enJson },
  tr: { translation: trJson },
};

const savedLanguage = localStorage.getItem("language") || "en";

i18n.use(initReactI18next).init({
  fallbackLng: "en",
  interpolation: { escapeValue: false },
  lng: savedLanguage,
  resources,
});

i18n.on("languageChanged", (lng) => {
  localStorage.setItem("language", lng);
});

export default i18n;
