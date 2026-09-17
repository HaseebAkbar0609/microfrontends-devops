"use client";

import React, { useRef } from "react";
import { Trash2, ChevronDown, Plus } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { PdfFileIcon } from "@/components/ui/PdfFileIcon";
import type { CaseDocument } from "../../../types/cases.types";

interface DocumentUploadSectionProps {
	documents: CaseDocument[];
	onAddDocument: (doc: CaseDocument) => void;
	onRemoveDocument: (id: string) => void;
}

function formatBytes(bytes: number): string {
	if (bytes === 0) return "0 B";
	const k = 1024;
	const sizes = ["B", "KB", "MB", "GB"];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function DocumentUploadSection({
	documents,
	onAddDocument,
	onRemoveDocument,
}: DocumentUploadSectionProps) {
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (!files || files.length === 0) return;

		for (let i = 0; i < files.length; i++) {
			const file = files[i];
			const newDoc: CaseDocument = {
				id: crypto.randomUUID(),
				name: file.name,
				date: new Date().toISOString().split("T")[0],
				fileType: file.type || "application/pdf",
				fileSize: formatBytes(file.size),
				url: URL.createObjectURL(file),
				category: "document",
			};
			onAddDocument(newDoc);
		}

		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	return (
		<div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-4">
			<h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
				<Translate text={localizationConstants.casesDocumentsSectionTitle} />
			</h2>

			<div className="space-y-0.5">
				<p className="text-xs font-semibold text-slate-800">
					<Translate text={localizationConstants.casesUploadYourFiles} />
				</p>
				<p className="text-[11px] text-slate-400">
					<Translate text={localizationConstants.casesUploadFormats} />
				</p>
			</div>

			<input
				ref={fileInputRef}
				type="file"
				multiple
				accept=".pdf,.doc,.docx,.xlsx,.txt"
				className="hidden"
				onChange={handleFileChange}
			/>

			{/* File picker selector button matching Figma */}
			<div className="flex flex-wrap items-center gap-3 pt-1">
				<button
					type="button"
					onClick={() => fileInputRef.current?.click()}
					className="flex-1 min-w-[280px] h-[38px] px-3 bg-white border border-slate-200 hover:border-slate-300 rounded-lg flex items-center justify-between gap-2 text-xs text-slate-600 cursor-pointer transition-colors"
				>
					<span className="flex items-center gap-1.5 text-slate-500">
						<Plus className="w-3.5 h-3.5 text-slate-400" />
						<Translate text={localizationConstants.casesSelectFiles} />
					</span>
					<ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
				</button>

				<button
					type="button"
					onClick={() => fileInputRef.current?.click()}
					className="h-[38px] px-5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
				>
					<Translate text={localizationConstants.casesBtnUpload} />
				</button>
			</div>

			{/* Table of uploaded documents */}
			<div className="border border-slate-200 rounded-lg overflow-hidden mt-4">
				<table className="w-full text-left text-xs">
					<thead>
						<tr className="bg-slate-50/50 border-b border-slate-200 text-slate-500 font-medium text-[11px]">
							<th className="py-3 px-4">
								<Translate text={localizationConstants.casesColDocDate} /> ⇅
							</th>
							<th className="py-3 px-4">
								<Translate text={localizationConstants.casesColDocName} /> ⇅
							</th>
							<th className="py-3 px-4">
								<Translate text={localizationConstants.casesColDocFile} /> ⇅
							</th>
							<th className="py-3 px-4 text-right"></th>
						</tr>
					</thead>
					<tbody className="divide-y divide-slate-100 bg-white">
						{documents.length === 0 ? (
							<tr>
								<td colSpan={4} className="py-6 text-center text-slate-400 italic">
									<Translate text={localizationConstants.casesNoItemsFound} />
								</td>
							</tr>
						) : (
							documents.map((doc) => (
								<tr key={doc.id} className="hover:bg-slate-50/60 transition-colors">
									<td className="py-3 px-4 text-slate-600 whitespace-nowrap">{doc.date}</td>
									<td className="py-3 px-4 text-slate-800 font-medium">
										<div className="flex items-center gap-2">
											<PdfFileIcon className="h-6 w-5" />
											<span className="truncate max-w-[240px]">{doc.name}</span>
										</div>
									</td>
									<td className="py-3 px-4 text-slate-600 uppercase">{doc.fileSize || "PDF"}</td>
									<td className="py-3 px-4 text-right whitespace-nowrap">
										<div className="flex items-center justify-end gap-3">
											{doc.url && (
												<button
													type="button"
													onClick={() => window.open(doc.url, "_blank")}
													className="px-3 py-1 rounded border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium cursor-pointer transition-colors"
												>
													<Translate text={localizationConstants.casesBtnViewFile} />
												</button>
											)}
											<button
												type="button"
												onClick={() => onRemoveDocument(doc.id)}
												className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer transition-colors"
												aria-label="Remove document"
											>
												<Trash2 className="w-3.5 h-3.5" />
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
}

export default DocumentUploadSection;
