import localizationConstants from "@/utils/translation/constants";
import {
	CONTACT_FIELDS,
	CUSTOMER_FIELDS,
	PROJECT_FIELDS,
	PROJECT_INFO_FIELDS,
	PROJECT_LINKED_FIELD,
	toInfoPairs,
} from "../shared/projectInfoFields";
import type {
	CreateProjectFormData,
	ProjectCreateSummarySection,
} from "./types";

/**
 * The four key/value blocks on the Sammanställning step, in the frames' order.
 *
 * The field lists live in `shared/projectInfoFields`, because the
 * Projektinformation record screen draws the same four blocks and edits them.
 * All this adds is which step each pencil returns to.
 */
export function buildSummarySections(
	data: CreateProjectFormData,
): ProjectCreateSummarySection[] {
	const { customer, contactPerson, details } = data;

	return [
		{
			key: "customer",
			step: 1,
			titleKey: localizationConstants.orderKunduppgifterSection,
			fields: toInfoPairs(CUSTOMER_FIELDS, customer),
		},
		{
			key: "contact",
			step: 1,
			titleKey: localizationConstants.orderKontaktpersonSection,
			fields: toInfoPairs(CONTACT_FIELDS, contactPerson),
		},
		{
			key: "project",
			step: 2,
			titleKey: localizationConstants.projectLabel,
			/* The wizard also collects "Koppla projekt"; the record card does not. */
			fields: toInfoPairs([...PROJECT_FIELDS, PROJECT_LINKED_FIELD], details),
		},
		{
			key: "projectInfo",
			step: 2,
			titleKey: localizationConstants.projectCreateInfoSection,
			fields: toInfoPairs(PROJECT_INFO_FIELDS, details),
		},
	];
}
