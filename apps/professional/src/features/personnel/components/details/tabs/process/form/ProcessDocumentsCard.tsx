"use client";

import React from "react";
import { Folder, UploadCloud, FileText, X, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { ProcessDocumentItem } from "@/features/personnel/types/personalProcess.types";

interface ProcessDocumentsCardProps {
	documents: ProcessDocumentItem[];
	uploadTags: string[];
	onRemoveTag: (tag: string) => void;
	onFilesSelected?: (files: FileList) => void;
	onUpload: () => void;
	onDeleteDoc: (docId: string) => void;
	onPreviewDoc: (name: string) => void;
}

function getFormatBadgeStyle(format: string) {
	const f = format.toLowerCase();
	if (f === "pdf") {
		return "bg-rose-100 text-rose-700";
	}
	if (f === "doc" || f === "docx") {
		return "bg-blue-100 text-blue-700";
	}
	if (f === "xls" || f === "xlsx") {
		return "bg-emerald-100 text-emerald-700";
	}
	if (f === "png" || f === "jpg" || f === "jpeg") {
		return "bg-amber-100 text-amber-700";
	}
	return "bg-slate-100 text-slate-700";
}

export function ProcessDocumentsCard({
	documents,
	uploadTags,
	onRemoveTag,
	onFilesSelected,
	onUpload,
	onDeleteDoc,
	onPreviewDoc,
}: ProcessDocumentsCardProps) {
	const fileInputRef = React.useRef<HTMLInputElement>(null);

	const handleBoxClick = () => {
		fileInputRef.current?.click();
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0 && onFilesSelected) {
			onFilesSelected(e.target.files);
		}
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	return (
		<div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-5">
			{/* Hidden file picker input */}
			<input
				type="file"
				ref={fileInputRef}
				multiple
				onChange={handleFileChange}
				className="hidden"
				accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xlsx"
			/>

			{/* Header */}
			<div className="flex items-center gap-2">
				<Folder className="w-4 h-4 text-slate-700" />
				<h3 className="text-xs font-bold text-slate-900">
					<Translate text={localizationConstants.processSectionDocs} />
				</h3>
			</div>

			{/* Upload Box */}
			<div className="space-y-2">
				<div>
					<p className="text-xs font-semibold text-slate-900">
						<Translate text={localizationConstants.personalDocUploadTitle} />
					</p>
					<p className="text-[11px] text-slate-400">
						<Translate text={localizationConstants.processDocsUploadHint} />
					</p>
				</div>

				<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
					<div
						onClick={handleBoxClick}
						className="flex-1 flex flex-wrap items-center gap-1.5 p-1.5 rounded-lg border border-slate-200 bg-slate-50/50 min-h-[38px] cursor-pointer hover:border-slate-300 transition-colors"
					>
						{uploadTags.map((tag) => (
							<span
								key={tag}
								className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white border border-slate-200 text-xs text-slate-800 shadow-2xs"
								onClick={(e) => e.stopPropagation()}
							>
								<FileText className="w-3 h-3 text-slate-400" />
								{tag}
								<button
									type="button"
									onClick={(e) => {
										e.stopPropagation();
										onRemoveTag(tag);
									}}
									className="text-slate-400 hover:text-slate-700 ml-0.5 cursor-pointer"
								>
									<X className="w-3 h-3" />
								</button>
							</span>
						))}
						{uploadTags.length === 0 && (
							<span className="text-xs text-slate-400 pl-2">
								<Translate text={localizationConstants.processNoFilesSelected} />
							</span>
						)}
					</div>

					<Button
						type="button"
						onClick={onUpload}
						className="h-9 px-4 text-xs font-medium bg-[#111721] hover:bg-slate-800 text-white rounded-lg cursor-pointer shadow-2xs gap-1.5 shrink-0"
					>
						<UploadCloud className="w-4 h-4" />
						<Translate text={localizationConstants.processDocsUploadBtn} />
					</Button>
				</div>
			</div>

			{/* Specification Table */}
			<div className="space-y-2 pt-2">
				<h4 className="text-xs font-bold text-slate-900">
					<Translate text={localizationConstants.processDocsSpecTitle} />
				</h4>

				<div className="overflow-x-auto rounded-lg border border-slate-200">
					<table className="w-full text-left text-xs">
						<thead>
							<tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-medium">
								<th className="py-2.5 px-4">
									<Translate text={localizationConstants.processDocsColDate} />
								</th>
								<th className="py-2.5 px-4">
									<Translate text={localizationConstants.processDocsColName} />
								</th>
								<th className="py-2.5 px-4">
									<Translate text={localizationConstants.processDocsColFormat} />
								</th>
								<th className="py-2.5 px-4 text-right">
									<span className="sr-only">
										<Translate text={localizationConstants.processColActions} />
									</span>
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-100">
							{documents.map((doc) => (
								<tr key={doc.id} className="hover:bg-slate-50/60 transition-colors">
									<td className="py-2.5 px-4 font-mono text-slate-600">{doc.date}</td>
									<td className="py-2.5 px-4">
										<div className="flex items-center gap-2">
											<span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${getFormatBadgeStyle(doc.fileFormat)}`}>
												{doc.fileFormat.toUpperCase()}
											</span>
											<span
												onClick={() => onPreviewDoc(doc.name)}
												className="font-medium text-slate-800 cursor-pointer hover:underline"
											>
												{doc.name}
											</span>
										</div>
									</td>
									<td className="py-2.5 px-4 text-slate-600 uppercase font-mono text-[11px]">
										{doc.fileFormat}
									</td>
									<td className="py-2.5 px-4 text-right">
										<div className="flex items-center justify-end gap-1">
											<Button
												type="button"
												variant="outline"
												size="sm"
												onClick={() => onPreviewDoc(doc.name)}
												className="h-7 px-2.5 text-xs font-medium border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer"
											>
												<Eye className="w-3 h-3 mr-1" />
												<Translate text={localizationConstants.processBtnViewFile} />
											</Button>
											<Button
												type="button"
												variant="ghost"
												size="icon"
												onClick={() => onDeleteDoc(doc.id)}
												className="h-7 w-7 text-slate-400 hover:text-rose-600 cursor-pointer"
											>
												<Trash2 className="w-3.5 h-3.5" />
											</Button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
