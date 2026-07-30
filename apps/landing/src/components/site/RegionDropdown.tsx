import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  REGIONS,
  RegionConfig,
  getSavedRegion,
  setRegionLanguage,
} from "./regionUtils";

interface RegionDropdownProps {
  variant?: "dark" | "light";
  className?: string;
  dropDirection?: "up" | "down";
}

export const RegionDropdown: React.FC<RegionDropdownProps> = ({
  variant = "dark",
  className = "",
  dropDirection = "down",
}) => {
  const { t } = useTranslation();
  const defaultRegion = REGIONS.find((r) => r.code === "SE") || REGIONS[0];
  const [selectedRegion, setSelectedRegion] = useState<RegionConfig>(defaultRegion);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedRegion(getSavedRegion());
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (region: RegionConfig) => {
    setSelectedRegion(region);
    setIsOpen(false);
    setRegionLanguage(region);
  };

  const isDark = variant === "dark";

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between gap-2.5 px-3 py-2 text-xs md:text-sm font-medium rounded-sm transition-all duration-200 cursor-pointer border ${
          isDark
            ? "bg-white/10 text-white border-white/20 hover:bg-white/20 hover:border-white/30"
            : "bg-surface text-foreground border-border hover:border-foreground/30"
        }`}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2 whitespace-nowrap">
          <span className="text-base leading-none">{selectedRegion.flag}</span>
          <span className="font-medium">
            {t(selectedRegion.nameKey)} ({selectedRegion.code})
          </span>
        </div>
        <svg
          className={`w-3.5 h-3.5 transition-transform duration-200 opacity-70 shrink-0 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div
          className={`absolute left-0 right-0 ${
            dropDirection === "up" ? "bottom-full mb-2" : "top-full mt-2"
          } w-full min-w-full rounded-sm shadow-2xl z-50 overflow-hidden border backdrop-blur-md transition-all animate-fade-in ${
            isDark
              ? "bg-zinc-900/95 border-white/15 text-stone-200 divide-y divide-white/10"
              : "bg-background/95 border-border text-foreground divide-y divide-border"
          }`}
        >
          <div className="py-1 max-h-[122px] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {REGIONS.map((region) => {
              const isSelected = region.code === selectedRegion.code;
              return (
                <button
                  key={region.code}
                  type="button"
                  onClick={() => handleSelect(region)}
                  className={`w-full text-left px-3 py-2 text-xs md:text-sm flex items-center justify-between transition-colors cursor-pointer ${
                    isSelected
                      ? isDark
                        ? "bg-blue-600/30 text-white font-semibold"
                        : "bg-primary/10 text-primary font-semibold"
                      : isDark
                      ? "hover:bg-white/10 hover:text-white"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{region.flag}</span>
                    <span>{t(region.nameKey)}</span>
                  </div>
                  <span className="text-xs font-mono opacity-60 uppercase">{region.code}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
