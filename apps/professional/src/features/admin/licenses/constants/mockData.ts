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

export interface LicensePackage {
	id: string;
	name: string;
	price: number;
	feeKey: string;
	modulesKey: string;
	action: "upgrade" | "add";
}

export const LICENSE_PACKAGES: Record<LicenseTabId, LicensePackage[]> = {
	system: [
		{
			id: "timeflow-start",
			name: "TimeFlow - Start",
			price: 2995,
			feeKey: localizationConstants.licensesStartFee,
			modulesKey: localizationConstants.licensesStartModules,
			action: "upgrade",
		},
		{
			id: "timeflow-standard",
			name: "TimeFlow - Standard",
			price: 995,
			feeKey: localizationConstants.licensesStandardFee,
			modulesKey: localizationConstants.licensesStandardModules,
			action: "add",
		},
		{
			id: "timeflow-pro",
			name: "TimeFlow - Pro",
			price: 1295,
			feeKey: localizationConstants.licensesProFee,
			modulesKey: localizationConstants.licensesProModules,
			action: "add",
		},
		{
			id: "app-timeflow-work",
			name: "App - Timeflow Work",
			price: 129,
			feeKey: localizationConstants.licensesAppWorkFee,
			modulesKey: localizationConstants.licensesAppWorkModules,
			action: "add",
		},
	],
	addonSystem: [
		{
			id: "addon-stock",
			name: "Tillval - Lagerhantering",
			price: 295,
			feeKey: localizationConstants.licensesAddonStockFee,
			modulesKey: localizationConstants.licensesAddonStockModules,
			action: "add",
		},
		{
			id: "addon-time",
			name: "Tillval - Tidrapportering Plus",
			price: 195,
			feeKey: localizationConstants.licensesAddonTimeFee,
			modulesKey: localizationConstants.licensesAddonTimeModules,
			action: "add",
		},
	],
	addonApp: [
		{
			id: "addon-field",
			name: "App - Fältservice",
			price: 99,
			feeKey: localizationConstants.licensesAddonFieldFee,
			modulesKey: localizationConstants.licensesAddonFieldModules,
			action: "add",
		},
		{
			id: "addon-journal",
			name: "App - Körjournal",
			price: 59,
			feeKey: localizationConstants.licensesAddonJournalFee,
			modulesKey: localizationConstants.licensesAddonJournalModules,
			action: "add",
		},
	],
	addonCommunication: [
		{
			id: "addon-sms",
			name: "SMS-paket",
			price: 149,
			feeKey: localizationConstants.licensesAddonSmsFee,
			modulesKey: localizationConstants.licensesAddonSmsModules,
			action: "add",
		},
		{
			id: "addon-email",
			name: "E-postutskick",
			price: 99,
			feeKey: localizationConstants.licensesAddonEmailFee,
			modulesKey: localizationConstants.licensesAddonEmailModules,
			action: "add",
		},
	],
};

export interface LicenseCartItem {
	packageId: string;
	name: string;
	price: number;
	quantity: number;
}

export const INITIAL_CART_ITEMS: LicenseCartItem[] = [
	{
		packageId: "timeflow-start",
		name: "TimeFlow Start",
		price: 2995,
		quantity: 1,
	},
	{
		packageId: "timeflow-standard",
		name: "TimeFlow Standard",
		price: 995,
		quantity: 4,
	},
	{
		packageId: "app-timeflow-work",
		name: "App- TimeFlow Work",
		price: 129,
		quantity: 5,
	},
];

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
