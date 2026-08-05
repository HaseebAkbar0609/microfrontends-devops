import { z } from "zod";
import localizationConstants from "@/utils/translation/constants";
import { toMinutes } from "../utils/time";

const required = z
	.string()
	.min(1, { message: localizationConstants.protocolValRequired });

export const timeRowSchema = z
	.object({
		date: required,
		start: required,
		end: required,
		type: z.enum(["order", "project", "overhead"]),
		refNr: z.string(),
		ata: z.boolean(),
		ataNr: z.string(),
		travelUnit: z.enum(["time", "km"]),
		travelValue: z.string(),
		allowance: z.boolean(),
		title: z.string(),
		description: z.string(),
	})
	.refine((values) => toMinutes(values.end) > toMinutes(values.start), {
		message: localizationConstants.protocolValRequired,
		path: ["end"],
	})
	.refine(
		(values) => values.type === "overhead" || values.refNr.length > 0,
		{
			message: localizationConstants.protocolValRequired,
			path: ["refNr"],
		},
	)
	.refine((values) => !values.ata || values.ataNr.length > 0, {
		message: localizationConstants.protocolValRequired,
		path: ["ataNr"],
	});

export type TimeRowValues = z.infer<typeof timeRowSchema>;
