import { z } from "zod";
import localizationConstants from "@/utils/translation/constants";

export const itTicketSchema = z.object({
	subject: z
		.string()
		.trim()
		.min(1, localizationConstants.itSupportValSubjectRequired).max(500),
	description: z
		.string()
		.trim()
		.min(1, localizationConstants.itSupportValDescRequired).max(20000),
});

export type ItTicketValues = z.infer<typeof itTicketSchema>;
