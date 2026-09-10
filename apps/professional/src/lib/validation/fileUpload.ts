/**
 * Client-side guard for file pickers.
 *
 * An `<input type="file">`'s `accept` attribute only filters the OS dialog: it
 * is advisory, and a drag-and-drop, a renamed file or a scripted change event
 * walks straight past it. Anything that takes an upload therefore re-checks
 * here. This is a guard, not a boundary — the server must validate the file it
 * actually receives.
 */

export interface FileUploadRules {
	/** Extensions the caller will take, e.g. `[".pdf", ".png"]`. Omit for any. */
	acceptExtensions?: string[];
	/** Per-file ceiling in bytes. Omit for no ceiling. */
	maxFileSizeBytes?: number;
}

/** Why a file was turned away, so the caller can say which rule it broke. */
export type FileRejectionReason = "size" | "extension";

/** `null` when the file passes, otherwise the rule it broke. */
export function checkUploadedFile(
	file: File,
	{ acceptExtensions, maxFileSizeBytes }: FileUploadRules = {},
): FileRejectionReason | null {
	if (maxFileSizeBytes !== undefined && file.size > maxFileSizeBytes) {
		return "size";
	}

	if (!acceptExtensions || acceptExtensions.length === 0) return null;

	const name = file.name.toLowerCase();
	const allowed = acceptExtensions.some((extension) =>
		name.endsWith(extension.toLowerCase()),
	);

	return allowed ? null : "extension";
}

/** Convenience wrapper for callers that only need pass/fail. */
export function isAllowedUpload(file: File, rules: FileUploadRules = {}): boolean {
	return checkUploadedFile(file, rules) === null;
}

/** Splits an `accept` attribute string (".pdf,.png") into a rule list. */
export function extensionsFromAccept(accept: string): string[] {
	return accept
		.split(",")
		.map((entry) => entry.trim())
		.filter(Boolean);
}
