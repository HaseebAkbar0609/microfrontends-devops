import type { QAThreadMessage } from "@/components/common/QAThreadCard";
import type { PurchaseComplaintDetail } from "../types/purchase.types";

/**
 * The complaint record's detail, taken from the Figma frames.
 *
 * The frames print "Skappd datum" / "Skappd av" / "Beraknad leverans" /
 * "Leveransdattum" / "Referensnumer" / "Kontakt peroson" — six typos in two
 * screens. The dictionary carries the correct Swedish; only the data lives
 * here.
 *
 * Absent values are stored empty and dashed at render, never as a literal "-".
 * Dates are literal ISO strings — `new Date()` in a mock desynchronises the
 * server and client render.
 */
export const MOCK_PURCHASE_COMPLAINT_DETAILS: PurchaseComplaintDetail[] = [
	{
		complaintId: "rkl-00123",
		linkedPurchase: {
			lineNo: "I500-001",
			purchaseId: "I500",
			name: "Kök",
			supplier: "Beijer",
			supplierId: "beijer",
			purchaseDate: "2024-05-10",
			supplierDate: "2024-05-10",
			estimatedDelivery: "2024-05-10",
		},
		createdDate: "2026-05-01",
		createdBy: "Anna Svensson",
		assignedTo: "Erik Johansson",
		description:
			"Företaget behöver Beprövad erfarenhet av köksrenovering eller inredning. Ett skarpt öga för designtrender och en passion för att skapa snygga och funktionella utrymmen.",
		attachments: [
			{
				id: "img-1",
				name: "Photo.img",
				category: "image",
				thumbnailUrl: "/offer-details.png",
				fileUrl: "/offer-details.png",
			},
			{
				id: "img-2",
				name: "Photo.img",
				category: "image",
				thumbnailUrl: "/offer-details.png",
				fileUrl: "/offer-details.png",
			},
			{
				id: "img-3",
				name: "Photo.img",
				category: "image",
				thumbnailUrl: "/offer-details.png",
				fileUrl: "/offer-details.png",
			},
			// The fourth tile has no preview, so the gallery's placeholder
			// shows — the frame draws that state too.
			{ id: "img-4", name: "Photo.img", category: "image" },
			{
				id: "doc-1",
				name: "Förmulärsmall #1.doc",
				category: "document",
			},
			{
				id: "doc-2",
				name: "Förmulärsmall #2.doc",
				category: "document",
			},
			{
				id: "doc-3",
				name: "projekt.pdf",
				category: "document",
				fileUrl: "/file-type-pdf.png",
			},
			{
				id: "dwg-1",
				name: "projekt.pdf",
				category: "drawing",
				fileUrl: "/file-type-pdf.png",
			},
			{ id: "dwg-2", name: "bild.1", category: "drawing" },
			{ id: "dwg-3", name: "bild.2", category: "drawing" },
			{ id: "dwg-4", name: "bild.3", category: "drawing" },
		],
		supplierContact: {
			contactPerson: "Johan Berg",
			email: "johan.berg@bejer.se",
			referenceNumber: "REF-2026-0521",
			phone: "08-123 456 78",
		},
		resolution: {
			decision: "",
			resolutionType: "",
			resolutionStatus: "",
			resolutionDate: "",
			internalNotes: "",
		},
	},
	{
		complaintId: "rkl-00128",
		linkedPurchase: {
			lineNo: "I501-001",
			purchaseId: "I501",
			name: "Kök",
			supplier: "Beijer",
			supplierId: "beijer",
			purchaseDate: "2025-08-04",
			supplierDate: "",
			estimatedDelivery: "2025-09-18",
		},
		createdDate: "2026-05-01",
		createdBy: "Anna Svensson",
		assignedTo: "",
		description: "",
		attachments: [],
		supplierContact: {
			contactPerson: "Johan Berg",
			email: "johan.berg@bejer.se",
			referenceNumber: "",
			phone: "",
		},
		resolution: {
			decision: "",
			resolutionType: "",
			resolutionStatus: "",
			resolutionDate: "",
			internalNotes: "",
		},
	},
];

/**
 * Detail for one complaint, or `undefined` when none is recorded — the record
 * shows an empty state rather than a page of dashes.
 */
export function purchaseComplaintDetailFor(
	complaintId: string,
): PurchaseComplaintDetail | undefined {
	return MOCK_PURCHASE_COMPLAINT_DETAILS.find(
		(row) => row.complaintId === complaintId,
	);
}

/**
 * The record's Fråga/Svar thread, keyed by complaint. Separate from the detail
 * because messages arrive on their own, not with the record.
 */
export const MOCK_PURCHASE_COMPLAINT_MESSAGES: Record<
	string,
	QAThreadMessage[]
> = {
	"rkl-00123": [
		{
			id: "msg-1",
			sender: "Kalle Svensson",
			company: "Pelles Måleri",
			badge: "UE",
			message: "Hej, undrar om ni skickar över kontrollplan",
			date: "12 augusti",
		},
		{
			id: "msg-2",
			sender: "Kalle Svensson",
			company: "Pelles Måleri",
			badge: "UE",
			message: "Har ni fått bilderna på skadan?",
			date: "13 augusti",
		},
	],
};

export function purchaseComplaintMessagesFor(
	complaintId: string,
): QAThreadMessage[] {
	return MOCK_PURCHASE_COMPLAINT_MESSAGES[complaintId] ?? [];
}
