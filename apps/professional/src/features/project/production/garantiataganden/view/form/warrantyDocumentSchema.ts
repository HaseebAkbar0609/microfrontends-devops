import { z } from "zod";

import localizationConstants from "@/utils/translation/constants";
import { fileRejection } from "../../../../shared/recordFiles";
import { WARRANTY_FILE_RULES, WARRANTY_NAME_MAX_LENGTH } from "../../projectWarranty.config";

/** `File` checked at runtime, so the schema module is safe to load on the server. */
const fileSchema = z.custom<File>((value) => typeof File !== "undefined" && value instanceof File);

/**
 * The Dokument card's dialog. Messages are translation keys.
 *
 * `file` is the file attached with "Ladda upp"; `pendingFile` one picked but
 * not yet attached, which Spara refuses rather than dropping silently. Redigera
 * changes the Benämning of a stored document, so it asks for no file and sets
 * `withFile` to false. The file is re-checked by extension and size, since
 * `accept` only filters the OS dialog.
 */
export const warrantyDocumentSchema = z
	.object({
		withFile: z.boolean(),
		name: z.string().trim(),
		file: fileSchema.nullable(),
		pendingFile: fileSchema.nullable(),
	})
	.superRefine((values, ctx) => {
		const issue = (path: string, message: string) => ctx.addIssue({ code: z.ZodIssueCode.custom, path: [path], message });

		if (!values.name) {
			issue("name", localizationConstants.projectWarrantyNameRequired);
		} else if (values.name.length > WARRANTY_NAME_MAX_LENGTH) {
			issue("name", localizationConstants.projectWarrantyTooLong);
		}

		if (!values.withFile) return;

		if (values.pendingFile) {
			issue("file", localizationConstants.projectWarrantyFileNotUploaded);
		} else if (!values.file) {
			issue("file", localizationConstants.projectWarrantyFileRequired);
		} else {
			const refused = fileRejection(values.file, WARRANTY_FILE_RULES);
			if (refused) {
				issue("file", refused === "size" ? localizationConstants.projectWarrantyFileSizeError : localizationConstants.projectWarrantyFileTypeError);
			}
		}
	});

export type WarrantyDocumentValues = z.infer<typeof warrantyDocumentSchema>;

/** An empty document to add, or the stored one Redigera renames. */
export function emptyWarrantyDocument(document?: { name: string }): WarrantyDocumentValues {
	return { withFile: !document, name: document?.name ?? "", file: null, pendingFile: null };
}
