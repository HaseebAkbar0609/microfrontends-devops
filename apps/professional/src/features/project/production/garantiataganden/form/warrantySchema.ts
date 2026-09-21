import { z } from "zod";

import { emailRegex } from "@/lib/validation/contactSchema";
import localizationConstants from "@/utils/translation/constants";
import { fileRejection } from "../../../shared/recordFiles";
import { WARRANTY_FILE_RULES, WARRANTY_NAME_MAX_LENGTH } from "../projectWarranty.config";

const M = localizationConstants;

/** `File` checked at runtime, so the schema module is safe to load on the server. */
const fileSchema = z.custom<File>((value) => typeof File !== "undefined" && value instanceof File);

/**
 * One attached file: a document the commitment already stores, carried by its
 * id, or a picked file not yet stored. The name comes from the file, so it is
 * never blank.
 */
const documentDraftSchema = z.object({
	id: z.string().min(1),
	name: z.string().trim().min(1, M.projectWarrantyNameRequired).max(WARRANTY_NAME_MAX_LENGTH, M.projectWarrantyTooLong),
	fileName: z.string().min(1),
	file: fileSchema.optional(),
});

/**
 * "Skapa ny" and ⋮ Redigera — the frame's five fields. Messages are translation
 * keys.
 *
 * Only Datum is starred in the frame, but Benämning stays required: it is the
 * list's own column, and a blank one leaves an unreadable row. `emailRegex`
 * accepts an empty string, so a row the reader has not filled in yet does not
 * read as an error; blank rows are dropped on Spara. Files are re-checked by
 * extension and size, since `accept` only filters the OS dialog.
 */
export const warrantySchema = z.object({
	date: z.string().min(1, M.projectWarrantyDateRequired),
	name: z.string().trim().min(1, M.projectWarrantyNameRequired).max(WARRANTY_NAME_MAX_LENGTH, M.projectWarrantyTooLong),
	/** Påminnelse regel, which the frame fills with a date. Optional. */
	reminderDate: z.string(),
	emails: z.array(z.object({ value: z.string().trim().regex(emailRegex, M.orderValidationEmailInvalid) })),
	documents: z
		.array(documentDraftSchema)
		.max(WARRANTY_FILE_RULES.maxCount, M.projectWarrantyTooManyFiles)
		.superRefine((documents, ctx) => {
			for (const document of documents) {
				const refused = document.file && fileRejection(document.file, WARRANTY_FILE_RULES);
				if (refused) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: refused === "size" ? M.projectWarrantyFileSizeError : M.projectWarrantyFileTypeError,
					});
				}
			}
		}),
});

export type WarrantyFormValues = z.infer<typeof warrantySchema>;

/**
 * An empty commitment — what "Skapa ny" opens on, with the frame's one blank
 * address row. A function, not a shared constant: each opening needs its own
 * arrays for the field array to work through.
 */
export function emptyWarrantyDraft(): WarrantyFormValues {
	return { date: "", name: "", reminderDate: "", emails: [{ value: "" }], documents: [] };
}
