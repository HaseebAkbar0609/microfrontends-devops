import { z } from "zod";
import localizationConstants from "@/utils/translation/constants";

/**
 * The newsletter composer.
 *
 * The prototype validated the heading with a truthiness check and a toast, and
 * then dropped the body entirely on save — `innehall` was read into state, left
 * out of the saved row and cleared, while the success toast still fired.
 */
export const newsletterSchema = z.object({
	heading: z
		.string()
		.trim()
		.min(1, { message: localizationConstants.marketingValidationRequired }),
	body: z.string().trim(),
	owner: z.string().trim(),
});

export type NewsletterFormValues = z.infer<typeof newsletterSchema>;

export const NEWSLETTER_EMPTY_VALUES: NewsletterFormValues = {
	heading: "",
	body: "",
	owner: "",
};
