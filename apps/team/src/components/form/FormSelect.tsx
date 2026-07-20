"use client";

import type { Control, FieldPath, FieldValues } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface FormSelectOption {
  value: string;
  label: React.ReactNode;
}

export interface FormSelectProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control: Control<TFieldValues>;
  name: TName;
  label?: React.ReactNode;
  placeholder?: string;
  options: FormSelectOption[];
  disabled?: boolean;
  /** Class applied to the FormItem (root wrapper) */
  className?: string;
  /** Class applied to the FormLabel */
  labelClassName?: string;
  /** Class applied to the SelectTrigger */
  triggerClassName?: string;
  /** Class applied to the SelectContent */
  contentClassName?: string;
  /** Class applied to the FormMessage (error text) */
  messageClassName?: string;
}

export function FormSelect<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  placeholder = "Select...",
  options,
  disabled,
  className,
  labelClassName,
  triggerClassName,
  contentClassName,
  messageClassName,
}: FormSelectProps<TFieldValues, TName>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("grid gap-2", className)}>
          {label && (
            <FormLabel className={labelClassName}>{label}</FormLabel>
          )}
          <Select
            onValueChange={field.onChange}
            value={field.value ?? ""}
            disabled={disabled}
          >
            <FormControl>
              <SelectTrigger className={triggerClassName}>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent className={contentClassName}>
              {options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage className={messageClassName} />
        </FormItem>
      )}
    />
  );
}
