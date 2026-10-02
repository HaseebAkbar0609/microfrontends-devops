/** Field limits and patterns of the new-access wizard. Plain values, so the validation can be tested alone. */

export const ACCESS_NEW_LIMITS = {
	name: 255,
	address: 255,
	city: 100,
	email: 254,
	mobile: 30,
	regNo: 30,
	tag: 60,
} as const;

/** Swedish postal code: five digits, with or without the space after the third ("113 45"). */
export const ACCESS_POSTAL_CODE_PATTERN = /^\d{3} ?\d{2}$/;

export const ACCESS_EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Used for the first access when the list is empty; later ones continue the highest existing number. */
export const ACCESS_ID_DEFAULT_PREFIX = "NYK-2026-";

export const ACCESS_ROW_ID_PREFIX = "ap-";

export const ACCESS_KEY_ID_PREFIX = "N";

/** Digits in a generated number: "NYK-2026-001", "N001". */
export const ACCESS_NUMBER_DIGITS = 3;

/** Placeholder pricing from the Figma frame's saved-keys table; no pricing source exists yet. */
export const ACCESS_KEY_MOCK_UNIT_PRICE = 358;
export const ACCESS_KEY_MOCK_SUBTOTAL = 158000;

export const ACCESS_NEW_TOTAL_STEPS = 2;
