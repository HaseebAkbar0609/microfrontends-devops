import { z } from "zod";

const swedishOrgNoRegex = /^\d{6}-?\d{4}$/;
const swedishPersonnummerRegex = /^(19|20)?\d{6}-?\d{4}$/;

export const createCustomerSchema = z
	.object({
		entityType: z.enum(["company", "private"]),

		customerNo: z.string().optional(),
		status: z.string().optional(),

		// Company fields
		companyName: z.string().optional(),
		orgNo: z.string().optional(),
		mainCategory: z.string().optional(),
		department: z.string().optional(),
		region: z.string().optional(),
		vatRegNo: z.string().optional(),

		// Private fields
		firstName: z.string().optional(),
		lastName: z.string().optional(),
		personnummer: z.string().optional(),

		// Addresses
		visitingAddress: z.string().min(1, "validationAddressRequired"),
		visitingPostalCode: z.string().min(1, "validationPostalCodeRequired"),
		visitingCity: z.string().min(1, "validationCityRequired"),
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

		// Contact
		phone: z.string().min(1, "validationPhoneRequired"),
		email: z.string().email("validationEmailInvalid").min(1, "validationEmailRequired"),
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
		notes: z.string().optional(),

		// Invoice & bookkeeping
		paymentTerms: z.string().optional(),
		deliveryTerms: z.string().optional(),
		deliveryMethod: z.string().optional(),
		interestInvoicing: z.string().optional(),
		priceList: z.string().optional(),
		currency: z.string().optional(),
		invoiceDiscount: z.string().optional(),
		invoiceFee: z.string().optional(),
		shippingFee: z.string().optional(),
		pricesInclVat: z.string().optional(),
		ourReference: z.string().optional(),
		customerResponsible: z.string().optional(),
		externalReference: z.string().optional(),
		yourReference: z.string().optional(),
		vatNumber: z.string().optional(),
		vatType: z.string().optional(),
		salesAccount: z.string().optional(),
		costCenter: z.string().optional(),
		project: z.string().optional(),

		// ROT/RUT
		isRotRutEnabled: z.boolean().default(false),
		propertyDesignation: z.string().optional(),
		apartmentNumber: z.string().optional(),
		associatedPersons: z
			.array(
				z.object({
					id: z.string(),
					name: z.string(),
					personalId: z.string(),
					ownershipShare: z.number(),
				}),
			)
			.default([]),
	})
	.superRefine((data, ctx) => {
		if (data.entityType === "company") {
			if (!data.companyName || data.companyName.trim().length < 2) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: "validationCompanyNameRequired",
					path: ["companyName"],
				});
			}
			if (!data.orgNo || !swedishOrgNoRegex.test(data.orgNo.trim())) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: "validationOrgNoInvalid",
					path: ["orgNo"],
				});
			}
		} else {
			if (!data.firstName || data.firstName.trim().length < 2) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: "validationFirstNameRequired",
					path: ["firstName"],
				});
			}
			if (!data.lastName || data.lastName.trim().length < 2) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: "validationLastNameRequired",
					path: ["lastName"],
				});
			}
			if (!data.personnummer || !swedishPersonnummerRegex.test(data.personnummer.trim())) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: "validationPersonalNoInvalid",
					path: ["personnummer"],
				});
			}
		}
	});

export type CreateCustomerSchemaType = z.infer<typeof createCustomerSchema>;
