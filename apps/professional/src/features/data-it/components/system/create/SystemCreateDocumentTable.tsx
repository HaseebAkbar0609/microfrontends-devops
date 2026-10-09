"use client";

import React, { useState } from "react";
import { ArrowUpDown, Trash2 } from "lucide-react";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { SystemDocument } from "@/features/data-it/types/dataItSystem.types";

interface SystemCreateDocumentTableProps {
	documents: SystemDocument[];
	onRemoveDocument: (id: string) => void;
}

export const SystemCreateDocumentTable: React.FC<
	SystemCreateDocumentTableProps
> = ({ documents, onRemoveDocument }) => {
	const t = useTranslate();
	const [activePreview, setActivePreview] = useState<string | null>(null);

	return (
		<div className="space-y-4">
			{/* Preview banner */}
			{activePreview && (
				<div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-700">
					<span>
						{t(localizationConstants.dataItSystemPreview)} <strong>{activePreview}</strong>
					</span>
					<button
						type="button"
						onClick={() => setActivePreview(null)}
						className="font-medium text-slate-500 hover:text-slate-800"
					>
						{t(localizationConstants.dataItSystemClose)}
					</button>
				</div>
			)}

			{/* Documents Table */}
			<div className="overflow-x-auto">
				<table
					className="w-full text-left border-collapse"
					aria-label={t(localizationConstants.dataItSystemAriaDocumentsTable)}
				>
					<thead>
						<tr className="border-b border-slate-200 text-xs font-semibold text-slate-500">
							<th className="py-3 pr-4">
								<span className="inline-flex items-center gap-1.5">
									{t(localizationConstants.dataItSystemColDocDate)}
									<ArrowUpDown className="h-3 w-3 text-slate-400" />
								</span>
							</th>
							<th className="px-4 py-3">
								<span className="inline-flex items-center gap-1.5">
									{t(localizationConstants.dataItSystemColDocName)}
									<ArrowUpDown className="h-3 w-3 text-slate-400" />
								</span>
							</th>
							<th className="px-4 py-3">
								<span className="inline-flex items-center gap-1.5">
									{t(localizationConstants.dataItSystemColDocType)}
									<ArrowUpDown className="h-3 w-3 text-slate-400" />
								</span>
							</th>
							<th className="py-3 pl-4 text-right">
								<span className="sr-only">
									{t(localizationConstants.dataItSystemColActions)}
								</span>
							</th>
						</tr>
					</thead>

					<tbody>
						{documents.length === 0 ? (
							<tr>
								<td colSpan={4} className="py-8 text-center text-xs text-slate-500">
									{t(localizationConstants.dataItSystemEmptyDocuments)}
								</td>
							</tr>
						) : (
							documents.map((doc) => (
								<tr
									key={doc.id}
									className="border-b border-slate-100 text-sm transition-colors hover:bg-slate-50/70"
								>
									<td className="py-3.5 pr-4 text-slate-600">{doc.date}</td>
									<td className="px-4 py-3.5">
										<div className="flex items-center gap-2 font-medium text-slate-900">
											<span className="inline-flex items-center justify-center rounded bg-rose-100 px-1 py-0.5 text-[10px] font-bold text-rose-600">
												{doc.fileType}
											</span>
											<span>{doc.name}</span>
										</div>
									</td>
									<td className="px-4 py-3.5 text-slate-600">{doc.fileType}</td>
									<td className="py-3.5 pl-4 text-right">
										<div className="inline-flex items-center justify-end gap-2">
											<button
												type="button"
												onClick={() => {
													if (doc.url && doc.url !== "#") {
														window.open(doc.url, "_blank", "noopener,noreferrer");
													} else {
														setActivePreview(doc.name);
													}
												}}
												className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
											>
												{t(localizationConstants.dataItSystemActionViewFile)}
											</button>
											<button
												type="button"
												onClick={() => onRemoveDocument(doc.id)}
												className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
												aria-label={`${t(localizationConstants.dataItSystemAssigneesRemoveBtn)} ${doc.name}`}
											>
												<Trash2 className="h-4 w-4" />
											</button>
										</div>
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default SystemCreateDocumentTable;
