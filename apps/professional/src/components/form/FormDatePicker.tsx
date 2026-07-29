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
}: FormDatePickerProps<TFieldValues, TName>) {
	const { t } = useTranslation();
	const [open, setOpen] = React.useState(false);

	const resolvedLabel =
		typeof label === "string" ? <Translate text={label} /> : label;

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

				return (
					<FormItem className={cn("grid gap-1", className)}>
						{label != null && (
							<FormLabel className={labelClassName}>
								{resolvedLabel}
							</FormLabel>
						)}
						<FormControl>
							<Popover open={open} onOpenChange={setOpen}>
								<PopoverTrigger asChild>
									<Button
										type="button"
										variant="outline"
										disabled={disabled}
										className={cn(
											"h-10 w-full justify-between text-left font-normal border-slate-200 bg-white px-3 shadow-2xs hover:bg-slate-50 focus:ring-1 focus:ring-slate-950 text-sm",
											!validDate && "text-slate-400",
											inputClassName,
										)}
									>
										<span>
											{validDate
												? format(validDate, "yyyy-MM-dd")
												: placeholder
													? t(placeholder)
													: "YYYY-MM-DD"}
										</span>
										<CalendarIcon className="h-4 w-4 text-slate-500 shrink-0" />
									</Button>
								</PopoverTrigger>
								<PopoverContent align="start" className="w-auto p-0 border-0 bg-transparent shadow-none">
									<Calendar
										mode="single"
										captionLayout="dropdown"
										startMonth={new Date(2015, 0)}
										endMonth={new Date(2035, 11)}
										selected={validDate}
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
