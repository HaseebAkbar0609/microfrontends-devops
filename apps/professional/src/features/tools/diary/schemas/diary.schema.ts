import { z } from "zod";
import localizationConstants from "@/utils/translation/constants";

const required = z
	.string()
	.trim()
	.min(1, { message: localizationConstants.protocolValRequired });

export const diarySchema = z.object({
	title: required.max(500),
	projectName: required.max(500),
	date: z.string().date(localizationConstants.protocolValRequired),
	description: required.max(20000),
});

export type DiaryValues = z.infer<typeof diarySchema>;
