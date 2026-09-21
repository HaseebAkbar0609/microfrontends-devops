"use client";

import type { Control, FieldPathByValue, FieldValues } from "react-hook-form";

import { FormDatePicker } from "@/components/form";
import { cn } from "@/lib/utils";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { formatMeetingDate } from "../../meetingTime";
import { MeetingTimeField } from "./MeetingTimeField";

export interface MeetingMomentFieldsProps<T extends FieldValues> {
	control: Control<T>;
	dateName: FieldPathByValue<T, string>;
	timeName: FieldPathByValue<T, string>;
	/** Start tid or Slut tid. */
	legendKey: TranslationKeys;
	required?: boolean;
	/** The start's day, so the end's calendar cannot go before it. */
	minDate?: string;
	translateError: (message: string) => string;
	className?: string;
}

/**
 * Start tid or Slut tid, as the frames draw it: the day — "Tis 2024-12-17" —
 * beside the time. A fieldset, so the one label names both controls.
 */
export function MeetingMomentFields<T extends FieldValues>({
	control,
	dateName,
	timeName,
	legendKey,
	required,
	minDate,
	translateError,
	className,
}: MeetingMomentFieldsProps<T>) {
	const t = useTranslate();

	return (
		<fieldset className={cn("min-w-0", className)}>
			<legend className="mb-1 flex items-center gap-2 text-sm font-medium text-slate-900">
				<Translate text={legendKey} />
				{required && (
					<span className="text-red-500" aria-hidden>
						*
					</span>
				)}
			</legend>
			<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
				<FormDatePicker
					control={control}
					name={dateName}
					placeholder={localizationConstants.pickDatePlaceholder}
					iconPosition="start"
					required={required}
					minDate={minDate}
					formatValue={(isoDate) => formatMeetingDate(isoDate, t)}
					translateError={translateError}
				/>
				<MeetingTimeField control={control} name={timeName} required={required} translateError={translateError} />
			</div>
		</fieldset>
	);
}

export default MeetingMomentFields;
