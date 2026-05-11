"use client";

import { useState } from "react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Eye, EyeOff } from "lucide-react";

import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Translate } from "@/utils/translation/translate";

export interface FormInputProps<
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
	control: Control<TFieldValues>;
	name: TName;
	label?: React.ReactNode;
	placeholder?: string;
	type?: React.ComponentProps<"input">["type"] | "textarea";
	disabled?: boolean;
	rows?: number;
	cols?: number;
	className?: string;
	labelClassName?: string;
	inputClassName?: string;
	messageClassName?: string;
	translateError?: (message: string) => string;
	inputProps?: Omit<
		React.ComponentProps<"input"> & React.ComponentProps<"textarea">,
		"name" | "placeholder" | "type" | "disabled" | "className" | "ref"
	>;
}

export function FormInput<
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
	control,
	name,
	label,
	placeholder,
	type = "text",
	disabled,
	rows,
	cols,
	className,
	labelClassName,
	inputClassName,
	messageClassName,
	translateError,
	inputProps,
}: FormInputProps<TFieldValues, TName>) {
	const { t } = useTranslation();

	// 👇 state for password toggle
	const [showPassword, setShowPassword] = useState(false);

	const resolvedPlaceholder =
		placeholder != null ? t(placeholder) : undefined;

	const resolvedLabel =
		typeof label === "string" ? <Translate text={label} /> : label;

	// 👇 determine input type
	const inputType =
		type === "password" ? (showPassword ? "text" : "password") : type;

	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem className={cn("grid gap-2 ", className)}>
					{label != null && (
						<FormLabel className={labelClassName}>
							{resolvedLabel}
						</FormLabel>
					)}

					<FormControl>
						{type === "textarea" ? (
							<Textarea
								placeholder={resolvedPlaceholder}
								disabled={disabled}
								rows={rows}
								cols={cols}
								className={cn(
									// Override ui/textarea focus ring + shadow so the field matches plain inputs (no ring glow)
									"shadow-none ring-0 ring-offset-0",
									"focus-visible:ring-0 focus-visible:ring-offset-0",
									"aria-invalid:ring-0 dark:aria-invalid:ring-0",
									"border border-gray-300 focus-visible:border-gray-300 focus-visible:outline-none",
									inputClassName,
								)}
								{...field}
								{...(inputProps as React.ComponentProps<"textarea">)}
								ref={field.ref}
							/>
						) : (
							<div className="relative">
								<Input
									type={inputType}
									placeholder={resolvedPlaceholder}
									disabled={disabled}
									className={cn("pr-10 focus-visible:border-gray-300 focus-visible:outline-none", inputClassName)}
									{...field}
									{...inputProps}
								/>

								{/* 👇 Eye Icon */}
								{type === "password" && (
									<button
										type="button"
										onClick={() =>
											setShowPassword((prev) => !prev)
										}
										className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
									>
										{showPassword ? (
											<Eye size={24} />
										) : (
											<EyeOff size={24} />
										)}
									</button>
								)}
							</div>
						)}
					</FormControl>

					<FormMessage
						className={messageClassName}
						translate={translateError ?? t}
					/>
				</FormItem>
			)}
		/>
	);
}
