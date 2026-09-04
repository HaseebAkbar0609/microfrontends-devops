import type { PurchaseInformation } from "../types/purchase.types";

/**
 * Information shown on a purchase record, taken from the Figma frame.
 *
 * One correction, flagged on the ticket: the frame's Order card puts its values
 * under the wrong labels. It prints a company name under "Order No.", the
 * literal placeholder "Enter Address" under "Order Name", an org number under
 * "Customer" and an email address under "Status" — the values are offset from
 * their labels. The labels are kept as drawn and the values put where they
 * belong, so "Fastighetsbolaget AB" reads as the Customer it is.
 *
 * Absent values are stored empty and dashed at render, never as a literal "-".
 */
export const MOCK_PURCHASE_INFORMATION: PurchaseInformation[] = [
	{
		purchaseId: "I500",
		calculation: {
			calculationNo: "K001",
			orderer: "Fastighetsbolag",
			quoteDate: "2024-04-18",
			type: "Total",
			quoteAmount: "486 000",
			category: "Service",
			status: "ongoing",
		},
		quote: {
			idNo: "OFN001",
			job: "Köksrenovering",
			date: "2024-05-10",
			type: "Entreprenad",
			inquiry: "",
			municipality: "Göteborg",
			category: "Service",
		},
		order: {
			orderNo: "OR001",
			orderName: "Köksrenovering",
			customer: "Fastighetsbolaget AB",
			type: "Löpande",
			status: "Pågår",
			telephone: "",
			orderAmount: "",
			projectManager: "Erik Svensson",
			startDate: "2024-06-03",
			endDate: "",
		},
	},
	{
		purchaseId: "I501",
		calculation: {
			calculationNo: "K301",
			orderer: "Fastighetsbolag",
			quoteDate: "",
			type: "General",
			quoteAmount: "",
			category: "Entreprenad",
			status: "not_started",
		},
		quote: {
			idNo: "OFN002",
			job: "Ombyggnad",
			date: "2025-09-01",
			type: "",
			inquiry: "",
			municipality: "",
			category: "Entreprenad",
		},
		order: {
			orderNo: "",
			orderName: "Ombyggnad",
			customer: "Fastighetsbolaget AB",
			type: "",
			status: "Ej påbörjad",
			telephone: "",
			orderAmount: "",
			projectManager: "",
			startDate: "",
			endDate: "",
		},
	},
];

/**
 * Information for one purchase, or `undefined` when none is recorded — the tab
 * renders an empty state rather than a page of dashes.
 */
export function purchaseInformationFor(
	purchaseId: string,
): PurchaseInformation | undefined {
	return MOCK_PURCHASE_INFORMATION.find(
		(row) => row.purchaseId === purchaseId,
	);
}
