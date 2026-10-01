"use client";

import { SortableHead } from "@/components/table/SortableHead";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { SortDir } from "@/utils/tableSort";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { DOCUMENT_COLUMNS } from "../../../constants/forecastDocuments.constants";
import { FORECAST_ACTION_COLUMN } from "../../../constants/forecastList.constants";
import type { DocumentSortField, ForecastDocument } from "../../../types/forecastDocuments.types";
import { DocumentsTableRow } from "./DocumentsTableRow";

export interface DocumentsTableProps {
	documents: ForecastDocument[];
	sortField: DocumentSortField | null;
	sortDir: SortDir;
	onSort: (field: DocumentSortField) => void;
	emptyKey: TranslationKeys;
	onView: (document: ForecastDocument) => void;
	onOpenFile: (document: ForecastDocument) => void;
	onDelete: (document: ForecastDocument) => void;
}

/**
 * Dokumentcenter's table: four sortable columns, then the eye and the row menu
 * in a column pinned to the right. The table scrolls sideways inside itself,
 * so the page never does.
 */
export function DocumentsTable({
	documents,
	sortField,
	sortDir,
	onSort,
	emptyKey,
	onView,
	onOpenFile,
	onDelete,
}: DocumentsTableProps) {
	return (
		<div className="w-full overflow-x-auto">
			<Table className="min-w-[48rem]">
				<TableHeader>
					<TableRow className="hover:bg-transparent">
						{DOCUMENT_COLUMNS.map((column) => (
							<SortableHead
								key={column.key}
								labelKey={column.labelKey}
								onSort={() => onSort(column.key)}
								active={sortField === column.key}
								dir={sortDir}
							/>
						))}
						<TableHead className={cn(FORECAST_ACTION_COLUMN, "z-20 w-24")}>
							<span className="sr-only">
								<Translate text={localizationConstants.actionsAriaLabel} />
							</span>
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{documents.length === 0 ? (
						<TableRow className="hover:bg-transparent">
							<TableCell
								colSpan={DOCUMENT_COLUMNS.length + 1}
								className="py-10 text-center text-sm text-slate-500"
							>
								<Translate text={emptyKey} />
							</TableCell>
						</TableRow>
					) : (
						documents.map((document) => (
							<DocumentsTableRow
								key={document.id}
								document={document}
								onView={() => onView(document)}
								onOpenFile={() => onOpenFile(document)}
								onDelete={() => onDelete(document)}
							/>
						))
					)}
				</TableBody>
			</Table>
		</div>
	);
}

export default DocumentsTable;
