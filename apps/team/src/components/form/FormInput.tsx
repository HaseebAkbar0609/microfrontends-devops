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
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Translate } from "@/utils/translation/translate";

export interface FormInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  control: Control<TFieldValues>;
  name: TName;
  /** Label: pass a translation key (string) and it is rendered via <Translate />, or pass custom ReactNode. */
  label?: React.ReactNode;
  /** Placeholder: pass a translation key (string); it is translated via i18n. */
  placeholder?: string;
  type?: React.ComponentProps<"input">["type"];
  disabled?: boolean;
  /** Class applied to the FormItem (root wrapper) */
  className?: string;
  /** Class applied to the FormLabel */
  labelClassName?: string;
  /** Class applied to the Input */
  inputClassName?: string;
  /** Class applied to the FormMessage (error text) */
  messageClassName?: string;
  /** If provided, error messages are translated. When omitted, FormInput uses useTranslation().t so validation messages update when language changes. */
  translateError?: (message: string) => string;
  /** Additional input props */
  inputProps?: Omit<
    React.ComponentProps<"input">,
    "name" | "placeholder" | "type" | "disabled" | "className"
  >;
}

export function FormInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  control,
  name,
  label,
  placeholder,
  type = "text",
  disabled,
  className,
  labelClassName,
  inputClassName,
  messageClassName,
  translateError,
  inputProps,
}: FormInputProps<TFieldValues, TName>) {
  const { t } = useTranslation();
  const resolvedPlaceholder = placeholder != null ? t(placeholder) : undefined;
  const resolvedLabel =
    typeof label === "string" ? <Translate text={label} /> : label;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("grid gap-2", className)}>
          {label != null && <FormLabel className={labelClassName}>{resolvedLabel}</FormLabel>}
          <FormControl>
            <Input
              type={type}
              placeholder={resolvedPlaceholder}
              disabled={disabled}
              className={inputClassName}
              {...field}
              {...inputProps}
            />
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
