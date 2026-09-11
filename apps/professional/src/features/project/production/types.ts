import type { CustomerDetails } from "@/lib/validation/contactSchema";
import type { ProjectDetailsData, ProjectDocumentItem } from "../create/types";
import type { ProjectContactDetails } from "../shared/projectInfoFields";

/** The contracting company's own details, as they appear on an offer. */
export interface ProjectCompanyDetails {
	name: string;
	email: string;
	phone: string;
	address: string;
	orgNo: string;
}

/** What the work is and where it happens. */
export interface ProjectDescriptionDetails {
	projectName: string;
	workLocation: string;
	specifications: string;
}

/**
 * The offer's terms.
 *
 * Every amount is a string, matching the Order module's `OfferInfoDetails` and
 * the frames — nothing on this screen is calculated. `rotDeductionSettled` is
 * the one departure: Orders stores the literal `"ja"`, which cannot be
 * translated or reasoned about, so it is a boolean here and the view prints
 * Ja/Nej.
 */
export interface ProjectOfferDetails {
	offerNo: string;
	work: string;
	material: string;
	totalOffer: string;
	/** Free text in the frames ("---"), not a computed figure. */
	rotDeductionLabor: string;
	paymentTerms: string;
	rotDeductionSettled: boolean;
}

/**
 * Everything the project record's cards show, across both its tabs.
 *
 * The first three blocks are what the create wizard collects in its opening two
 * steps, so what a project is created with is what its record displays. The
 * rest are the Offert tab's.
 */
export interface ProjectRecordInfo {
	customer: CustomerDetails;
	contactPerson: ProjectContactDetails;
	details: ProjectDetailsData;
	company: ProjectCompanyDetails;
	projectDescription: ProjectDescriptionDetails;
	offer: ProjectOfferDetails;
	documents: ProjectDocumentItem[];
}

/** Which card an edit dialog is editing. Only the Projektuppgifter tab edits. */
export type ProjectInfoSectionKey =
	| "customer"
	| "contact"
	| "project"
	| "projectInfo";
