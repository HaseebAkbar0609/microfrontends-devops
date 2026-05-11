"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { AVAILABLE_LANGUAGES } from "@/constants/constant";
import { refreshLanguage } from "@/utils/localization";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function LanguageDropdown() {
  const { i18n } = useTranslation();
  const [value, setValue] = useState(i18n.language || "en");

  useEffect(() => {
    const handleLanguageChanged = (lng: string) => {
      setValue(lng);
    };

    i18n.on("languageChanged", handleLanguageChanged);
    return () => {
      i18n.off("languageChanged", handleLanguageChanged);
    };
  }, [i18n]);

  const handleChange = (lang: string) => {
    setValue(lang);
    refreshLanguage(lang);
  };

  return (
    <Select value={value} onValueChange={handleChange}>
      <SelectTrigger className="w-[140px] h-9 text-sm">
        <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent align="end">
        {AVAILABLE_LANGUAGES.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            {lang.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
