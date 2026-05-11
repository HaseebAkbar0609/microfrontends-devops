import { z } from "zod";
import { otpSchema } from "../schemas/otp.schema";

export type OtpFormValues = z.infer<typeof otpSchema>;
