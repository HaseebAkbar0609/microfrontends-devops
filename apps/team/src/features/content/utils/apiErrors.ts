import { isAxiosError } from "axios";

/** What the backend sends when its language files have no text for a code. */
const UNTRANSLATED_CODE = /^[A-Z0-9_]+$/;

export function apiErrorStatus(error: unknown): number | undefined {
	return isAxiosError(error) ? error.response?.status : undefined;
}

/**
 * The backend translates `message` itself, so it is shown as sent. A missing
 * message or a bare code such as "CONSULTANT_TYPE_IN_USE" falls back to the
 * caller's already translated text.
 */
export function apiErrorText(error: unknown, fallback: string): string {
	const message: unknown = isAxiosError(error)
		? error.response?.data?.message
		: undefined;
	if (typeof message !== "string") return fallback;
	const text = message.trim();
	return text && !UNTRANSLATED_CODE.test(text) ? text : fallback;
}
