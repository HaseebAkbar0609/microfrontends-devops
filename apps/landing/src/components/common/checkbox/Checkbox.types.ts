import { ReactNode } from "react";

export interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string | ReactNode;
  id?: string;
  name?: string;
  required?: boolean;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  labelClassName?: string;
}
