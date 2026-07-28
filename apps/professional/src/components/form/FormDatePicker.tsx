"use client";

import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Calendar as CalendarIcon } from "lucide-react";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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
}: FormDatePickerProps<TFieldValues, TName>) {
	const { t } = useTranslation();

	const resolvedLabel =
		typeof label === "string" ? <Translate text={label} /> : label;

	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem className={cn("grid gap-1", className)}>
					{label != null && (
						<FormLabel className={labelClassName}>
							{resolvedLabel}
						</FormLabel>
					)}
					<FormControl>
						<div className="relative flex items-center">
							<Input
								type="date"
								disabled={disabled}
								placeholder={placeholder ? t(placeholder) : undefined}
								className={cn(
									"h-10 w-full pl-3 pr-10 text-sm border-gray-300 rounded-md shadow-2xs focus-visible:ring-1 focus-visible:ring-slate-950 focus-visible:border-slate-950 transition-colors [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer",
									inputClassName,
								)}
								{...field}
								value={field.value ?? ""}
							/>
							<CalendarIcon className="pointer-events-none absolute right-3 h-4 w-4 text-slate-500" />
						</div>
					</FormControl>
					<FormMessage className={messageClassName} />
				</FormItem>
			)}
		/>
	);
}
