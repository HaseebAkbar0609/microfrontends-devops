"use client";

import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Translate } from "@/utils/translation/translate";

type CheckboxVariant = "primary" | "secondary" | "danger";

export interface FormCheckboxProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  control: Control<TFieldValues>;
  name: TName;
  label?: React.ReactNode;
  description?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  variant?: CheckboxVariant;
  labelClassName?: string;
  checkboxClassName?: string;
  messageClassName?: string;
  translateError?: (message: string) => string;
}
const checkboxVariants = {
  primary:
    "data-[state=checked]:bg-primary data-[state=checked]:border-primary",
  secondary: "data-[state=checked]:bg-black data-[state=checked]:border-black",
  danger: "data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600",
};
export function FormCheckbox<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  control,
  name,
  label,
  description,
  disabled,
  className,
  variant = "primary",
  labelClassName,
  checkboxClassName,
  messageClassName,
  translateError,
}: FormCheckboxProps<TFieldValues, TName>) {
  const { t } = useTranslation();
  const resolvedLabel =
    typeof label === "string" ? <Translate text={label} /> : label;
  const resolvedDescription =
    typeof description === "string" ? t(description) : description;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("space-y-2", className)}>
          <div className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={disabled}
                className={cn(checkboxVariants[variant], checkboxClassName ,'border-black')}
              />
            </FormControl>
            <div className="grid gap-1.5 leading-none">
              {label != null && (
                <FormLabel className={cn("cursor-pointer", labelClassName)}>
                  {resolvedLabel}
                </FormLabel>
              )}
              {description != null && (
                <p className="text-muted-foreground text-sm">
                  {resolvedDescription}
                </p>
              )}
            </div>
          </div>
          <FormMessage
            className={messageClassName}
            translate={translateError ?? t}
          />
        </FormItem>
      )}
    />
  );
}
