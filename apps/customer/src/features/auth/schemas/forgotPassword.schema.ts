import { z } from "zod";
import localizationConstants from "@/utils/translation/constants";

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, localizationConstants.validationForgotPasswordEmailRequired),
});
