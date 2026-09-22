import { z } from "zod";

import localizationConstants from "@/utils/translation/constants";
import { fileRejection } from "../../../shared/recordFiles";
import { PROTOCOL_FILE_RULES } from "../projectProtocol.config";
import { checkMoments, checkTexts, issuer, planShape, typeSchema, type Issue } from "./meetingRules";

const M = localizationConstants;

/** `File` checked at runtime, so the schema module is safe to load on the server. */
const fileSchema = z.custom<File>((value) => typeof File !== "undefined" && value instanceof File);

const { host: _host, title: _title, ...uploadPlanShape } = planShape;

/**
 * "Nytt protokoll" — Ladda upp. Typ, Rubrik, both moments and the file are
 * required; the rest as Nytt möte. Rubrik is held as `name`, the field the
 * file row fills from the file's name. `file` is what "Ladda upp" attached,
 * `pendingFile` one picked but not attached, which Spara refuses rather than
 * dropping silently; the file is re-checked by type and size, since `accept`
 * only filters the OS dialog. Every rule runs in one pass.
 */
export const uploadSchema = z
	.object({
		...uploadPlanShape,
		type: typeSchema,
		name: z.string(),
		file: fileSchema.nullable(),
		pendingFile: fileSchema.nullable(),
	})
	.superRefine((values, ctx) => {
		const issue = issuer(ctx);
		/* The shared text rules read and name Rubrik `title`; here it is `name`. */
		const onName: Issue = (path, message) => issue(path === "title" ? "name" : path, message);

		if (!values.type) issue("type", M.projectProtocolTypeRequired);
		checkTexts({ ...values, title: values.name }, onName, true);
		checkMoments(values, issue, true);

		if (values.pendingFile) {
			issue("file", M.projectProtocolFileNotUploaded);
		} else if (!values.file) {
			issue("file", M.projectProtocolFileRequired);
		} else {
			const refused = fileRejection(values.file, PROTOCOL_FILE_RULES);
			if (refused) issue("file", refused === "size" ? M.projectProtocolFileSizeError : M.projectProtocolFileTypeError);
		}
	});

export type UploadFormValues = z.infer<typeof uploadSchema>;
