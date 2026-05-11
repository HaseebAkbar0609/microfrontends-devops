import { z } from "zod";
import { otpSchema } from "../schemas";

export type OtpFormValues = z.infer<typeof otpSchema>;

