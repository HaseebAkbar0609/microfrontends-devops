import { z } from "zod";
import localizationConstants from "@/utils/translation/constants";

export const otpSchema = z.object({
  otp: z
    .string()
    .min(1, localizationConstants.validationOtpRequired)
    .regex(/^\d{6}$/, localizationConstants.validationOtpInvalid),
});

