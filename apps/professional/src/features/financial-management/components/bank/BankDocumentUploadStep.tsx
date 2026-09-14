"use client";

import React, { useState, useRef } from "react";
import { FileText, Trash2, ArrowUpDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { BankDocumentItem } from "../../types/bank.types";

export interface BankDocumentUploadStepProps {
	documents: BankDocumentItem[];
	onAddDocument: (doc: Omit<BankDocumentItem, "id">) => void;
	onRemoveDocument: (index: number) => void;
}

export function BankDocumentUploadStep({
	documents,
	onAddDocument,
	onRemoveDocument,
}: BankDocumentUploadStepProps) {
	const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files) return;
		const newFiles = Array.from(e.target.files);
		setSelectedFiles((prev) => [...prev, ...newFiles]);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const handleRemoveSelectedFile = (idx: number) => {
		setSelectedFiles((prev) => prev.filter((_, i) => i !== idx));
	};

	const handleUpload = () => {
		if (selectedFiles.length === 0) return;
		selectedFiles.forEach((file) => {
			const ext = file.name.split(".").pop()?.toUpperCase() || "PDF";
			onAddDocument({
				date: new Date().toISOString().slice(0, 10),
				name: file.name,
				fileType: ext,
				fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
			});
		});
		setSelectedFiles([]);
	};

	return (
		<div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-6">
			<div>
				<h3 className="text-sm font-semibold text-slate-900 mb-1">
					<Translate text={localizationConstants.tabDokument} />
				</h3>
			</div>

			<div className="space-y-3">
				<div>
					<p className="text-xs font-medium text-slate-700">
						<Translate text={localizationConstants.uploadFilesTitle} />
					</p>
					<p className="text-[11px] text-slate-400">
						<Translate text={localizationConstants.uploadFilesSubtitle} />
					</p>
				</div>

				<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
					<div className="relative flex-1 flex flex-wrap items-center gap-1.5 p-2 min-h-10 bg-white border border-slate-200 rounded-lg shadow-2xs">
						{selectedFiles.map((file, idx) => (
							<span
								key={`${file.name}-${idx}`}
								className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-700 text-xs rounded-md border border-slate-200"
							>
								{file.name}
								<button
									type="button"
									onClick={() => handleRemoveSelectedFile(idx)}
									className="text-slate-400 hover:text-slate-600 cursor-pointer"
								>
									<X className="w-3 h-3" />
								</button>
							</span>
						))}

						<input
							ref={fileInputRef}
							type="file"
							multiple
							accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
							onChange={handleFileSelect}
							className="hidden"
							id="bank-doc-upload-input"
						/>
						<label
							htmlFor="bank-doc-upload-input"
							className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer py-1 px-2"
						>
							{selectedFiles.length === 0 && (
								<Translate text={localizationConstants.uploadFilePlaceholder} />
							)}
						</label>
					</div>

					<Button
						type="button"
						onClick={handleUpload}
						disabled={selectedFiles.length === 0}
						className="h-10 px-5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-lg cursor-pointer transition-colors shrink-0 disabled:opacity-50"
					>
						<Translate text={localizationConstants.btnUploadAction} />
					</Button>
				</div>
			</div>

			{/* Document Table */}
			<div className="border border-slate-200 rounded-lg overflow-hidden">
				<table className="w-full text-left text-xs">
					<thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-medium">
						<tr>
							<th className="px-4 py-3">
								<div className="flex items-center gap-1">
									<Translate text={localizationConstants.colDocDate} />
									<ArrowUpDown className="w-3 h-3 text-slate-400" />
								</div>
							</th>
							<th className="px-4 py-3">
								<div className="flex items-center gap-1">
									<Translate text={localizationConstants.colDocName} />
									<ArrowUpDown className="w-3 h-3 text-slate-400" />
								</div>
							</th>
							<th className="px-4 py-3">
								<div className="flex items-center gap-1">
									<Translate text={localizationConstants.colDocFileType} />
									<ArrowUpDown className="w-3 h-3 text-slate-400" />
								</div>
							</th>
							<th className="px-4 py-3 text-right"></th>
						</tr>
					</thead>
					<tbody className="divide-y divide-slate-100 bg-white">
						{documents.length === 0 ? (
							<tr>
								<td colSpan={4} className="px-4 py-8 text-center text-slate-400">
									<Translate text={localizationConstants.emptyBankDocsTitle} />
								</td>
							</tr>
						) : (
							documents.map((doc, index) => (
								<tr key={doc.id || index} className="hover:bg-slate-50/50">
									<td className="px-4 py-3 text-slate-600 whitespace-nowrap">
										{doc.date}
									</td>
									<td className="px-4 py-3">
										<div className="flex items-center gap-2">
											<div className="w-6 h-6 rounded bg-rose-50 border border-rose-200 flex items-center justify-center shrink-0">
												<FileText className="w-3.5 h-3.5 text-rose-600" />
											</div>
											<span className="font-medium text-slate-800">{doc.name}</span>
										</div>
									</td>
									<td className="px-4 py-3 text-slate-600 font-medium">
										{doc.fileType || "PDF"}
									</td>
									<td className="px-4 py-3 text-right whitespace-nowrap">
										<div className="flex items-center justify-end gap-2">
											<Button
												type="button"
												variant="outline"
												size="sm"
												className="h-7 px-2.5 text-xs text-slate-700 bg-white border-slate-200 hover:bg-slate-50"
												onClick={() => window.open(doc.fileUrl || "#", "_blank")}
											>
												<Translate text={localizationConstants.btnViewFile} />
											</Button>
											<Button
												type="button"
												variant="ghost"
												size="icon"
												className="h-7 w-7 text-slate-400 hover:text-rose-600 hover:bg-rose-50"
												onClick={() => onRemoveDocument(index)}
											>
												<Trash2 className="w-3.5 h-3.5" />
											</Button>
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

export default BankDocumentUploadStep;
