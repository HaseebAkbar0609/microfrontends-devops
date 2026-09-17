import { notFound } from "next/navigation";
import { z } from "zod";

/**
 * The shape every record id in this app takes: a short slug of letters,
 * digits, `_` and `-`, such as `I501` or `5000-001`.
 *
 * Bounded and character-checked so an unchecked path segment cannot reach a
 * query once these screens read from an API rather than a mock. A guard, not a
 * boundary — the server must validate what it is given as well.
 */
export const recordIdSchema = z
	.string()
	.trim()
	.min(1)
	.max(64)
	.regex(/^[A-Za-z0-9_-]+$/);

/**
 * Decodes a path segment, returning `undefined` rather than throwing.
 *
 * `decodeURIComponent` throws a `URIError` on a malformed escape — `%E0%A4%A`
 * is enough — and an uncaught throw in a server component is a 500 where the
 * honest answer is a 404.
 */
function decodeSegment(value: string): string | undefined {
	try {
		return decodeURIComponent(value);
	} catch {
		return undefined;
	}
}

/**
 * Validates a `[id]` route param, calling `notFound()` on anything malformed.
 *
 * Returns the decoded id, so a caller can use the result directly.
 */
export function parseRecordIdParam(value: string): string {
	const decoded = decodeSegment(value);
	if (decoded === undefined) notFound();

	const parsed = recordIdSchema.safeParse(decoded);
	if (!parsed.success) notFound();

	return parsed.data;
}

/**
 * Validates an optional query-string id, returning `undefined` rather than
 * 404ing — a bad `?ref=` should fall back to the unscoped screen, not break it.
 *
 * Repeated params arrive as an array; only a single value is accepted.
 */
export function parseOptionalIdParam(
	value: string | string[] | undefined,
): string | undefined {
	if (typeof value !== "string") return undefined;

	const decoded = decodeSegment(value);
	if (decoded === undefined) return undefined;

	const parsed = recordIdSchema.safeParse(decoded);
	return parsed.success ? parsed.data : undefined;
}
