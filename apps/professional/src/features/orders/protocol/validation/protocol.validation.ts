import { z } from "zod";

export const PROTOCOL_VALIDATION_LIMITS = {
	MAX_SUBJECT_LENGTH: 120,
	MAX_ADDRESS_LENGTH: 150,
	MAX_LOCATION_LENGTH: 100,
	MAX_POSTAL_CODE_LENGTH: 20,
	MAX_CITY_LENGTH: 50,
	MAX_RESPONSIBLE_LENGTH: 100,
	MAX_NOTES_LENGTH: 2000,
} as const;

export const createProtocolSchema = (
	dateRequiredMsg: string,
	typeRequiredMsg: string,
	subjectRequiredMsg: string
) =>
	z.object({
		responsible: z.string().max(PROTOCOL_VALIDATION_LIMITS.MAX_RESPONSIBLE_LENGTH).optional(),
		rubrik: z
			.string()
			.min(1, subjectRequiredMsg)
			.max(PROTOCOL_VALIDATION_LIMITS.MAX_SUBJECT_LENGTH),
		type: z.string().min(1, typeRequiredMsg),
		category: z.string().optional(),
		address: z.string().max(PROTOCOL_VALIDATION_LIMITS.MAX_ADDRESS_LENGTH).optional(),
		postalCode: z.string().max(PROTOCOL_VALIDATION_LIMITS.MAX_POSTAL_CODE_LENGTH).optional(),
		city: z.string().max(PROTOCOL_VALIDATION_LIMITS.MAX_CITY_LENGTH).optional(),
		location: z.string().max(PROTOCOL_VALIDATION_LIMITS.MAX_LOCATION_LENGTH).optional(),
		startDate: z.string().min(1, dateRequiredMsg),
		startTime: z.string().optional(),
		endDate: z.string().optional(),
		endTime: z.string().optional(),
		notes: z.string().max(PROTOCOL_VALIDATION_LIMITS.MAX_NOTES_LENGTH).optional(),
	});

export type CreateProtocolFormData = z.infer<
	ReturnType<typeof createProtocolSchema>
>;

export const uploadProtocolSchema = (
	dateRequiredMsg: string,
	typeRequiredMsg: string
) =>
	z.object({
		type: z.string().min(1, typeRequiredMsg),
		category: z.string().optional(),
		address: z.string().max(PROTOCOL_VALIDATION_LIMITS.MAX_ADDRESS_LENGTH).optional(),
		postalCode: z.string().max(PROTOCOL_VALIDATION_LIMITS.MAX_POSTAL_CODE_LENGTH).optional(),
		city: z.string().max(PROTOCOL_VALIDATION_LIMITS.MAX_CITY_LENGTH).optional(),
		location: z.string().max(PROTOCOL_VALIDATION_LIMITS.MAX_LOCATION_LENGTH).optional(),
		startDate: z.string().min(1, dateRequiredMsg),
		startTime: z.string().optional(),
		endDate: z.string().optional(),
		endTime: z.string().optional(),
		notes: z.string().max(PROTOCOL_VALIDATION_LIMITS.MAX_NOTES_LENGTH).optional(),
	});

export type UploadProtocolFormData = z.infer<
	ReturnType<typeof uploadProtocolSchema>
>;
