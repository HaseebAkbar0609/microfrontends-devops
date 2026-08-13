"use client";

import { useState } from "react";
import { MOCK_ORDER_OPENED_DATA } from "../data/orderOpened.mock";
import type { OrderOpenedData } from "../types/orderOpened.types";

export function useOrderOpened(orderId?: string) {
	const [orderData, setOrderData] = useState<OrderOpenedData>(() => {
		if (!orderId) return MOCK_ORDER_OPENED_DATA;
		return {
			...MOCK_ORDER_OPENED_DATA,
			id: orderId,
			orderDetails: {
				...MOCK_ORDER_OPENED_DATA.orderDetails,
				serialNo: orderId,
			},
		};
	});

	const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

	return {
		orderData,
		setOrderData,
		isConfirmModalOpen,
		setIsConfirmModalOpen,
		openConfirmModal: () => setIsConfirmModalOpen(true),
		closeConfirmModal: () => setIsConfirmModalOpen(false),
	};
}
