import { z } from "zod";

export const orderTimeplanStep1Schema = z.object({
	planName: z.string().min(1),
	type: z.string().default("Standard"),
	startDate: z.string().min(1),
	endDate: z.string().min(1),
	orderNr: z.string().default(""),
	customer: z.string().default(""),
	createdBy: z.string().default(""),
	date: z.string().default(""),
	revisedDate: z.string().default(""),
	description: z.string().default(""),
});

export type OrderTimeplanStep1FormData = z.infer<typeof orderTimeplanStep1Schema>;

export const orderTimeplanAddTaskSchema = z.object({
	name: z.string().min(1),
	kind: z.enum(["subtask", "milestone"]).default("subtask"),
	startDate: z.string().min(1),
	endDate: z.string().min(1),
});

export type OrderTimeplanAddTaskFormData = z.infer<typeof orderTimeplanAddTaskSchema>;
