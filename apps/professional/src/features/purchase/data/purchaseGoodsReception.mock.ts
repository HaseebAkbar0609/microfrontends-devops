import type {
	PurchaseAgreementDocument,
	PurchaseGoodsReceptionRow,
} from "../types/purchase.types";

/**
 * Sample goods receptions, taken from the Figma frame.
 *
 * Two corrections to the frame, both flagged on the ticket. It prints
 * "Benämning" twice — header and data — so the duplicate column is dropped. And
 * its "Förväntat leveransdatum" cells hold "Skadat" / "Fel leverans", which are
 * deviation types rather than dates; a date column gets dates, and the deviation
 * vocabulary is left for whichever ticket designs a column to put it in.
 */
export const MOCK_PURCHASE_GOODS_RECEPTIONS: PurchaseGoodsReceptionRow[] = [
	{
		id: "i501",
		object: "Order OR001",
		purchaseNo: "I501",
		name: "Kök",
		supplier: "Beijer",
		expectedDelivery: "2026-05-12",
		orderType: "normal",
		description: "Köksstomme med luckor och bänkskiva.",
		category: "raw_materials",
		sku: "KOK-1001",
		unitPrice: 12500,
		leadTimeDays: 14,
		minimumOrderQuantity: 1,
		bulkDiscounts: [
			{ quantity: 5, percentage: 5 },
			{ quantity: 10, percentage: 12 },
		],
		attachments: [
			{
				id: "i501-spec",
				name: "Teknisk specifikation.pdf",
				fileType: "pdf",
			},
		],
		archived: false,
	},
	{
		id: "i502",
		object: "Projekt 2025-01",
		purchaseNo: "I502",
		name: "Golv",
		supplier: "ByggMax",
		expectedDelivery: "2026-06-02",
		orderType: "partial",
		description: "Ekparkett, 14 mm, mattlackad.",
		category: "raw_materials",
		sku: "GLV-2204",
		unitPrice: 899,
		leadTimeDays: 21,
		minimumOrderQuantity: 20,
		bulkDiscounts: [{ quantity: 50, percentage: 8 }],
		attachments: [
			{
				id: "i502-brochure",
				name: "Produktblad.pdf",
				fileType: "pdf",
			},
		],
		archived: false,
	},
	{
		id: "i503",
		object: "Order OR001",
		purchaseNo: "I503",
		name: "Trappa",
		supplier: "Fredells",
		expectedDelivery: "2026-05-20",
		orderType: "backorder",
		description: "Prefabricerad trappa i furu, 13 steg.",
		category: "machinery",
		sku: "TRP-3010",
		unitPrice: 24900,
		leadTimeDays: 35,
		minimumOrderQuantity: 1,
		bulkDiscounts: [],
		attachments: [],
		archived: false,
	},
	{
		id: "i504",
		object: "Order OR001",
		purchaseNo: "I504",
		name: "Byggmaterial",
		supplier: "Marbodal",
		expectedDelivery: "2026-07-01",
		orderType: "backorder",
		description: "Blandat byggmaterial för etapp 2.",
		category: "raw_materials",
		sku: "BYG-4400",
		unitPrice: 450,
		leadTimeDays: 7,
		minimumOrderQuantity: 100,
		bulkDiscounts: [{ quantity: 500, percentage: 10 }],
		attachments: [],
		archived: false,
	},
	{
		id: "i505",
		object: "Order OR001",
		purchaseNo: "I505",
		name: "Fönster",
		supplier: "Marbodal",
		expectedDelivery: "2026-06-15",
		orderType: "backorder",
		description: "Treglasfönster, U-värde 0,9.",
		category: "spare_parts",
		sku: "FNS-5150",
		unitPrice: 7300,
		leadTimeDays: 28,
		minimumOrderQuantity: 4,
		bulkDiscounts: [{ quantity: 10, percentage: 6 }],
		attachments: [
			{
				id: "i505-spec",
				name: "Monteringsanvisning.pdf",
				fileType: "pdf",
			},
		],
		archived: false,
	},
	{
		id: "i490",
		object: "Order OR001",
		purchaseNo: "I490",
		name: "Rivningscontainer",
		supplier: "Beijer",
		expectedDelivery: "2026-03-02",
		orderType: "normal",
		description: "Container 10 m3 för rivningsavfall.",
		category: "machinery",
		sku: "RIV-9001",
		unitPrice: 3200,
		leadTimeDays: 3,
		minimumOrderQuantity: 1,
		bulkDiscounts: [],
		attachments: [],
		archived: true,
	},
	{
		id: "i491",
		object: "Projekt 2024-08",
		purchaseNo: "I491",
		name: "Stamrör",
		supplier: "ByggMax",
		expectedDelivery: "2026-03-18",
		orderType: "partial",
		description: "Avloppsrör i gjutjärn, 110 mm.",
		category: "raw_materials",
		sku: "STM-4410",
		unitPrice: 1450,
		leadTimeDays: 12,
		minimumOrderQuantity: 10,
		bulkDiscounts: [{ quantity: 40, percentage: 7 }],
		attachments: [],
		archived: true,
	},
];

/**
 * Documents already attached to a goods reception, as printed in the
 * "Lista godsmottagning" frame.
 */
export const MOCK_PURCHASE_GOODS_RECEPTION_DOCS: PurchaseAgreementDocument[] = [
	{
		id: "gm-doc-1",
		date: "2024-05-10",
		supplier: "Beijer",
		purchaseNo: "I501-001",
		documentName: "Kök.pdf",
		reference: "Följsedel",
		fileType: "pdf",
	},
	{
		id: "gm-doc-2",
		date: "2024-05-10",
		supplier: "Beijer",
		purchaseNo: "I501-002",
		documentName: "Badrum.pdf",
		reference: "Packsedel",
		fileType: "pdf",
	},
];
