"use client";

import type { Control, FieldPath, FieldValues } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

export interface FormSwitchProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control: Control<TFieldValues>;
  name: TName;
  label?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  labelClassName?: string;
  switchClassName?: string;
  messageClassName?: string;
  yesLabel?: React.ReactNode;
  noLabel?: React.ReactNode;
}

export function FormSwitch<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  disabled,
  className,
  labelClassName,
  switchClassName,
  messageClassName,
  yesLabel = <Translate text={localizationConstants.yesLabel} />,
  noLabel = <Translate text={localizationConstants.noLabel} />,
}: FormSwitchProps<TFieldValues, TName>) {
  const resolvedLabel =
    typeof label === "string" ? <Translate text={label} /> : label;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("flex flex-col gap-1", className)}>
          {label && (
            <FormLabel className={cn("text-sm font-medium text-slate-700", labelClassName)}>
              {resolvedLabel}
            </FormLabel>
          )}
          <div className="flex items-center gap-2">
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={disabled}
                className={cn(
                  "data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-slate-300",
                  switchClassName
                )}
              />
            </FormControl>
            <span className="text-sm text-slate-600">
              {field.value ? yesLabel : noLabel}
            </span>
          </div>
          <FormMessage className={messageClassName} />
        </FormItem>
      )}
    />
  );
}
