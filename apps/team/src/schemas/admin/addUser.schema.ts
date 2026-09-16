import { z } from "zod";
import localizationConstants from "@/utils/translation/constants";
import { ADMIN_EMAIL_MAX_LENGTH, ADMIN_LOGOUT_MAX_MINUTES, ADMIN_NAME_MAX_LENGTH, ADMIN_OPTION_NONE, ADMIN_PASSWORD_MAX_LENGTH, ADMIN_PASSWORD_MIN_LENGTH } from "@/features/admin/users/constants/adminUsers.constants";
import type { UpdateAdminUserRequest } from "@/features/admin/users/types/adminUsers.types";
import { normalizeSwedishPhone, parseLogout } from "@/features/admin/users/utils/adminUserForms";

const optionalReference = z.string().refine((value) => !value || value === ADMIN_OPTION_NONE || z.string().uuid().safeParse(value).success, localizationConstants.adminValidationOption);

export const getAddUserSchema = (isEditMode = false, editableFields: (keyof UpdateAdminUserRequest)[] = []) => {
  const editable = (field: keyof UpdateAdminUserRequest) => !isEditMode || editableFields.includes(field);
  return z
  .object({
    userCredentials: z.string().optional(),
    password: z.string().optional(),
    firstName: editable("first_name") ? z.string().trim().min(1, localizationConstants.addUserValidationFirstNameRequired).max(ADMIN_NAME_MAX_LENGTH, localizationConstants.adminValidationNameLength) : z.string(),
    lastName: editable("last_name") ? z.string().trim().min(1, localizationConstants.addUserValidationLastNameRequired).max(ADMIN_NAME_MAX_LENGTH, localizationConstants.adminValidationNameLength) : z.string(),
    accessRole: z.enum(["owner", "manage", "worker"]),
    confirmPassword: z.string().optional(),
    role: optionalReference,
    department: optionalReference.optional(),
    isActive: z.boolean(),
    generateEmailForNewPassword: z.boolean(),
    personalNumber: z.string().trim(),
    smsAuthentication: z.boolean(),
    email: editable("email") ? z
      .string()
      .trim()
      .min(1, localizationConstants.addUserValidationEmailRequired)
      .max(ADMIN_EMAIL_MAX_LENGTH, localizationConstants.adminValidationEmailLength)
      .email(localizationConstants.addUserValidationEmailInvalid) : z.string(),
    mobileNumber: z.string().refine((value) => !editable("phone_number") || !value.trim() || /^\+[1-9]\d{6,14}$/.test(normalizeSwedishPhone(value)), localizationConstants.adminValidationPhone).optional(),
    language: z.string(),
    automaticLogout: z.string().refine((value) => {
      const minutes = parseLogout(value);
      return !editable("auto_logout") || minutes === null || (Number.isSafeInteger(minutes) && minutes > 0 && minutes <= ADMIN_LOGOUT_MAX_MINUTES);
    }, localizationConstants.adminValidationLogout),
  })
  .superRefine((data, ctx) => {
    if (isEditMode) return;
    for (const field of ["password", "confirmPassword"] as const) {
      const value = data[field] ?? "";
      if (Array.from(value).length < ADMIN_PASSWORD_MIN_LENGTH || new TextEncoder().encode(value).length > ADMIN_PASSWORD_MAX_LENGTH) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: [field], message: localizationConstants.adminValidationPasswordLength });
      }
    }
  })
  .refine((data) => {
    if (data.password || data.confirmPassword) {
      return data.password === data.confirmPassword;
    }
    return true;
  }, {
    message: localizationConstants.addUserValidationPasswordMismatch,
    path: ["confirmPassword"],
  });
};

export const addUserSchema = getAddUserSchema();
export type AddUserFormValues = z.infer<ReturnType<typeof getAddUserSchema>>;
