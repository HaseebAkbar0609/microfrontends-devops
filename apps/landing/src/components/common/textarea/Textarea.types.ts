import { ReactNode } from "react";

export interface TextareaProps {
  value: string;
  onChange: (data: string) => void;
  label?: string;
  id?: string;
  name?: string;
  required?: boolean;
  placeholder?: string;
  size?: "sm" | "md" | "lg";
  rows?: number;
  className?: string;
}
