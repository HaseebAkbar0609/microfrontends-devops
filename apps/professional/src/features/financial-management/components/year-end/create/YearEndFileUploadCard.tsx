"use client";

import React, { useRef, useState } from "react";
import { UploadCloud, CheckCircle2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

interface YearEndFileUploadCardProps {
	fileName: string;
	fileType: "PDF" | "DOC" | "DOCX" | "PNG" | "JPG" | "XLSX";
	fileSize?: string;
	onFileChange: (file: File) => void;
}

export function YearEndFileUploadCard({
	fileName,
	fileType,
	fileSize,
	onFileChange,
}: YearEndFileUploadCardProps) {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [isDragOver, setIsDragOver] = useState(false);

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files && files.length > 0) {
			onFileChange(files[0]);
		}
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragOver(false);
		if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
			onFileChange(e.dataTransfer.files[0]);
		}
	};

	return (
		<div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
			<div className="px-6 py-4 border-b border-slate-100 bg-white">
				<h2 className="text-sm font-bold text-slate-900">
					<Translate text={localizationConstants.sectionFileAttachmentYearEnd} />
				</h2>
			</div>

			<div className="p-6 space-y-4 text-xs">
				<div>
					<Label className="text-xs font-semibold text-slate-700 mb-1.5 block">
						<Translate text={localizationConstants.colFile} />
					</Label>
					<div
						onClick={() => fileInputRef.current?.click()}
						onDragOver={(e) => {
							e.preventDefault();
							setIsDragOver(true);
						}}
						onDragLeave={() => setIsDragOver(false)}
						onDrop={handleDrop}
						className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
							isDragOver
								? "border-slate-800 bg-slate-100"
								: "border-slate-200 hover:border-slate-400 bg-slate-50/50"
						}`}
					>
						<input
							ref={fileInputRef}
							type="file"
							accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.xlsx"
							onChange={handleFileSelect}
							className="hidden"
						/>
						<div className="flex flex-col items-center justify-center gap-2 text-slate-500">
							<div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
								<UploadCloud className="h-5 w-5" />
							</div>
							<p className="text-xs font-medium text-slate-800">
								<Translate text={localizationConstants.fieldDropFileOrBrowse} />
							</p>
							<p className="text-[11px] text-slate-400">
								<Translate text={localizationConstants.fileUploadHintYearEnd} />
							</p>
							{fileName && (
								<div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800 text-xs shadow-2xs">
									<CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
									<span className="text-slate-500">
										<Translate text={localizationConstants.selectedFileLabelYearEnd} />:
									</span>
									<span className="font-bold text-slate-900">{fileName}</span>
									<span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 uppercase">
										{fileType}
									</span>
									{fileSize && (
										<span className="text-slate-400 text-[10px]">({fileSize})</span>
									)}
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default YearEndFileUploadCard;
