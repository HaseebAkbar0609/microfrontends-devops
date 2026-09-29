"use client";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { LANGUAGE_CODES } from "@/constants/constant";
import localizationConstants from "@/utils/translation/constants";
import { ANALYTICS_LOCALES } from "./analytics.constants";

/**
 * The viewer's locale (sv-SE or en-GB), a number formatter for it, and the
 * footnote shown when a breakdown was counted from fewer records than exist.
 */
export function useAnalyticsLocale() {
  const { t, i18n } = useTranslation();
  const locale =
    i18n.language === LANGUAGE_CODES.swe ? ANALYTICS_LOCALES.swe : ANALYTICS_LOCALES.en;

  return useMemo(() => {
    const numberFormat = new Intl.NumberFormat(locale);
    const formatNumber = (value: number) => numberFormat.format(value);
    const formatSample = (fetched: number, total: number) =>
      total > fetched
        ? t(localizationConstants.analyticsSample, {
            shown: formatNumber(fetched),
            total: formatNumber(total),
          })
        : undefined;
    return { locale, formatNumber, formatSample };
  }, [locale, t]);
}
