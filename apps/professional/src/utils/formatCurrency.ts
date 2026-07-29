import { getUserLanguage } from "./userLanguage";

export function formatCurrency(amount: number): string {
  const lang = getUserLanguage();
  const locale = lang === "sv" ? "sv-SE" : "en-US";
  return amount.toLocaleString(locale);
}
