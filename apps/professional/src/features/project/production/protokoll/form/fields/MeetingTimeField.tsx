"use client";

import type { Control, FieldPathByValue, FieldValues } from "react-hook-form";

import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { TimePicker } from "@/components/ui/time-picker";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";

export interface MeetingTimeFieldProps<T extends FieldValues> {
	control: Control<T>;
	name: FieldPathByValue<T, string>;
	required?: boolean;
	translateError: (message: string) => string;
}

/**
 * A time of day, "15:00", beside its date. No label of its own: the fieldset's
 * legend names the moment, and the button reads its value — or "Välj tid".
 */
export function MeetingTimeField<T extends FieldValues>({ control, name, required, translateError }: MeetingTimeFieldProps<T>) {
	const t = useTranslate();

	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem className="grid gap-1">
					<FormControl>
						<TimePicker
							value={field.value ?? ""}
							onChange={field.onChange}
							placeholder={t(localizationConstants.chooseTime)}
							hourLabel={t(localizationConstants.projectProtocolHour)}
							minuteLabel={t(localizationConstants.projectProtocolMinute)}
							aria-required={required || undefined}
							className="border-slate-200 shadow-2xs"
						/>
					</FormControl>
					<FormMessage translate={translateError} />
				</FormItem>
			)}
		/>
	);
}

export default MeetingTimeField;
