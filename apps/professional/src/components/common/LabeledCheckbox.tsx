"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Translate } from "@/utils/translation/translate";

type CheckboxVariant = "primary" | "secondary" | "danger";

interface LabeledCheckboxProps {
  label?: string;
  description?: React.ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
  labelClassName?: string;
  checkboxClassName?: string;
  variant?: CheckboxVariant;
}

const checkboxVariants = {
  primary:
    "data-[state=checked]:bg-primary data-[state=checked]:border-primary",
  secondary:
    "data-[state=checked]:bg-black data-[state=checked]:border-black",
  danger:
    "data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600",
};

export function LabeledCheckbox({
  label,
  description,
  checked,
  defaultChecked,
  disabled,
  onChange,
  className,
  labelClassName,
  checkboxClassName,
  variant = "primary",
}: LabeledCheckboxProps) {
  const [internalChecked, setInternalChecked] = useState(
    defaultChecked ?? false
  );

  const isControlled = checked !== undefined;
  const value = isControlled ? checked : internalChecked;

  const handleChange = (val: boolean) => {
    if (!isControlled) {
      setInternalChecked(val);
    }
    onChange?.(val);
  };

  return (
    <div className={cn("flex items-center space-x-3", className)}>
      <Checkbox
        checked={value}
        onCheckedChange={(val) => handleChange(!!val)}
        disabled={disabled}
        className={cn(
          checkboxVariants[variant],
          "border-black w-5 h-5",
          checkboxClassName
        )}
      />

      <div className="grid gap-1.5 leading-none">
        {label && (
          <label
            className={cn("cursor-pointer text-sm font-normal text-gray-500", labelClassName)}
            onClick={() => handleChange(!value)}
          >
            <Translate text={label} />
          </label>
        )}

        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  );
}