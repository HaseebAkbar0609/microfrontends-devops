import { z } from "zod";
import localizationConstants from "@/utils/translation/constants";

export const itTicketSchema = z.object({
	subject: z
		.string()
		.min(1, localizationConstants.itSupportValSubjectRequired),
	description: z
		.string()
		.min(1, localizationConstants.itSupportValDescRequired),
});

export type ItTicketValues = z.infer<typeof itTicketSchema>;
