import { z } from "zod";
import localizationConstants from "@/utils/translation/constants";

/**
 * The contact block shown on the public support page.
 *
 * The prototype's save button only fired a toast, so nothing was ever
 * validated. Messages are translation keys; `FormInput` resolves them.
 */
export const supportContactSchema = z.object({
	phone: z
		.string()
		.trim()
		.min(1, { message: localizationConstants.contentValidationRequired }),
	email: z
		.string()
		.trim()
		.email({ message: localizationConstants.contentValidationEmail }),
	hours: z
		.string()
		.trim()
		.min(1, { message: localizationConstants.contentValidationRequired }),
});

export type SupportContactValues = z.infer<typeof supportContactSchema>;
