import { z } from "zod";
import localizationConstants from "@/utils/translation/constants";

export const addUserSchema = z
  .object({
    userCredentials: z.string().min(1, localizationConstants.addUserValidationCredentialsRequired),
    password: z.string().min(1, localizationConstants.addUserValidationPasswordRequired),
    firstName: z.string().min(1, localizationConstants.addUserValidationFirstNameRequired),
    lastName: z.string().min(1, localizationConstants.addUserValidationLastNameRequired),
    confirmPassword: z.string().min(1, localizationConstants.addUserValidationConfirmPasswordRequired),
    role: z.string().min(1, localizationConstants.addUserValidationRoleRequired),
    department: z.string().optional(),
    isActive: z.boolean(),
    generateEmailForNewPassword: z.boolean(),
    personalNumber: z.string().min(1, localizationConstants.addUserValidationPersonalNumberRequired),
    smsAuthentication: z.boolean(),
    email: z
      .string()
      .min(1, localizationConstants.addUserValidationEmailRequired)
      .email(localizationConstants.addUserValidationEmailInvalid),
    mobileNumber: z.string().optional(),
    employeeRegisterPerson: z.string().optional(),
    language: z.string(),
    automaticLogout: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: localizationConstants.addUserValidationPasswordMismatch,
    path: ["confirmPassword"],
  });

export type AddUserFormValues = z.infer<typeof addUserSchema>;
