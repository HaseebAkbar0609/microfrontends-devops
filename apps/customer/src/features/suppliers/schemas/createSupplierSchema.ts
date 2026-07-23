import { z } from "zod";

export const createSupplierSchema = z.object({
	companyName: z
		.string()
		.trim()
		.min(1, "validationSupplierCompanyNameRequired")
		.max(255, "Company name cannot exceed 255 characters"),
	category: z.string().min(1, "validationSupplierCategoryRequired"),
	orgNo: z
		.string()
		.trim()
		.min(1, "validationSupplierOrgNoRequired")
		.regex(
			/^(\d{6}-\d{4}|\d{10})$/,
			"validationSupplierOrgNoInvalid",
		),
	email: z
		.string()
		.trim()
		.min(1, "validationRegisterEmailRequired")
		.email("validationRegisterEmailInvalid"),
	contactFirstName: z
		.string()
		.trim()
		.min(1, "validationRegisterContactFirstNameRequired")
		.regex(/^[a-zA-ZåäöÅÄÖ\s\-']+$/, "validationRegisterContactFirstNameInvalid"),
	contactLastName: z
		.string()
		.trim()
		.min(1, "validationRegisterContactLastNameRequired")
		.regex(/^[a-zA-ZåäöÅÄÖ\s\-']+$/, "validationRegisterContactLastNameInvalid"),
	mobileNo: z
		.string()
		.trim()
		.min(1, "validationSupplierMobileNoRequired")
		.regex(
			/^\+?[0-9\s\-()]{7,20}$/,
			"validationSupplierMobileNoInvalid",
		),
});

export type CreateSupplierValues = z.infer<typeof createSupplierSchema>;
