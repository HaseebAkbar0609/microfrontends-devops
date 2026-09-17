"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { ProjectColumnPicker } from "../../../components/ProjectColumnPicker";
import { SortableHead } from "../../components/SortableHead";
import type { DocumentLabels } from "../documentView";
import type { DocumentListState } from "../hooks/useDocumentList";
import type { ProjectDocument } from "../types";
import { DocumentsTableRow } from "./DocumentsTableRow";

export interface DocumentsTableProps {
	list: DocumentListState;
	labels: DocumentLabels;
	onOpen: (doc: ProjectDocument) => void;
	onToggleArchive: (doc: ProjectDocument) => void;
	onDelete: (doc: ProjectDocument) => void;
}

/**
 * A tab's table as the frames draw it: its columns, sortable but for Skapad av,
 * the `+` that picks which show, and a ⋮ per row. It scrolls inside its border
 * on a narrow screen, so the page itself never scrolls sideways.
 */
export function DocumentsTable({ list, labels, onOpen, onToggleArchive, onDelete }: DocumentsTableProps) {
	const { shownColumns, pageRows, emptyState } = list;

	return (
		<div className="w-full overflow-x-auto rounded-lg border border-slate-200 bg-white">
			<Table className="min-w-[40rem]">
				<TableHeader>
					<TableRow className="hover:bg-transparent">
						{shownColumns.map((column) => (
							<SortableHead
								key={column.key}
								labelKey={column.labelKey}
								onSort={column.sortable ? () => list.onSort(column.key) : undefined}
								active={list.sortField === column.key}
								dir={list.sortDir}
								className="px-3 xl:px-4"
							/>
						))}
						<TableHead className="w-12 border-l border-slate-200 px-2 text-right">
							<ProjectColumnPicker
								columns={list.columns}
								visibleColumns={list.visibleColumns}
								onToggleColumn={list.toggleColumn}
								ariaLabelKey={localizationConstants.projectDocumentsColumnPicker}
							/>
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{pageRows.length === 0 ? (
						<TableRow className="hover:bg-transparent">
							<TableCell colSpan={shownColumns.length + 1} className="py-10 text-center">
								<p className="text-sm font-medium text-slate-900">
									<Translate text={emptyState.titleKey} />
								</p>
								{emptyState.descriptionKey && (
									<p className="mt-1 text-sm text-slate-500">
										<Translate text={emptyState.descriptionKey} />
									</p>
								)}
							</TableCell>
						</TableRow>
					) : (
						pageRows.map((doc) => (
							<DocumentsTableRow
								key={doc.id}
								document={doc}
								columns={shownColumns}
								labels={labels}
								onOpen={() => onOpen(doc)}
								onToggleArchive={() => onToggleArchive(doc)}
								onDelete={() => onDelete(doc)}
							/>
						))
					)}
				</TableBody>
			</Table>
		</div>
	);
}

export default DocumentsTable;
