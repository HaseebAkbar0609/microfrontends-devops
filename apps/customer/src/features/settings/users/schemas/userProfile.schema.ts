import { z } from "zod";
import {
	isPersonalNumberValid,
	isSwedishPhoneNumberValid,
} from "../utils/userFormatters";

export type UserProfileValidationMessages = {
	firstNameRequired: string;
	lastNameRequired: string;
	mobileNumberRequired: string;
	mobileNumberInvalid: string;
	privateEmailInvalid: string;
	addressRequired: string;
	cityRequired: string;
	postalCodeRequired: string;
	personalNumberFormat: string;
};

export const createUserProfileSchema = (messages: UserProfileValidationMessages) => z.object({
	first_name: z.string().min(1, messages.firstNameRequired),
	last_name: z.string().min(1, messages.lastNameRequired),
	mobile_number: z
		.string()
		.min(1, messages.mobileNumberRequired)
		.refine(isSwedishPhoneNumberValid, {
			message: messages.mobileNumberInvalid,
		}),
	private_email: z.string().email(messages.privateEmailInvalid),
	address: z.string().min(1, messages.addressRequired),
	city: z.string().min(1, messages.cityRequired),
	postal_code: z.string().min(1, messages.postalCodeRequired),
	personal_number: z.string().refine(isPersonalNumberValid, {
		message: messages.personalNumberFormat,
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

export type UserProfileFormValues = z.infer<ReturnType<typeof createUserProfileSchema>>;
