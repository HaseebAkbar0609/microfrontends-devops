import { ReactNode } from "react";

export interface InputProps {
  value: string;
  onChange: (data: string) => void;
  label?: string;
  id?: string;
  name?: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  icon?: ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
}
