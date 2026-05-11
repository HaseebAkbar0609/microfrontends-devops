import { ReactNode, ButtonHTMLAttributes } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  type?: "button" | "reset" | "submit";
  size?: "sm" | "md" | "lg";
  round?: "default" | "full";
  className?: string;
}
