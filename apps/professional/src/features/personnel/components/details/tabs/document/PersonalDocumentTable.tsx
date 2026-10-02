"use client";

import React from "react";
import { ArrowUpDown, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { PersonalDocumentFileItem } from "@/features/personnel/types/personalDocument.types";

interface PersonalDocumentTableProps {
	documents: PersonalDocumentFileItem[];
	onPreviewDoc: (name: string) => void;
	onPromptDelete: (doc: PersonalDocumentFileItem) => void;
}

export function PersonalDocumentTable({
	documents,
	onPreviewDoc,
	onPromptDelete,
}: PersonalDocumentTableProps) {
	return (
		<div className="space-y-3 pt-2">
			<h4 className="text-xs font-bold text-slate-900">
				<Translate text={localizationConstants.personalDocSpecsTitle} />
			</h4>

			<div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
				<table className="w-full text-left text-xs">
					<thead>
						<tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-medium">
							<th className="py-2.5 px-4 w-36">
								<div className="flex items-center gap-1 cursor-pointer select-none hover:text-slate-800">
									<Translate text={localizationConstants.personalDocColDate} />
									<ArrowUpDown className="w-3 h-3 text-slate-400" />
								</div>
							</th>
							<th className="py-2.5 px-4">
								<div className="flex items-center gap-1 cursor-pointer select-none hover:text-slate-800">
									<Translate text={localizationConstants.personalDocColName} />
									<ArrowUpDown className="w-3 h-3 text-slate-400" />
								</div>
							</th>
							<th className="py-2.5 px-4 w-28">
								<div className="flex items-center gap-1 cursor-pointer select-none hover:text-slate-800">
									<Translate text={localizationConstants.personalDocColFormat} />
									<ArrowUpDown className="w-3 h-3 text-slate-400" />
								</div>
							</th>
							<th className="py-2.5 px-4 text-right w-36">
								<span className="sr-only">Actions</span>
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-slate-100">
						{documents.map((doc) => (
							<tr key={doc.id} className="hover:bg-slate-50/60 transition-colors">
								{/* Date */}
								<td className="py-3 px-4 font-mono text-slate-600">{doc.date}</td>

								{/* Name */}
								<td className="py-3 px-4">
									<div className="flex items-center gap-2.5">
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

								{/* Format */}
								<td className="py-3 px-4 text-slate-600 uppercase font-mono text-[11px]">
									{doc.fileFormat}
								</td>

								{/* Actions */}
								<td className="py-3 px-4 text-right">
									<div className="flex items-center justify-end gap-1.5">
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={() => onPreviewDoc(doc.name)}
											className="h-7 px-3 text-xs font-medium border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer"
										>
											<Eye className="w-3 h-3 mr-1" />
											<Translate text={localizationConstants.personalDocBtnViewFile} />
										</Button>
										<Button
											type="button"
											variant="ghost"
											size="icon"
											onClick={() => onPromptDelete(doc)}
											className="h-7 w-7 text-slate-400 hover:text-rose-600 cursor-pointer"
										>
											<Trash2 className="w-3.5 h-3.5" />
										</Button>
									</div>
								</td>
							</tr>
						))}

						{documents.length === 0 && (
							<tr>
								<td colSpan={4} className="py-8 text-center text-slate-400 text-xs">
									Inga dokument uppladdade
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}
