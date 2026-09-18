import type { SalesCompany, SalesEmailTemplate } from "../types";

export type TemplateValues = {
	company: string;
	contact: string;
	seller: string;
	calendly: string;
};

/**
 * Swaps every tag for its value. Tags the caller has no value for are left
 * alone rather than blanked, so a half-filled template still reads sensibly.
 */
export function fillTemplateTags(text: string, values: TemplateValues): string {
	return text
		.replaceAll("{företag}", values.company || "{företag}")
		.replaceAll("{kontakt}", values.contact || "{kontakt}")
		.replaceAll("{säljare}", values.seller || "{säljare}")
		.replaceAll("{calendly}", values.calendly || "{calendly}");
}

/** A template with its tags resolved against one company. */
export function renderTemplate(
	template: SalesEmailTemplate,
	company: SalesCompany,
	calendlyLink: string,
): { subject: string; body: string } {
	const values: TemplateValues = {
		company: company.name,
		contact: company.contactPerson,
		seller: company.seller,
		calendly: calendlyLink,
	};

	return {
		subject: fillTemplateTags(template.subject, values),
		body: fillTemplateTags(template.body, values),
	};
}

/** True for an empty value or an https link. */
export function isValidLink(value: string): boolean {
	if (!value.trim()) return true;
	try {
		return new URL(value).protocol === "https:";
	} catch {
		return false;
	}
}
