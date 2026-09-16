import { z } from "zod";

export const PROTOCOL_VALIDATION_LIMITS = {
	MAX_SUBJECT_LENGTH: 120,
	MAX_ADDRESS_LENGTH: 150,
	MAX_LOCATION_LENGTH: 100,
	MAX_POSTAL_CODE_LENGTH: 20,
	MAX_CITY_LENGTH: 50,
	MAX_RESPONSIBLE_LENGTH: 100,
	MAX_NOTES_LENGTH: 2000,
	MAX_DECISION_LENGTH: 1000,
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

export const meetingPointSchema = (
	requiredMsg: string,
	maxLengthMsg?: string
) =>
	z.object({
		nr: z.string().trim().min(1, requiredMsg).max(20, maxLengthMsg),
		responsible: z
			.string()
			.trim()
			.min(1, requiredMsg)
			.max(PROTOCOL_VALIDATION_LIMITS.MAX_RESPONSIBLE_LENGTH, maxLengthMsg),
		subject: z
			.string()
			.trim()
			.min(1, requiredMsg)
			.max(PROTOCOL_VALIDATION_LIMITS.MAX_SUBJECT_LENGTH, maxLengthMsg),
		description: z.string().max(PROTOCOL_VALIDATION_LIMITS.MAX_NOTES_LENGTH, maxLengthMsg).optional(),
		decision: z.string().max(PROTOCOL_VALIDATION_LIMITS.MAX_DECISION_LENGTH, maxLengthMsg).optional(),
	});

export type MeetingPointFormData = z.infer<
	ReturnType<typeof meetingPointSchema>
>;

export const editProtocolSchema = (
	requiredMsg: string
) =>
	z.object({
		// Time section
		startDate: z.string().min(1, requiredMsg),
		startTime: z.string().optional(),
		endDate: z.string().min(1, requiredMsg),
		endTime: z.string().optional(),

		// Participants section
		host: z.string().min(1, requiredMsg),
		participants: z.array(z.string()),

		// Other information section
		protocolNumber: z.string().max(50).optional(),
		topic: z.string().max(PROTOCOL_VALIDATION_LIMITS.MAX_NOTES_LENGTH).optional(),
		rubrik: z.string().min(1, requiredMsg).max(PROTOCOL_VALIDATION_LIMITS.MAX_SUBJECT_LENGTH),
		category: z.string().optional(),
		location: z.string().max(PROTOCOL_VALIDATION_LIMITS.MAX_LOCATION_LENGTH).optional(),
		address: z.string().max(PROTOCOL_VALIDATION_LIMITS.MAX_ADDRESS_LENGTH).optional(),
		postalCode: z.string().max(PROTOCOL_VALIDATION_LIMITS.MAX_POSTAL_CODE_LENGTH).optional(),
		city: z.string().max(PROTOCOL_VALIDATION_LIMITS.MAX_CITY_LENGTH).optional(),
		information: z.string().max(PROTOCOL_VALIDATION_LIMITS.MAX_NOTES_LENGTH).optional(),
		comment: z.string().max(PROTOCOL_VALIDATION_LIMITS.MAX_NOTES_LENGTH).optional(),

		// Next meeting section
		nextMeetingResponsible: z.string().max(PROTOCOL_VALIDATION_LIMITS.MAX_RESPONSIBLE_LENGTH).optional(),
		nextMeetingRubrik: z.string().max(PROTOCOL_VALIDATION_LIMITS.MAX_SUBJECT_LENGTH).optional(),
		nextMeetingCategory: z.string().optional(),
		nextMeetingAddress: z.string().max(PROTOCOL_VALIDATION_LIMITS.MAX_ADDRESS_LENGTH).optional(),
		nextMeetingPostalCode: z.string().max(PROTOCOL_VALIDATION_LIMITS.MAX_POSTAL_CODE_LENGTH).optional(),
		nextMeetingCity: z.string().max(PROTOCOL_VALIDATION_LIMITS.MAX_CITY_LENGTH).optional(),
		nextMeetingParticipants: z.array(z.string()),
		nextMeetingLocation: z.string().max(PROTOCOL_VALIDATION_LIMITS.MAX_LOCATION_LENGTH).optional(),
		nextMeetingStartDate: z.string().optional(),
		nextMeetingStartTime: z.string().optional(),
		nextMeetingEndDate: z.string().optional(),
		nextMeetingEndTime: z.string().optional(),
		nextMeetingInfo: z.string().max(PROTOCOL_VALIDATION_LIMITS.MAX_NOTES_LENGTH).optional(),
	});

export type EditProtocolFormData = z.infer<
	ReturnType<typeof editProtocolSchema>
>;
