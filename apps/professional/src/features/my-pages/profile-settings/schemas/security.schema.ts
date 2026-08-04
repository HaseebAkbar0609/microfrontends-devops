import { z } from "zod";

export const securitySchema = z.object({
	twoFactorEnabled: z.boolean(),
	securityQuestion: z.string().optional(),
	securityAnswer: z.string().optional(),
	acceptTerms: z.boolean(),
});

export type SecurityFormValues = z.infer<typeof securitySchema>;
