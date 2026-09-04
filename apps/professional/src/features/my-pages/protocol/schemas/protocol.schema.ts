import { z } from "zod";
import localizationConstants from "@/utils/translation/constants";

const required = z
	.string()
	.min(1, { message: localizationConstants.protocolValRequired });

export const meetingSchema = z.object({
	responsible: required,
	title: required,
	category: required,
	address: z.string(),
	postalCode: z.string(),
	city: z.string(),
	participantIds: z.array(z.string()),
	location: z.string(),
	startDate: required,
	startTime: required,
	endDate: required,
	endTime: required,
	information: z.string(),
});

export type MeetingValues = z.infer<typeof meetingSchema>;

export const pointSchema = z.object({
	nr: required,
	responsible: required,
	title: required,
	description: z.string(),
	decision: z.string(),
});

export type PointValues = z.infer<typeof pointSchema>;

export const noteSchema = z.object({
	description: required,
});

export type NoteValues = z.infer<typeof noteSchema>;

export const editProtocolSchema = z.object({
	startDate: required,
	startTime: required,
	endDate: required,
	endTime: required,
	host: required,
	participantIds: z.array(z.string()),
	protocolNumber: z.string(),
	subject: z.string(),
	title: required,
	category: required,
	location: z.string(),
	address: z.string(),
	postalCode: z.string(),
	city: z.string(),
	information: z.string(),
	comment: z.string(),
	next: meetingSchema,
});

export type EditProtocolValues = z.infer<typeof editProtocolSchema>;
