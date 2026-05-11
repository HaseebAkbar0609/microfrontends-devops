import { loginSchema } from "../schemas";
import { z } from "zod";

export type LoginFormValues = z.infer<typeof loginSchema>;

export interface LoginPayloadData {
  accessToken?: string;
  access_token?: string;
  token?: string;
  refreshToken?: string;
  refresh_token?: string;
  user?: unknown;
}

export interface LoginAPIPayload {
  email: string;
  password: string;
}
