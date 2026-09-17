"use client";

import React, { useState } from "react";
import { ChevronDown, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { ClaimDocument } from "../../../types/claims.types";
import { ALLOWED_FILE_EXTENSIONS } from "../../../constants/claims.constants";

interface ClaimDocumentsStepCardProps {
	documents: ClaimDocument[];
	onAddDocument: (doc: Omit<ClaimDocument, "id">) => void;
	onRemoveDocument: (docId: string) => void;
	onViewDocument: (doc: ClaimDocument) => void;
	error?: string;
}

export function ClaimDocumentsStepCard({
	documents,
	onAddDocument,
	onRemoveDocument,
	onViewDocument,
	error,
}: ClaimDocumentsStepCardProps) {
	const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

	const handleRemoveSelectedChip = (index: number) => {
		setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
	};

	const handleNativeFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			const names = Array.from(e.target.files).map((f) => f.name);
			setSelectedFiles((prev) => [...prev, ...names]);
		}
	};

	const handleUploadClick = () => {
		if (selectedFiles.length === 0) return;

		selectedFiles.forEach((name) => {
			const ext = name.split(".").pop()?.toUpperCase() || "PDF";
			onAddDocument({
				date: new Date().toISOString().slice(0, 10),
				name: name,
				fileType: ext,
				fileSize: "1.4 MB",
			});
		});

		setSelectedFiles([]);
	};

	return (
		<div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
			<div className="px-6 py-3.5 border-b border-slate-200">
				<h2 className="text-sm font-semibold text-slate-900">
					<Translate text={localizationConstants.claimsTabDocuments} />
				</h2>
			</div>

			<div className="p-6 space-y-6">

			{/* Upload section */}
			<div>
				<h3 className="text-xs font-semibold text-slate-800 mb-1">
					<Translate text={localizationConstants.claimsUploadTitle} />
				</h3>
				<p className="text-xs text-slate-400 mb-3">
					<Translate text={localizationConstants.claimsUploadSubtitle} />
				</p>

				<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
					<div className="flex-1 min-h-[42px] px-3 py-1.5 bg-white border border-slate-200 rounded-md flex items-center justify-between gap-2 shadow-2xs">
						<div className="flex items-center flex-wrap gap-2 flex-1">
							{selectedFiles.map((fileName, idx) => (
								<span
									key={`${fileName}-${idx}`}
									className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-medium"
								>
									<span>{fileName}</span>
									<button
										type="button"
										onClick={() => handleRemoveSelectedChip(idx)}
										className="text-slate-400 hover:text-slate-600 cursor-pointer"
									>
										<X className="w-3 h-3" />
									</button>
								</span>
							))}

							<label className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer flex-1 py-1">
								{selectedFiles.length === 0 && <Translate text={localizationConstants.claimsSelectFiles} />}
								<input
									type="file"
									multiple
									accept={ALLOWED_FILE_EXTENSIONS}
									onChange={handleNativeFileSelect}
									className="hidden"
								/>
							</label>
						</div>

						<ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
					</div>

					<Button
						type="button"
						onClick={handleUploadClick}
						disabled={selectedFiles.length === 0}
						className="h-[42px] px-6 bg-slate-950 hover:bg-slate-800 text-white text-xs font-medium rounded-md cursor-pointer disabled:opacity-50 transition-colors shadow-2xs shrink-0"
					>
						<Translate text={localizationConstants.claimsBtnUpload} />
					</Button>
				</div>

				{error && (
					<div className="mt-2.5 px-3.5 py-2 bg-rose-50 border border-rose-200 rounded-md text-rose-600 text-xs font-medium">
						{error}
					</div>
				)}
			</div>

			{/* Attached Documents Table */}
			<div className="border border-slate-200 rounded-lg overflow-hidden mt-4">
				<table className="w-full text-left border-collapse">
					<thead>
						<tr className="border-b border-slate-200 bg-white text-xs font-medium text-slate-500 select-none">
							<th className="px-4 py-3">
								<Translate text={localizationConstants.claimsColDate} /> ↕
							</th>
							<th className="px-4 py-3">
								<Translate text={localizationConstants.claimsColDocName} /> ↕
							</th>
							<th className="px-4 py-3">
								<Translate text={localizationConstants.claimsColFileType} /> ↕
							</th>
							<th className="px-4 py-3 text-right border-l border-slate-200"></th>
						</tr>
					</thead>
					<tbody className="divide-y divide-slate-100">
						{documents.length === 0 ? (
							<tr>
								<td colSpan={4} className="px-6 py-8 text-center text-xs text-slate-400">
									<Translate text={localizationConstants.claimsNoDocsUploaded} />
								</td>
							</tr>
						) : (
							documents.map((doc, index) => (
								<tr key={`${doc.id}-${index}`} className="hover:bg-slate-50/80 transition-colors">
									<td className="px-4 py-3 text-xs text-slate-700">
										{doc.date}
									</td>
									<td className="px-4 py-3 text-xs text-slate-900 font-medium">
										<div className="flex items-center gap-2">
											<span className="inline-flex items-center justify-center w-5 h-5 bg-red-500 text-white text-[9px] font-bold rounded">
												PDF
											</span>
											<span>{doc.name}</span>
										</div>
									</td>
									<td className="px-4 py-3 text-xs text-slate-700">
										{doc.fileType}
									</td>
									<td className="px-4 py-3 text-right border-l border-slate-200">
										<div className="flex items-center justify-end gap-2">
											<Button
												type="button"
												variant="outline"
												size="sm"
												onClick={() => onViewDocument(doc)}
												className="h-7 px-3 text-xs text-slate-700 hover:text-slate-900 border-slate-200 cursor-pointer rounded-md bg-white hover:bg-slate-50"
											>
												<Translate text={localizationConstants.claimsBtnViewFile} />
											</Button>
											<Button
												type="button"
												variant="ghost"
												size="sm"
												onClick={() => onRemoveDocument(doc.id)}
												className="h-7 w-7 p-0 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
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
		</div>
	);
}

export default ClaimDocumentsStepCard;
