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
		NOT_REVIEWED: "ej_granskad",
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
	ALL_SUPPLIERS_VALUE: "all",
	VIEW_SECTIONS: {
		ORDERER: "orderer",
		GENERAL_INFO: "generalInfo",
		STAFF: "staff",
		MATERIAL: "material",
		MACHINES: "machines",
		UE: "ue",
		SUPPLIER_ATA: "supplierAta",
		DOCUMENTS: "documents",
	} as const,
	VIEW_DEFAULTS: {
		ACTIVE_BADGE: "Publicerad",
		TAG_BADGES: ["Tillkommande", "ÄTA-Ute"],
		LINKED_LEV_ATA: "Äta nr: 001",
		LINKED_ATA_OPTIONS: ["Äta nr: 001", "Äta nr: 002", "Äta nr: 003"],
		DEFAULT_TEAM: "00032",
		DEFAULT_UNIT: "tim",
	} as const,
};

export type AtaCategory = (typeof ATA_CONSTANTS.CATEGORIES)[keyof typeof ATA_CONSTANTS.CATEGORIES];
export type AtaStatus = (typeof ATA_CONSTANTS.STATUSES)[keyof typeof ATA_CONSTANTS.STATUSES];
export type AtaAttestedStatus = (typeof ATA_CONSTANTS.ATTESTED)[keyof typeof ATA_CONSTANTS.ATTESTED];
export type AtaTypeValue = (typeof ATA_CONSTANTS.TYPES)[keyof typeof ATA_CONSTANTS.TYPES];
export type ViewAtaSectionKey = (typeof ATA_CONSTANTS.VIEW_SECTIONS)[keyof typeof ATA_CONSTANTS.VIEW_SECTIONS];

