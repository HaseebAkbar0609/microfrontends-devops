import { z } from "zod";

export const userDetailsSchema = z.object({
  isAdmin: z.boolean(),
  group: z.string(),
  role: z.string(),
  type: z.string(),
  reports: z.boolean(),
  registerImportant: z.boolean(),
  permissions: z.record(z.boolean().optional()).optional(),
});

export type UserDetailsFormValues = z.infer<typeof userDetailsSchema>;
