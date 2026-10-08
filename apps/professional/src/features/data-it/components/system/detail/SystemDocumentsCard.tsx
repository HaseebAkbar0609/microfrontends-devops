"use client";

import React, { useState } from "react";
import { FileText, Pencil, ArrowUpDown } from "lucide-react";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { SystemDocument } from "@/features/data-it/types/dataItSystem.types";

interface SystemDocumentsCardProps {
	documents: SystemDocument[];
	onEdit?: () => void;
}

export const SystemDocumentsCard: React.FC<SystemDocumentsCardProps> = ({
	documents,
	onEdit,
}) => {
	const t = useTranslate();
	const [activeFilePreview, setActiveFilePreview] = useState<string | null>(
		null,
	);

	const handleViewFile = (doc: SystemDocument) => {
		if (doc.url && doc.url !== "#") {
			window.open(doc.url, "_blank", "noopener,noreferrer");
		} else {
			setActiveFilePreview(doc.name);
		}
	};

	return (
		<div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs">
			{/* Card Header */}
			<div className="flex items-center justify-between border-b border-slate-100 pb-4">
				<div className="flex items-center gap-2.5">
					<FileText className="h-5 w-5 text-slate-700" />
					<h2 className="text-base font-semibold text-slate-900">
						{t(localizationConstants.dataItSystemDocumentsTitle)}
					</h2>
				</div>
				{onEdit && (
					<button
						type="button"
						onClick={onEdit}
						className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
					>
						<Pencil className="h-3.5 w-3.5 text-slate-500" />
						<span>{t(localizationConstants.dataItSystemBtnEdit)}</span>
					</button>
				)}
			</div>

			{/* File Preview Banner if selected */}
			{activeFilePreview && (
				<div className="mt-4 flex items-center justify-between rounded-lg bg-slate-50 border border-slate-200 px-4 py-2.5 text-xs text-slate-700">
					<span>
						{t(localizationConstants.dataItSystemPreview)}{" "}
						<strong>{activeFilePreview}</strong>
					</span>
					<button
						type="button"
						onClick={() => setActiveFilePreview(null)}
						className="font-medium text-slate-500 hover:text-slate-800"
					>
						{t(localizationConstants.dataItSystemClose)}
					</button>
				</div>
			)}

			{/* Documents Table */}
			<div className="mt-4 overflow-x-auto">
				<table className="w-full text-left border-collapse">
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
												PDF
											</span>
											<span>{doc.name}</span>
										</div>
									</td>
									<td className="px-4 py-3.5 text-slate-600">{doc.fileType}</td>
									<td className="py-3.5 pl-4 text-right">
										<button
											type="button"
											onClick={() => handleViewFile(doc)}
											className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
										>
											{t(localizationConstants.dataItSystemActionViewFile)}
										</button>
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

export default SystemDocumentsCard;
