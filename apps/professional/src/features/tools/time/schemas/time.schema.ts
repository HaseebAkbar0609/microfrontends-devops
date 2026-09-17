import { z } from "zod";
import localizationConstants from "@/utils/translation/constants";
import { toMinutes } from "../utils/time";

const required = z
	.string()
	.trim()
	.min(1, { message: localizationConstants.protocolValRequired });

export const timeRowSchema = z
	.object({
		date: z.string().date(localizationConstants.protocolValRequired),
		start: required.regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/, localizationConstants.protocolValRequired),
		end: required.regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/, localizationConstants.protocolValRequired),
		type: z.enum(["order", "project", "overhead"]),
		refNr: z.string(),
		ata: z.boolean(),
		ataNr: z.string(),
		travelUnit: z.enum(["time", "km"]),
		travelValue: z.string().trim().max(20).refine(value => value === "" || (Number.isFinite(Number(value)) && Number(value) >= 0 && Number(value) <= 100000), localizationConstants.protocolValRequired),
		allowance: z.boolean(),
		title: z.string().trim().max(500),
		description: z.string().trim().max(20000),
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
