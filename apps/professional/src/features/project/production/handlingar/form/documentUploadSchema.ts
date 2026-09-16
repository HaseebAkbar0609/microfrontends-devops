import { z } from "zod";

import localizationConstants from "@/utils/translation/constants";
import { fileRejection } from "../../../shared/recordFiles";
import {
	DOCUMENT_FILE_RULES,
	DOCUMENT_KINDS,
	DOCUMENT_NAME_MAX_LENGTH,
	DRAWING_CATEGORIES,
	DRAWING_NUMBER_MAX_LENGTH,
} from "../projectDocuments.config";
import type { ProjectDocumentKind } from "../types";

/** `File` checked at runtime, so the schema module is safe to load on the server. */
const fileSchema = z.custom<File>((value) => typeof File !== "undefined" && value instanceof File);

/**
 * "Ladda upp handling". Messages are translation keys.
 *
 * `file` is the file attached with "Ladda upp"; `pendingFile` one picked but not
 * yet attached, which Spara refuses rather than dropping silently. A drawing
 * asks for its Ritningsnummer and Kategori instead of a Benämning. The file is
 * re-checked by extension and size, since `accept` only filters the OS dialog.
 */
export const documentUploadSchema = z
	.object({
		kind: z.enum(DOCUMENT_KINDS),
		name: z.string().trim(),
		category: z.enum(DRAWING_CATEGORIES).nullable(),
		file: fileSchema.nullable(),
		pendingFile: fileSchema.nullable(),
	})
	.superRefine((values, ctx) => {
		const drawing = values.kind === "ritning";
		const maxLength = drawing ? DRAWING_NUMBER_MAX_LENGTH : DOCUMENT_NAME_MAX_LENGTH;
		const issue = (path: string, message: string) => ctx.addIssue({ code: z.ZodIssueCode.custom, path: [path], message });

		if (!values.name) {
			issue("name", drawing ? localizationConstants.projectDocumentsDrawingNumberRequired : localizationConstants.projectDocumentsNameRequired);
		} else if (values.name.length > maxLength) {
			issue("name", localizationConstants.projectDocumentsTooLong);
		}

		if (drawing && !values.category) issue("category", localizationConstants.projectDocumentsCategoryRequired);

		if (values.pendingFile) {
			issue("file", localizationConstants.projectDocumentsFileNotUploaded);
		} else if (!values.file) {
			issue("file", localizationConstants.projectDocumentsFileRequired);
		} else {
			const refused = fileRejection(values.file, DOCUMENT_FILE_RULES);
			if (refused) {
				issue(
					"file",
					refused === "size" ? localizationConstants.projectDocumentsFileSizeError : localizationConstants.projectDocumentsFileTypeError,
				);
			}
		}
	});

export type DocumentUploadValues = z.infer<typeof documentUploadSchema>;

/** An empty upload of this kind — each opening of the dialog starts from it. */
export function emptyDocumentUpload(kind: ProjectDocumentKind): DocumentUploadValues {
	return { kind, name: "", category: null, file: null, pendingFile: null };
}
