"use client";

import { Eye, FileText, PencilLine, Plus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useTableSort } from "@/hooks/useTableSort";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { ProjectSectionCard } from "../../../components/ProjectSectionCard";
import { RecordFileIcon } from "../../../components/RecordFileIcon";
import { RowActionMenu, RowMenuAction } from "../../../components/RowActionMenu";
import { SortableHead } from "../../../components/SortableHead";
import { baseNameOf } from "../../../../shared/recordFiles";
import { WARRANTY_DOCUMENT_COLUMNS, WARRANTY_FILE_RULES, type WarrantyDocumentSortField } from "../../projectWarranty.config";
import type { WarrantyDocument } from "../../types";
import { sortWarrantyDocuments } from "../../warrantyView";

/* Narrower padding below lg keeps the three columns upright on a tablet. */
const CELL = "px-3 py-3 text-sm text-slate-900 lg:px-4";

export interface WarrantyDocumentsCardProps {
	documents: readonly WarrantyDocument[];
	onAdd: () => void;
	onOpen: (document: WarrantyDocument) => void;
	onEdit: (document: WarrantyDocument) => void;
	onDelete: (document: WarrantyDocument) => void;
}

/**
 * The frame's Dokument card: "Lägg till" over Datum, Benämning and the file,
 * all three sortable, with ⋮ Visa, Redigera and Radera. The table scrolls
 * inside the card on a phone, so the page itself never scrolls sideways.
 */
export function WarrantyDocumentsCard({ documents, onAdd, onOpen, onEdit, onDelete }: WarrantyDocumentsCardProps) {
	/* `t` from the app's own hook: it expands `{label}`, which react-i18next's does not. */
	const t = useTranslate();
	const { i18n } = useTranslation();
	const { sortField, sortDir, toggleSort } = useTableSort<WarrantyDocumentSortField>();
	const rows = sortWarrantyDocuments(documents, sortField, sortDir, i18n.language);

	return (
		<ProjectSectionCard
			titleKey={localizationConstants.projectWarrantySectionDocuments}
			icon={<FileText className="h-5 w-5 text-slate-700" aria-hidden />}
			contentClassName="sm:p-4"
			action={
				<Button
					type="button"
					onClick={onAdd}
					className="h-9 cursor-pointer gap-2 rounded-md bg-[#111721] px-3 text-sm font-medium text-white hover:bg-slate-800"
				>
					<Plus className="h-4 w-4 shrink-0" aria-hidden />
					<Translate text={localizationConstants.projectWarrantyAddDocument} />
				</Button>
			}
		>
			<div className="w-full overflow-x-auto">
				<Table className="min-w-[32rem]">
					<TableHeader>
						<TableRow className="hover:bg-transparent">
							{WARRANTY_DOCUMENT_COLUMNS.map((column) => (
								<SortableHead
									key={column.key}
									labelKey={column.labelKey}
									onSort={() => toggleSort(column.key)}
									active={sortField === column.key}
									dir={sortDir}
									className="px-3 lg:px-4"
								/>
							))}
							<TableHead className="w-12" />
						</TableRow>
					</TableHeader>
					<TableBody>
						{rows.length === 0 ? (
							<TableRow className="hover:bg-transparent">
								<TableCell colSpan={WARRANTY_DOCUMENT_COLUMNS.length + 1} className="py-10 text-center text-sm font-medium text-slate-900">
									<Translate text={localizationConstants.projectWarrantyDocumentsEmpty} />
								</TableCell>
							</TableRow>
						) : (
							rows.map((document) => (
								<TableRow key={document.id}>
									<TableCell className={`${CELL} whitespace-nowrap tabular-nums`}>{document.date}</TableCell>
									<TableCell className={`${CELL} whitespace-normal`}>{document.name}</TableCell>
									<TableCell className={CELL}>
										{/* The frame drops the extension, which the icon already shows;
										    a screen reader hears the file's name in full. */}
										<span className="flex min-w-0 items-center gap-3" title={document.fileName}>
											<RecordFileIcon fileName={document.fileName} types={WARRANTY_FILE_RULES.types} />
											<span aria-hidden className="truncate">
												{baseNameOf(document.fileName)}
											</span>
											<span className="sr-only">{document.fileName}</span>
										</span>
									</TableCell>
									<TableCell className="w-12 px-1 py-3 text-right lg:px-2">
										<RowActionMenu ariaLabel={t(localizationConstants.projectWarrantyRowActions, { label: document.name })}>
											<RowMenuAction
												icon={Eye}
												labelKey={localizationConstants.projectWarrantyDocumentView}
												/* Seeded documents have no stored file, so Visa says why it cannot open them. */
												reasonKey={document.url ? null : localizationConstants.projectWarrantyDocumentNoFile}
												onSelect={() => onOpen(document)}
											/>
											<RowMenuAction
												icon={PencilLine}
												labelKey={localizationConstants.projectWarrantyRowEdit}
												reasonKey={null}
												onSelect={() => onEdit(document)}
											/>
											<RowMenuAction
												icon={Trash2}
												labelKey={localizationConstants.projectWarrantyRowDelete}
												reasonKey={null}
												destructive
												onSelect={() => onDelete(document)}
											/>
										</RowActionMenu>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>
		</ProjectSectionCard>
	);
}

export default WarrantyDocumentsCard;
