import type { PurchaseAgreementDocument } from "../types/purchase.types";

/**
 * Sample attachments for the supplier agreements tab. The first two rows are
 * the ones drawn in the Figma frame; the rest exist so sorting is observable.
 */
export const MOCK_PURCHASE_AGREEMENT_DOCS: PurchaseAgreementDocument[] = [
	{
		id: "a500-10",
		date: "2024-05-10",
		supplier: "Beijer Byggmaterial",
		documentName: "filename.pdf",
		reference: "A500-10",
		fileType: "pdf",
	},
	{
		id: "a500-11",
		date: "2024-05-10",
		supplier: "Beijer Byggmaterial",
		documentName: "filename.pdf",
		reference: "A500-11",
		fileType: "pdf",
	},
	{
		id: "a500-12",
		date: "2024-06-02",
		supplier: "AB Stålpartner",
		documentName: "ramavtal-stal.pdf",
		reference: "A500-12",
		fileType: "pdf",
	},
	{
		id: "a500-13",
		date: "2024-04-18",
		supplier: "Elektroimport AB",
		documentName: "prisbilaga.doc",
		reference: "A500-13",
		fileType: "doc",
	},
];
