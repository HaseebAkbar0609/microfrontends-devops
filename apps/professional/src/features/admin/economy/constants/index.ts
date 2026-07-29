import localizationConstants from "@/utils/translation/constants";

export const ECONOMY_INVOICE_COLUMNS = [
	{
		key: "invoiceNo",
		label: localizationConstants.economyInvoiceCol,
		sortable: true,
	},
	{
		key: "date",
		label: localizationConstants.economyDateCol,
		sortable: true,
	},
	{
		key: "amount",
		label: localizationConstants.economyAmountCol,
		sortable: true,
	},
	{
		key: "action",
		label: localizationConstants.economyActionCol,
		sortable: false,
	},
] as const;

export type EconomyInvoiceColumnKey =
	(typeof ECONOMY_INVOICE_COLUMNS)[number]["key"];

export const ECONOMY_INVOICE_FILTERS = [
	{ id: "all", label: localizationConstants.economyFilterAll },
	{ id: "recent", label: localizationConstants.economyFilterRecent },
	{ id: "older", label: localizationConstants.economyFilterOlder },
] as const;

export type EconomyInvoiceFilterId =
	(typeof ECONOMY_INVOICE_FILTERS)[number]["id"];
