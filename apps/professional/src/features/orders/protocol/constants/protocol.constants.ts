export const PROTOCOL_CONSTANTS = {
	DEFAULT_ORDER_ID: "5000-001",
	DEFAULT_ORDER_NAME: "Order 5000–001",
	DEFAULT_PAGE_SIZE: 10,
	DEFAULT_FALLBACK_DATE: "2025-09-01",
	DEFAULT_FALLBACK_TYPE: "Byggmöte",
	DEFAULT_FALLBACK_DOCUMENT_NAME: "filename.pdf",
	DEFAULT_FILE_TYPE: "pdf",
	ALLOWED_FILE_TYPES: ".pdf,.doc,.docx,.png,.jpg,.jpeg,.txt",
	MAX_FILE_SIZE_BYTES: 10 * 1024 * 1024,
	ALLOWED_EXTENSIONS: ["pdf", "doc", "docx", "png", "jpg", "jpeg", "txt"],
	DEFAULT_PROJECT_NUMBER: "5001",
	DEFAULT_PROJECT_NAME: "Kv Skatan, Storgatan 10",
	DEFAULT_LOCATION: "Kontoret",
	DEFAULT_START_TIME: "15:00",
	DEFAULT_END_TIME: "17:00",
	DEFAULT_CATEGORY: "Bygg",
	DEFAULT_UPLOAD_DATE: "2024-12-17",
	DEFAULT_POSTAL_CODE: "-",
	DEFAULT_CITY: "-",
	DEFAULT_RESPONSIBLE: "Kalle Svensson",
	DEFAULT_FALLBACK_FILE_NAME: "file.txt",
	DAY_NAMES: ["Sön", "Mån", "Tis", "Ons", "Tor", "Fre", "Lör"] as const,
	DEFAULT_PARTICIPANTS: ["Thao", "Robert"],
	AVAILABLE_PARTICIPANTS: ["Thao", "Robert", "Anna", "Johan", "Kalle", "Sara"],
	CATEGORIES: ["Bygg", "Installation", "Mark & Anläggning", "Måleri", "El & VVS"] as const,
	UPLOAD_PROTOCOL_TYPES: [
		"Byggmöte 1",
		"Byggmöte 2",
		"Egenkontroll",
		"Slutbesiktning",
		"Kvalitetskontroll",
		"Skyddsrond",
	] as const,
	PROTOCOL_TYPES: [
		"Byggmöte",
		"Egenkontroll",
		"Slutbesiktning",
		"Kvalitetskontroll",
		"Skyddsrond",
	] as const,
	TEMPLATE_TYPES: {
		STANDARD: "standard",
		ACTION: "action",
		UPLOAD: "upload",
	} as const,
	STATUSES: {
		NOT_STARTED: "not_started",
		IN_PROGRESS: "in_progress",
		COMPLETED: "completed",
	} as const,
} as const;

export type ProtocolType = (typeof PROTOCOL_CONSTANTS.PROTOCOL_TYPES)[number];
export type ProtocolTemplateType =
	(typeof PROTOCOL_CONSTANTS.TEMPLATE_TYPES)[keyof typeof PROTOCOL_CONSTANTS.TEMPLATE_TYPES];
export type ProtocolStatus =
	(typeof PROTOCOL_CONSTANTS.STATUSES)[keyof typeof PROTOCOL_CONSTANTS.STATUSES];
