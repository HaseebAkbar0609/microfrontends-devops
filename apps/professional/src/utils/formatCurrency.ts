import { getUserLanguage } from "./userLanguage";

const LOCALE_MAP: Record<string, string> = {
  sv: "sv-SE",
  en: "en-US",
};

const SEK_FORMAT_OPTIONS: Intl.NumberFormatOptions = {
  style: "decimal",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
};

export function formatCurrency(amount: number): string {
  const lang = getUserLanguage();
  const locale = LOCALE_MAP[lang] ?? "sv-SE";
  return new Intl.NumberFormat(locale, SEK_FORMAT_OPTIONS).format(amount);
}
