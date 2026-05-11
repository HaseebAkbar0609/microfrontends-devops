import { z } from "zod";
import { forgotPasswordSchema } from "../schemas";

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;