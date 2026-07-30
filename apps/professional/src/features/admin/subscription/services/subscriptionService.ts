import {
	INITIAL_PAYMENT_CARDS,
	PaymentCard,
	SUBSCRIPTION_OVERVIEW,
	SubscriptionOverview,
} from "../constants/mockData";

export function getSubscriptionOverview(): SubscriptionOverview {
	return SUBSCRIPTION_OVERVIEW;
}

export function listPaymentCards(): PaymentCard[] {
	return INITIAL_PAYMENT_CARDS;
}
