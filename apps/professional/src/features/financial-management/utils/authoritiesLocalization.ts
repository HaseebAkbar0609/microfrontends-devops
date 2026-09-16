import type { TFunction } from "i18next";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import type { AuthorityCategory, AuthorityStatus } from "../types/authorities.types";

export interface AuthorityCategoryOption {
	value: AuthorityCategory;
	labelKey: TranslationKeys;
}

export const AUTHORITY_CATEGORY_OPTIONS: AuthorityCategoryOption[] = [
	{ value: "Govt Docs", labelKey: localizationConstants.catGovtDocs },
	{ value: "Financial", labelKey: localizationConstants.catFinancial },
	{ value: "Tax", labelKey: localizationConstants.catTaxAuthority },
	{ value: "Legal", labelKey: localizationConstants.catLegal },
	{ value: "Insurance", labelKey: localizationConstants.catInsurance },
];

export function getAuthorityCategoryLabel(
	category: AuthorityCategory | string,
	t: TFunction,
): string {
	const option = AUTHORITY_CATEGORY_OPTIONS.find((opt) => opt.value === category);
	if (option) {
		return t(option.labelKey);
	}
	return category;
}

export function getAuthorityStatusLabel(
	status: AuthorityStatus | string,
	t: TFunction,
): string {
	switch (status) {
		case "approved":
			return t(localizationConstants.statusApproved);
		case "submitted":
			return t(localizationConstants.statusSubmitted);
		case "action_required":
			return t(localizationConstants.statusActionRequired);
		case "pending":
		default:
			return t(localizationConstants.statusPending);
	}
}
