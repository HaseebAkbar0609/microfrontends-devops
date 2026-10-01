"use client";

import React, { useRef } from "react";
import { Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PdfFileIcon } from "@/components/ui/PdfFileIcon";
import { DocFileIcon } from "@/components/ui/DocFileIcon";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { ReviewDocumentItem } from "@/features/personnel/types/medarbetarsamtal.types";

interface Section7DocumentsProps {
	documents: ReviewDocumentItem[];
	onDocumentsChange: (items: ReviewDocumentItem[]) => void;
	uploadedChips: string[];
	onUploadedChipsChange: (chips: string[]) => void;
	onPreviewDoc?: (name: string) => void;
}

export function Section7Documents({
	documents,
	onDocumentsChange,
	uploadedChips,
	onUploadedChipsChange,
	onPreviewDoc,
}: Section7DocumentsProps) {
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleUploadClick = () => {
		fileInputRef.current?.click();
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files && files.length > 0) {
			const file = files[0];
			const fileName = file.name;
			const ext = fileName.split(".").pop()?.toLowerCase();
			const fileType = ext === "doc" || ext === "docx" ? "doc" : "pdf";
			const baseName = fileName.replace(/\.[^/.]+$/, "");

			onUploadedChipsChange([...uploadedChips, fileName]);
			onDocumentsChange([
				...documents,
				{
					id: `doc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
					date: new Date().toISOString().split("T")[0],
					name: baseName,
					fileType,
					fileName,
				},
			]);
		}
		if (fileInputRef.current) fileInputRef.current.value = "";
	};

	const handleRemoveChip = (chip: string) => {
		onUploadedChipsChange(uploadedChips.filter((c) => c !== chip));
	};

	const handleDeleteDoc = (id: string) => {
		onDocumentsChange(documents.filter((d) => d.id !== id));
	};

	return (
		<div className="space-y-4">
			<input
				type="file"
				ref={fileInputRef}
				onChange={handleFileChange}
				className="hidden"
				accept=".png,.jpg,.jpeg,.pdf,.doc,.docx"
			/>

			<div className="space-y-2">
				<Label className="text-xs font-semibold text-slate-700">
					<Translate text={localizationConstants.kompetensModalUploadLabel} />
				</Label>
				<p className="text-[11px] text-slate-400">
					<Translate text={localizationConstants.nyIncheckningUploadDocHint} />
				</p>

				<div className="flex items-center gap-2">
					<div className="flex-1 flex flex-wrap items-center gap-1.5 min-h-[36px] px-2.5 py-1 rounded-md border border-slate-200 bg-white">
						{uploadedChips.map((chip) => (
							<span
								key={chip}
								className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] rounded bg-slate-100 text-slate-700 border border-slate-200"
							>
								{chip}
								<button
									type="button"
									onClick={() => handleRemoveChip(chip)}
									className="text-slate-400 hover:text-slate-600 cursor-pointer"
								>
									<X className="h-3 w-3" />
								</button>
							</span>
						))}
					</div>
					<Button
						type="button"
						onClick={handleUploadClick}
						className="h-9 px-4 text-xs font-medium bg-slate-900 hover:bg-slate-800 text-white cursor-pointer shrink-0"
					>
						<Translate text={localizationConstants.kompetensModalUploadBtn} />
					</Button>
				</div>
			</div>

			<div className="space-y-2 pt-1">
				<h4 className="text-xs font-semibold text-slate-800">
					<Translate text={localizationConstants.kompetensDetailSpecification} />
				</h4>

				<div className="rounded-lg border border-slate-200 overflow-hidden">
					<table className="w-full text-xs text-left">
						<thead className="bg-slate-50/80 text-[11px] text-slate-500 font-medium border-b border-slate-200">
							<tr>
								<th className="py-2.5 px-3">
									<Translate text={localizationConstants.kompetensDocColDate} />
								</th>
								<th className="py-2.5 px-3">
									<Translate
										text={localizationConstants.kompetensDocColDocName}
									/>
								</th>
								<th className="py-2.5 px-3">
									<Translate text={localizationConstants.kompetensDocColFile} />
								</th>
								<th className="py-2.5 px-3 text-right"></th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-100">
							{documents.length === 0 ? (
								<tr>
									<td
										colSpan={4}
										className="py-4 text-center text-slate-400 text-xs"
									>
										Inga dokument bifogade
									</td>
								</tr>
							) : (
								documents.map((item) => (
									<tr key={item.id} className="hover:bg-slate-50/50">
										<td className="py-2.5 px-3 text-slate-600 font-mono text-[11px]">
											{item.date}
										</td>
										<td className="py-2.5 px-3">
											<div className="flex items-center gap-2">
												{item.fileType === "doc" ? (
													<DocFileIcon className="h-6 w-5 shrink-0" />
												) : (
													<PdfFileIcon className="h-6 w-5 shrink-0" />
												)}
												<span className="font-medium text-slate-800">
													{item.name}
												</span>
											</div>
										</td>
										<td className="py-2.5 px-3 text-slate-500 uppercase text-[10px] font-semibold">
											{item.fileType}
										</td>
										<td className="py-2.5 px-3 text-right">
											<div className="inline-flex items-center gap-2">
												<button
													type="button"
													onClick={() => onPreviewDoc?.(item.name)}
													className="text-[11px] font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
												>
													<Translate
														text={localizationConstants.kompetensDetailSeeFile}
													/>
												</button>
												<button
													type="button"
													onClick={() => handleDeleteDoc(item.id)}
													className="text-slate-400 hover:text-rose-500 cursor-pointer p-0.5"
												>
													<Trash2 className="h-3.5 w-3.5" />
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
		</div>
	);
}
