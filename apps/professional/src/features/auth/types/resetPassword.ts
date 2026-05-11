import { z } from "zod";

import { resetPasswordSchema } from "../schemas";

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
