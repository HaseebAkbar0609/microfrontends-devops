"use client";

import React, { useRef, useState } from "react";
import { ArrowUpDown, Trash2, Upload } from "lucide-react";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { AVAILABLE_SYSTEM_DOCUMENT_TEMPLATES } from "@/features/data-it/constants/dataItSystem.mock";
import type { SystemDocument } from "@/features/data-it/types/dataItSystem.types";

interface SystemCreateDocumentsCardProps {
	documents: SystemDocument[];
	onAddDocument: (doc: SystemDocument) => void;
	onRemoveDocument: (id: string) => void;
}

export const SystemCreateDocumentsCard: React.FC<
	SystemCreateDocumentsCardProps
> = ({ documents, onAddDocument, onRemoveDocument }) => {
	const t = useTranslate();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [activePreview, setActivePreview] = useState<string | null>(null);

	const handleNativeFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (!files || files.length === 0) return;
		Array.from(files).forEach((file) => {
			const ext = file.name.split(".").pop()?.toUpperCase() || "PDF";
			const today = new Date().toISOString().split("T")[0];
			onAddDocument({
				id: `doc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
				name: file.name,
				date: today,
				fileType: ext,
				url: "#",
			});
		});
		if (fileInputRef.current) fileInputRef.current.value = "";
	};

	return (
		<div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs">
			<h2 className="border-b border-slate-100 pb-4 text-base font-semibold text-slate-900">
				{t(localizationConstants.dataItSystemCreateDocumentsCard)}
			</h2>

			{/* Upload Area matching Figma Screenshot 1 */}
			<div className="mt-5 space-y-2">
				<p className="text-xs font-semibold text-slate-800">
					{t(localizationConstants.dataItSystemCreateUploadHintTitle)}
				</p>
				<p className="text-xs text-slate-500">
					{t(localizationConstants.dataItSystemCreateUploadHintDesc)}
				</p>

				<div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
					{/* Dropdown template selector */}
					<div className="relative flex-1">
						<select
							onChange={(e) => {
								if (e.target.value) {
									const tpl = AVAILABLE_SYSTEM_DOCUMENT_TEMPLATES.find(
										(item: SystemDocument) => item.id === e.target.value,
									);
									if (tpl) onAddDocument(tpl);
									e.target.value = "";
								}
							}}
							defaultValue=""
							className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3.5 text-xs text-slate-700 transition-colors focus:border-slate-400 focus:outline-hidden"
						>
							<option value="" disabled>
								{t(localizationConstants.dataItSystemCreateUploadSelectPlaceholder)}
							</option>
							{AVAILABLE_SYSTEM_DOCUMENT_TEMPLATES.map((tpl: SystemDocument) => (
								<option key={tpl.id} value={tpl.id}>
									{tpl.name} ({tpl.fileType})
								</option>
							))}
						</select>
					</div>

					{/* Hidden native file input */}
					<input
						ref={fileInputRef}
						type="file"
						multiple
						accept=".png,.jpg,.jpeg,.pdf,.doc,.docx"
						onChange={handleNativeFileUpload}
						className="hidden"
					/>

					{/* Upload button */}
					<button
						type="button"
						onClick={() => fileInputRef.current?.click()}
						className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-slate-900 px-5 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 transition-colors"
					>
						<Upload className="h-4 w-4" />
						<span>{t(localizationConstants.dataItSystemCreateUploadBtn)}</span>
					</button>
				</div>
			</div>

			{/* Preview banner */}
			{activePreview && (
				<div className="mt-4 flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-700">
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
			<div className="mt-6 overflow-x-auto">
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
												onClick={() => setActivePreview(doc.name)}
												className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
											>
												{t(localizationConstants.dataItSystemActionViewFile)}
											</button>
											<button
												type="button"
												onClick={() => onRemoveDocument(doc.id)}
												className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
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

export default SystemCreateDocumentsCard;
