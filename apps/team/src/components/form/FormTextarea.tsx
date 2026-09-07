"use client";

import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { useTranslation } from "react-i18next";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Translate } from "@/utils/translation/translate";

export interface FormTextareaProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control: Control<TFieldValues>;
  name: TName;
  label?: React.ReactNode;
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
  placeholder,
  disabled,
  rows,
  className,
  labelClassName,
  textareaClassName,
  messageClassName,
  textareaProps,
}: FormTextareaProps<TFieldValues, TName>) {
  // Matches FormInput and FormSelect: a string label or placeholder is
  // treated as a translation key, a ReactNode label is rendered as given.
  const { t } = useTranslation();
  const resolvedLabel =
    typeof label === "string" ? <Translate text={label} /> : label;
  const resolvedPlaceholder = placeholder != null ? t(placeholder) : undefined;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("grid gap-2", className)}>
          {label != null && (
            <FormLabel className={labelClassName}>{resolvedLabel}</FormLabel>
          )}
          <FormControl>
            <Textarea
              placeholder={resolvedPlaceholder}
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
