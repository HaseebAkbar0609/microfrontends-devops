import type { TranslationKeys } from "@/utils/translation/constants";
import localizationConstants from "@/utils/translation/constants";
import type { SalesCompanyStatus } from "../types";

export type SalesStatusMeta = {
	id: SalesCompanyStatus;
	labelKey: TranslationKeys;
	hintKey: TranslationKeys;
	/** Pill classes for the status badge. */
	accentClassName: string;
};

/**
 * Pipeline order matters: the overview renders the counters in this sequence and
 * the company card derives its next step from the current position.
 */
export const SALES_STATUSES: SalesStatusMeta[] = [
	{
		id: "prospect",
		labelKey: localizationConstants.salesStatusProspectLabel,
		hintKey: localizationConstants.salesStatusProspectHint,
		accentClassName: "bg-slate-100 text-slate-700",
	},
	{
		id: "lead",
		labelKey: localizationConstants.salesStatusLeadLabel,
		hintKey: localizationConstants.salesStatusLeadHint,
		accentClassName: "bg-warning text-warning",
	},
	{
		id: "quoted",
		labelKey: localizationConstants.salesStatusQuotedLabel,
		hintKey: localizationConstants.salesStatusQuotedHint,
		accentClassName: "bg-brand-orange/10 text-brand-orange",
	},
	{
		id: "accepted",
		labelKey: localizationConstants.salesStatusAcceptedLabel,
		hintKey: localizationConstants.salesStatusAcceptedHint,
		accentClassName: "bg-emerald-50 text-emerald-700",
	},
	{
		id: "closed",
		labelKey: localizationConstants.salesStatusClosedLabel,
		hintKey: localizationConstants.salesStatusClosedHint,
		accentClassName: "bg-slate-100 text-slate-500",
	},
];

const SALES_STATUS_BY_ID = new Map<SalesCompanyStatus, SalesStatusMeta>(
	SALES_STATUSES.map((status) => [status.id, status]),
);

export function getSalesStatusMeta(id: SalesCompanyStatus): SalesStatusMeta {
	const meta = SALES_STATUS_BY_ID.get(id);
	if (!meta) throw new Error(`Unknown sales status: ${id}`);
	return meta;
}

export const SALES_STATUS_IDS: SalesCompanyStatus[] = SALES_STATUSES.map(
	(status) => status.id,
);

export function isSalesCompanyStatus(
	value: string,
): value is SalesCompanyStatus {
	return SALES_STATUS_BY_ID.has(value as SalesCompanyStatus);
}
