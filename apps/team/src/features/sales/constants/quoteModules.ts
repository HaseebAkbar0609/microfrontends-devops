import type { TranslationKeys } from "@/utils/translation/constants";
import localizationConstants from "@/utils/translation/constants";
import type { QuotePriceUnit, QuoteTermId } from "../types";
import {
	TERM_DISCOUNT_MONTHLY,
	TERM_DISCOUNT_QUARTERLY,
	TERM_DISCOUNT_YEARLY,
	TERM_MONTHS_MONTHLY,
	TERM_MONTHS_QUARTERLY,
	TERM_MONTHS_YEARLY,
} from "./sales.constants";

export type QuoteModuleTemplate = {
	id: string;
	/** Product name. These are brand names and read the same in every language. */
	name: string;
	descriptionKey: TranslationKeys;
	price: number;
	unit: QuotePriceUnit;
	defaultSelected: boolean;
	defaultQuantity: number;
	quantityEditable: boolean;
};

/** The sellable Timeflow modules, with their Swedish list prices in SEK. */
export const QUOTE_MODULE_TEMPLATES: QuoteModuleTemplate[] = [
	{ id: "start", name: "Start", descriptionKey: localizationConstants.salesModuleStartDescription, price: 2995, unit: "perMonth", defaultSelected: true, defaultQuantity: 1, quantityEditable: false },
	{ id: "standard", name: "Standard", descriptionKey: localizationConstants.salesModuleStandardDescription, price: 995, unit: "perUserMonth", defaultSelected: false, defaultQuantity: 0, quantityEditable: true },
	{ id: "pro", name: "Pro", descriptionKey: localizationConstants.salesModuleProDescription, price: 1295, unit: "perUserMonth", defaultSelected: false, defaultQuantity: 0, quantityEditable: true },
	{ id: "timeflow-work", name: "Timeflow Work", descriptionKey: localizationConstants.salesModuleTimeflowWorkDescription, price: 159, unit: "perMonth", defaultSelected: false, defaultQuantity: 0, quantityEditable: true },
	{ id: "autoekonomi", name: "Autoekonomi", descriptionKey: localizationConstants.salesModuleAutoEconomyDescription, price: 199, unit: "perMonth", defaultSelected: false, defaultQuantity: 1, quantityEditable: false },
	{ id: "smart-ekonomi", name: "Smart ekonomi", descriptionKey: localizationConstants.salesModuleSmartEconomyDescription, price: 199, unit: "perMonth", defaultSelected: false, defaultQuantity: 1, quantityEditable: false },
	{ id: "drive", name: "Drive", descriptionKey: localizationConstants.salesModuleDriveDescription, price: 199, unit: "perUserMonth", defaultSelected: false, defaultQuantity: 0, quantityEditable: true },
	{ id: "rutplan", name: "Rutplan", descriptionKey: localizationConstants.salesModuleRoutePlanDescription, price: 1295, unit: "perMonth", defaultSelected: false, defaultQuantity: 1, quantityEditable: false },
	{ id: "order-direkt", name: "Order Direkt", descriptionKey: localizationConstants.salesModuleOrderDirectDescription, price: 199, unit: "perMonth", defaultSelected: false, defaultQuantity: 0, quantityEditable: true },
	{ id: "calculation-pro", name: "Calculation PRO", descriptionKey: localizationConstants.salesModuleCalculationProDescription, price: 299, unit: "perMonth", defaultSelected: false, defaultQuantity: 1, quantityEditable: false },
	{ id: "calculation-pro-advance", name: "Calculation PRO Advance", descriptionKey: localizationConstants.salesModuleCalculationProAdvanceDescription, price: 595, unit: "perMonth", defaultSelected: false, defaultQuantity: 1, quantityEditable: false },
	{ id: "quickaicalc", name: "QuickAICalc", descriptionKey: localizationConstants.salesModuleQuickAiCalcDescription, price: 2995, unit: "perMonth", defaultSelected: false, defaultQuantity: 1, quantityEditable: false },
	{ id: "flowtalk", name: "FlowTalk", descriptionKey: localizationConstants.salesModuleFlowTalkDescription, price: 299, unit: "perMonth", defaultSelected: false, defaultQuantity: 1, quantityEditable: false },
	{ id: "metric", name: "Metric", descriptionKey: localizationConstants.salesModuleMetricDescription, price: 59, unit: "perUserMonth", defaultSelected: false, defaultQuantity: 0, quantityEditable: true },
];

export const QUOTE_UNIT_LABEL_KEYS: Record<QuotePriceUnit, TranslationKeys> = {
	perUserMonth: localizationConstants.salesUnitPerUserMonth,
	perMonth: localizationConstants.salesUnitPerMonth,
	oneTime: localizationConstants.salesUnitOneTime,
};

/** Short unit labels used inside the compact unit picker on each module row. */
export const QUOTE_UNIT_SHORT_LABEL_KEYS: Record<
	QuotePriceUnit,
	TranslationKeys
> = {
	perUserMonth: localizationConstants.salesUnitPerUserMonthShort,
	perMonth: localizationConstants.salesUnitPerMonthShort,
	oneTime: localizationConstants.salesUnitOneTimeShort,
};

export const QUOTE_UNIT_IDS: QuotePriceUnit[] = [
	"perUserMonth",
	"perMonth",
	"oneTime",
];

export type QuoteTermMeta = {
	id: QuoteTermId;
	labelKey: TranslationKeys;
	noteKey: TranslationKeys;
	/** Fraction taken off the monthly gross for committing to this term. */
	discount: number;
	/** Months billed per invoice. */
	months: number;
};

export const QUOTE_TERMS: QuoteTermMeta[] = [
	{
		id: "monthly",
		labelKey: localizationConstants.salesTermMonthlyLabel,
		noteKey: localizationConstants.salesTermMonthlyNote,
		discount: TERM_DISCOUNT_MONTHLY,
		months: TERM_MONTHS_MONTHLY,
	},
	{
		id: "quarterly",
		labelKey: localizationConstants.salesTermQuarterlyLabel,
		noteKey: localizationConstants.salesTermQuarterlyNote,
		discount: TERM_DISCOUNT_QUARTERLY,
		months: TERM_MONTHS_QUARTERLY,
	},
	{
		id: "yearly",
		labelKey: localizationConstants.salesTermYearlyLabel,
		noteKey: localizationConstants.salesTermYearlyNote,
		discount: TERM_DISCOUNT_YEARLY,
		months: TERM_MONTHS_YEARLY,
	},
];

const QUOTE_TERM_BY_ID = new Map<QuoteTermId, QuoteTermMeta>(
	QUOTE_TERMS.map((term) => [term.id, term]),
);

export function getQuoteTermMeta(id: QuoteTermId): QuoteTermMeta {
	const term = QUOTE_TERM_BY_ID.get(id);
	if (!term) throw new Error(`Unknown quote term: ${id}`);
	return term;
}
