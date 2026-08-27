"use client";

import { useCallback, useMemo, useState } from "react";

import {
	MOCK_PURCHASE_API_CATEGORIES,
	MOCK_PURCHASE_API_SUPPLIERS,
} from "../data/purchaseApiIntegrations.mock";
import type { PurchaseApiSupplier } from "../types/purchase.types";

/**
 * Supplier connection state for the API integrations tab.
 *
 * The design shows two lists, but they are two views of one collection: a
 * supplier is either connected or not. Deriving both from a single flag keeps
 * them in step, where moving entries between two arrays would let them drift.
 */
export function usePurchaseApiIntegrations(
	initialSuppliers: PurchaseApiSupplier[] = MOCK_PURCHASE_API_SUPPLIERS,
) {
	const [suppliers, setSuppliers] =
		useState<PurchaseApiSupplier[]>(initialSuppliers);

	const setConnected = useCallback((id: string, connected: boolean) => {
		setSuppliers((previous) =>
			previous.map((supplier) =>
				supplier.id === id ? { ...supplier, connected } : supplier,
			),
		);
	}, []);

	const toConnect = useMemo(
		() => suppliers.filter((supplier) => !supplier.connected),
		[suppliers],
	);

	const connected = useMemo(
		() => suppliers.filter((supplier) => supplier.connected),
		[suppliers],
	);

	return {
		categories: MOCK_PURCHASE_API_CATEGORIES,
		toConnect,
		connected,
		setConnected,
	};
}
