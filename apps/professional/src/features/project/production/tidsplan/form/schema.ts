import { z } from "zod";

import localizationConstants from "@/utils/translation/constants";
import { TIMEPLAN_AUTHORS } from "../timeplan.config";

/** The longest description the form accepts (rule 1: a named limit). */
export const TIMEPLAN_DESCRIPTION_MAX_LENGTH = 1000;

/**
 * The create and edit form's rules.
 *
 * Messages are translation KEYS, resolved by `translateError` at the field —
 * the convention the project create wizard's schema set. The frame stars
 * nothing; the dates are required because a plan without them has no timeline
 * to draw.
 */
export const timeplanDetailsSchema = z
	.object({
		kind: z.enum(["main", "sub"]),
		type: z.enum(["standard"]),
		startDate: z
			.string()
			.min(1, localizationConstants.planningValidationStartDateRequired),
		endDate: z
			.string()
			.min(1, localizationConstants.planningValidationEndDateRequired),
		createdById: z
			.string()
			.refine(
				(id) => TIMEPLAN_AUTHORS.some((author) => author.id === id),
				localizationConstants.projectTimeplanCreatedByRequired,
			),
		createdDate: z.string(),
		revisedDate: z.string(),
		description: z
			.string()
			.max(
				TIMEPLAN_DESCRIPTION_MAX_LENGTH,
				localizationConstants.protocolValMaxLength,
			),
	})
	.refine(
		(values) =>
			!values.startDate || !values.endDate || values.endDate >= values.startDate,
		{
			path: ["endDate"],
			message: localizationConstants.orderValidationDateRangeInvalid,
		},
	);

export type TimeplanDetailsValues = z.infer<typeof timeplanDetailsSchema>;
