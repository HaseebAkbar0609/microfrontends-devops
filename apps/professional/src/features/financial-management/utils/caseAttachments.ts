import {
	mintTypedUrl,
	sortPickedFiles,
	type PickRejectionReason,
	type RecordFileRules,
} from "@/features/project/shared/recordFiles";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { formatFileSize } from "@/utils/formatFileSize";
import type { CaseDocument } from "../types/cases.types";

/** Why a pick was refused, in words the reader can act on. */
const REJECTION_KEYS: Record<PickRejectionReason, TranslationKeys> = {
	size: localizationConstants.casesAttachmentSizeError,
	extension: localizationConstants.casesAttachmentTypeError,
	duplicate: localizationConstants.casesAttachmentDuplicate,
	count: localizationConstants.casesAttachmentCount,
};

export interface CasePickRejection {
	key: TranslationKeys;
	/** The file refused; absent when the case is simply full. */
	name?: string;
}

export interface CasePickResult {
	accepted: File[];
	rejection: CasePickRejection | null;
}

/**
 * Sorts a pick against what the case already holds: the right type, under the
 * size ceiling, not a name already attached, and within the case's maximum.
 *
 * Files that pass come back even when others in the same pick are refused, and
 * the first refusal is reported so one message can name one file.
 */
export function acceptPickedCaseFiles(
	existingNames: readonly string[],
	picked: readonly File[],
	rules: RecordFileRules,
): CasePickResult {
	const { accepted, rejection } = sortPickedFiles(existingNames, picked, rules);
	return {
		accepted,
		rejection: rejection ? { key: REJECTION_KEYS[rejection.reason], name: rejection.name } : null,
	};
}

/**
 * A picked file as the case stores it.
 *
 * The URL serves the file as its extension's content type and lives as long as
 * the tab does. A case read back later keeps the row and loses the URL, which
 * is what the "file is no longer held" state is for.
 */
export function toCaseDocument(
	file: File,
	category: "document" | "image",
	rules: RecordFileRules,
	today: string = new Date().toISOString().split("T")[0],
): CaseDocument {
	return {
		id: `case-file-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
		name: file.name,
		date: today,
		fileType: file.type || undefined,
		fileSize: formatFileSize(file.size),
		url: mintTypedUrl(file, rules.types),
		category,
	};
}
