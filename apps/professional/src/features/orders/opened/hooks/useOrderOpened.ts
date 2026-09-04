"use client";

import { useState, useEffect } from "react";
import type { OrderOpenedData } from "../types/orderOpened.types";
import { getOrderOpenedMockById } from "../data/orderOpened.mock";
import { getOrderInformation } from "../api/orderInformation.api";

export function useOrderOpened(orderId?: string) {
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

	return {
		orderData,
		setOrderData,
		isLoading,
		error,
	};
}
