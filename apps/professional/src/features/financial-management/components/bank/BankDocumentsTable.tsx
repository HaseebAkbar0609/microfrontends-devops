"use client";

import React from "react";
import { ArrowUpDown, ArrowUp, ArrowDown, Plus } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type {
	BankDocumentItem,
	BankDocSortField,
	SortOrder,
} from "../../types/bank.types";
import { BankDocumentsTableRow } from "./BankDocumentsTableRow";

interface BankDocumentsTableProps {
	documents: BankDocumentItem[];
	sortBy: BankDocSortField;
	sortOrder: SortOrder;
	onSort: (field: BankDocSortField) => void;
	onView: (doc: BankDocumentItem) => void;
	onDelete?: (id: string, name: string) => void;
	onUploadClick: () => void;
}

export function BankDocumentsTable({
	documents,
	sortBy,
	sortOrder,
	onSort,
	onView,
	onDelete,
	onUploadClick,
}: BankDocumentsTableProps) {
	const renderSortIcon = (field: BankDocSortField) => {
		if (sortBy !== field) {
			return <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />;
		}
		return sortOrder === "asc" ? (
			<ArrowUp className="w-3.5 h-3.5 text-slate-700" />
		) : (
			<ArrowDown className="w-3.5 h-3.5 text-slate-700" />
		);
	};

	return (
		<div className="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden flex flex-col">
			<div className="overflow-x-auto">
				<table className="w-full border-collapse text-left text-xs">
					<thead>
						<tr className="border-b border-slate-200 bg-white font-semibold text-slate-600 select-none">
							{/* Datum */}
							<th className="px-4 py-3.5">
								<button
									type="button"
									onClick={() => onSort("date")}
									className="flex items-center gap-1.5 hover:text-slate-900 cursor-pointer font-semibold"
								>
									<Translate text={localizationConstants.colDocDate} />
									{renderSortIcon("date")}
								</button>
							</th>

							{/* Dokumentnamn */}
							<th className="px-4 py-3.5">
								<button
									type="button"
									onClick={() => onSort("name")}
									className="flex items-center gap-1.5 hover:text-slate-900 cursor-pointer font-semibold"
								>
									<Translate text={localizationConstants.colDocName} />
									{renderSortIcon("name")}
								</button>
							</th>

							{/* Filtyp */}
							<th className="px-4 py-3.5">
								<button
									type="button"
									onClick={() => onSort("fileType")}
									className="flex items-center gap-1.5 hover:text-slate-900 cursor-pointer font-semibold"
								>
									<Translate text={localizationConstants.colDocFileType} />
									{renderSortIcon("fileType")}
								</button>
							</th>

							{/* Actions Header */}
							<th className="w-40 px-4 py-3.5 text-right">
								<div className="flex items-center justify-end gap-2">
									<span>
										<Translate text={localizationConstants.colDocActions} />
									</span>
									<button
										type="button"
										onClick={onUploadClick}
										className="p-1 hover:bg-slate-200 rounded text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
										aria-label="Add document"
									>
										<Plus className="w-3.5 h-3.5" />
									</button>
								</div>
							</th>
						</tr>
					</thead>

					<tbody className="divide-y divide-slate-100 bg-white">
						{documents.length === 0 ? (
							<tr>
								<td colSpan={4} className="py-12 text-center text-slate-500">
									<div className="flex flex-col items-center justify-center gap-2">
										<p className="font-semibold text-sm text-slate-700">
											<Translate text={localizationConstants.emptyBankDocsTitle} />
										</p>
										<p className="text-xs text-slate-500 max-w-sm">
											<Translate text={localizationConstants.emptyBankDocsDesc} />
										</p>
										<button
											type="button"
											onClick={onUploadClick}
											className="mt-2 text-xs font-semibold text-blue-600 hover:text-blue-700 underline cursor-pointer"
										>
											<Translate text={localizationConstants.btnCreateNew} />
										</button>
									</div>
								</td>
							</tr>
						) : (
							documents.map((doc) => (
								<BankDocumentsTableRow
									key={doc.id}
									document={doc}
									onView={onView}
									onDelete={onDelete}
								/>
							))
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}

export default BankDocumentsTable;
