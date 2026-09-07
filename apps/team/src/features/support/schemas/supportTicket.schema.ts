import { z } from "zod";
import localizationConstants from "@/utils/translation/constants";

/** Ticket ids we generate look like `TF-2481`. */
const TICKET_ID_PATTERN = /^[A-Za-z]{2,4}-\d{1,8}$/;

/**
 * Validation messages are translation keys, not sentences. Render them with
 * `t(message as TranslationKeys)` so the language toggle applies to them too.
 */
export const supportTicketDraftSchema = z.object({
	subject: z.string().trim().min(1, {
		message: localizationConstants.supportValidationSubjectRequired,
	}),
	customer: z.string().trim().min(1, {
		message: localizationConstants.supportValidationCustomerRequired,
	}),
	customerType: z.enum(["private", "craftsman"]),
	channel: z.enum(["phone", "email", "chat"]),
	priority: z.enum(["low", "medium", "high", "critical"]),
	line: z.enum(["first", "second"]),
	country: z.string().min(1),
	assigneeId: z.string().nullable(),
	craftsmanId: z.string().nullable(),
	description: z.string().trim(),
});

export type SupportTicketFormValues = z.infer<typeof supportTicketDraftSchema>;

/** Empty draft, kept next to the schema it is validated against. */
export const EMPTY_SUPPORT_TICKET_DRAFT: SupportTicketFormValues = {
	subject: "",
	customer: "",
	customerType: "private",
	channel: "phone",
	priority: "medium",
	line: "first",
	country: "Sverige",
	assigneeId: null,
	craftsmanId: null,
	description: "",
};

/** Guards the `[ticketId]` route segment before it reaches the feature. */
export const ticketIdSchema = z.string().regex(TICKET_ID_PATTERN);

export function parseTicketId(value: string): string | null {
	const result = ticketIdSchema.safeParse(value);
	return result.success ? result.data : null;
}
