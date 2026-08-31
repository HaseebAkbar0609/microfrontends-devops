import type { PurchaseComplaintRow } from "../types/purchase.types";

/**
 * Sample complaints, taken from the Figma frame.
 *
 * The frame prints "RKL-00123" on every row — placeholder data of the same kind
 * as the suppliers frame — so these are numbered sequentially instead, or the
 * rows would be indistinguishable and the detail route meaningless.
 *
 * The two `RKL-0012x` rows flagged `archived` exist to give the Arkiv tab
 * something to show; they drop out of this list.
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
		priority: "high",
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
		priority: "medium",
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
		priority: "low",
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
		priority: "high",
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
		priority: "medium",
		archived: false,
	},
	{
		id: "rkl-00120",
		complaintNo: "RKL-00120",
		purchaseNo: "I490",
		object: "Order OR001",
		name: "Rivningsavfall",
		supplier: "Beijer",
		type: "wrong_delivery",
		date: "2026-03-11",
		status: "approved",
		priority: "low",
		archived: true,
	},
	{
		id: "rkl-00121",
		complaintNo: "RKL-00121",
		purchaseNo: "I491",
		object: "Projekt 2024-08",
		name: "Rörkoppling",
		supplier: "ByggMax",
		type: "damaged",
		date: "2026-03-24",
		status: "approved",
		priority: "medium",
		archived: true,
	},
];
