"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import type { OrderOpenedData } from "../types/orderOpened.types";
import { getOrderOpenedMockById } from "../data/orderOpened.mock";
import { getOrderInformation, updateOrderInformation } from "../api/orderInformation.api";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

/**
 * Safe deep merge for order data that prevents prototype pollution
 * and safely merges nested records.
 */
function safeMergeOrderData(
	prev: OrderOpenedData,
	updated: Partial<OrderOpenedData>
): OrderOpenedData {
	if (!updated || typeof updated !== "object") return prev;

	const dangerousKeys = new Set(["__proto__", "constructor", "prototype"]);
	const result = { ...prev };

	for (const [key, value] of Object.entries(updated)) {
		if (dangerousKeys.has(key)) continue;

		const currentVal = prev[key as keyof OrderOpenedData];
		if (
			value &&
			typeof value === "object" &&
			!Array.isArray(value) &&
			currentVal &&
			typeof currentVal === "object" &&
			!Array.isArray(currentVal)
		) {
			const sanitizedSub: Record<string, unknown> = {};
			for (const [subKey, subVal] of Object.entries(value as unknown as Record<string, unknown>)) {
				if (!dangerousKeys.has(subKey)) {
					sanitizedSub[subKey] = subVal;
				}
			}
			result[key as keyof OrderOpenedData] = {
				...(currentVal as unknown as Record<string, unknown>),
				...sanitizedSub,
			} as never;
		} else if (Array.isArray(value)) {
			result[key as keyof OrderOpenedData] = [...value] as never;
		} else {
			result[key as keyof OrderOpenedData] = value as never;
		}
	}

	return result;
}

export function useOrderOpened(orderId?: string) {
	const t = useTranslate();
	const [orderData, setOrderData] = useState<OrderOpenedData>(() =>
		getOrderOpenedMockById(orderId)
	);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!orderId) return;
		let isMounted = true;
		setIsLoading(true);
		setError(null);

		getOrderInformation(orderId)
			.then((data) => {
				if (isMounted) {
					setOrderData(data);
				}
			})
			.catch((err) => {
				if (isMounted) {
					setError(err instanceof Error ? err.message : "Failed to load order");
				}
			})
			.finally(() => {
				if (isMounted) {
					setIsLoading(false);
				}
			});

		return () => {
			isMounted = false;
		};
	}, [orderId]);

	const updateOrderData = async (updated: Partial<OrderOpenedData>) => {
		const previousData = orderData;
		setOrderData((prev) => ({
			...prev,
			...updated,
			customerInfo: { ...prev.customerInfo, ...updated.customerInfo },
			contactPerson: { ...prev.contactPerson, ...updated.contactPerson },
			orderDetails: { ...prev.orderDetails, ...updated.orderDetails },
			orderInfo: { ...prev.orderInfo, ...updated.orderInfo },
		}));
		setOrderData((prev) => safeMergeOrderData(prev, updated));

		if (orderId) {
			try {
				await updateOrderInformation(orderId, updated);
				toast.success(t(localizationConstants.orderUpdatedSuccess));
			} catch (err) {
				console.error("[useOrderOpened] Update sync failed:", err);
				setOrderData(previousData);
				toast.error(t(localizationConstants.orderUpdateFailed));
			}
		} else {
			toast.success(t(localizationConstants.orderUpdatedSuccess));
		}
	};

	return {
		orderData,
		setOrderData,
		updateOrderData,
		isLoading,
		error,
	};
}
