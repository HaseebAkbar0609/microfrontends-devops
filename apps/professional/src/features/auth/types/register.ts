import { registerSchema } from "../schemas";
import { z } from "zod";

export type RegisterFormValues = z.infer<typeof registerSchema>;

export type RegisterCategoryValue =
  | "cleaning"
  | "construction"
  | "plumbing"
  | "other";

export type RegisterCityValue =
  string;

export type RegisterCountryValue = string;

