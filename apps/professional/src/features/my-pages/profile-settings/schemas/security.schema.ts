// src/features/my-pages/profile-settings/schemas/security.schema.ts

import { z } from "zod";

export const securitySchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // attaches error to confirmPassword field
  });

export type SecurityFormValues = z.infer<typeof securitySchema>;