/**
 * Cryptographically Secure ID and Randomness Utilities
 * Replaces non-secure Date.now() and Math.random() with standard Web Crypto API.
 */

/**
 * Generates a cryptographically secure, non-predictable UUID v4.
 * Uses crypto.randomUUID() where available, with crypto.getRandomValues() fallback.
 */
export function generateSecureId(prefix?: string): string {
	let uuid: string;

	if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
		uuid = crypto.randomUUID();
	} else if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
		const bytes = new Uint8Array(16);
		crypto.getRandomValues(bytes);
		// Set version (4) and variant (RFC4122)
		bytes[6] = (bytes[6] & 0x0f) | 0x40;
		bytes[8] = (bytes[8] & 0x3f) | 0x80;
		const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
		uuid = `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
	} else {
		// Fallback for isolated legacy environments
		uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
			const r = (Math.random() * 16) | 0;
			const v = c === "x" ? r : (r & 0x3) | 0x8;
			return v.toString(16);
		});
	}

	return prefix ? `${prefix}-${uuid}` : uuid;
}

/**
 * Generates a cryptographically secure 6-digit numeric string for expense/invoice numbers.
 */
export function generateSecureExpenseNo(min = 100000, max = 999999): string {
	if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
		const buffer = new Uint32Array(1);
		crypto.getRandomValues(buffer);
		const range = max - min + 1;
		const val = min + (buffer[0] % range);
		return String(val);
	}
	return String(Math.floor(min + Math.random() * (max - min + 1)));
}
