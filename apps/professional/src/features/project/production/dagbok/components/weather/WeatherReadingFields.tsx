"use client";

import { useWatch, type UseFormReturn } from "react-hook-form";

import { FormInput, FormSelect, FormTextarea } from "@/components/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import {
	DIARY_LIMITS,
	TEMPERATURE_RANGE,
	TEMPERATURE_UNIT_LABELS,
	TEMPERATURE_UNITS,
	WEATHER_CONDITION_LABELS,
	WEATHER_CONDITIONS,
} from "../../projectDiary.config";
import type { WeatherReadingDraft } from "../../form/weatherReadingSchema";

const UNIT_OPTIONS = TEMPERATURE_UNITS.map((value) => ({ value, label: <Translate text={TEMPERATURE_UNIT_LABELS[value]} /> }));
const CONDITION_OPTIONS = WEATHER_CONDITIONS.map((value) => ({ value, label: <Translate text={WEATHER_CONDITION_LABELS[value]} /> }));

export interface WeatherReadingFieldsProps {
	form: UseFormReturn<WeatherReadingDraft>;
	/** Plats: where the project is. Read only. */
	city: string;
	/** Datum: the diary's day. Read only — a reading belongs to its day. */
	date: string;
}

/** The frame's reading fields: Plats and Datum as drawn, disabled; Temperatur with its unit; Vädret; two notes. */
export function WeatherReadingFields({ form, city, date }: WeatherReadingFieldsProps) {
	const t = useTranslate();
	const unit = useWatch({ control: form.control, name: "unit" });
	const translateError = (message: string) => t(message as TranslationKeys, TEMPERATURE_RANGE[unit]);

	return (
		<div className="grid gap-4 sm:grid-cols-2">
			<div className="grid gap-1">
				<Label htmlFor="diary-weather-location">
					<Translate text={localizationConstants.projectDiaryFieldLocation} />
				</Label>
				<Input id="diary-weather-location" value={city} disabled className="h-10 bg-slate-100" />
			</div>
			<div className="grid gap-1">
				<Label htmlFor="diary-weather-date">
					<Translate text={localizationConstants.projectDiaryDate} />
				</Label>
				<Input id="diary-weather-date" value={date} disabled className="h-10 bg-slate-100 tabular-nums" />
			</div>
			<div className="grid gap-1">
				{/* One visible label over the pair; each control keeps its own for a screen reader. */}
				<p aria-hidden className="text-sm font-medium text-slate-900">
					<Translate text={localizationConstants.projectDiaryFieldTemperature} />
					<span className="text-red-500">*</span>
				</p>
				<div className="grid grid-cols-[8.5rem_1fr] items-start gap-2">
					<FormSelect
						control={form.control}
						name="unit"
						label={localizationConstants.projectDiaryFieldTemperatureUnit}
						labelClassName="sr-only"
						options={UNIT_OPTIONS}
					/>
					<FormInput
						control={form.control}
						name="temperature"
						label={localizationConstants.projectDiaryFieldTemperature}
						labelClassName="sr-only"
						required
						inputProps={{ inputMode: "decimal", maxLength: 6 }}
						translateError={translateError}
					/>
				</div>
			</div>
			<FormSelect
				control={form.control}
				name="condition"
				label={localizationConstants.projectDiaryFieldCondition}
				placeholder={localizationConstants.projectDiaryConditionPlaceholder}
				options={CONDITION_OPTIONS}
				translateError={translateError}
			/>
			<FormTextarea
				control={form.control}
				name="description"
				label={localizationConstants.projectDiaryFieldDescription}
				rows={3}
				textareaProps={{ maxLength: DIARY_LIMITS.note }}
			/>
			<FormTextarea
				control={form.control}
				name="otherNote"
				label={localizationConstants.projectDiaryFieldOtherNote}
				rows={3}
				textareaProps={{ maxLength: DIARY_LIMITS.note }}
			/>
		</div>
	);
}

export default WeatherReadingFields;
