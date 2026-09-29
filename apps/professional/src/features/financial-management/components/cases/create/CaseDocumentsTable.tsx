"use client";

import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ArrowDown, ArrowUp, ArrowUpDown, Trash2 } from "lucide-react";

import { RecordFileIcon } from "@/features/project/production/components/RecordFileIcon";
import { extensionOf } from "@/features/project/shared/recordFiles";
import { useTableSort } from "@/hooks/useTableSort";
import { openSafeUrl } from "@/lib/safeUrl";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { CASE_DOCUMENT_FILE_RULES } from "../../../constants/cases.constants";
import type { CaseDocument } from "../../../types/cases.types";

type DocumentSortField = "date" | "name" | "fileType";

const COLUMNS: { key: DocumentSortField; labelKey: TranslationKeys }[] = [
	{ key: "date", labelKey: localizationConstants.casesColDocDate },
	{ key: "name", labelKey: localizationConstants.casesColDocName },
	{ key: "fileType", labelKey: localizationConstants.casesColDocFile },
];

/** "PDF", "DOCX" — the type the frame shows, read off the name. */
function fileLabel(document: CaseDocument): string {
	return extensionOf(document.name).replace(".", "").toUpperCase();
}

export interface CaseDocumentsTableProps {
	documents: CaseDocument[];
	onRemove: (id: string) => void;
}

/** What has been added: the frame's three sortable columns, then the actions. */
export function CaseDocumentsTable({ documents, onRemove }: CaseDocumentsTableProps) {
	const t = useTranslate();
	const { i18n } = useTranslation();
	const { sortField, sortDir, toggleSort } = useTableSort<DocumentSortField>();

	const rows = useMemo(() => {
		if (!sortField || !sortDir) return documents;
		const factor = sortDir === "asc" ? 1 : -1;
		return [...documents].sort((a, b) => {
			const left = sortField === "fileType" ? fileLabel(a) : a[sortField];
			const right = sortField === "fileType" ? fileLabel(b) : b[sortField];
			return factor * String(left).localeCompare(String(right), i18n.language, { sensitivity: "base", numeric: true });
		});
	}, [documents, sortField, sortDir, i18n.language]);

	if (documents.length === 0) {
		return (
			<p className="py-8 text-center text-xs text-slate-400 italic">
				<Translate text={localizationConstants.casesNoDocumentsYet} />
			</p>
		);
	}

	return (
		<div className="overflow-x-auto">
			<table className="w-full text-left text-xs">
				<thead>
					<tr className="border-b border-slate-200 text-slate-500">
						{COLUMNS.map((column) => {
							const active = sortField === column.key;
							const Icon = active && sortDir === "asc" ? ArrowUp : active && sortDir === "desc" ? ArrowDown : ArrowUpDown;
							return (
								<th
									key={column.key}
									className="py-3 px-4 font-medium"
									aria-sort={active && sortDir === "asc" ? "ascending" : active && sortDir === "desc" ? "descending" : "none"}
								>
									<button
										type="button"
										onClick={() => toggleSort(column.key)}
										className="flex cursor-pointer items-center gap-1 font-medium hover:text-slate-900"
									>
										<Translate text={column.labelKey} />
										<Icon className={`h-3 w-3 ${active ? "text-slate-900" : "text-slate-400"}`} aria-hidden />
									</button>
								</th>
							);
						})}
						<th className="py-3 px-4 w-32" />
					</tr>
				</thead>
				<tbody className="divide-y divide-slate-100">
					{rows.map((document) => (
						<tr key={document.id} className="hover:bg-slate-50">
							<td className="py-3 px-4 whitespace-nowrap text-slate-700">{document.date}</td>
							<td className="py-3 px-4">
								<div className="flex items-center gap-2.5">
									<RecordFileIcon fileName={document.name} types={CASE_DOCUMENT_FILE_RULES.types} />
									<span className="max-w-[16rem] truncate text-slate-900" title={document.name}>
										{document.name}
									</span>
								</div>
							</td>
							<td className="py-3 px-4 uppercase text-slate-700">{fileLabel(document)}</td>
							<td className="py-3 px-4">
								<div className="flex items-center justify-end gap-2">
									{/* A case reopened later keeps its rows but not its files. */}
									<button
										type="button"
										disabled={!document.url}
										title={document.url ? undefined : t(localizationConstants.casesAttachmentNotHeld)}
										onClick={() => openSafeUrl(document.url)}
										className="h-8 cursor-pointer rounded-lg border border-slate-200 px-3 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-400 disabled:hover:bg-transparent"
									>
										<Translate text={localizationConstants.casesBtnViewFile} />
									</button>
									<button
										type="button"
										onClick={() => onRemove(document.id)}
										aria-label={t(localizationConstants.casesRemoveDocument, { name: document.name })}
										className="cursor-pointer p-1.5 text-slate-400 hover:text-rose-600"
									>
										<Trash2 className="h-4 w-4" aria-hidden />
									</button>
								</div>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

export default CaseDocumentsTable;
