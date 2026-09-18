"use client";

import type { Control, FieldPath, FieldValues } from "react-hook-form";

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
import type { TemperatureUnit } from "../../types";

const UNIT_OPTIONS = TEMPERATURE_UNITS.map((value) => ({ value, label: <Translate text={TEMPERATURE_UNIT_LABELS[value]} /> }));
const CONDITION_OPTIONS = WEATHER_CONDITIONS.map((value) => ({ value, label: <Translate text={WEATHER_CONDITION_LABELS[value]} /> }));

export interface WeatherReadingFieldsProps<T extends FieldValues> {
	control: Control<T>;
	/**
	 * Where the reading sits in the form: `""` on the day page, whose form is the
	 * reading itself, and `"weather."` in Ny dagbok, which carries it alongside
	 * the rest of the wizard.
	 */
	prefix?: string;
	/** The chosen unit, so the range message names the right bounds. */
	unit: TemperatureUnit;
	/**
	 * Plats and Datum, drawn disabled above the reading: where the project is and
	 * which day it belongs to. `null` leaves them out, as Ny dagbok's frame does —
	 * there the day is picked a card higher up.
	 */
	context: { city: string; date: string } | null;
}

/** The frame's reading fields: Plats and Datum as drawn, disabled; Temperatur with its unit; Vädret; two notes. */
export function WeatherReadingFields<T extends FieldValues>({ control, prefix = "", unit, context }: WeatherReadingFieldsProps<T>) {
	const t = useTranslate();
	const translateError = (message: string) => t(message as TranslationKeys, TEMPERATURE_RANGE[unit]);
	const field = (name: string) => `${prefix}${name}` as FieldPath<T>;

	return (
		<div className="grid gap-4 sm:grid-cols-2">
			{context && (
				<>
					<div className="grid gap-1">
						<Label htmlFor="diary-weather-location">
							<Translate text={localizationConstants.projectDiaryFieldLocation} />
						</Label>
						<Input id="diary-weather-location" value={context.city} disabled className="h-10 bg-slate-100" />
					</div>
					<div className="grid gap-1">
						<Label htmlFor="diary-weather-date">
							<Translate text={localizationConstants.projectDiaryDate} />
						</Label>
						<Input id="diary-weather-date" value={context.date} disabled className="h-10 bg-slate-100 tabular-nums" />
					</div>
				</>
			)}
			<div className="grid gap-1">
				{/* One visible label over the pair; each control keeps its own for a screen reader. */}
				<p aria-hidden className="text-sm font-medium text-slate-900">
					<Translate text={localizationConstants.projectDiaryFieldTemperature} />
					<span className="text-red-500">*</span>
				</p>
				<div className="grid grid-cols-[8.5rem_1fr] items-start gap-2">
					<FormSelect
						control={control}
						name={field("unit")}
						label={localizationConstants.projectDiaryFieldTemperatureUnit}
						labelClassName="sr-only"
						options={UNIT_OPTIONS}
					/>
					<FormInput
						control={control}
						name={field("temperature")}
						label={localizationConstants.projectDiaryFieldTemperature}
						labelClassName="sr-only"
						required
						inputProps={{ inputMode: "decimal", maxLength: 6 }}
						translateError={translateError}
					/>
				</div>
			</div>
			<FormSelect
				control={control}
				name={field("condition")}
				label={localizationConstants.projectDiaryFieldCondition}
				placeholder={localizationConstants.projectDiaryConditionPlaceholder}
				options={CONDITION_OPTIONS}
				translateError={translateError}
			/>
			<FormTextarea
				control={control}
				name={field("description")}
				label={localizationConstants.projectDiaryFieldDescription}
				rows={3}
				textareaProps={{ maxLength: DIARY_LIMITS.note }}
			/>
			<FormTextarea
				control={control}
				name={field("otherNote")}
				label={localizationConstants.projectDiaryFieldOtherNote}
				rows={3}
				textareaProps={{ maxLength: DIARY_LIMITS.note }}
			/>
		</div>
	);
}

export default WeatherReadingFields;
