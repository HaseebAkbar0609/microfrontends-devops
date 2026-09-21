import localizationConstants from "@/utils/translation/constants";

export const LICENSE_TAB_IDS = [
	"system",
	"addonSystem",
	"addonApp",
	"addonCommunication",
] as const;

export type LicenseTabId = (typeof LICENSE_TAB_IDS)[number];

export const LICENSE_TABS: { id: LicenseTabId; label: string }[] = [
	{ id: "system", label: localizationConstants.licensesTabSystem },
	{ id: "addonSystem", label: localizationConstants.licensesTabAddonSystem },
	{ id: "addonApp", label: localizationConstants.licensesTabAddonApp },
	{
		id: "addonCommunication",
		label: localizationConstants.licensesTabAddonCommunication,
	},
];

export const LICENSE_TAB_HEADINGS: Partial<Record<LicenseTabId, string>> = {
	addonSystem: localizationConstants.licensesHeadingAddonSystem,
	addonApp: localizationConstants.licensesHeadingAddonApp,
	addonCommunication: localizationConstants.licensesHeadingAddonCommunication,
};

export const LICENSE_CATEGORY_IDS = [
	"economy",
	"purchasing",
	"calculation",
	"order",
	"storage",
	"machine",
] as const;

export type LicenseCategoryId = (typeof LICENSE_CATEGORY_IDS)[number];

export const LICENSE_CATEGORIES: {
	id: LicenseCategoryId;
	label: string;
}[] = [
	{ id: "economy", label: localizationConstants.licensesCatEconomy },
	{ id: "purchasing", label: localizationConstants.licensesCatPurchasing },
	{ id: "calculation", label: localizationConstants.licensesCatCalculation },
	{ id: "order", label: localizationConstants.licensesCatOrder },
	{ id: "storage", label: localizationConstants.licensesCatStorage },
	{ id: "machine", label: localizationConstants.licensesCatMachine },
];

export interface LicenseVersionOption {
	id: string;
	label: string;
	priceLabel: string;
	price: number | null;
	// Only options with defaultChecked: true start checked.
	defaultChecked?: boolean;
}

export interface LicensePackage {
	id: string;
	name: string;
	// null hides the header price line entirely.
	priceLabel: string | null;
	price: number | null;
	feeKey: string;
	modulesKey?: string;
	versionText?: string;
	versionOptions?: LicenseVersionOption[];
	versionChecklist?: LicenseVersionOption[];
	connectedSystems?: string;
	industryOptionKeys?: string[];
	industryText?: string;
	categoryId?: LicenseCategoryId;
	action: "upgrade" | "add";
}

export interface LicenseCartItem {
	id: string;
	name: string;
	price: number;
	quantity: number;
	sourceTab: LicenseTabId;
	showPrice: boolean;
}

export const PAYMENT_CYCLE_IDS = ["monthly", "quarterly", "annually"] as const;

export type PaymentCycleId = (typeof PAYMENT_CYCLE_IDS)[number];

export const PAYMENT_CYCLES: {
	id: PaymentCycleId;
	label: string;
	discount: number;
}[] = [
	{
		id: "monthly",
		label: localizationConstants.licensesCartPaymentMonthly,
		discount: 0,
	},
	{
		id: "quarterly",
		label: localizationConstants.licensesCartPaymentQuarterly,
		discount: 0.05,
	},
	{
		id: "annually",
		label: localizationConstants.licensesCartPaymentAnnually,
		discount: 0.17,
	},
];
