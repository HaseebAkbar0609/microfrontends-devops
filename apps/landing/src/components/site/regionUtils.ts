import i18n from "../../lib/i18n";

export interface RegionConfig {
  name: string;
  nameKey: string;
  code: string;
  lang: string;
  flag: string;
}

export const REGIONS: RegionConfig[] = [
  { name: "Sverige", nameKey: "pricing.nameSverige", code: "SE", lang: "sv", flag: "🇸🇪" },
  { name: "England", nameKey: "pricing.nameEngland", code: "UK", lang: "en", flag: "🇬🇧" },
  { name: "Danmark", nameKey: "pricing.nameDanmark", code: "DK", lang: "da", flag: "🇩🇰" },
  { name: "Norge", nameKey: "pricing.nameNorge", code: "NO", lang: "no", flag: "🇳🇴" },
  { name: "Finland", nameKey: "pricing.nameFinland", code: "FI", lang: "fi", flag: "🇫🇮" },
  { name: "Tyskland", nameKey: "pricing.nameTyskland", code: "DE", lang: "de", flag: "🇩🇪" },
  { name: "Estonia", nameKey: "pricing.nameEstonia", code: "EE", lang: "et", flag: "🇪🇪" },
  { name: "Latvia", nameKey: "pricing.nameLatvia", code: "LV", lang: "lv", flag: "🇱🇻" },
  { name: "Lithuania", nameKey: "pricing.nameLithuania", code: "LT", lang: "lt", flag: "🇱🇹" },
  { name: "Polen", nameKey: "pricing.namePolen", code: "PL", lang: "pl", flag: "🇵🇱" },
  { name: "Usa", nameKey: "pricing.nameUsa", code: "US", lang: "en", flag: "🇺🇸" },
];

export const getSavedRegion = (): RegionConfig => {
  const sweden = REGIONS.find((r) => r.code === "SE") || REGIONS[0];
  if (typeof window === "undefined") return sweden;

  try {
    const savedCode = localStorage.getItem("tfs_region_code");
    if (savedCode) {
      const foundByCode = REGIONS.find(
        (r) => r.code.toUpperCase() === savedCode.toUpperCase()
      );
      if (foundByCode) return foundByCode;
    }
  } catch {
    // Ignore storage errors
  }

  return sweden; // Default to Sverige (SE / sv)
};

export const setRegionLanguage = (region: RegionConfig) => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem("tfs_region_code", region.code);
  } catch {
    // Ignore storage errors
  }

  // Change i18n language
  if (i18n && i18n.changeLanguage) {
    i18n.changeLanguage(region.lang);
  }
  if (typeof document !== "undefined") {
    document.documentElement.lang = region.lang;
  }

  // Clear legacy Google Translate cookies if any
  const hostname = window.location.hostname;
  document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${hostname}`;
  document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;

  // Dispatch custom event for region updates
  window.dispatchEvent(
    new CustomEvent("region-change", { detail: region })
  );
};
