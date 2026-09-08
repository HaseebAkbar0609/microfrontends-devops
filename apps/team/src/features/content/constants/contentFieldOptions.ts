import localizationConstants from "@/utils/translation/constants";
import type { ContentSelectOption } from "../types";

/**
 * Select options are stored by id and displayed by key, so a language change
 * never rewrites saved rows.
 */

export const INSPIRATION_TYPE_OPTIONS: ContentSelectOption[] = [
	{ id: "inspiration", labelKey: localizationConstants.contentTypeInspiration },
	{ id: "advice", labelKey: localizationConstants.contentTypeAdvice },
	{ id: "tips", labelKey: localizationConstants.contentTypeTips },
];

export const KUND_FAQ_CATEGORY_OPTIONS: ContentSelectOption[] = [
	{ id: "general", labelKey: localizationConstants.contentFaqGeneral },
	{ id: "project", labelKey: localizationConstants.contentFaqProject },
	{ id: "payment", labelKey: localizationConstants.contentFaqPayment },
	{ id: "account", labelKey: localizationConstants.contentFaqAccount },
];

export const WORKSPACE_FAQ_CATEGORY_OPTIONS: ContentSelectOption[] = [
	{ id: "leads", labelKey: localizationConstants.contentFaqLeads },
	{ id: "billing", labelKey: localizationConstants.contentFaqBilling },
	{ id: "account", labelKey: localizationConstants.contentFaqAccount },
	{ id: "general", labelKey: localizationConstants.contentFaqGeneral },
];

export const PRICE_KIND_OPTIONS: ContentSelectOption[] = [
	{ id: "unitPrice", labelKey: localizationConstants.contentPriceKindUnit },
	{ id: "productPrice", labelKey: localizationConstants.contentPriceKindProduct },
];

export const PRICE_UNIT_OPTIONS: ContentSelectOption[] = [
	{ id: "squareMetre", labelKey: localizationConstants.contentUnitSquareMetre },
	{ id: "linearMetre", labelKey: localizationConstants.contentUnitLinearMetre },
	{ id: "piece", labelKey: localizationConstants.contentUnitPiece },
	{ id: "hour", labelKey: localizationConstants.contentUnitHour },
];

export const CATEGORY_PARENT_OPTIONS: ContentSelectOption[] = [
	{ id: "none", labelKey: localizationConstants.contentParentNone },
	{ id: "construction", labelKey: localizationConstants.contentParentConstruction },
	{ id: "electrical", labelKey: localizationConstants.contentParentElectrical },
	{ id: "plumbing", labelKey: localizationConstants.contentParentPlumbing },
	{ id: "groundworks", labelKey: localizationConstants.contentParentGroundworks },
];

export const DOWNTIME_OPTIONS: ContentSelectOption[] = [
	{ id: "no", labelKey: localizationConstants.contentDowntimeNo },
	{ id: "yes", labelKey: localizationConstants.contentDowntimeYes },
];

/** Resolves a stored option id back to its label key for display. */
export function findOptionLabelKey(
	options: ContentSelectOption[] | undefined,
	id: string,
) {
	return options?.find((option) => option.id === id)?.labelKey ?? null;
}
