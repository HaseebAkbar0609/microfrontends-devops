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
}

export interface LicensePackage {
	id: string;
	name: string;
	priceLabel: string;
	price: number | null;
	feeKey: string;
	modulesKey?: string;
	versionText?: string;
	versionOptions?: LicenseVersionOption[];
	versionChecklist?: LicenseVersionOption[];
	connectedSystems?: string;
	industryOptionKeys?: string[];
	categoryId?: LicenseCategoryId;
	action: "upgrade" | "add";
}

const INDUSTRY_OPTION_KEYS = [
	localizationConstants.licensesIndustryFloor,
	localizationConstants.licensesIndustryPainting,
	localizationConstants.licensesIndustryCleaning,
	localizationConstants.licensesIndustryConstruction,
	localizationConstants.licensesIndustryPlumbing,
	localizationConstants.licensesIndustryTiler,
	localizationConstants.licensesIndustryElectrician,
];

export const LICENSE_PACKAGES: Record<LicenseTabId, LicensePackage[]> = {
	system: [
		{
			id: "timeflow-start",
			name: "TimeFlow - Start",
			priceLabel: "2995",
			price: 2995,
			feeKey: localizationConstants.licensesStartFee,
			modulesKey: localizationConstants.licensesStartModules,
			action: "upgrade",
		},
		{
			id: "timeflow-standard",
			name: "TimeFlow - Standard",
			priceLabel: "995",
			price: 995,
			feeKey: localizationConstants.licensesStandardFee,
			modulesKey: localizationConstants.licensesStandardModules,
			action: "add",
		},
		{
			id: "timeflow-pro",
			name: "TimeFlow - Pro",
			priceLabel: "1295",
			price: 1295,
			feeKey: localizationConstants.licensesProFee,
			modulesKey: localizationConstants.licensesProModules,
			action: "add",
		},
		{
			id: "app-timeflow-work",
			name: "App - Timeflow Work",
			priceLabel: "129",
			price: 129,
			feeKey: localizationConstants.licensesAppWorkFee,
			modulesKey: localizationConstants.licensesAppWorkModules,
			action: "add",
		},
	],
	addonSystem: [
		{
			id: "connect-economy",
			name: "Autoekonomi",
			priceLabel: "199 kr/mån",
			price: 199,
			feeKey: localizationConstants.licensesConnectEconomyFee,
			modulesKey: localizationConstants.licensesConnectEconomyModules,
			versionText: "Autoekonomi",
			connectedSystems:
				"Fortnox | Visma | Björn Lunden | Microsoft | Softone",
			categoryId: "economy",
			action: "add",
		},
		{
			id: "scan-supplier",
			name: "Scan- supplier",
			priceLabel: "5 kr styck",
			price: 5,
			feeKey: localizationConstants.licensesScanSupplierFee,
			modulesKey: localizationConstants.licensesScanSupplierModules,
			versionText: "Scan- supplier",
			categoryId: "economy",
			action: "add",
		},
		{
			id: "connect-supplier",
			name: "Smart-Inköp",
			priceLabel: "199 kr/mån",
			price: 199,
			feeKey: localizationConstants.licensesConnectSupplierFee,
			modulesKey: localizationConstants.licensesConnectSupplierModules,
			versionText: "Smart-Inköp",
			connectedSystems: "Ahlsell | Dhal | Beijer | Bygg-Max | K-Rauta",
			categoryId: "purchasing",
			action: "add",
		},
		{
			id: "calculation-pro",
			name: "Calculation PRO",
			priceLabel: "199",
			price: 199,
			feeKey: localizationConstants.licensesCalculationProFee,
			modulesKey: localizationConstants.licensesCalculationProModules,
			versionText: "Calculation - PRO",
			industryOptionKeys: INDUSTRY_OPTION_KEYS,
			categoryId: "calculation",
			action: "add",
		},
		{
			id: "order-direct",
			name: "Order Direct",
			priceLabel: "159",
			price: 159,
			feeKey: localizationConstants.licensesOrderDirectFee,
			modulesKey: localizationConstants.licensesOrderDirectModules,
			versionText: "Order - Direct",
			categoryId: "order",
			action: "add",
		},
		{
			id: "storage",
			name: "Storage",
			priceLabel: "199 - 599",
			price: 199,
			feeKey: localizationConstants.licensesStorageFee,
			modulesKey: localizationConstants.licensesStorageModules,
			versionOptions: [
				{
					id: "storage-standard",
					label: "Storage- Standard  51-250 GB",
					priceLabel: "199",
					price: 199,
				},
				{
					id: "storage-pro",
					label: "Storage - PRO, 251 GB-1TB",
					priceLabel: "599",
					price: 599,
				},
				{
					id: "storage-plus",
					label: "Storage - PLUS >1 TB",
					priceLabel: "Offert",
					price: null,
				},
			],
			categoryId: "storage",
			action: "add",
		},
		{
			id: "rutt-plan",
			name: "Rutt-plan",
			priceLabel: "999",
			price: 999,
			feeKey: localizationConstants.licensesRuttPlanFee,
			modulesKey: localizationConstants.licensesRuttPlanModules,
			versionText: "Ruttplan - Standard",
			categoryId: "machine",
			action: "add",
		},
		{
			id: "drive",
			name: "Drive",
			priceLabel: "199",
			price: 199,
			feeKey: localizationConstants.licensesDriveFee,
			modulesKey: localizationConstants.licensesDriveModules,
			versionText: "Drive - Standard",
			categoryId: "machine",
			action: "add",
		},
	],
	addonApp: [
		{
			id: "metric",
			name: "Metric - Mätning",
			priceLabel: "59",
			price: 59,
			feeKey: localizationConstants.licensesMetricFee,
			modulesKey: localizationConstants.licensesMetricModules,
			action: "add",
		},
		{
			id: "product-finder",
			name: "Product - Finder - produkt sök",
			priceLabel: "0",
			price: 89,
			feeKey: localizationConstants.licensesProductFinderFee,
			modulesKey: localizationConstants.licensesProductFinderModules,
			versionText: "Product Finder",
			action: "add",
		},
	],
	addonCommunication: [
		{
			id: "communication",
			name: "Communication",
			priceLabel: "5 kr/styck",
			price: null,
			feeKey: localizationConstants.licensesCommunicationFee,
			versionChecklist: [
				{
					id: "bankid-sign",
					label: "Bank-Id- sign -agreement",
					priceLabel: "5 kr /styck",
					price: 5,
				},
				{
					id: "sms-service",
					label: "SMS- service",
					priceLabel: "2 kr /styck",
					price: 2,
				},
				{
					id: "mail-service",
					label: "Mail - service",
					priceLabel: "0,50 kr /styck",
					price: 0.5,
				},
			],
			action: "add",
		},
	],
};

export interface LicenseCartItem {
	id: string;
	name: string;
	price: number;
	quantity: number;
	sourceTab: LicenseTabId;
	showPrice: boolean;
}

export const INITIAL_CART_ITEMS: LicenseCartItem[] = [
	{
		id: "timeflow-start",
		name: "TimeFlow Start",
		price: 2995,
		quantity: 1,
		sourceTab: "system",
		showPrice: true,
	},
	{
		id: "timeflow-standard",
		name: "TimeFlow Standard",
		price: 995,
		quantity: 4,
		sourceTab: "system",
		showPrice: true,
	},
	{
		id: "app-timeflow-work",
		name: "App- TimeFlow Work",
		price: 129,
		quantity: 5,
		sourceTab: "system",
		showPrice: true,
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
