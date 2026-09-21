import { checkUploadedFile } from "@/lib/validation/fileUpload";

/**
 * Files attached on a project record's sections (Besiktning, ÄTA, Handlingar,
 * Dagbok, Garantiåtaganden, Protokoll).
 *
 * There is no upload endpoint, so a section's in-memory store stands in for
 * one and serves a saved file from a `blob:` URL. These helpers are the rules
 * those sections share: which files a pick may attach, and what content type a
 * stored file is served as. Each section keeps its own limits and messages.
 */

/** Extension → the content type a file with it is served as, e.g. `".pdf" → "application/pdf"`. */
export type RecordFileTypes = Readonly<Record<string, string>>;

export interface RecordFileRules {
	types: RecordFileTypes;
	maxBytes: number;
	/** Files one record may hold in total. */
	maxCount: number;
}

/** Why a picked file was not attached. */
export type PickRejectionReason = "size" | "extension" | "duplicate" | "count";

export interface PickRejection {
	reason: PickRejectionReason;
	/** The file refused; absent when the record is simply full. */
	name?: string;
}

const FALLBACK_CONTENT_TYPE = "application/octet-stream";

/** ".PDF" → ".pdf"; `""` when the name has no extension. */
export function extensionOf(name: string): string {
	const dot = name.lastIndexOf(".");
	return dot < 0 ? "" : name.slice(dot).toLowerCase();
}

/** "Tidrapport v28.pdf" → "Tidrapport v28", the name a new document starts with. */
export function baseNameOf(fileName: string): string {
	const dot = fileName.lastIndexOf(".");
	return dot > 0 ? fileName.slice(0, dot) : fileName;
}

/** The content type an allowed file is served as, from its extension alone. */
export function mimeTypeFor(name: string, types: RecordFileTypes): string {
	return types[extensionOf(name)] ?? FALLBACK_CONTENT_TYPE;
}

export function isImageFile(name: string, types: RecordFileTypes): boolean {
	return mimeTypeFor(name, types).startsWith("image/");
}

/** The picker's advisory `accept`: extensions and content types together. */
export function acceptAttribute(types: RecordFileTypes): string {
	return [...Object.keys(types), ...Array.from(new Set(Object.values(types)))].join(",");
}

/** Type or size refusal for one file, or `null` when it passes both. */
export function fileRejection(file: File, rules: RecordFileRules): "size" | "extension" | null {
	return checkUploadedFile(file, {
		acceptExtensions: Object.keys(rules.types),
		maxFileSizeBytes: rules.maxBytes,
	});
}

/**
 * Sorts a pick against what the record already holds: each file must be an
 * allowed type under the size ceiling, not a name already attached
 * (case-insensitive), and within the record's maximum. The files that pass are
 * returned even when others in the same pick are refused; the first refusal is
 * reported so the field can say which rule a file broke.
 */
export function sortPickedFiles(
	existingNames: readonly string[],
	picked: readonly File[],
	rules: RecordFileRules,
): { accepted: File[]; rejection: PickRejection | null } {
	const names = new Set(existingNames.map((name) => name.toLowerCase()));
	const accepted: File[] = [];
	const refusals: PickRejection[] = [];

	for (const file of picked) {
		const reason = fileRejection(file, rules);
		const name = file.name.toLowerCase();
		if (reason) {
			refusals.push({ reason, name: file.name });
		} else if (names.has(name)) {
			refusals.push({ reason: "duplicate", name: file.name });
		} else if (existingNames.length + accepted.length >= rules.maxCount) {
			refusals.push({ reason: "count" });
		} else {
			names.add(name);
			accepted.push(file);
		}
	}

	return { accepted, rejection: refusals[0] ?? null };
}

/**
 * A `blob:` URL serving the file as its extension's content type, so a renamed
 * file never opens as something else (an `.html` saved as `.pdf` stays a PDF).
 * `slice` points at the same bytes; nothing is copied.
 */
export function mintTypedUrl(file: File, types: RecordFileTypes): string {
	return URL.createObjectURL(file.slice(0, file.size, mimeTypeFor(file.name, types)));
}

export function revokeUrls(documents: readonly { url?: string }[]): void {
	for (const doc of documents) {
		if (doc.url) URL.revokeObjectURL(doc.url);
	}
}
