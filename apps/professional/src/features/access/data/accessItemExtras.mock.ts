import type { AccessDocument, AccessImage, AccessItemExtrasById } from "../types/accessItemDetails.types";

/**
 * Company, documents and images for the item details page (TFS-1104), keyed by
 * the id of the item in `ACCESS_HOLDERS_MOCK`. Mock data until a backend exists;
 * an item with no entry shows empty tables. Names and companies are made up, and
 * the images are placeholders with captions only.
 */
function doc(id: string, date: string, name: string): AccessDocument {
	return { id, date, name, fileType: "pdf" };
}

function images(prefix: string, count: number): AccessImage[] {
	return Array.from({ length: count }, (_, index) => ({ id: `${prefix}-img-${index + 1}`, caption: `photo${index + 1}.png` }));
}

export const ACCESS_ITEM_EXTRAS_MOCK: AccessItemExtrasById = {
	"i-001-1-1": {
		company: "Nordisk El & VVS AB",
		assignmentDocument: "agreement-N001.pdf",
		documents: [doc("d-001-1-1-1", "2024-05-10", "agreement-N001.pdf"), doc("d-001-1-1-2", "2024-05-10", "handover-N001.pdf")],
		images: images("i-001-1-1", 6),
	},
	"i-001-1-2": {
		company: "Nordisk El & VVS AB",
		assignmentDocument: "agreement-N005.pdf",
		documents: [doc("d-001-1-2-1", "2024-06-02", "agreement-N005.pdf")],
		images: images("i-001-1-2", 2),
	},
	"i-001-1-3": {
		company: "Bygg & Tak i Väst",
		assignmentDocument: "return-N009.pdf",
		documents: [doc("d-001-1-3-1", "2024-07-15", "return-N009.pdf"), doc("d-001-1-3-2", "2024-03-01", "agreement-N009.pdf")],
		images: [],
	},
	"i-001-1-4": {
		company: "Nordisk El & VVS AB",
		assignmentDocument: "agreement-N018.pdf",
		documents: [doc("d-001-1-4-1", "2024-08-20", "agreement-N018.pdf")],
		images: images("i-001-1-4", 3),
	},
	"i-001-2-1": { company: "Malmö Måleri & Fasad AB", assignmentDocument: null, documents: [], images: images("i-001-2-1", 1) },
	"i-001-3-1": {
		company: "Uppsala Markteknik AB",
		assignmentDocument: "agreement-N034.pdf",
		documents: [doc("d-001-3-1-1", "2024-09-05", "agreement-N034.pdf")],
		images: [],
	},
	"i-003-1-1": {
		company: "Järfälla Städservice",
		assignmentDocument: "agreement-N201.pdf",
		documents: [doc("d-003-1-1-1", "2024-10-11", "agreement-N201.pdf")],
		images: images("i-003-1-1", 4),
	},
};
