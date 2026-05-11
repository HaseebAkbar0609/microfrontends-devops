import { z } from "zod";
import { resetPasswordSchema } from "../schemas/resetPassword.schema";

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
