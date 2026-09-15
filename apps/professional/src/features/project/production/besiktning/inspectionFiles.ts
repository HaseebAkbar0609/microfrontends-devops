import { generateTempId } from "@/lib/tempId";
import { checkUploadedFile, type FileRejectionReason } from "@/lib/validation/fileUpload";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import {
	INSPECTION_DOCUMENTS_MAX,
	INSPECTION_FILE_EXTENSIONS,
	INSPECTION_FILE_MAX_BYTES,
	INSPECTION_FILE_TYPES,
} from "./projectInspection.config";
import type { InspectionDocumentInput } from "./types";

const FALLBACK_CONTENT_TYPE = "application/octet-stream";

function extensionOf(name: string): string {
	const dot = name.lastIndexOf(".");
	return dot < 0 ? "" : name.slice(dot).toLowerCase();
}

/** Why a picked file is refused, or `null` when it may be attached. */
export function fileRejection(file: File): FileRejectionReason | null {
	return checkUploadedFile(file, {
		acceptExtensions: INSPECTION_FILE_EXTENSIONS,
		maxFileSizeBytes: INSPECTION_FILE_MAX_BYTES,
	});
}

export function rejectionKey(reason: FileRejectionReason): TranslationKeys {
	return reason === "size"
		? localizationConstants.inspectionFileSizeError
		: localizationConstants.inspectionFileTypeError;
}

/** The content type an allowed file is served as, from its extension alone. */
export function mimeTypeFor(name: string): string {
	return INSPECTION_FILE_TYPES[extensionOf(name)] ?? FALLBACK_CONTENT_TYPE;
}

export function isImageFile(name: string): boolean {
	return mimeTypeFor(name).startsWith("image/");
}

export interface PickedFilesResult {
	next: InspectionDocumentInput[];
	/** How many of the picked files were attached. */
	added: number;
	/** The first refusal, so the field can say which rule a file broke. */
	rejection: { key: TranslationKeys; name?: string } | null;
}

/**
 * Attaches picked files to the dialog's list: each must be an allowed type
 * under the size ceiling, not a name already attached (case-insensitive), and
 * within the per-inspection maximum. The files that pass are attached even
 * when others in the same pick are refused.
 */
export function acceptPickedFiles(
	current: InspectionDocumentInput[],
	picked: File[],
): PickedFilesResult {
	const names = new Set(current.map((doc) => doc.name.toLowerCase()));
	const next = [...current];
	const refusals: NonNullable<PickedFilesResult["rejection"]>[] = [];

	for (const file of picked) {
		const reason = fileRejection(file);
		const name = file.name.toLowerCase();
		if (reason) {
			refusals.push({ key: rejectionKey(reason), name: file.name });
		} else if (names.has(name)) {
			refusals.push({ key: localizationConstants.projectInspectionFileDuplicate, name: file.name });
		} else if (next.length >= INSPECTION_DOCUMENTS_MAX) {
			refusals.push({ key: localizationConstants.projectInspectionTooManyFiles });
		} else {
			names.add(name);
			next.push({ id: generateTempId(), name: file.name, file });
		}
	}

	return { next, added: next.length - current.length, rejection: refusals[0] ?? null };
}
