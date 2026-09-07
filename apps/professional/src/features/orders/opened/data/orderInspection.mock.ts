import type { OrderInspectionItem } from "../types/orderInspection.types";

export const MOCK_INSPECTIONS: OrderInspectionItem[] = [
	{
		id: "insp-001",
		orderId: "5000-001",
		date: "2025-09-01",
		type: "Byggmöte",
		inspectionDate: "2025-10-01",
		status: "approved",
		documents: [
			{
				id: "doc-001",
				name: "filename.pdf",
				fileName: "filename.pdf",
				fileType: "pdf",
				url: "#",
			},
			{
				id: "doc-002",
				name: "Document 1.pdf",
				fileName: "Document 1.pdf",
				fileType: "pdf",
				url: "#",
			},
		],
		comments: "Första genomgång av byggmöte och status på platsen godkänd.",
	},
	{
		id: "insp-002",
		orderId: "5000-001",
		date: "2025-09-01",
		type: "Byggmöte",
		inspectionDate: "2025-10-01",
		status: "approved",
		documents: [
			{
				id: "doc-003",
				name: "filename.pdf",
				fileName: "filename.pdf",
				fileType: "pdf",
				url: "#",
			},
		],
		comments: "Kvalitetskontroll av underlag och elinstallationer.",
	},
	{
		id: "insp-003",
		orderId: "5000-001",
		date: "2025-09-01",
		type: "Byggmöte",
		inspectionDate: "2025-10-01",
		status: "approved",
		documents: [
			{
				id: "doc-004",
				name: "filename.pdf",
				fileName: "filename.pdf",
				fileType: "pdf",
				url: "#",
			},
		],
		comments: "Protokoll och sammanfattning från besiktningstillfället.",
	},
];

export function getMockInspections(orderId?: string): OrderInspectionItem[] {
	if (!orderId) return [...MOCK_INSPECTIONS];
	const filtered = MOCK_INSPECTIONS.filter((item) => item.orderId === orderId);
	return filtered.length > 0 ? filtered : [...MOCK_INSPECTIONS];
}
