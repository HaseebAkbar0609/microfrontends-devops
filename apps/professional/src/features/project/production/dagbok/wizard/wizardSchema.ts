import type { FieldPath } from "react-hook-form";
import { z } from "zod";

import { generateTempId } from "@/lib/tempId";
import localizationConstants from "@/utils/translation/constants";
import { isIsoDate } from "../diaryDates";
import { parseTemperature, toWeatherReading, type WeatherReadingDraft } from "../form/weatherReadingSchema";
import { DIARY_LIMITS, TEMPERATURE_RANGE, TEMPERATURE_UNITS, WEATHER_CONDITIONS } from "../projectDiary.config";
import type { DiaryContent, DeviationRow, MachineRow, WorkRow, WorkforceRow } from "../types";

const M = localizationConstants;

/*
 * Rows arrive already validated by each card's own fields, so here they only
 * need to be arrays within the row limit.
 */
const rows = <T>() => z.array(z.custom<T>()).max(DIARY_LIMITS.rows);

/**
 * "Ny dagbok", both steps in one form so ← Tillbaka never loses what step 2
 * holds. The weather is optional — a day may be logged without a reading — but
 * Temperatur and Vädret belong together, and a temperature is range-checked
 * for its unit.
 */
export const diaryWizardSchema = z
	.object({
		date: z.string().min(1, M.projectDiaryDateRequired),
		createdBy: z.string().trim().min(1, M.projectDiaryCreatedByRequired),
		weather: z.object({
			temperature: z.string(),
			unit: z.enum(TEMPERATURE_UNITS),
			condition: z.union([z.enum(WEATHER_CONDITIONS), z.literal("")]),
			description: z.string().trim().max(DIARY_LIMITS.note, M.projectDiaryTooLong),
			otherNote: z.string().trim().max(DIARY_LIMITS.note, M.projectDiaryTooLong),
		}),
		workforce: rows<WorkforceRow>(),
		works: rows<WorkRow>(),
		machines: rows<MachineRow>(),
		deviations: rows<DeviationRow>(),
	})
	.superRefine((values, ctx) => {
		const issue = (path: (string | number)[], message: string) => ctx.addIssue({ code: z.ZodIssueCode.custom, path, message });

		if (values.date && !isIsoDate(values.date)) issue(["date"], M.projectDiaryDateRequired);

		const typed = values.weather.temperature.trim();
		if (typed) {
			const value = parseTemperature(values.weather.temperature);
			const { min, max } = TEMPERATURE_RANGE[values.weather.unit];
			if (value === null || value < min || value > max) issue(["weather", "temperature"], M.projectDiaryTemperatureInvalid);
			if (!values.weather.condition) issue(["weather", "condition"], M.projectDiaryWeatherNeedsCondition);
		} else if (values.weather.condition) {
			issue(["weather", "temperature"], M.projectDiaryWeatherNeedsTemperature);
		}
	});

export type DiaryWizardValues = z.infer<typeof diaryWizardSchema>;

/** What Nästa checks before it leaves step 1. */
export const WIZARD_STEP_ONE_PATHS: FieldPath<DiaryWizardValues>[] = [
	"date",
	"createdBy",
	"weather.temperature",
	"weather.condition",
	"weather.description",
	"weather.otherNote",
];

export function emptyWizardValues(date: string, createdBy: string): DiaryWizardValues {
	return {
		date,
		createdBy,
		weather: { temperature: "", unit: "celsius", condition: "", description: "", otherNote: "" },
		workforce: [],
		works: [],
		machines: [],
		deviations: [],
	};
}

/** The wizard's values as a day's content. A reading is kept only when one was entered. */
export function toDiaryContent(values: DiaryWizardValues): DiaryContent {
	const typed = values.weather.temperature.trim();
	return {
		weather: typed ? [toWeatherReading(generateTempId(), values.weather as WeatherReadingDraft)] : [],
		workforce: values.workforce,
		works: values.works,
		machines: values.machines,
		deviations: values.deviations,
		generalNotes: "",
		selfControlNote: "",
	};
}
