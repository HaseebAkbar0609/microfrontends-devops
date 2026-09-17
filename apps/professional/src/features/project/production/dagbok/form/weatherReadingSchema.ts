import { z } from "zod";

import localizationConstants from "@/utils/translation/constants";
import { DIARY_LIMITS, TEMPERATURE_RANGE, TEMPERATURE_UNITS, WEATHER_CONDITIONS } from "../projectDiary.config";
import type { WeatherCondition, WeatherReading } from "../types";

const M = localizationConstants;

/** "−3", "-3", "21,5" → a number; `null` for anything else. */
export function parseTemperature(value: string): number | null {
	const normalised = value.trim().replace("−", "-").replace(",", ".");
	return /^-?\d{1,3}(\.\d)?$/.test(normalised) ? Number(normalised) : null;
}

/**
 * "Det lokala vädret": one reading, added to the day with "Lägg till ny".
 * Temperatur must be a number within an outdoor range for its unit; Vädret is
 * required. Messages are translation keys; the range message takes `min` and
 * `max`, which the field supplies from `TEMPERATURE_RANGE`.
 */
export const weatherReadingSchema = z
	.object({
		temperature: z.string(),
		unit: z.enum(TEMPERATURE_UNITS),
		condition: z.union([z.enum(WEATHER_CONDITIONS), z.literal("")]),
		description: z.string().trim().max(DIARY_LIMITS.note, M.projectDiaryTooLong),
		otherNote: z.string().trim().max(DIARY_LIMITS.note, M.projectDiaryTooLong),
	})
	.superRefine((reading, ctx) => {
		const value = parseTemperature(reading.temperature);
		const { min, max } = TEMPERATURE_RANGE[reading.unit];
		if (value === null || value < min || value > max) {
			ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["temperature"], message: M.projectDiaryTemperatureInvalid });
		}
		if (!reading.condition) {
			ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["condition"], message: M.projectDiaryConditionRequired });
		}
	});

export type WeatherReadingDraft = z.infer<typeof weatherReadingSchema>;

export const EMPTY_WEATHER_READING: WeatherReadingDraft = {
	temperature: "",
	unit: "celsius",
	condition: "",
	description: "",
	otherNote: "",
};

/** A validated draft as a stored reading. */
export function toWeatherReading(id: string, draft: WeatherReadingDraft): WeatherReading {
	return {
		id,
		temperature: parseTemperature(draft.temperature) ?? 0,
		unit: draft.unit,
		condition: draft.condition as WeatherCondition,
		description: draft.description.trim(),
		otherNote: draft.otherNote.trim(),
	};
}
