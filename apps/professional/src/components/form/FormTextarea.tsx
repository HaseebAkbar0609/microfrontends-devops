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

import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  const resolvedPlaceholder = placeholder != null ? t(placeholder) : undefined;
  const resolvedLabel = typeof label === "string" ? <Translate text={label} /> : label;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("grid gap-1", className)}>
          {label && (
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
          <FormMessage className={messageClassName} translate={t} />
        </FormItem>
      )}
    />
  );
}
