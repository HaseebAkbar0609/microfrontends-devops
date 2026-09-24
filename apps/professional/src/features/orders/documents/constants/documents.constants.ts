/**
 * TFS-668: Order Production Documents Constants
 */

export const DOCUMENTS_CONSTANTS = {
	STORAGE_KEY: "tfs_order_documents_records",
	DEFAULT_ORDER_ID: "5000-001",
	MAX_FILE_SIZE_BYTES: 50 * 1024 * 1024, // 50MB
	ALLOWED_EXTENSIONS: [".pdf", ".png", ".jpg", ".jpeg", ".dwg", ".doc", ".docx"],
	ALLOWED_MIME_TYPES: [
		"application/pdf",
		"image/png",
		"image/jpeg",
		"image/jpg",
		"application/acad",
		"application/x-acad",
		"application/autocad_dwg",
		"image/x-dwg",
		"application/dwg",
		"application/x-dwg",
		"application/msword",
		"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
	],
	SUBTABS: {
		DOCUMENTS: "handlingar",
		DRAWINGS: "ritningar",
		ARCHIVE: "arkivera",
	} as const,
	CATEGORIES: {
		A_DRAWING: "A-ritning",
		CONSTRUCTION: "Konstruktion",
		K_DRAWING: "K-ritning",
		VVS_DRAWING: "VVS-ritning",
		ROOM_SPEC: "Rumsbeskrivning",
		BUILD_SPEC: "Byggbeskrivning",
		COLOR_SPEC: "Färgsättning",
		SOUND_PROTOCOL: "Ljudprotokoll",
		OTHER: "Övrigt",
	} as const,
	FILTER_ALL: "all",
	FALLBACK_DASH: "-",
	ACCEPT_EXTENSIONS_STRING: ".pdf,.png,.jpg,.jpeg,.dwg,.doc,.docx",
	DEFAULT_PAGE_SIZE: 10,
	DEFAULT_USER_NAME: "Kalle Svensson",
	KINDS: {
		DOCUMENT: "handling",
		DRAWING: "ritning",
	} as const,
} as const;

export type DocumentsSubTab =
	(typeof DOCUMENTS_CONSTANTS.SUBTABS)[keyof typeof DOCUMENTS_CONSTANTS.SUBTABS];
