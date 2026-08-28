import type { PurchaseComplaintRow } from "../types/purchase.types";

/**
 * Sample complaints, taken from the Figma frame.
 *
 * The frame prints "RKL-00123" on every row — placeholder data of the same kind
 * as the suppliers frame — so these are numbered sequentially instead, or the
 * rows would be indistinguishable and the detail route meaningless.
 */
export const MOCK_PURCHASE_COMPLAINTS: PurchaseComplaintRow[] = [
	{
		id: "rkl-00123",
		complaintNo: "RKL-00123",
		purchaseNo: "I500",
		object: "Order OR001",
		name: "Kök",
		supplier: "Beijer",
		type: "damaged",
		date: "2026-05-01",
		status: "sent",
		archived: false,
	},
	{
		id: "rkl-00124",
		complaintNo: "RKL-00124",
		purchaseNo: "I501",
		object: "Projekt 2025-01",
		name: "Golv",
		supplier: "ByggMax",
		type: "wrong_delivery",
		date: "2026-05-01",
		status: "sent",
		archived: false,
	},
	{
		id: "rkl-00125",
		complaintNo: "RKL-00125",
		purchaseNo: "I502",
		object: "Order OR001",
		name: "Trappa",
		supplier: "Fredells",
		type: "wrong_delivery",
		date: "2026-05-01",
		status: "approved",
		archived: false,
	},
	{
		id: "rkl-00126",
		complaintNo: "RKL-00126",
		purchaseNo: "I503",
		object: "Order OR001",
		name: "Byggmaterial",
		supplier: "Marbodal",
		type: "wrong_delivery",
		date: "2026-05-01",
		status: "not_sent",
		archived: false,
	},
	{
		id: "rkl-00127",
		complaintNo: "RKL-00127",
		purchaseNo: "I504",
		object: "Order OR001",
		name: "Fönster",
		supplier: "Marbodal",
		type: "wrong_delivery",
		date: "2026-05-01",
		status: "approved",
		archived: false,
	},
];
