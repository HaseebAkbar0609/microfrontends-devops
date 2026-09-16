"use client";

import {
	deleteBillingPaymentMethodAction,
	listBillingPaymentMethodsAction,
	setDefaultBillingPaymentMethodAction,
} from "@/api-actions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const PAYMENT_METHOD_QUERY_KEY = ["billing-payment-methods"] as const;

/** Legacy mock-dialog contract kept only until that unused component is removed. */
export type PaymentCardDraft = {
	cardName: string;
	firstName: string;
	lastName: string;
	cardNumber: string;
	expiryMonth: string;
	expiryYear: string;
};

export function usePaymentCards() {
	const queryClient = useQueryClient();
	const cardsQuery = useQuery({
		queryKey: PAYMENT_METHOD_QUERY_KEY,
		queryFn: async () => {
			const result = await listBillingPaymentMethodsAction();
			if (!result.success || !result.data) {
				throw new Error(result.error ?? "PAYMENT_METHOD_REQUEST_FAILED");
			}
			return result.data;
		},
	});

	const setDefaultMutation = useMutation({
		mutationFn: async (paymentMethodId: string) => {
			const result = await setDefaultBillingPaymentMethodAction(paymentMethodId);
			if (!result.success) {
				throw new Error(result.error ?? "PAYMENT_METHOD_REQUEST_FAILED");
			}
		},
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: PAYMENT_METHOD_QUERY_KEY }),
	});

	const deleteMutation = useMutation({
		mutationFn: async (paymentMethodId: string) => {
			const result = await deleteBillingPaymentMethodAction(paymentMethodId);
			if (!result.success) {
				throw new Error(result.error ?? "PAYMENT_METHOD_REQUEST_FAILED");
			}
		},
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: PAYMENT_METHOD_QUERY_KEY }),
	});

	return {
		cards: cardsQuery.data ?? [],
		isLoading: cardsQuery.isLoading,
		error: cardsQuery.error,
		refreshCards: cardsQuery.refetch,
		setDefaultCard: setDefaultMutation.mutateAsync,
		deleteCard: deleteMutation.mutateAsync,
		isUpdating: setDefaultMutation.isPending || deleteMutation.isPending,
	};
}
