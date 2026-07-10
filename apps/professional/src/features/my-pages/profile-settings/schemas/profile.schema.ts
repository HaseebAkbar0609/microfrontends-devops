import { z } from "zod";

const nextOfKinSchema = z.object({
	name: z.string().optional(),
	relation: z.string().optional(),
	phone: z.string().optional(),
	email: z.string().email().or(z.literal("")).optional(),
});

export const contactSchema = z.object({
	firstName: z.string().min(1),
	lastName: z.string().min(1),
	personalId: z.string().optional(),
	email: z.string().email(),
	phone: z.string().optional(),
	streetAddress: z.string().optional(),
	postalCode: z.string().optional(),
	countryId: z.string().optional(),
	cityId: z.string().optional(),
	nextOfKin: z.array(nextOfKinSchema).optional(),
	employmentNumber: z.string().optional(),
	position: z.string().optional(),
	department: z.string().optional(),
	profilePicture: z.any().optional(),
	languagePreference: z.string().optional(),
	languageOther: z.string().optional(),
	notifications: z
		.object({
			email: z.boolean().optional(),
			sms: z.boolean().optional(),
			webPush: z.boolean().optional(),
		})
		.optional(),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
