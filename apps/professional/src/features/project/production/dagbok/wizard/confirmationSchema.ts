import { z } from "zod";

import localizationConstants from "@/utils/translation/constants";
import { fileRejection } from "../../../shared/recordFiles";
import { DIARY_LIMITS, DIARY_SIGNER_ROLES, SIGNATURE_FILE_RULES } from "../projectDiary.config";
import type { DiarySignerRole } from "../types";

const M = localizationConstants;

/** `File` checked at runtime, so the schema module is safe to load on the server. */
const fileSchema = z.custom<File>((value) => typeof File !== "undefined" && value instanceof File);

/**
 * The Bekräftelse modal: who signs, the name that goes on the line, and the
 * signature file.
 *
 * The file is optional. There is no file store behind it — only its name is
 * kept — so a diary is never blocked on one. It is re-checked here by type and
 * size, since `accept` only filters the OS dialog.
 */
export const confirmationSchema = z.object({
	role: z.enum(DIARY_SIGNER_ROLES),
	clarification: z
		.string()
		.trim()
		.min(1, M.projectDiaryClarificationRequired)
		.max(DIARY_LIMITS.text, M.projectDiaryTooLong),
	file: fileSchema.nullable().superRefine((file, ctx) => {
		if (!file) return;
		const refused = fileRejection(file, SIGNATURE_FILE_RULES);
		if (refused) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: refused === "size" ? M.projectDiaryFileSizeError : M.projectDiaryFileTypeError,
			});
		}
	}),
});

export type ConfirmationValues = z.infer<typeof confirmationSchema>;

export function emptyConfirmation(role: DiarySignerRole, clarification: string): ConfirmationValues {
	return { role, clarification, file: null };
}
