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

import mpSv from "./locales/modulePages.sv.json";
import mpEn from "./locales/modulePages.en.json";
import mpDa from "./locales/modulePages.da.json";
import mpDe from "./locales/modulePages.de.json";
import mpEt from "./locales/modulePages.et.json";
import mpNo from "./locales/modulePages.no.json";
import mpFi from "./locales/modulePages.fi.json";
import mpLt from "./locales/modulePages.lt.json";
import mpLv from "./locales/modulePages.lv.json";
import mpPl from "./locales/modulePages.pl.json";

const resources = {
  sv: { translation: sv, modulePages: mpSv },
  da: { translation: da, modulePages: mpDa },
  en: { translation: en, modulePages: mpEn },
  no: { translation: no, modulePages: mpNo },
  de: { translation: de, modulePages: mpDe },
  fi: { translation: fi, modulePages: mpFi },
  et: { translation: et, modulePages: mpEt },
  lv: { translation: lv, modulePages: mpLv },
  lt: { translation: lt, modulePages: mpLt },
  pl: { translation: pl, modulePages: mpPl },
};

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    lng: "sv",
    fallbackLng: "en",
    ns: ["translation", "modulePages"],
    defaultNS: "translation",
    interpolation: {
      escapeValue: false,
    },
  });
}

export default i18n;
