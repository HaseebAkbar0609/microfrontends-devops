import { z } from "zod";

import localizationConstants from "@/utils/translation/constants";
import { PROTOCOL_NAME_MAX_LENGTH, PROTOCOL_TYPES } from "../projectProtocol.config";

const M = localizationConstants;

/**
 * The Action protocol's short dialog: Datum, Typ and Benämning, all required.
 * Messages are translation keys; every rule runs in one pass, so an empty Spara
 * names each missing field at once.
 */
export const protocolSchema = z
	.object({
		date: z.string(),
		type: z.enum(PROTOCOL_TYPES).nullable(),
		name: z.string().trim(),
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
	});

export type ProtocolFormValues = z.infer<typeof protocolSchema>;

/** An empty Action protocol — each opening of the dialog starts from it. */
export function emptyProtocolDraft(): ProtocolFormValues {
	return { date: "", type: null, name: "" };
}
