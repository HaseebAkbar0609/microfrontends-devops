"use client";

import type { Control, FieldPath, FieldValues } from "react-hook-form";

import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { withOptionalSuffix } from "./OptionalLabelSuffix";

export interface FormTextareaProps<
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
	control: Control<TFieldValues>;
	name: TName;
	label?: React.ReactNode;
	/** Appends " (Valfritt)" / " (Optional)" to the label. */
	optional?: boolean;
	placeholder?: string;
	disabled?: boolean;
	rows?: number;
	/** Class applied to the FormItem (root wrapper) */
	className?: string;
	/** Class applied to the FormLabel */
	labelClassName?: string;
	/** Class applied to the Textarea */
	textareaClassName?: string;
	/** Class applied to the FormMessage (error text) */
	messageClassName?: string;
	/** Additional textarea props */
	textareaProps?: Omit<
		React.ComponentProps<"textarea">,
		"name" | "placeholder" | "disabled" | "rows" | "className"
	>;
}

export function FormTextarea<
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
	control,
	name,
	label,
	optional,
	placeholder,
	disabled,
	rows,
	className,
	labelClassName,
	textareaClassName,
	messageClassName,
	textareaProps,
}: FormTextareaProps<TFieldValues, TName>) {
	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem
					className={cn(
						"grid gap-2 focus-visible:border-gray-300 focus-visible:outline-none",
						className,
					)}
				>
					{label && (
						<FormLabel className={labelClassName}>
							{withOptionalSuffix(label, optional)}
						</FormLabel>
					)}
					<FormControl>
						<Textarea
							placeholder={placeholder}
							disabled={disabled}
							rows={rows}
							className={textareaClassName}
							{...field}
							{...textareaProps}
						/>
					</FormControl>
					<FormMessage className={messageClassName} />
				</FormItem>
			)}
		/>
	);
}
