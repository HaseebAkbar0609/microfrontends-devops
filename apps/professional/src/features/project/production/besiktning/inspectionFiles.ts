import { generateTempId } from "@/lib/tempId";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import {
	fileRejection as recordFileRejection,
	isImageFile as recordIsImageFile,
	sortPickedFiles,
	type PickRejectionReason,
	type RecordFileRules,
} from "../../shared/recordFiles";
import {
	INSPECTION_DOCUMENTS_MAX,
	INSPECTION_FILE_MAX_BYTES,
	INSPECTION_FILE_TYPES,
} from "./projectInspection.config";
import type { InspectionDocumentInput } from "./types";

/** Besiktning's limits on the shared record-file rules. */
export const INSPECTION_FILE_RULES: RecordFileRules = {
	types: INSPECTION_FILE_TYPES,
	maxBytes: INSPECTION_FILE_MAX_BYTES,
	maxCount: INSPECTION_DOCUMENTS_MAX,
};

const REJECTION_KEYS: Record<PickRejectionReason, TranslationKeys> = {
	size: localizationConstants.inspectionFileSizeError,
	extension: localizationConstants.inspectionFileTypeError,
	duplicate: localizationConstants.projectInspectionFileDuplicate,
	count: localizationConstants.projectInspectionTooManyFiles,
};

/** Why a picked file is refused, or `null` when it may be attached. */
export function fileRejection(file: File): "size" | "extension" | null {
	return recordFileRejection(file, INSPECTION_FILE_RULES);
}

export function rejectionKey(reason: PickRejectionReason): TranslationKeys {
	return REJECTION_KEYS[reason];
}

export function isImageFile(name: string): boolean {
	return recordIsImageFile(name, INSPECTION_FILE_TYPES);
}

export interface PickedFilesResult {
	next: InspectionDocumentInput[];
	/** How many of the picked files were attached. */
	added: number;
	/** The first refusal, so the field can say which rule a file broke. */
	rejection: { key: TranslationKeys; name?: string } | null;
}

/**
 * Attaches picked files to the dialog's list under the shared record-file rules
 * (type, size, duplicate name, per-inspection maximum). The files that pass are
 * attached even when others in the same pick are refused.
 */
export function acceptPickedFiles(
	current: InspectionDocumentInput[],
	picked: File[],
): PickedFilesResult {
	const { accepted, rejection } = sortPickedFiles(
		current.map((doc) => doc.name),
		picked,
		INSPECTION_FILE_RULES,
	);
	const next = [
		...current,
		...accepted.map((file) => ({ id: generateTempId(), name: file.name, file })),
	];

	return {
		next,
		added: accepted.length,
		rejection: rejection ? { key: rejectionKey(rejection.reason), name: rejection.name } : null,
	};
}
