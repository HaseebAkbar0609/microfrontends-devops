/** Protocols safe to hand to `href` or `window.open`. */
const SAFE_PROTOCOLS = ["http:", "https:", "blob:"];

/**
 * Returns a normalised URL when it is safe to navigate to, and `undefined`
 * otherwise. Fails closed: anything unparseable is rejected.
 *
 * This is an allow-list, so `javascript:`, `data:`, `vbscript:` and `file:` are
 * all rejected, including the whitespace, newline and mixed-case variants the
 * URL parser normalises (`java\nscript:` parses as `javascript:`).
 *
 * Relative paths are accepted only in the single-slash form. A protocol-relative
 * `//evil.example` is rejected, because it leaves the current origin while
 * looking like a path.
 *
 * Takes no base and touches no globals, so it is safe to call while rendering
 * on the server.
 */
export function safeExternalUrl(url?: string | null): string | undefined {
	if (!url) return undefined;

	const trimmed = url.trim();
	if (!trimmed) return undefined;

	if (trimmed.startsWith("//")) return undefined;
	if (trimmed.startsWith("/")) return trimmed;

	try {
		const parsed = new URL(trimmed);
		return SAFE_PROTOCOLS.includes(parsed.protocol)
			? parsed.href
			: undefined;
	} catch {
		return undefined;
	}
}

/**
 * Opens a URL in a new tab when it passes `safeExternalUrl`, and reports whether
 * it did. `noopener` keeps the opened page from reaching back through
 * `window.opener`; `noreferrer` withholds the referrer.
 *
 * Call this straight from a click handler — a popup blocker will stop it
 * otherwise.
 */
export function openSafeUrl(url?: string | null): boolean {
	const safe = safeExternalUrl(url);
	if (!safe) return false;

	window.open(safe, "_blank", "noopener,noreferrer");
	return true;
}
