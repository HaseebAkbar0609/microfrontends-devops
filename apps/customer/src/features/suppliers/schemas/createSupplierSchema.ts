import { z } from "zod";

export const createSupplierStep1Schema = z.object({
	companyName: z.string().min(1, "validationSupplierCompanyNameRequired"),
	category: z.string().min(1, "validationSupplierCategoryRequired"),
	orgNo: z.string().min(1, "validationSupplierOrgNoRequired"),
	email: z
		.string()
		.min(1, "validationRegisterEmailRequired")
		.email("validationRegisterEmailInvalid"),
	contactFirstName: z
		.string()
		.min(1, "validationRegisterContactFirstNameRequired"),
	contactLastName: z
		.string()
		.min(1, "validationRegisterContactLastNameRequired"),
});

export type CreateSupplierStep1Values = z.infer<typeof createSupplierStep1Schema>;

export const TOTAL_STEPS = 3;
