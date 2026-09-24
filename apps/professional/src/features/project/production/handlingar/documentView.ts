import type { SortDir } from "@/utils/tableSort";
import { extensionOf, isImageFile } from "../../shared/recordFiles";
import {
	DOCUMENT_FILE_RULES,
	FILE_FILTER_IMAGES,
	FILE_FILTER_PDF,
	VIEW_KIND,
	type DocumentColumnKey,
	type DocumentView,
} from "./projectDocuments.config";
import type { DrawingCategory, ProjectDocument, ProjectDocumentKind } from "./types";

/** Turns stored codes into the reader's labels. */
export interface DocumentLabels {
	category: (category: DrawingCategory) => string;
	kind: (kind: ProjectDocumentKind) => string;
}

/** Whether a file belongs on a tab: its kind while active, Arkiv once archived. */
export function belongsToView(doc: ProjectDocument, view: DocumentView): boolean {
	return view === "arkiv" ? doc.archived : !doc.archived && doc.kind === VIEW_KIND[view];
}

function matchesFilter(doc: ProjectDocument, filter: string | null): boolean {
	if (filter === null) return true;
	if (filter === FILE_FILTER_PDF) return extensionOf(doc.fileName) === ".pdf";
	if (filter === FILE_FILTER_IMAGES) return isImageFile(doc.fileName, DOCUMENT_FILE_RULES.types);
	return doc.category === filter || doc.kind === filter;
}

/**
 * Whether a file shows on a tab as filtered and searched. Filter is by file
 * type on Handlingar and Kontrakt, Kategori on Ritningar and Typ on Arkiv —
 * the values cannot collide. Search reads what the reader sees.
 */
export function matchesDocument(
	doc: ProjectDocument,
	view: DocumentView,
	filter: string | null,
	query: string,
	labels: DocumentLabels,
): boolean {
	if (!belongsToView(doc, view) || !matchesFilter(doc, filter)) return false;

	const needle = query.trim().toLowerCase();
	if (!needle) return true;

	return [doc.date, doc.name, doc.fileName, doc.createdBy, doc.category ? labels.category(doc.category) : "", labels.kind(doc.kind)]
		.join(" ")
		.toLowerCase()
		.includes(needle);
}

function sortValue(doc: ProjectDocument, field: DocumentColumnKey, labels: DocumentLabels): string {
	switch (field) {
		case "date":
			return doc.date;
		case "name":
			return doc.name;
		case "file":
			return doc.fileName;
		case "category":
			return doc.category ? labels.category(doc.category) : "";
		case "kind":
			return labels.kind(doc.kind);
		case "createdBy":
			return doc.createdBy;
	}
}

/**
 * Rows in header order, compared in the app's language (so å, ä and ö sort
 * after z) and numerically, so A-99 comes before A-305. Blank values sort last
 * in both directions. With no sort the store's order — newest first — stands.
 */
export function sortDocuments(
	rows: ProjectDocument[],
	field: DocumentColumnKey | null,
	dir: SortDir,
	labels: DocumentLabels,
	locale: string,
): ProjectDocument[] {
	if (!field || !dir) return rows;

	const factor = dir === "asc" ? 1 : -1;
	return [...rows].sort((a, b) => {
		const left = sortValue(a, field, labels);
		const right = sortValue(b, field, labels);
		if (!left || !right) return left === right ? 0 : left ? -1 : 1;
		return factor * left.localeCompare(right, locale, { sensitivity: "base", numeric: true });
	});
}
