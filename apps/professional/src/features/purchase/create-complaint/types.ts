import type { PurchaseContactPerson } from "../types/purchase.types";

/** Company block: the four fields the design's company cards carry. */
export interface ComplaintCompany {
	company: string;
	address: string;
	phone: string;
	email: string;
}

/** Contact block, repeated for the supplier and the reporting side. */
/** Kept as the wizard's local name for the shared contact shape. */
export type ComplaintContact = PurchaseContactPerson;

export type ComplaintPriority = "high" | "medium" | "low";

/** Read-only summary of the purchase the complaint is raised against. */
export interface ComplaintInfo {
	purchaseNo: string;
	name: string;
	object: string;
	complaintType: string;
}

/** Step 2's "Förklara vad som gick fel" plus the GDPR consent. */
export interface ComplaintReport {
	title: string;
	description: string;
	discoveredAt: string;
	deliveredAt: string;
	priority: ComplaintPriority;
	gdprAccepted: boolean;
}

export interface ComplaintDraft {
	info: ComplaintInfo;
	supplierId: string;
	supplier: ComplaintCompany;
	supplierContact: ComplaintContact;
	reporter: ComplaintCompany;
	reporterContact: ComplaintContact;
	report: ComplaintReport;
}

export const EMPTY_COMPLAINT_COMPANY: ComplaintCompany = {
	company: "",
	address: "",
	phone: "",
	email: "",
};

export const EMPTY_COMPLAINT_CONTACT: ComplaintContact = {
	contactId: "",
	firstName: "",
	lastName: "",
	address: "",
	postalCode: "",
	email: "",
	phone: "",
	city: "",
	role: "",
};
