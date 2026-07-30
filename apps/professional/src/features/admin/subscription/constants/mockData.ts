import { mockDate } from "@/features/widgetdashboard/utils/mockDates";
import localizationConstants from "@/utils/translation/constants";

export interface SubscriptionLicenseRow {
	name: string;
	licenseCount: number;
}

export interface SubscriptionServiceRow {
	id: string;
	labelKey: string;
	active: boolean;
}

export interface SubscriptionOverview {
	subscriptionNumber: string;
	startDate: string;
	agreementNumber: string;
	packages: SubscriptionLicenseRow[];
	addons: SubscriptionLicenseRow[];
	services: SubscriptionServiceRow[];
}

export const SUBSCRIPTION_OVERVIEW: SubscriptionOverview = {
	subscriptionNumber: "1456897799",
	startDate: mockDate(-326),
	agreementNumber: "111345675",
	packages: [
		{ name: "Start", licenseCount: 1 },
		{ name: "Standard", licenseCount: 5 },
		{ name: "Pro", licenseCount: 3 },
		{ name: "Timeflow Work", licenseCount: 10 },
	],
	addons: [
		{ name: "Drive", licenseCount: 10 },
		{ name: "QuickAI Calc", licenseCount: 2 },
		{ name: "Rutplan", licenseCount: 5 },
	],
	services: [
		{
			id: "bank-id",
			labelKey: localizationConstants.subscriptionServiceBankId,
			active: true,
		},
		{
			id: "sms",
			labelKey: localizationConstants.subscriptionServiceSms,
			active: true,
		},
		{
			id: "email",
			labelKey: localizationConstants.subscriptionServiceEmail,
			active: true,
		},
	],
};

export const SUBSCRIPTION_TAB_IDS = ["my", "payment"] as const;

export type SubscriptionTabId = (typeof SUBSCRIPTION_TAB_IDS)[number];

export const SUBSCRIPTION_TABS: { id: SubscriptionTabId; label: string }[] = [
	{ id: "my", label: localizationConstants.subscriptionTabMy },
	{ id: "payment", label: localizationConstants.subscriptionTabPayment },
];
