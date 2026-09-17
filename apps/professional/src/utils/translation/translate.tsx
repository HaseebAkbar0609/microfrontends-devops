"use client";

import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";

export function useTranslate(): (key: string, values?: Record<string, string | number>) => string {
  const { t } = useTranslation();
  return useCallback(
    (key: string, values?: Record<string, string | number>) => {
      let result = t(key, values);
      if (values && typeof result === "string") {
        Object.entries(values).forEach(([k, v]) => {
          result = result.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
        });
      }
      return result;
    },
    [t],
  );
}

export const Translate: React.FC<{ text: string; values?: Record<string, string | number> }> = ({ text, values }) => {
  const t = useTranslate();
  return <>{t(text, values)}</>;
};