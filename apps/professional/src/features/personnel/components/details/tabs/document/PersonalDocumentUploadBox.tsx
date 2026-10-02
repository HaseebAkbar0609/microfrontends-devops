"use client";

import React from "react";
import { Folder, UploadCloud, FileText, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

interface PersonalDocumentUploadBoxProps {
	tags: string[];
	onRemoveTag: (tag: string) => void;
	onUpload: () => void;
}

export function PersonalDocumentUploadBox({
	tags,
	onRemoveTag,
	onUpload,
}: PersonalDocumentUploadBoxProps) {
	return (
		<div className="space-y-4">
			{/* Card Title */}
			<div className="flex items-center gap-2">
				<Folder className="w-4 h-4 text-slate-700" />
				<h3 className="text-xs font-bold text-slate-900">
					<Translate text={localizationConstants.personalDocOverviewTitle} />
				</h3>
			</div>

			{/* Subtitle / Hint */}
			<div className="space-y-1">
				<p className="text-xs font-semibold text-slate-900">
					<Translate text={localizationConstants.personalDocUploadTitle} />
				</p>
				<p className="text-[11px] text-slate-400">
					<Translate text={localizationConstants.personalDocUploadHint} />
				</p>
			</div>

			{/* Upload Input & Button */}
			<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
				<div className="flex-1 flex items-center justify-between p-1.5 rounded-lg border border-slate-200 bg-white min-h-[38px] shadow-2xs">
					<div className="flex flex-wrap items-center gap-1.5">
						{tags.map((tag) => (
							<span
								key={tag}
								className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 text-xs text-slate-800"
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
						{tags.length === 0 && (
							<span className="text-xs text-slate-400 pl-2">Inga valda filer</span>
						)}
					</div>

					<ChevronDown className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
				</div>

				<Button
					type="button"
					onClick={onUpload}
					className="h-9 px-5 text-xs font-medium bg-[#111721] hover:bg-slate-800 text-white rounded-lg cursor-pointer shadow-2xs gap-1.5 shrink-0"
				>
					<UploadCloud className="w-4 h-4" />
					<Translate text={localizationConstants.personalDocUploadBtn} />
				</Button>
			</div>
		</div>
	);
}
