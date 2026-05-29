import { z } from "zod";
import { isPersonalNumberValid } from "../utils/userFormatters";


export const userProfileSchema = z.object({
	first_name: z.string().min(1, "First name is required"),
	last_name: z.string().min(1, "Last name is required"),
	mobile_number: z.string().min(1, "Mobile number is required"),
	private_email: z.string().email("Valid email is required"),
	address: z.string().min(1, "Address is required"),
	city: z.string().min(1, "City is required"),
	postal_code: z.string().min(1, "Postal code is required"),
	personal_number: z.string().refine(isPersonalNumberValid, {
		message: "Use format YYYYMMDD-XXXX",
	}),
	profile_photo: z.custom<File | null>().nullable(),
	permissions: z.object({
		viewProjects: z.boolean(),
		createProjects: z.boolean(),
		editProjects: z.boolean(),
		viewOffers: z.boolean(),
		approveOffers: z.boolean(),
		manageUsers: z.boolean(),
	}),
});

export type UserProfileFormValues = z.infer<typeof userProfileSchema>;
