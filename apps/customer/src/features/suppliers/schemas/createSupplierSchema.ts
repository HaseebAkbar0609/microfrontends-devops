import { z } from "zod";

export const createSupplierSchema = z.object({
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
	mobileNo: z.string().min(1, "validationSupplierMobileNoRequired"),
});

export type CreateSupplierValues = z.infer<typeof createSupplierSchema>;
