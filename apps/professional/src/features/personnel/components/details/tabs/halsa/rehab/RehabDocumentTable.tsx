"use client";

import React from "react";
import { FileText, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { RehabDocumentItem } from "@/features/personnel/types/halsa.types";

interface RehabDocumentTableProps {
	documents: RehabDocumentItem[];
	onPreviewDoc: (name: string) => void;
}

export function RehabDocumentTable({
	documents,
	onPreviewDoc,
}: RehabDocumentTableProps) {
	if (documents.length === 0) return null;

	return (
		<div className="pt-4 border-t border-slate-100 space-y-3">
			<h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
				<Translate text={localizationConstants.rehabAttachedDocsTitle} />
			</h4>

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
				{documents.map((doc) => (
					<div
						key={doc.id}
						className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors"
					>
						<div className="flex items-center gap-3 overflow-hidden">
							<div className="w-8 h-8 rounded bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0">
								<FileText className="w-4 h-4" />
							</div>
							<div className="truncate">
								<p className="text-xs font-bold text-slate-800 truncate">{doc.name}</p>
								<p className="text-[11px] text-slate-400">
									{doc.date} {doc.fileSize && `• ${doc.fileSize}`}
								</p>
							</div>
						</div>

						<div className="flex items-center gap-1 shrink-0">
							<Button
								type="button"
								variant="ghost"
								size="sm"
								onClick={() => onPreviewDoc(doc.name)}
								className="h-8 px-2 text-xs text-sky-700 hover:text-sky-800 hover:bg-sky-50 cursor-pointer font-medium"
							>
								<Eye className="w-3.5 h-3.5 mr-1" />
								<Translate text={localizationConstants.rehabBtnViewFile} />
							</Button>
							<Button
								type="button"
								variant="ghost"
								size="icon"
								onClick={() => onPreviewDoc(doc.name)}
								className="h-8 w-8 text-slate-400 hover:text-slate-700 cursor-pointer"
							>
								<Download className="w-3.5 h-3.5" />
							</Button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
