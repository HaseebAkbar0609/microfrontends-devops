"use client";

import React, { useState } from "react";
import {
	FileText,
	MoreVertical,
	Eye,
	Download,
	Archive,
	Trash2,
	Briefcase,
	X,
	UploadCloud,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { ContractInfo } from "../../../types/personnelOverview.types";

interface ViewContractSectionProps {
	contract: ContractInfo;
	onPreview: (fileName: string) => void;
	onDownload: (fileName: string) => void;
	onArchive: () => void;
	onDelete: () => void;
	onUpload: (files: string[]) => void;
}

export function ViewContractSection({
	contract,
	onPreview,
	onDownload,
	onArchive,
	onDelete,
	onUpload,
}: ViewContractSectionProps) {
	const [tags, setTags] = useState<string[]>(["Document 1.pdf", "Document 2.doc"]);

	const handleRemoveTag = (tag: string) => {
		setTags((prev) => prev.filter((t) => t !== tag));
	};

	const handleUploadClick = () => {
		onUpload(tags);
	};

	return (
		<div className="space-y-4">
			{/* Top Contract Card matching Screenshot 5 */}
			<div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
				<div className="flex items-center justify-between border-b border-slate-100 pb-3">
					<div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 text-xs font-semibold text-slate-800">
						<Translate text={localizationConstants.employmentContractTitle} />
					</div>
				</div>

				<div className="space-y-2">
					<span className="text-xs font-medium text-slate-500">
						<Translate text={localizationConstants.signedDateLabel} />
					</span>
					<div className="text-xs font-mono font-semibold text-slate-900">
						{contract.signedDate || "2025-10-05"}
					</div>
				</div>

				{/* File pill with 3-dot dropdown */}
				<div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors">
					<div className="flex items-center gap-3 min-w-0">
						<div className="w-8 h-8 rounded-md bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0">
							<FileText className="w-4 h-4" />
						</div>
						<div className="min-w-0">
							<span className="text-xs font-medium text-slate-900 block truncate">
								{contract.fileName || "Anställningsavtal.pdf"}
							</span>
							<span className="text-[11px] text-slate-500">
								{contract.fileSize || "1.2 MB"} • PDF
							</span>
						</div>
					</div>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								type="button"
								variant="ghost"
								size="icon"
								className="h-8 w-8 text-slate-500 hover:text-slate-800 rounded-md cursor-pointer"
							>
								<MoreVertical className="w-4 h-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-36">
							<DropdownMenuItem
								onClick={() => onPreview(contract.fileName)}
								className="cursor-pointer gap-2 text-xs"
							>
								<Eye className="w-3.5 h-3.5 text-slate-500" />
								<Translate text={localizationConstants.actionSeeFile} />
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => onDownload(contract.fileName)}
								className="cursor-pointer gap-2 text-xs"
							>
								<Download className="w-3.5 h-3.5 text-slate-500" />
								<Translate text={localizationConstants.actionDownload} />
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={onArchive}
								className="cursor-pointer gap-2 text-xs"
							>
								<Archive className="w-3.5 h-3.5 text-slate-500" />
								<Translate text={localizationConstants.actionArchive} />
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={onDelete}
								className="cursor-pointer gap-2 text-xs text-rose-600 focus:text-rose-700 focus:bg-rose-50"
							>
								<Trash2 className="w-3.5 h-3.5 text-rose-600" />
								<Translate text={localizationConstants.actionDelete} />
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>

			{/* Upload Kontrakt Box matching Screenshot 5 */}
			<div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
				<div className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-100 bg-slate-50/50">
					<div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
						<Briefcase className="w-4 h-4" />
					</div>
					<h2 className="text-sm font-semibold text-slate-900">
						<Translate text={localizationConstants.uploadContractTitle} />
					</h2>
				</div>

				<div className="p-5 space-y-4">
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
								<span className="text-xs text-slate-400 pl-2">
									Inga valda filer
								</span>
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
			</div>
		</div>
	);
}
