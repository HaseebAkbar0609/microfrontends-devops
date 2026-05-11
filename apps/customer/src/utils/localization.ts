import { getUserLanguage, setUserLanguage } from "@/utils/userLanguage";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { en } from "./translation/en";
import { sv } from "./translation/sv";

const resources = {
	en: {
		translation: en,
	},
	sv: {
		translation: sv,
	},
};

i18n.use(initReactI18next).init({
	resources,
	lng: getUserLanguage(),
	fallbackLng: "en",
	keySeparator: false,
	interpolation: {
		escapeValue: false,
	},
	react: {
		useSuspense: false,
	},
});

export default i18n;

const refreshLanguage = (language: string) => {
	setUserLanguage(language);
	i18n.changeLanguage(language);
};

export { refreshLanguage };
