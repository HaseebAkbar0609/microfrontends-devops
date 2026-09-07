export const PROTOCOL_CONSTANTS = {
	DEFAULT_ORDER_ID: "5000-001",
	DEFAULT_ORDER_NAME: "Order 5000–001",
	DEFAULT_PAGE_SIZE: 10,
	DEFAULT_FALLBACK_DATE: "2025-09-01",
	DEFAULT_FALLBACK_TYPE: "Byggmöte",
	DEFAULT_FALLBACK_DOCUMENT_NAME: "filename.pdf",
	DEFAULT_FILE_TYPE: "pdf",
	ALLOWED_FILE_TYPES: ".pdf,.doc,.docx,.png,.jpg,.jpeg",
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
