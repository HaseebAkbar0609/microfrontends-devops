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

/** The purchase the design's info card is drawn against. */
const DEFAULT_PURCHASE_NO = "I501";

/**
 * Option lists and starting values for the complaint wizard.
 *
 * The wizard reads these through the hook rather than importing the mock files,
 * so replacing them with a query later touches only this file.
 */
export function usePurchaseOptions(prefillPurchaseNo?: string) {
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

	/** Resolves a purchase number to its descriptive fields. */
	const findPurchase = (purchaseNo: string) =>
		MOCK_PURCHASES.find((purchase) => purchase.purchaseNo === purchaseNo);

	/**
	 * Starting values for the info card, always taken from a real purchase so
	 * the number, description and object agree with each other.
	 *
	 * Opened from a record the wizard is told which purchase it is for; opened
	 * from the module list it starts on the one the design prints. The design's
	 * literal values describe a purchase *line* ("I501-05", "Kök"), which this
	 * select cannot represent — its options are purchases — so the line's
	 * purchase is used instead of copying strings the dropdown cannot resolve.
	 */
	const initialInfo = useMemo<ComplaintInfo>(() => {
		const source =
			findPurchase(prefillPurchaseNo ?? "") ?? findPurchase(DEFAULT_PURCHASE_NO);

		return {
			purchaseNo: source?.purchaseNo ?? "",
			name: source?.name ?? "",
			object: source?.object ?? "",
			complaintType: "damaged_on_delivery",
		};
	}, [prefillPurchaseNo]);

	return {
		purchaseOptions,
		supplierOptions,
		contactOptions,
		initialInfo,
		findPurchase,
	};
}
