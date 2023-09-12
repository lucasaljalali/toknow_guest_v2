import { initReactI18next } from "react-i18next";
import i18n from "i18next";
import translationEN from "./en.json";
import translationPT from "./pt.json";

const resources = {
  en: {
    id: "En",
    locale: "GB",
    label: "English",
    translation: translationEN,
  },
  pt: {
    id: "Pt",
    locale: "PT",
    label: "Português",
    translation: translationPT,
  },
};

i18n.use(initReactI18next).init({
  resources: resources,
  lng: "en",
  fallbackLng: "en",
  keySeparator: false,
  interpolation: {
    escapeValue: false,
  },
});
export default i18n;
