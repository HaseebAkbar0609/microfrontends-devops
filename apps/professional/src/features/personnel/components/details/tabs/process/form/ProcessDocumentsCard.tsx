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
	onUpload: () => void;
	onDeleteDoc: (docId: string) => void;
	onPreviewDoc: (name: string) => void;
}

export function ProcessDocumentsCard({
	documents,
	uploadTags,
	onRemoveTag,
	onUpload,
	onDeleteDoc,
	onPreviewDoc,
}: ProcessDocumentsCardProps) {
	return (
		<div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-5">
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
					<div className="flex-1 flex flex-wrap items-center gap-1.5 p-1.5 rounded-lg border border-slate-200 bg-slate-50/50 min-h-[38px]">
						{uploadTags.map((tag) => (
							<span
								key={tag}
								className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white border border-slate-200 text-xs text-slate-800 shadow-2xs"
							>
								<FileText className="w-3 h-3 text-slate-400" />
								{tag}
								<button
									type="button"
									onClick={() => onRemoveTag(tag)}
									className="text-slate-400 hover:text-slate-700 ml-0.5 cursor-pointer"
								>
									<X className="w-3 h-3" />
								</button>
							</span>
						))}
						{uploadTags.length === 0 && (
							<span className="text-xs text-slate-400 pl-2">Inga valda filer</span>
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
									<span className="sr-only">Actions</span>
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-100">
							{documents.map((doc) => (
								<tr key={doc.id} className="hover:bg-slate-50/60 transition-colors">
									<td className="py-2.5 px-4 font-mono text-slate-600">{doc.date}</td>
									<td className="py-2.5 px-4">
										<div className="flex items-center gap-2">
											<span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700">
												PDF
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
