import type { SortOrder } from "../types/access.types";
import type {
	AccessDocument,
	AccessDocumentSortField,
	AccessItemExtra,
	AccessItemExtrasById,
} from "../types/accessItemDetails.types";

/** What an item with no extra data shows: empty tables and a dash for the company. */
export const EMPTY_ACCESS_ITEM_EXTRA: AccessItemExtra = {
	company: "",
	assignmentDocument: null,
	documents: [],
	images: [],
};

/** Removes one image of one item; everything else is returned as it was. */
export function removeAccessImage(
	extras: AccessItemExtrasById,
	itemId: string,
	imageId: string,
): AccessItemExtrasById {
	const extra = extras[itemId];
	if (!extra) return extras;
	return { ...extras, [itemId]: { ...extra, images: extra.images.filter((image) => image.id !== imageId) } };
}

/** Documents in Swedish order, dates in calendar order; the input is untouched. */
export function sortAccessDocuments(
	documents: AccessDocument[],
	field: AccessDocumentSortField | null,
	order: SortOrder,
): AccessDocument[] {
	if (!field) return documents;
	return [...documents].sort((a, b) => {
		const result = a[field].localeCompare(b[field], "sv", { numeric: true });
		return order === "asc" ? result : -result;
	});
}
