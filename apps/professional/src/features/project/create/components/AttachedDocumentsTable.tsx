"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

import { ConfirmActionDialog } from "@/components/dialog/ConfirmActionDialog";
import { DocFileIcon } from "@/components/ui/DocFileIcon";
import { PdfFileIcon } from "@/components/ui/PdfFileIcon";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import type { ProjectDocumentItem } from "../types";
import { DocumentRowMenu } from "./DocumentRowMenu";

type SortField = "date" | "documentName" | "fileName";

const HEADERS: { field: SortField; label: TranslationKeys }[] = [
	{ field: "date", label: localizationConstants.dateHeaderLabel },
	{
		field: "documentName",
		label: localizationConstants.orderDocumentNameHeader,
	},
	{ field: "fileName", label: localizationConstants.orderFileHeader },
];

/** The glyph for a column: neutral when it is not the one being sorted on. */
function sortIcon(active: boolean, order: "asc" | "desc") {
	if (!active) {
		return <ArrowUpDown className="h-3.5 w-3.5 text-slate-400 opacity-60" />;
	}
	return order === "asc" ? (
		<ArrowUp className="h-3.5 w-3.5 text-slate-900" />
	) : (
		<ArrowDown className="h-3.5 w-3.5 text-slate-900" />
	);
}

function ariaSort(active: boolean, order: "asc" | "desc") {
	if (!active) return "none" as const;
	return order === "asc" ? ("ascending" as const) : ("descending" as const);
}

export interface AttachedDocumentsTableProps {
	documents: ProjectDocumentItem[];
	onRename: (id: string, name: string) => void;
	onRemove: (id: string) => void;
}

/**
 * "Bifogade dokument" — the attached files, sortable.
 *
 * The frames draw a sort glyph on each heading, so the columns actually sort
 * and carry `aria-sort`. The order wizard's identical-looking arrows are
 * decorative and sort nothing.
 */
export function AttachedDocumentsTable({
	documents,
	onRename,
	onRemove,
}: AttachedDocumentsTableProps) {
	const t = useTranslate();
	const [sortField, setSortField] = useState<SortField>("date");
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
	const [deletingId, setDeletingId] = useState<string | null>(null);
	/** One entry per rendered row, so Redigera can focus without a DOM lookup. */
	const nameInputs = useRef(new Map<string, HTMLInputElement | null>());

	const focusName = useCallback((id: string) => {
		const input = nameInputs.current.get(id);
		input?.focus();
		input?.select();
	}, []);

	const sorted = useMemo(
		() =>
			[...documents].sort((a, b) => {
				const compared = String(a[sortField]).localeCompare(
					String(b[sortField]),
				);
				return sortOrder === "asc" ? compared : -compared;
			}),
		[documents, sortField, sortOrder],
	);

	const handleSort = (field: SortField) => {
		if (field === sortField) {
			setSortOrder((order) => (order === "asc" ? "desc" : "asc"));
			return;
		}
		setSortField(field);
		setSortOrder("asc");
	};

	return (
		<div className="overflow-hidden rounded-lg border border-slate-200">
			<div className="bg-slate-100 px-4 py-3 text-sm font-medium text-slate-900">
				<Translate
					text={localizationConstants.orderAttachedDocumentsHeader}
				/>
			</div>

			<div className="w-full overflow-x-auto bg-white">
				<Table className="w-full min-w-[560px]">
					<TableHeader>
						<TableRow className="border-b border-slate-200 bg-white hover:bg-white">
							{HEADERS.map(({ field, label }) => (
								<TableHead
									key={field}
									aria-sort={ariaSort(field === sortField, sortOrder)}
									className="px-4 py-3 text-sm font-medium text-slate-500"
								>
									<button
										type="button"
										onClick={() => handleSort(field)}
										className="flex cursor-pointer items-center gap-1 hover:text-slate-900"
									>
										<Translate text={label} />
										{sortIcon(field === sortField, sortOrder)}
									</button>
								</TableHead>
							))}
							<TableHead className="w-12 px-4 py-3" />
						</TableRow>
					</TableHeader>

					<TableBody>
						{sorted.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={HEADERS.length + 1}
									className="py-8 text-center text-sm text-slate-500"
								>
									<Translate
										text={localizationConstants.noRecordsFound}
									/>
								</TableCell>
							</TableRow>
						) : (
							sorted.map((doc) => (
								<TableRow
									key={doc.id}
									className="group border-b border-slate-100 last:border-b-0 hover:bg-slate-50/60"
								>
									<TableCell className="px-4 py-3 text-sm whitespace-nowrap text-slate-900">
										{doc.date}
									</TableCell>
									<TableCell className="px-4 py-3">
										{/* Editable in the frame, so the cell is
										    the input itself. */}
										<Input
											ref={(node) => {
												nameInputs.current.set(doc.id, node);
											}}
											value={doc.documentName}
											onChange={(event) =>
												onRename(doc.id, event.target.value)
											}
											aria-label={`${t(localizationConstants.orderDocumentNameHeader)} ${doc.fileName}`}
											className="h-9 rounded-md border-slate-200 text-sm shadow-none"
										/>
									</TableCell>
									<TableCell className="px-4 py-3">
										<div className="flex items-center gap-2">
											{doc.fileType === "doc" ? (
												<DocFileIcon className="h-8 w-6 shrink-0" />
											) : (
												<PdfFileIcon className="h-8 w-6 shrink-0" />
											)}
											<span className="truncate text-sm text-slate-900">
												{doc.fileName}
											</span>
										</div>
									</TableCell>
									<TableCell className="px-4 py-3 text-center">
										<DocumentRowMenu
											document={doc}
											onEdit={focusName}
											onDelete={setDeletingId}
										/>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>

			<ConfirmActionDialog
				open={Boolean(deletingId)}
				onOpenChange={(open) => !open && setDeletingId(null)}
				title={localizationConstants.projectCreateDeleteDocTitle}
				description={localizationConstants.projectCreateDeleteDesc}
				confirmLabel={localizationConstants.menuDeleteDocument}
				destructive
				onConfirm={() => {
					if (deletingId) onRemove(deletingId);
					setDeletingId(null);
				}}
			/>
		</div>
	);
}

export default AttachedDocumentsTable;
