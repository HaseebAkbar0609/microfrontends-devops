import { PROJECT_LIST_ROWS } from "../../data/projectsOverview.mock";
import type { ProjectListItem } from "../../data/projectsOverview.mock";
import type { CreateProjectFormData } from "../types";

/**
 * Payload mappers for the create wizard.
 *
 * There is no create endpoint — `projectOverviewService` mutates a module-level
 * array and nothing in the project module speaks HTTP yet. The payload is built
 * in full anyway, in the repo's camelCase-to-snake_case shape, so there is one
 * obvious call site to swap for a request rather than a shape to invent later.
 */

export interface ProjectCreatePayload {
	is_draft: boolean;
	customer: Record<string, string>;
	contact_person: Record<string, string>;
	project: Record<string, string>;
	documents: Record<string, string>[];
	organisation: Record<string, unknown>;
}

export function buildProjectPayload(
	data: CreateProjectFormData,
	{ isDraft }: { isDraft: boolean },
): ProjectCreatePayload {
	const { customer, contactPerson, details, documents, organisation } = data;

	return {
		is_draft: isDraft,
		customer: {
			name: customer.customer,
			address: customer.address,
			postal_code: customer.postalCode ?? "",
			city: customer.city ?? "",
			email: customer.email ?? "",
			phone: customer.phone ?? "",
			org_or_personal_no: customer.orgOrPersonalNo ?? "",
		},
		contact_person: {
			first_name: contactPerson.firstName,
			last_name: contactPerson.lastName,
			email: contactPerson.email,
			mobile: contactPerson.mobile,
			role: contactPerson.role,
		},
		project: {
			project_no: details.projectNo,
			project_name: details.projectName,
			block_name: details.blockName,
			address: details.projectAddress,
			postal_code: details.postalCode,
			city: details.city,
			linked_project_no: details.linkedProjectNo,
			type: details.type,
			category: details.category,
			department: details.department,
			contract_sum: details.contractSum,
			offer_no: details.offerNo,
			start_date: details.startDate,
			end_date: details.endDate,
		},
		documents: documents.map((doc) => ({
			document_name: doc.documentName,
			file_name: doc.fileName,
			file_type: doc.fileType,
			date: doc.date,
		})),
		organisation: {
			contractor_type: organisation.contractorType,
			name: organisation.organizationName,
			address: organisation.address,
			postal_code: organisation.postalCode,
			city: organisation.city,
			email: organisation.email,
			phone: organisation.phone,
			contacts: organisation.contacts.map((contact) => ({
				first_name: contact.firstName,
				last_name: contact.lastName,
				email: contact.email,
				mobile: contact.mobile,
				role: contact.role,
			})),
		},
	};
}

/** The row the list will show, derived from what the wizard collected. */
export function toProjectListItem(data: CreateProjectFormData): ProjectListItem {
	const { details, customer, contactPerson } = data;

	return {
		id: details.projectNo.replace(/[^A-Za-z0-9_-]/g, "") || `p-${Date.now()}`,
		projectNr: details.projectNo,
		name: details.projectName,
		category: details.category,
		department: details.department,
		contractSum: details.contractSum,
		projectManager:
			`${contactPerson.firstName} ${contactPerson.lastName}`.trim(),
		customer: customer.customer,
		offerNr: details.offerNo,
		startDate: details.startDate,
		endDate: details.endDate,
	};
}

/**
 * Stands in for `POST /projects`. Resolves with the payload it would send.
 *
 * The new row is pushed onto the same in-memory array the overview reads, so
 * the project appears in the list after the redirect — which is what the
 * ticket's acceptance criteria describe.
 */
export async function createProjectApi(
	data: CreateProjectFormData,
	{ isDraft }: { isDraft: boolean },
): Promise<ProjectCreatePayload> {
	const payload = buildProjectPayload(data, { isDraft });

	if (!isDraft) {
		PROJECT_LIST_ROWS.unshift(toProjectListItem(data));
	}

	return payload;
}
