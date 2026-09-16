import localizationConstants from "@/utils/translation/constants";

/** Legacy dialog shape retained until NewCardDialog is removed. */
export interface PaymentCard {
	id: string;
	cardName: string;
	firstName: string;
	lastName: string;
	lastFourDigits: string;
	expiryMonth: string;
	expiryYear: string;
}

export const SUBSCRIPTION_TAB_IDS = ["my", "payment"] as const;

export type SubscriptionTabId = (typeof SUBSCRIPTION_TAB_IDS)[number];

export const SUBSCRIPTION_TABS: { id: SubscriptionTabId; label: string }[] = [
	{ id: "my", label: localizationConstants.subscriptionTabMy },
	{ id: "payment", label: localizationConstants.subscriptionTabPayment },
];
