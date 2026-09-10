import type { TranslationKeys } from "@/utils/translation/constants";
import type { CustomerDetails } from "@/lib/validation/contactSchema";

/** One person on the customer side or inside a contractor organisation. */
export interface ProjectContactPerson {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	mobile: string;
	role: string;
}

/** The frame's "Projekt" and "Projekt Information" cards, plus the link card. */
export interface ProjectDetailsData {
	projectNo: string;
	projectName: string;
	blockName: string;
	projectAddress: string;
	postalCode: string;
	city: string;
	/** "Koppla projekt" — the project number this one hangs off, if any. */
	linkedProjectNo: string;
	type: string;
	category: string;
	department: string;
	contractSum: string;
	offerNo: string;
	startDate: string;
	endDate: string;
}

export interface ProjectDocumentItem {
	id: string;
	/** ISO `yyyy-MM-dd`; the frames render it as-is. */
	date: string;
	documentName: string;
	fileName: string;
	fileType: "pdf" | "doc" | "png" | "jpg";
	fileSize?: string;
}

export interface ProjectOrganisationData {
	contractorType: string;
	organizationName: string;
	address: string;
	postalCode: string;
	city: string;
	email: string;
	phone: string;
	contacts: ProjectContactPerson[];
}

export interface CreateProjectFormData {
	/** Step 1 */
	customer: CustomerDetails;
	contactPerson: Omit<ProjectContactPerson, "id">;
	/** Step 2 */
	details: ProjectDetailsData;
	/** Step 3 */
	documents: ProjectDocumentItem[];
	/** Step 4 */
	organisation: ProjectOrganisationData;
}

/** One read-only block on the Sammanställning step. */
export interface ProjectCreateSummarySection {
	key: string;
	/** The step its pencil returns to. */
	step: 1 | 2 | 3 | 4 | 5;
	titleKey: TranslationKeys;
	/** `[label, value]` pairs; an empty value renders the missing-field mark. */
	fields: [TranslationKeys, string | undefined][];
}
