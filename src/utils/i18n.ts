import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { locales_en } from "../constants/locales_en.ts";
import { useTranslation as useTranslationOrg } from "react-i18next";
import type { LocaleKeysEn } from "../constants/locales_en";

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {
    translation: locales_en,
  },
  ru: {
    translation: {
      WELCOME_MESSAGE: "Добро пожаловать в React и react-i18next",
    },
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    fallbackLng: "ru",
    lng: "ru", // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;

export function useTranslation() {
  const { t, ...rest } = useTranslationOrg();
  return {
    t: (key: LocaleKeysEn, options?: Record<string, unknown>) =>
      t(key, options),
    ...rest,
  };
}
