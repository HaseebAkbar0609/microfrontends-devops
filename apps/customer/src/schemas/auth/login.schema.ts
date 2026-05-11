import { z } from "zod";

import localizationConstants from "@/utils/translation/constants";

/**
 * Login schema uses translation keys as error messages so that when errors
 * are displayed, they can be translated at render time and update when language changes.
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, localizationConstants.validationLoginEmailRequired),
  password: z
    .string()
    .min(1, localizationConstants.validationLoginPasswordRequired),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
