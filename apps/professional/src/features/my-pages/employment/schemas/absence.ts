import { z } from "zod";
import localizationConstants from "@/utils/translation/constants";

export const sickRequestSchema = z.object({
	startDate: z
		.string()
		.date(localizationConstants.myPagesEmpValStartRequired),
	expectedBack: z.union([z.literal(""), z.string().date(localizationConstants.myPagesEmpValToAfterFrom)]),
	type: z.enum(["sick", "vab"]),
	message: z.string().max(20000),
}).refine(values => !values.expectedBack || values.expectedBack > values.startDate, {
	message: localizationConstants.myPagesEmpValToAfterFrom, path: ["expectedBack"],
});

export type SickRequestValues = z.infer<typeof sickRequestSchema>;

export const leaveRequestSchema = z
	.object({
		fromDate: z
			.string()
			.date(localizationConstants.myPagesEmpValFromRequired),
		toDate: z
			.string()
			.date(localizationConstants.myPagesEmpValToRequired),
		message: z.string().max(20000),
	})
	.refine(
		(values) =>
			!values.fromDate ||
			!values.toDate ||
			values.toDate >= values.fromDate,
		{
			message: localizationConstants.myPagesEmpValToAfterFrom,
			path: ["toDate"],
		},
	);

export type LeaveRequestValues = z.infer<typeof leaveRequestSchema>;
