import { z } from "zod";

import localizationConstants from "@/utils/translation/constants";
import { fileRejection, rejectionKey } from "../inspectionFiles";
import {
	DEFAULT_INSPECTION_TYPE,
	INSPECTION_DOCUMENTS_MAX,
	INSPECTION_TYPES,
} from "../projectInspection.config";
import type { ProjectInspection } from "../types";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/** `File` checked at runtime, so the schema module is safe to load on the server. */
const fileSchema = z.custom<File>((value) => typeof File !== "undefined" && value instanceof File);

/**
 * "Lägg till / Redigera Besiktning". Messages are translation keys.
 *
 * Only Datum carries the frame's asterisk; Besiktningsdatum may wait until the
 * inspection is booked. Files are re-checked here although the picker already
 * filtered them — `accept` only filters the OS dialog. The issues sit on the
 * list rather than an entry, so the field's message can show them.
 */
export const inspectionSchema = z.object({
	date: z
		.string()
		.min(1, localizationConstants.inspectionDateRequired)
		.regex(ISO_DATE, localizationConstants.projectInspectionInvalidDate),
	type: z.enum(INSPECTION_TYPES, {
		errorMap: () => ({ message: localizationConstants.inspectionTypeRequired }),
	}),
	inspectionDate: z
		.string()
		.refine((value) => value === "" || ISO_DATE.test(value), localizationConstants.projectInspectionInvalidDate),
	documents: z
		.array(z.object({ id: z.string().min(1), name: z.string().min(1), file: fileSchema.optional() }))
		.max(INSPECTION_DOCUMENTS_MAX, localizationConstants.projectInspectionTooManyFiles)
		.superRefine((documents, ctx) => {
			for (const doc of documents) {
				const reason = doc.file ? fileRejection(doc.file) : null;
				if (reason) {
					ctx.addIssue({ code: z.ZodIssueCode.custom, message: rejectionKey(reason) });
					return;
				}
			}
		}),
});

export type InspectionFormValues = z.infer<typeof inspectionSchema>;

/** A new inspection's draft. Datum is today, passed in from the click that opened the dialog. */
export function emptyInspectionDraft(today: string): InspectionFormValues {
	return { date: today, type: DEFAULT_INSPECTION_TYPE, inspectionDate: "", documents: [] };
}

/** An existing inspection's draft. Files travel by id and name only — never their URL. */
export function draftOf(inspection: ProjectInspection): InspectionFormValues {
	return {
		date: inspection.date,
		type: inspection.type,
		inspectionDate: inspection.inspectionDate,
		documents: inspection.documents.map(({ id, name }) => ({ id, name })),
	};
}
