import { customerDetailsSchema } from "@/lib/validation/contactSchema";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import type { ProjectInfoSectionKey } from "./types";

/** Field name → message, empty when the section is valid. */
export type SectionErrors = Record<string, string>;

/**
 * Checks one card's values before it is saved.
 *
 * AGENTS.md rule 4: nothing is written without the required fields being
 * checked first. Messages are translation keys, resolved by the caller — the
 * same convention the create wizard's zod schemas use.
 *
 * The customer block reuses `customerDetailsSchema` whole, so the record and
 * the create wizard accept exactly the same input; the other blocks only mark
 * what the frame stars.
 */
export function validateSection(
	section: ProjectInfoSectionKey,
	values: Record<string, unknown>,
): Record<string, TranslationKeys> {
	const errors: Record<string, TranslationKeys> = {};

	if (section === "customer") {
		const parsed = customerDetailsSchema.safeParse(values);
		if (!parsed.success) {
			for (const issue of parsed.error.issues) {
				const field = String(issue.path[0] ?? "");
				if (field && !errors[field]) {
					errors[field] = issue.message as TranslationKeys;
				}
			}
		}
		return errors;
	}

	if (section === "contact") {
		if (!String(values.firstName ?? "").trim()) {
			errors.firstName =
				localizationConstants.orderValidationFirstNameRequired;
		}
		return errors;
	}

	if (section === "project") {
		if (!String(values.projectNo ?? "").trim()) {
			errors.projectNo =
				localizationConstants.projectCreateValidationNoRequired;
		}
		if (!String(values.projectName ?? "").trim()) {
			errors.projectName =
				localizationConstants.projectCreateValidationNameRequired;
		}
		return errors;
	}

	/* Projekt Information stars nothing in the frame, but an end date before a
	   start date is still wrong however it was typed. */
	const start = String(values.startDate ?? "");
	const end = String(values.endDate ?? "");
	if (start && end && end < start) {
		errors.endDate = localizationConstants.orderValidationDateRangeInvalid;
	}

	return errors;
}
