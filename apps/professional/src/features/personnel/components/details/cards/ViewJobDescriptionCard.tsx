"use client";

import React, { useState } from "react";
import { Briefcase, FileText, Trash2, X, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";

export interface JobDescriptionItem {
	id: string;
	date: string;
	name: string;
	fileType: "doc" | "pdf";
}

interface ViewJobDescriptionCardProps {
	items: JobDescriptionItem[];
	onDelete: (id: string) => void;
	onUpload: (tags: string[]) => void;
	onPreview?: (name: string) => void;
}

export function ViewJobDescriptionCard({
	items,
	onDelete,
	onUpload,
	onPreview,
}: ViewJobDescriptionCardProps) {
	const [tags, setTags] = useState<string[]>(["Document 1.pdf", "Document 2.doc"]);

	const handleRemoveTag = (tag: string) => {
		setTags((prev) => prev.filter((t) => t !== tag));
	};

	const handleUploadClick = () => {
		onUpload(tags);
	};

	return (
		<div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
			{/* Card Header matching Screenshot 4 */}
			<div className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-100 bg-slate-50/50">
				<div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
					<Briefcase className="w-4 h-4" />
				</div>
				<h2 className="text-sm font-semibold text-slate-900">
					<Translate text={localizationConstants.jobDescriptionTitle} />
				</h2>
			</div>

			<div className="p-5 space-y-6">
				{/* Upload files box */}
				<div className="space-y-3">
					<div>
						<h3 className="text-xs font-semibold text-slate-900 mb-0.5">
							<Translate text={localizationConstants.uploadFilesLabel} />
						</h3>
						<p className="text-xs text-slate-500">
							<Translate text={localizationConstants.uploadFilesSubtitle} />
						</p>
					</div>

					<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
						<div className="flex-1 flex flex-wrap items-center gap-2 p-2 rounded-lg border border-slate-200 bg-slate-50/40 min-h-[42px]">
							{tags.map((tag) => (
								<span
									key={tag}
									className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-slate-200 text-xs text-slate-800 shadow-2xs"
								>
									<FileText className="w-3 h-3 text-slate-500" />
									{tag}
									<button
										type="button"
										onClick={() => handleRemoveTag(tag)}
										className="text-slate-400 hover:text-slate-700 ml-1 cursor-pointer"
									>
										<X className="w-3 h-3" />
									</button>
								</span>
							))}
							{tags.length === 0 && (
								<span className="text-xs text-slate-400 pl-2">Inga valda filer</span>
							)}
						</div>

						<Button
							type="button"
							onClick={handleUploadClick}
							className="bg-[#111721] hover:bg-slate-800 text-white text-xs h-10 px-5 rounded-lg cursor-pointer shadow-2xs gap-1.5"
						>
							<UploadCloud className="w-4 h-4" />
							<Translate text={localizationConstants.btnUpload} />
						</Button>
					</div>
				</div>

				{/* Table matching Screenshot 4 */}
				<div>
					<h3 className="text-xs font-semibold text-slate-900 mb-2">Dokument</h3>
					<div className="overflow-x-auto rounded-lg border border-slate-200">
						<table className="w-full text-left text-xs">
							<thead>
								<tr className="border-b border-slate-200 bg-slate-50/80 text-slate-600 font-medium">
									<th className="py-2.5 px-4">
										<Translate text={localizationConstants.colDate} />
									</th>
									<th className="py-2.5 px-4">
										<Translate text={localizationConstants.colDocName} />
									</th>
									<th className="py-2.5 px-4">
										<Translate text={localizationConstants.colFile} />
									</th>
									<th className="py-2.5 px-4 text-right">
										<Translate text={localizationConstants.tableSpecification} />
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-slate-100">
								{items.map((item) => (
									<tr
										key={item.id}
										className="hover:bg-slate-50/60 transition-colors text-slate-700"
									>
										<td className="py-3 px-4 font-mono">{item.date}</td>
										<td
											className="py-3 px-4 font-medium text-slate-900 cursor-pointer hover:underline"
											onClick={() => onPreview?.(item.name)}
										>
											{item.name}
										</td>
										<td className="py-3 px-4">
											{item.fileType === "doc" ? (
												<span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 border border-blue-200">
													DOC
												</span>
											) : (
												<span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-200">
													PDF
												</span>
											)}
										</td>
										<td className="py-3 px-4 text-right">
											<Button
												type="button"
												variant="ghost"
												size="icon"
												onClick={() => onDelete(item.id)}
												className="h-7 w-7 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md cursor-pointer"
											>
												<Trash2 className="w-3.5 h-3.5" />
											</Button>
										</td>
									</tr>
								))}
								{items.length === 0 && (
									<tr>
										<td colSpan={4} className="py-6 text-center text-slate-400 text-xs">
											<Translate text={localizationConstants.emptyDocumentsTitle} />
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
}
