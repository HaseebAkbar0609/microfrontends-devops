"use client";

import * as React from "react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Calendar as CalendarIcon } from "lucide-react";
import { format, parseISO, isValid } from "date-fns";

import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Translate } from "@/utils/translation/translate";

export interface FormDatePickerProps<
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
	control: Control<TFieldValues>;
	name: TName;
	label?: React.ReactNode;
	placeholder?: string;
	disabled?: boolean;
	className?: string;
	labelClassName?: string;
	inputClassName?: string;
	messageClassName?: string;
	translateError?: (message: string) => string;
	/**
	 * Earliest selectable day, as `yyyy-MM-dd`. Use it for a "to" field so the
	 * range cannot be inverted in the picker — the value stays typeable through
	 * the form, so pair it with a schema rule rather than relying on it alone.
	 */
	minDate?: string;
	/**
	 * Latest selectable day, as `yyyy-MM-dd` (e.g. today, for a date that cannot
	 * be in the future). Like `minDate`, pair it with a schema rule.
	 */
	maxDate?: string;
	/**
	 * Which side of the value the calendar icon sits. Defaults to `"end"`, as
	 * every existing form draws it; the Tidsplan frames draw it at the start.
	 */
	iconPosition?: "start" | "end";
	/**
	 * Marks the field mandatory: draws the asterisk after the label and sets
	 * `aria-required` on the trigger, as `FormInput` does. The asterisk alone is
	 * decoration a screen reader never hears.
	 */
	required?: boolean;
	/**
	 * How a chosen day reads on the trigger. Defaults to `yyyy-MM-dd`; the
	 * protocol frames prefix the weekday ("Tis 2024-12-17"). The field's value
	 * stays `yyyy-MM-dd` either way.
	 */
	formatValue?: (isoDate: string) => string;
}

export function FormDatePicker<
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
	control,
	name,
	label,
	placeholder,
	disabled,
	className,
	labelClassName,
	inputClassName,
	messageClassName,
	translateError,
	minDate,
	maxDate,
	iconPosition = "end",
	required = false,
	formatValue,
}: FormDatePickerProps<TFieldValues, TName>) {
	const { t } = useTranslation();
	const [open, setOpen] = React.useState(false);

	const resolvedLabel =
		typeof label === "string" ? <Translate text={label} /> : label;

	const parseDay = (value?: string) => {
		const day = value && value.trim().length > 0 ? parseISO(value) : undefined;
		return day && isValid(day) ? day : undefined;
	};
	const validMinimum = parseDay(minDate);
	const validMaximum = parseDay(maxDate);

	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => {
				const rawVal = field.value;
				let selectedDate: Date | undefined;

				if (typeof rawVal === "string" && rawVal.trim().length > 0) {
					selectedDate = parseISO(rawVal);
				} else if (rawVal && typeof rawVal === "object" && "getTime" in rawVal) {
					selectedDate = rawVal as Date;
				}

				const validDate =
					selectedDate && isValid(selectedDate) ? selectedDate : undefined;
				const shownDate = validDate ? format(validDate, "yyyy-MM-dd") : "";

				return (
					<FormItem className={cn("grid gap-1", className)}>
						{label != null && (
							<FormLabel className={labelClassName}>
								{resolvedLabel}
								{required && (
									<span className="text-red-500" aria-hidden>
										*
									</span>
								)}
							</FormLabel>
						)}
						<FormControl>
							<Popover open={open} onOpenChange={setOpen}>
								<PopoverTrigger asChild>
									<Button
										type="button"
										variant="outline"
										disabled={disabled}
										aria-required={required || undefined}
										className={cn(
											"h-10 w-full justify-between text-left font-normal border-slate-200 bg-white px-3 shadow-2xs hover:bg-slate-50 focus:ring-1 focus:ring-slate-950 text-sm",
											iconPosition === "start" && "justify-start gap-2",
											!validDate && "text-slate-400",
											inputClassName,
										)}
									>
										{iconPosition === "start" && (
											<CalendarIcon className="h-4 w-4 text-slate-500 shrink-0" />
										)}
										<span className={cn(iconPosition === "start" && "flex-1")}>
											{shownDate
												? formatValue
													? formatValue(shownDate)
													: shownDate
												: placeholder
													? t(placeholder)
													: "YYYY-MM-DD"}
										</span>
										{iconPosition === "end" && (
											<CalendarIcon className="h-4 w-4 text-slate-500 shrink-0" />
										)}
									</Button>
								</PopoverTrigger>
								<PopoverContent align="start" className="w-auto p-0 border-0 bg-transparent shadow-none">
									<Calendar
										mode="single"
										captionLayout="dropdown"
										startMonth={new Date(2015, 0)}
										endMonth={new Date(2035, 11)}
										selected={validDate}
										disabled={
											validMinimum || validMaximum
												? (date: Date) =>
														(validMinimum !== undefined && date < validMinimum) ||
														(validMaximum !== undefined && date > validMaximum)
												: undefined
										}
										onSelect={(date: Date | undefined) => {
											if (date) {
												field.onChange(format(date, "yyyy-MM-dd"));
											} else {
												field.onChange("");
											}
											setOpen(false);
										}}
									/>
								</PopoverContent>
							</Popover>
						</FormControl>
						<FormMessage
							className={messageClassName}
							translate={translateError ?? t}
						/>
					</FormItem>
				);
			}}
		/>
	);
}
