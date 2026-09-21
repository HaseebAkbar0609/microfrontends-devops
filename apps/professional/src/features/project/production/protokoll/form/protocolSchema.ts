import { z } from "zod";

import localizationConstants from "@/utils/translation/constants";
import { fileRejection } from "../../../shared/recordFiles";
import { PROTOCOL_FILE_RULES, PROTOCOL_NAME_MAX_LENGTH, PROTOCOL_TYPES } from "../projectProtocol.config";
import type { DialogProtocolKind } from "../types";

const M = localizationConstants;

/** `File` checked at runtime, so the schema module is safe to load on the server. */
const fileSchema = z.custom<File>((value) => typeof File !== "undefined" && value instanceof File);

/**
 * The protocol dialog. Messages are translation keys.
 *
 * Datum, Typ and Benämning are required for every kind. `withFile` is set for
 * Ladda upp only: `file` is the PDF attached with "Ladda upp", `pendingFile`
 * one picked but not yet attached, which Spara refuses rather than dropping
 * silently. The PDF is re-checked by extension and size, since `accept` only
 * filters the OS dialog. Every rule runs in one pass, so an empty Spara names
 * each missing field at once.
 */
export const protocolSchema = z
	.object({
		withFile: z.boolean(),
		date: z.string(),
		type: z.enum(PROTOCOL_TYPES).nullable(),
		name: z.string().trim(),
		file: fileSchema.nullable(),
		pendingFile: fileSchema.nullable(),
	})
	.superRefine((values, ctx) => {
		const issue = (path: string, message: string) => ctx.addIssue({ code: z.ZodIssueCode.custom, path: [path], message });

		if (!values.date) issue("date", M.projectProtocolDateRequired);
		if (!values.type) issue("type", M.projectProtocolTypeRequired);
		if (!values.name) {
			issue("name", M.projectProtocolNameRequired);
		} else if (values.name.length > PROTOCOL_NAME_MAX_LENGTH) {
			issue("name", M.projectProtocolTooLong);
		}

		if (!values.withFile) return;

		if (values.pendingFile) {
			issue("file", M.projectProtocolFileNotUploaded);
		} else if (!values.file) {
			issue("file", M.projectProtocolFileRequired);
		} else {
			const refused = fileRejection(values.file, PROTOCOL_FILE_RULES);
			if (refused) issue("file", refused === "size" ? M.projectProtocolFileSizeError : M.projectProtocolFileTypeError);
		}
	});

export type ProtocolFormValues = z.infer<typeof protocolSchema>;

/** An empty protocol of this kind — each opening of the dialog starts from it. */
export function emptyProtocolDraft(kind: DialogProtocolKind): ProtocolFormValues {
	return { withFile: kind === "upload", date: "", type: null, name: "", file: null, pendingFile: null };
}
