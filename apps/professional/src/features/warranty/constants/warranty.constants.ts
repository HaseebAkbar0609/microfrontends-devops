/**
 * Shared warranty (Garantiåtaganden) feature constants.
 *
 * One set for all three consumers — the Order warranty route, the tab inside an
 * opened order, and the Project module page. The two features this was merged
 * from disagreed on the default record id ("5000" vs "5000-001"); the
 * order-scoped one wins because the API paths are order-scoped.
 */

export const WARRANTY_CONSTANTS = {
	DEFAULT_ORDER_ID: "5000-001",
	DEFAULT_FALLBACK_EMAIL: "info@byggbolaget.se",
	DEFAULT_FALLBACK_DATE: "2026-09-01",
	DEFAULT_FALLBACK_RULE: "2026-08-01",
	DEFAULT_FALLBACK_DOCUMENT_NAME: "file.txt",
	DEFAULT_PAGE_SIZE: 10,
	ALLOWED_FILE_TYPES: ".png,.jpg,.jpeg,.pdf,.txt",
	/** Matches the ceiling the "max 10MB" help text under the picker promises. */
	MAX_FILE_SIZE_BYTES: 10 * 1024 * 1024,
	SUPPORTED_IMAGE_EXTENSIONS: ["png", "jpg", "jpeg", "doc"] as const,
	DEFAULT_FILE_TYPE: "pdf",
	WARRANTY_PERIOD_FILTERS: ["2 år", "5 år", "10 år"] as const,
} as const;
