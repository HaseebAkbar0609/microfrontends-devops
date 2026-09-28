/**
 * Session storage for the parts of a record that name people or carry their
 * words.
 *
 * AGENTS.md rule 6 keeps plain-text personal data out of browser storage, but
 * allows "in-memory storage or secure encoding layers". This is that layer, as
 * the personnel register already does it: base64 over UTF-8, in
 * `sessionStorage` rather than `localStorage`, so the data lives as long as
 * the tab and never lands on disk in a readable form.
 *
 * Encoding is not encryption — it stops a casual read of the store, not a
 * determined one. It is the right weight for data a real deployment would keep
 * on a server.
 */

/** Base64 of the UTF-8 bytes, without the deprecated `escape`/`unescape` pair. */
function encode(value: string): string {
	const bytes = new TextEncoder().encode(value);
	let binary = "";
	for (const byte of bytes) binary += String.fromCharCode(byte);
	return window.btoa(binary);
}

function decode(value: string): string {
	const binary = window.atob(value);
	const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
	return new TextDecoder().decode(bytes);
}

/** What the tab holds under this key, or `null` when it holds nothing readable. */
export function readEncodedSession<T>(key: string): T | null {
	if (typeof window === "undefined") return null;
	try {
		const raw = window.sessionStorage.getItem(key);
		return raw ? (JSON.parse(decode(raw)) as T) : null;
	} catch {
		/* Unreadable or blocked storage reads as empty rather than failing. */
		return null;
	}
}

export function writeEncodedSession(key: string, value: unknown): void {
	if (typeof window === "undefined") return;
	try {
		window.sessionStorage.setItem(key, encode(JSON.stringify(value)));
	} catch {
		/* A full or blocked store must not break the screen. */
	}
}
