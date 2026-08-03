import { z } from "zod";
import localizationConstants from "@/utils/translation/constants";

export const companyMessageSchema = z.object({
	recipient: z
		.string()
		.min(1, localizationConstants.companyMsgValRecipientRequired),
	message: z
		.string()
		.min(1, localizationConstants.companyMsgValMessageRequired),
});

export type CompanyMessageValues = z.infer<typeof companyMessageSchema>;

export const whistleblowerSchema = z.object({
	email: z
		.string()
		.min(1, localizationConstants.companyWbValEmailRequired)
		.email(localizationConstants.companyWbValEmailInvalid),
	message: z
		.string()
		.min(1, localizationConstants.companyMsgValMessageRequired),
});

export type WhistleblowerValues = z.infer<typeof whistleblowerSchema>;
