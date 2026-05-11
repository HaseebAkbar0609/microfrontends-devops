"use client";

import type { Control, FieldPath, FieldValues } from "react-hook-form";

import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
type CheckboxVariant = "primary" | "secondary" | "danger";
export interface FormCheckboxProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control: Control<TFieldValues>;
  name: TName;
  label?: React.ReactNode;
  description?: React.ReactNode;
  disabled?: boolean;
  /** Class applied to the FormItem (root wrapper) */
  className?: string;
  variant?: CheckboxVariant;
  /** Class applied to the FormLabel */
  labelClassName?: string;
  /** Class applied to the Checkbox */
  checkboxClassName?: string;
  /** Class applied to the FormMessage (error text) */
  messageClassName?: string;
}
const checkboxVariants = {
  primary: "data-[state=checked]:bg-primary data-[state=checked]:border-primary",
  secondary: "data-[state=checked]:bg-black data-[state=checked]:border-black",
  danger: "data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600",
};
export function FormCheckbox<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
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
}: FormCheckboxProps<TFieldValues, TName>) {
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
                className={cn(checkboxVariants[variant], checkboxClassName)}
              />
            </FormControl>
            <div className="grid gap-1.5 leading-none">
              {label && (
                <FormLabel className={cn("cursor-pointer", labelClassName)}>
                  {label}
                </FormLabel>
              )}
              {description && (
                <p className="text-muted-foreground text-sm">{description}</p>
              )}
            </div>
          </div>
          <FormMessage className={messageClassName} />
        </FormItem>
      )}
    />
  );
}
