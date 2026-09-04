"use client";

import { useTranslation } from "react-i18next";


export function useTranslate(): (key: string, options?: Record<string, unknown>) => string {
  const { t } = useTranslation();
  return t as (key: string, options?: Record<string, unknown>) => string;
}

export const Translate: React.FC<{ text: string }> = ({ text }) => {
  const t = useTranslate();
  return <>{t(text)}</>;
};