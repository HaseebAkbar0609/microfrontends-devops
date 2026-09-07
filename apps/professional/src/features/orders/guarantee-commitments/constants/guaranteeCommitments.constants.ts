/**
 * Guarantee Commitments Feature Constants
 */

export const GUARANTEE_CONSTANTS = {
	DEFAULT_ORDER_ID: "5000-001",
	DEFAULT_FALLBACK_EMAIL: "info@byggbolaget.se",
	DEFAULT_FALLBACK_DATE: "2026-09-01",
	DEFAULT_FALLBACK_RULE: "2026-08-01",
	DEFAULT_FALLBACK_DOCUMENT_NAME: "file.txt",
	DEFAULT_PAGE_SIZE: 10,
	ALLOWED_FILE_TYPES: ".png,.jpg,.jpeg,.pdf,.txt",
	SUPPORTED_IMAGE_EXTENSIONS: ["png", "jpg", "jpeg", "doc"] as const,
	DEFAULT_FILE_TYPE: "pdf",
} as const;
