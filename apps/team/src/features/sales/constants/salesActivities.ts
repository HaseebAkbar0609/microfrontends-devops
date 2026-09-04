import type { TranslationKeys } from "@/utils/translation/constants";
import localizationConstants from "@/utils/translation/constants";
import type { SalesActivityType } from "../types";

export type SalesActivityTypeMeta = {
	id: SalesActivityType;
	labelKey: TranslationKeys;
};

export const SALES_ACTIVITY_TYPES: SalesActivityTypeMeta[] = [
	{ id: "call", labelKey: localizationConstants.salesActivityTypeCall },
	{ id: "email", labelKey: localizationConstants.salesActivityTypeEmail },
	{ id: "meeting", labelKey: localizationConstants.salesActivityTypeMeeting },
	{ id: "note", labelKey: localizationConstants.salesActivityTypeNote },
];

const ACTIVITY_LABEL_BY_ID = new Map<SalesActivityType, TranslationKeys>(
	SALES_ACTIVITY_TYPES.map((entry) => [entry.id, entry.labelKey]),
);

export function getSalesActivityLabelKey(
	id: SalesActivityType,
): TranslationKeys {
	return ACTIVITY_LABEL_BY_ID.get(id) ?? localizationConstants.salesActivityTypeNote;
}
