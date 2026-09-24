"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import type { DocumentLabels } from "../documentView";
import type { DocumentColumn, DocumentColumnKey } from "../projectDocuments.config";
import type { ProjectDocument } from "../types";
import { DocumentFileCell } from "./DocumentFileCell";
import { DocumentRowMenu } from "./DocumentRowMenu";

/* Narrower padding below xl keeps the columns upright on a tablet. */
const CELL = "px-3 py-3 text-sm text-slate-900 xl:px-4";

export interface DocumentsTableRowProps {
	document: ProjectDocument;
	columns: readonly DocumentColumn[];
	labels: DocumentLabels;
	onOpen: () => void;
	onToggleArchive: () => void;
	onDelete: () => void;
}

function cellContent(doc: ProjectDocument, key: DocumentColumnKey, labels: DocumentLabels) {
	switch (key) {
		case "date":
			return doc.date;
		case "name":
			return doc.name;
		case "file":
			return <DocumentFileCell fileName={doc.fileName} />;
		case "category":
			return doc.category ? labels.category(doc.category) : "";
		case "kind":
			return labels.kind(doc.kind);
		case "createdBy":
			return doc.createdBy;
	}
}

const CELL_CLASS: Record<DocumentColumnKey, string> = {
	date: `${CELL} whitespace-nowrap tabular-nums`,
	name: `${CELL} font-semibold`,
	file: `${CELL} max-w-64`,
	category: CELL,
	kind: CELL,
	createdBy: `${CELL} whitespace-nowrap`,
};

export function DocumentsTableRow({ document, columns, labels, onOpen, onToggleArchive, onDelete }: DocumentsTableRowProps) {
	return (
		<TableRow>
			{columns.map((column) => (
				<TableCell key={column.key} className={CELL_CLASS[column.key]}>
					{cellContent(document, column.key, labels)}
				</TableCell>
			))}
			<TableCell className="w-12 border-l border-slate-200 px-2 py-3 text-right">
				<DocumentRowMenu
					label={document.name}
					archived={document.archived}
					hasFile={Boolean(document.url)}
					onOpen={onOpen}
					onToggleArchive={onToggleArchive}
					onDelete={onDelete}
				/>
			</TableCell>
		</TableRow>
	);
}

export default DocumentsTableRow;
