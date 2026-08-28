"use client";

import { useMemo } from "react";

import { MOCK_PURCHASE_SUPPLIERS } from "../data/purchaseSuppliers.mock";
import { MOCK_PURCHASES } from "../data/purchases.mock";
import type { ComplaintInfo } from "./types";

export interface ComplaintOption {
	id: string;
	name: string;
}

export interface PurchaseOption {
	value: string;
	label: string;
}

/**
 * Option lists and starting values for the complaint wizard.
 *
 * The wizard reads these through the hook rather than importing the mock files,
 * so replacing them with a query later touches only this file.
 */
export function usePurchaseOptions() {
	const purchaseOptions = useMemo<PurchaseOption[]>(
		() =>
			MOCK_PURCHASES.map((purchase) => ({
				value: purchase.purchaseNo,
				label: `${purchase.purchaseNo} — ${purchase.name}`,
			})),
		[],
	);

	const supplierOptions = useMemo<ComplaintOption[]>(
		() =>
			MOCK_PURCHASE_SUPPLIERS.map((supplier) => ({
				id: supplier.id,
				name: supplier.name,
			})),
		[],
	);

	const contactOptions = useMemo<ComplaintOption[]>(
		() => [
			{ id: "anders", name: "Anders Svensson" },
			{ id: "karin", name: "Karin Lund" },
		],
		[],
	);

	/** Starting values for the info card, as printed in the design. */
	const initialInfo = useMemo<ComplaintInfo>(
		() => ({
			purchaseNo: "I501-05",
			name: "Kök",
			object: "Projekt 2025-001",
			complaintType: "damaged_on_delivery",
		}),
		[],
	);

	/** Resolves a purchase number to its descriptive fields. */
	const findPurchase = (purchaseNo: string) =>
		MOCK_PURCHASES.find((purchase) => purchase.purchaseNo === purchaseNo);

	return {
		purchaseOptions,
		supplierOptions,
		contactOptions,
		initialInfo,
		findPurchase,
	};
}
