"use client";

import { useTranslation } from "react-i18next";


export function useTranslate(): (key: string) => string {
  const { t } = useTranslation();
  return t;
}

export const Translate: React.FC<{ text: string }> = ({ text }) => {
  const t = useTranslate();
  return <>{t(text)}</>;
};