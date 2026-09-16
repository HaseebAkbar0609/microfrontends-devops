import { z } from "zod";
import localizationConstants from "@/utils/translation/constants";
import { ADMIN_PASSWORD_MAX_LENGTH, ADMIN_PASSWORD_MIN_LENGTH } from "@/features/admin/users/constants/adminUsers.constants";

export const teamInvitationSchema = (requiresPassword: boolean) => z.object({ password: z.string(), confirmPassword: z.string() }).superRefine((values, ctx) => {
  if (!requiresPassword) return;
  for (const key of ["password", "confirmPassword"] as const) {
    if (Array.from(values[key]).length < ADMIN_PASSWORD_MIN_LENGTH || new TextEncoder().encode(values[key]).length > ADMIN_PASSWORD_MAX_LENGTH) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: [key], message: localizationConstants.adminValidationPasswordLength });
    }
  }
  if (values.password !== values.confirmPassword) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["confirmPassword"], message: localizationConstants.addUserValidationPasswordMismatch });
});

export type TeamInvitationValues = z.infer<ReturnType<typeof teamInvitationSchema>>;
