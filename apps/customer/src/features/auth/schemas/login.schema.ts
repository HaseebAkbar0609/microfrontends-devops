import { z } from "zod";

import localizationConstants from "@/utils/translation/constants";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, localizationConstants.validationLoginEmailRequired),
  password: z
    .string()
    .min(1, localizationConstants.validationLoginPasswordRequired),
});

