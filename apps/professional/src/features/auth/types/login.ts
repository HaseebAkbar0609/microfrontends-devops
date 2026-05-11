import { loginSchema } from "../schemas";
import { z } from "zod";

export type LoginFormValues = z.infer<typeof loginSchema>;

export interface LoginPayloadData {
  token: string;
  user: unknown;
}

export interface LoginAPIPayload {
  email: string;
  password: string;
}
