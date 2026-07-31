import { z } from "zod";
import localizationConstants from "@/utils/translation/constants";

export const sickRequestSchema = z.object({
	startDate: z
		.string()
		.min(1, localizationConstants.myPagesEmpValStartRequired),
	expectedBack: z.string(),
	type: z.enum(["sick", "vab"]),
	message: z.string(),
});

export type SickRequestValues = z.infer<typeof sickRequestSchema>;

export const leaveRequestSchema = z
	.object({
		fromDate: z
			.string()
			.min(1, localizationConstants.myPagesEmpValFromRequired),
		toDate: z
			.string()
			.min(1, localizationConstants.myPagesEmpValToRequired),
		message: z.string(),
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
