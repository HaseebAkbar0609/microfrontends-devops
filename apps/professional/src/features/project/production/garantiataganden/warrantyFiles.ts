import { generateTempId } from "@/lib/tempId";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { baseNameOf, sortPickedFiles, type PickRejectionReason } from "../../shared/recordFiles";
import { WARRANTY_FILE_RULES } from "./projectWarranty.config";
import type { WarrantyDocumentDraft } from "./types";

/**
 * The create form's file picking, over the shared record-file rules.
 *
 * Besiktning's `inspectionFiles.ts` is the same field in another section; this
 * is its Garantiåtaganden twin, differing only in the messages a refusal gets.
 */

const REJECTION_KEYS: Record<PickRejectionReason, TranslationKeys> = {
	size: localizationConstants.projectWarrantyFileSizeError,
	extension: localizationConstants.projectWarrantyFileTypeError,
	duplicate: localizationConstants.projectWarrantyFileDuplicate,
	count: localizationConstants.projectWarrantyTooManyFiles,
};

export function rejectionKey(reason: PickRejectionReason): TranslationKeys {
	return REJECTION_KEYS[reason];
}

export interface PickedWarrantyFilesResult {
	next: WarrantyDocumentDraft[];
	/** How many of the picked files were attached. */
	added: number;
	/** The first refusal, so the field can say which rule a file broke. */
	rejection: { key: TranslationKeys; name?: string } | null;
}

/**
 * Attaches picked files to the dialog's list under the section's rules — type,
 * size, a name already attached, the per-commitment maximum. The files that
 * pass are attached even when others in the same pick are refused. A draft
 * carries the `File` until Spara; the store mints the URL.
 */
export function acceptPickedFiles(
	current: readonly WarrantyDocumentDraft[],
	picked: readonly File[],
): PickedWarrantyFilesResult {
	const { accepted, rejection } = sortPickedFiles(
		current.map((doc) => doc.fileName),
		picked,
		WARRANTY_FILE_RULES,
	);
	const next = [
		...current,
		/* Benämning starts as the file's name without its extension, which the
		   Dokument card's own dialog also fills it with. */
		...accepted.map((file) => ({ id: generateTempId(), name: baseNameOf(file.name), fileName: file.name, file })),
	];

	return {
		next,
		added: accepted.length,
		rejection: rejection ? { key: rejectionKey(rejection.reason), name: rejection.name } : null,
	};
}
