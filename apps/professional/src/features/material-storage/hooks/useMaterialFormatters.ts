"use client";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { DEFAULT_LANGUAGE } from "@/constants/constant";
import { useTranslate } from "@/utils/translation/translate";
import {
	MATERIAL_CURRENCY,
	MATERIAL_NUMBER_LOCALES,
	MATERIAL_UNIT_LABELS,
} from "../constants/materialStorage.constants";
import type { MaterialUnit } from "../types/materialStorage.types";

/**
 * Number formats from the Figma frame, following the UI language: unit prices
 * with öre ("85,00 kr"), totals without ("27 200 kr"), quantities with their
 * unit ("1 150 m").
 */
export function useMaterialFormatters() {
	const { i18n } = useTranslation();
	const t = useTranslate();
	const language = i18n.language?.split("-")[0] ?? DEFAULT_LANGUAGE;
	const locale = MATERIAL_NUMBER_LOCALES[language] ?? MATERIAL_NUMBER_LOCALES[DEFAULT_LANGUAGE];

	return useMemo(() => {
		const price = new Intl.NumberFormat(locale, {
			style: "currency",
			currency: MATERIAL_CURRENCY,
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		});
		const amount = new Intl.NumberFormat(locale, {
			style: "currency",
			currency: MATERIAL_CURRENCY,
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		});
		const count = new Intl.NumberFormat(locale, { maximumFractionDigits: 2 });
		const signedCount = new Intl.NumberFormat(locale, { maximumFractionDigits: 2, signDisplay: "exceptZero" });
		const percent = new Intl.NumberFormat(locale, {
			style: "percent",
			minimumFractionDigits: 1,
			maximumFractionDigits: 1,
		});
		const decimalInput = new Intl.NumberFormat(locale, {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
			useGrouping: false,
		});

		return {
			formatPrice: (value: number) => price.format(value),
			formatAmount: (value: number) => amount.format(value),
			/** Whole kronor stay whole ("9 900 kr"); öre are kept when there are any ("2,55 kr"). */
			formatMoney: (value: number) =>
				Number.isInteger(value) ? amount.format(value) : price.format(value),
			formatCount: (value: number) => count.format(value),
			/** A value to put in a number input: "85,00" / "85.00", no grouping, so parseDecimalInput reads it back. */
			formatDecimalInput: (value: number) => decimalInput.format(value),
			formatQuantity: (value: number, unit: MaterialUnit) =>
				`${count.format(value)} ${t(MATERIAL_UNIT_LABELS[unit])}`,
			/** A stock change with its sign: "+120 st", "−40 st". */
			formatQuantityChange: (value: number, unit: MaterialUnit) =>
				`${signedCount.format(value)} ${t(MATERIAL_UNIT_LABELS[unit])}`,
			/** 51.8 → "51,8 %" */
			formatPercent: (value: number) => percent.format(value / 100),
		};
	}, [locale, t]);
}
