/** Shared numbers and lists for the Registrera nytt projekt wizard. */
export const PROJECT_CREATE_CONSTANTS = {
	TOTAL_STEPS: 5,
	/** The frames' helper text promises PNG, JPG and PDF. */
	ALLOWED_FILE_TYPES: ".png,.jpg,.jpeg,.pdf",
	/** Matches the 10 MB the shared size-limit message states. */
	MAX_FILE_SIZE_BYTES: 10 * 1024 * 1024,
	DEFAULT_FILE_TYPE: "pdf",
} as const;

export type ProjectCreateStep = 1 | 2 | 3 | 4 | 5;
