"use client";

import type { Control, FieldPath, FieldValues } from "react-hook-form";
import type { LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

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
import { Translate } from "@/utils/translation/translate";

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
  leadingIcon?: LucideIcon;
}

export function FormSelect<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  placeholder,
  options,
  disabled,
  className,
  labelClassName,
  triggerClassName,
  contentClassName,
  messageClassName,
  leadingIcon: LeadingIcon,
}: FormSelectProps<TFieldValues, TName>) {
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
          {label != null && (
            <FormLabel className={labelClassName}>{resolvedLabel}</FormLabel>
          )}
          <Select
            onValueChange={field.onChange}
            value={field.value ?? ""}
            disabled={disabled}
          >
            <FormControl>
              <SelectTrigger className={cn("gap-3", triggerClassName)}>
                <span className="flex items-center gap-2">
                  {LeadingIcon && (
                    <LeadingIcon className="h-4 w-4 shrink-0 text-slate-700" />
                  )}
                  <SelectValue placeholder={resolvedPlaceholder} />
                </span>
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
          <FormMessage className={messageClassName} translate={t} />
        </FormItem>
      )}
    />
  );
}
