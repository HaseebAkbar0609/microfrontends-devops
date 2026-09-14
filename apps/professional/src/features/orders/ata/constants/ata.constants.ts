export const ATA_CONSTANTS = {
	DEFAULT_ORDER_ID: "1",
	DEFAULT_PAGE_SIZE: 10,
	PAGE_SIZE_OPTIONS: [5, 10, 20, 50, 100] as const,
	VAT_RATE: 0.25, // 25% Swedish standard VAT
	STORAGE_KEYS: {
		ACTIVE_TAB: "tfs_order_ata_active_tab",
		PAGE_SIZE: "tfs_order_ata_page_size",
	},
	STATUSES: {
		OK: "ok",
		ACCOUNTED: "redovisad",
		NEGOTIATION: "forhandling",
		PENDING: "pending",
		APPROVED: "approved",
		REJECTED: "rejected",
		DRAFT: "draft",
	} as const,
	CATEGORIES: {
		CUSTOMER: "kund",
		SUPPLIER: "ue-lev",
	} as const,
	ATTESTED: {
		YES: "ja",
		NO: "nej",
		PENDING: "ej_klart",
	} as const,
	TYPES: {
		CHANGE: "andring",
		ADDITION: "tillagg",
		DEDUCTION: "avgaende",
	} as const,
	STEPS: {
		STEP_1: 1,
		STEP_2: 2,
		TOTAL_STEPS: 2,
	} as const,
};

export type AtaCategory = (typeof ATA_CONSTANTS.CATEGORIES)[keyof typeof ATA_CONSTANTS.CATEGORIES];
export type AtaStatus = (typeof ATA_CONSTANTS.STATUSES)[keyof typeof ATA_CONSTANTS.STATUSES];
export type AtaAttestedStatus = (typeof ATA_CONSTANTS.ATTESTED)[keyof typeof ATA_CONSTANTS.ATTESTED];
export type AtaTypeValue = (typeof ATA_CONSTANTS.TYPES)[keyof typeof ATA_CONSTANTS.TYPES];

