"use client";

import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { TranslationKeys } from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";

interface MaterialNumberFieldProps<TValues extends FieldValues> {
	control: Control<TValues>;
	name: FieldPath<TValues>;
	label: TranslationKeys;
	placeholder?: TranslationKeys;
	/** Already translated text drawn inside the field's right edge, e.g. "kr". */
	suffix?: string;
	required?: boolean;
	disabled?: boolean;
}

/**
 * A decimal field that keeps what is typed as text ("82,50" or "82.50"), so it
 * is read by parseDecimalInput, not by the browser's locale-dependent number input.
 */
export function MaterialNumberField<TValues extends FieldValues>({
	control,
	name,
	label,
	placeholder,
	suffix,
	required,
	disabled,
}: MaterialNumberFieldProps<TValues>) {
	const t = useTranslate();

	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem className="grid gap-1">
					<FormLabel>
						{t(label)}
						{required && (
							<span className="text-red-500" aria-hidden>
								*
							</span>
						)}
					</FormLabel>
					<div className="relative">
						<FormControl>
							<Input
								{...field}
								value={field.value ?? ""}
								inputMode="decimal"
								autoComplete="off"
								placeholder={placeholder ? t(placeholder) : undefined}
								disabled={disabled}
								aria-required={required || undefined}
								className={suffix ? "pr-12" : undefined}
							/>
						</FormControl>
						{suffix && (
							<span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-slate-500" aria-hidden>
								{suffix}
							</span>
						)}
					</div>
					<FormMessage translate={t} />
				</FormItem>
			)}
		/>
	);
}
