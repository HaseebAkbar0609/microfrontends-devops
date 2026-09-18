import type { TranslationKeys } from "@/utils/translation/constants";
import localizationConstants from "@/utils/translation/constants";

export type SalesDocumentType =
	| "quote"
	| "order"
	| "invoice"
	| "agreement"
	| "presentation"
	| "other";

export type SalesDocumentTypeOption = {
	id: SalesDocumentType;
	labelKey: TranslationKeys;
};

/** Filter pills and type labels, in display order. */
export const SALES_DOCUMENT_TYPES: SalesDocumentTypeOption[] = [
	{ id: "quote", labelKey: localizationConstants.salesQuoteLabel },
	{ id: "order", labelKey: localizationConstants.salesDocTypeOrder },
	{ id: "invoice", labelKey: localizationConstants.salesOrderInvoiceLabel },
	{ id: "agreement", labelKey: localizationConstants.salesDocTypeAgreement },
	{
		id: "presentation",
		labelKey: localizationConstants.salesDocTypePresentation,
	},
	{ id: "other", labelKey: localizationConstants.salesDocTypeOther },
];

/** The types a user can add by hand; the rest come from the CRM. */
export const SALES_CUSTOM_DOCUMENT_TYPES = SALES_DOCUMENT_TYPES.filter((type) =>
	["agreement", "presentation", "other"].includes(type.id),
);

const LABEL_BY_ID = new Map(
	SALES_DOCUMENT_TYPES.map((type) => [type.id, type.labelKey]),
);

export function getSalesDocumentLabelKey(id: SalesDocumentType): TranslationKeys {
	return LABEL_BY_ID.get(id) ?? localizationConstants.salesDocTypeOther;
}
