/**
 * User language preference – used project-wide (e.g. i18n, language switcher).
 * Persists and reads from localStorage; SSR-safe.
 */

import { DEFAULT_LANGUAGE, LANGUAGE_CODES } from "@/constants/constant";

export function getUserLanguage(): string {
  if (typeof window === "undefined") {
    return DEFAULT_LANGUAGE;
  }
  const savedLang = localStorage.getItem("userLanguage");
  if (savedLang) {
    return savedLang;
  }
  const userLang = navigator.language;
  if (userLang.includes(LANGUAGE_CODES.swe)) {
    return LANGUAGE_CODES.swe;
  }
  return DEFAULT_LANGUAGE;
}

export function setUserLanguage(language: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("userLanguage", language);
  }
}
