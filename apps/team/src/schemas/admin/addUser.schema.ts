import { z } from "zod";

export const addUserSchema = z
  .object({
    userCredentials: z.string().min(1, "Användaruppgifter krävs"),
    password: z.string().min(1, "Lösenord krävs"),
    name: z.string().min(1, "Namn krävs"),
    confirmPassword: z.string().min(1, "Bekräfta lösenord krävs"),
    isActive: z.boolean(),
    generateEmailForNewPassword: z.boolean(),
    personalNumber: z.string().min(1, "Personnummer krävs"),
    smsAuthentication: z.boolean(),
    email: z.string().min(1, "E-post krävs").email("Ogiltig e-postadress"),
    mobileNumber: z.string().optional(),
    employeeRegisterPerson: z.string().optional(),
    language: z.string(),
    automaticLogout: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Lösenorden matchar inte",
    path: ["confirmPassword"],
  });

export type AddUserFormValues = z.infer<typeof addUserSchema>;
