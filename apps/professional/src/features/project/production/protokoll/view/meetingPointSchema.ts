import { z } from "zod";

import localizationConstants from "@/utils/translation/constants";
import { PROTOCOL_FIELD_MAX_LENGTH, PROTOCOL_NOTE_MAX_LENGTH, PROTOCOL_POINT_NR_MAX_LENGTH } from "../projectProtocol.config";

const M = localizationConstants;

/** A meeting point. Nr and Rubrik are required; messages are translation keys. */
export const pointSchema = z
	.object({
		nr: z.string(),
		responsible: z.string(),
		title: z.string(),
		description: z.string(),
		decision: z.string(),
	})
	.superRefine((values, ctx) => {
		const issue = (path: string, message: string) => ctx.addIssue({ code: z.ZodIssueCode.custom, path: [path], message });

		if (!values.nr.trim()) issue("nr", M.projectProtocolNumberRequired);
		else if (values.nr.trim().length > PROTOCOL_POINT_NR_MAX_LENGTH) issue("nr", M.projectProtocolTooLong);
		if (!values.title.trim()) issue("title", M.projectProtocolTitleRequired);
		else if (values.title.trim().length > PROTOCOL_FIELD_MAX_LENGTH) issue("title", M.projectProtocolTooLong);
		if (values.description.trim().length > PROTOCOL_NOTE_MAX_LENGTH) issue("description", M.projectProtocolTooLong);
		if (values.decision.trim().length > PROTOCOL_NOTE_MAX_LENGTH) issue("decision", M.projectProtocolTooLong);
	});

export type PointValues = z.infer<typeof pointSchema>;
