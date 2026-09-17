import { SubscriptionInterval } from "@/features/manage-plans";
import { PAYMENT_MODES } from "../constants";

export type CartItem = {
	id: string;
	name: string;
	description?: string;
	planKey: string;
	unitPrice: number;
	quantity: number;
	itemTotalAmount?: number;
	interval?: SubscriptionInterval;
};

export type CartStep = "cart" | "confirm";

export type PaymentDetailsFormValues = {
	email: string;
	firstName: string;
	lastName: string;
	address: string;
	address2: string;
	country: string;
	city: string;
	postalCode: string;
	phone: string;
	cardNumber: string;
	expiry: string;
	cvc: string;
	discountCode: string;
	addNote: boolean;
	acceptTerms: boolean;
};

export interface CheckoutPaymentDetailsProps {
	items: CartItem[];
	subtotal: number;
	total: number;
	onBack: () => void;
	onCancelToCart: () => void;
}

export type UpdateQuantityFn = (
	id: string,
	delta: number,
) => void | Promise<void>;
export type RemoveItemFn = (id: string) => void | Promise<void>;

export interface CartItemsPanelProps {
	items: CartItem[];
	subtotal: number;
	onUpdateQuantity: UpdateQuantityFn;
	onRemoveItem: RemoveItemFn;
	updatingItemIds?: string[];
	removingItemIds?: string[];
}

export interface CartSummaryPanelProps {
	subtotal: number;
	total: number;
	discountCode: string;
	onDiscountCodeChange: (value: string) => void;
	onProceed: () => void;
	disabled?: boolean;
}

export interface ConfirmSubscriptionProps {
	items: CartItem[];
	subtotal: number;
	total: number;
	onBackToCart: () => void;
	isPlanChange?: boolean;
}

export interface CheckoutOrderSummaryProps {
	mainItem: CartItem[] | undefined;
	subtotal: number;
	total: number;
	showDiscountCode?: boolean;
	control?: import("react-hook-form").Control<PaymentDetailsFormValues>;
}

export type PaymentMode = (typeof PAYMENT_MODES)[keyof typeof PAYMENT_MODES];
