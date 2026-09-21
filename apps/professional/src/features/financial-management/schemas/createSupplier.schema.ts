import { z } from "zod";

const swedishOrgNoRegex = /^\d{6}-?\d{4}$/;

export const createSupplierSchema = z
	.object({
		levNr: z.string().optional(),
		status: z.string().optional(),

		// Company fields
		companyName: z.string().min(2, "supplierValidationCompanyName"),
		orgNo: z
			.string()
			.min(1, "supplierValidationRequired")
			.refine((val) => swedishOrgNoRegex.test(val.trim()), {
				message: "supplierValidationOrgNo",
			}),
		mainCategory: z.string().optional(),
		department: z.string().optional(),
		region: z.string().optional(),
		vatRegNo: z.string().optional(),

		// Addresses
		visitingAddress: z.string().min(1, "supplierValidationRequired"),
		visitingPostalCode: z.string().min(1, "supplierValidationRequired"),
		visitingCity: z.string().min(1, "supplierValidationRequired"),
		sameAsVisitingAddress: z.boolean().default(false),
		invoiceAddress: z.string().optional(),
		invoicePostalCode: z.string().optional(),
		invoiceCity: z.string().optional(),

		// Bank
		bankName: z.string().optional(),
		bankAccount: z.string().optional(),
		bankgiro: z.string().optional(),
		plusgiro: z.string().optional(),
		iban: z.string().optional(),
		bic: z.string().optional(),

		// Payment Terms
		paymentDays: z.string().optional(),
		interestRate: z.string().optional(),
		invoiceFee: z.string().optional(),
		collectionFee: z.string().optional(),

		// Contact
		phone: z.string().min(1, "supplierValidationPhone"),
		email: z.string().email("supplierValidationEmail").min(1, "supplierValidationEmail"),
		website: z.string().optional(),
		contactNotes: z.string().optional(),

		contactPersons: z
			.array(
				z.object({
					id: z.string(),
					firstName: z.string().optional(),
					lastName: z.string().optional(),
					mobilePhone: z.string().optional(),
					email: z.string().optional(),
					role: z.string().optional(),
					personalNo: z.string().optional(),
				}),
			)
			.default([]),

		// Ratings & documents
		ratings: z.record(z.string(), z.number()).optional(),
		documents: z.array(z.any()).default([]),
		additionalNotes: z.string().optional(),
	});

export type CreateSupplierSchemaType = z.infer<typeof createSupplierSchema>;
