import type { CustomerDetails } from "@/lib/validation/contactSchema";
import type { ProjectDetailsData } from "../create/types";
import type { ProjectContactDetails } from "../shared/projectInfoFields";

/**
 * Everything the Projektinformation cards show for one project.
 *
 * The same three blocks the create wizard collects in its first two steps, so
 * what a project is created with is what its record displays.
 */
export interface ProjectRecordInfo {
	customer: CustomerDetails;
	contactPerson: ProjectContactDetails;
	details: ProjectDetailsData;
}

/** Which card an edit dialog is editing. */
export type ProjectInfoSectionKey =
	| "customer"
	| "contact"
	| "project"
	| "projectInfo";
