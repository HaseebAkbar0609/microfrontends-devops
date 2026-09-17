import type { TFunction } from "i18next";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import type { YearEndCategory, YearEndStatus } from "../types/yearEnd.types";

export interface YearEndCategoryOption {
	value: YearEndCategory;
	labelKey: TranslationKeys;
}

export const YEAR_END_CATEGORY_OPTIONS: YearEndCategoryOption[] = [
	{ value: "Årsredovisning", labelKey: localizationConstants.catAnnualReport },
	{ value: "Deklaration", labelKey: localizationConstants.catTaxDeclaration },
	{ value: "Balans & Resultat", labelKey: localizationConstants.catBalanceIncome },
	{ value: "Huvudbok", labelKey: localizationConstants.catGeneralLedger },
	{ value: "Leverantörslista", labelKey: localizationConstants.catSupplierList },
	{ value: "Kundfordringar", labelKey: localizationConstants.catCustomerReceivables },
	{ value: "Moms & Skatt", labelKey: localizationConstants.catVatTax },
	{ value: "Övrigt", labelKey: localizationConstants.catOther },
];

export function getYearEndCategoryLabel(category: YearEndCategory, t: TFunction): string {
	const option = YEAR_END_CATEGORY_OPTIONS.find((opt) => opt.value === category);
	if (option) {
		return t(option.labelKey);
	}
	return category;
}

export function getYearEndStatusLabel(status: YearEndStatus, t: TFunction): string {
	switch (status) {
		case "completed":
			return t(localizationConstants.statusCompleted);
		case "in_progress":
			return t(localizationConstants.statusInProgress);
		case "not_started":
			return t(localizationConstants.statusNotStarted);
		default:
			return status;
	}
}
