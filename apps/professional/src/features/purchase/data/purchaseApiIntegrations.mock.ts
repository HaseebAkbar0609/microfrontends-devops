import type {
	PurchaseApiCategory,
	PurchaseApiSupplier,
} from "../types/purchase.types";

/**
 * Categories shown under "API kategori". Names are literal provider strings
 * rather than translation keys, matching how the admin integration catalogue
 * treats its offerings.
 */
export const MOCK_PURCHASE_API_CATEGORIES: PurchaseApiCategory[] = [
	{
		id: "connection-supplier-api",
		name: "Connection supplier - API",
		active: true,
	},
];

/**
 * Suppliers available over the API, taken verbatim from the Figma frame.
 *
 * These names differ from the suppliers tab's own list — the frame uses its own
 * set — so the two tabs will not line up until a canonical list is agreed.
 */
export const MOCK_PURCHASE_API_SUPPLIERS: PurchaseApiSupplier[] = [
	{ id: "bygg-max", name: "Bygg-Max", connected: false },
	{ id: "beijer", name: "Beijer", connected: false },
	{ id: "fredell", name: "Fredell", connected: false },
	{ id: "gronmarks", name: "Grönmarks", connected: true },
	{ id: "xl-bygg", name: "XL-Bygg", connected: true },
	{ id: "dhal-vvs", name: "Dhal VVS", connected: true },
];
