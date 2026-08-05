import { z } from "zod";
import localizationConstants from "@/utils/translation/constants";

const required = z
	.string()
	.min(1, { message: localizationConstants.protocolValRequired });

export const diarySchema = z.object({
	title: required,
	projectName: required,
	date: required,
	description: required,
});

export type DiaryValues = z.infer<typeof diarySchema>;
