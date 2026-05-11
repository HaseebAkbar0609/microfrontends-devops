import { ReactNode } from "react";

export interface HeroFormProps {
  title: string;
  description: string;
  button: string;
  buttonLink?: string; // ✅ optional link for the button
}
