import { z } from "zod";

import localizationConstants from "@/utils/translation/constants";

export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(1, localizationConstants.validationRegisterPasswordRequired),
    confirmPassword: z
      .string()
      .min(1, localizationConstants.validationRegisterConfirmPasswordRequired),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: localizationConstants.validationRegisterPasswordMismatch,
    path: ["confirmPassword"],
  });
