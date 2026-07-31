import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import sv from "./locales/sv.json";
import da from "./locales/da.json";
import en from "./locales/en.json";
import no from "./locales/no.json";
import de from "./locales/de.json";
import fi from "./locales/fi.json";
import et from "./locales/et.json";
import lv from "./locales/lv.json";
import lt from "./locales/lt.json";
import pl from "./locales/pl.json";

const resources = {
  sv: { translation: sv },
  da: { translation: da },
  en: { translation: en },
  no: { translation: no },
  de: { translation: de },
  fi: { translation: fi },
  et: { translation: et },
  lv: { translation: lv },
  lt: { translation: lt },
  pl: { translation: pl },
};

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    lng: "sv",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });
}

export default i18n;
