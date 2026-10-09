"use client";

import React, { useRef, useState } from "react";
import { ChevronDown, Upload, X } from "lucide-react";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { AVAILABLE_SYSTEM_DOCUMENT_TEMPLATES } from "@/features/data-it/constants/dataItSystem.mock";
import { showToast } from "@/lib/toast";
import type { SystemDocument } from "@/features/data-it/types/dataItSystem.types";

interface SystemCreateDocumentUploadProps {
	onCommitDocuments: (docs: SystemDocument[]) => void;
}

export const SystemCreateDocumentUpload: React.FC<
	SystemCreateDocumentUploadProps
> = ({ onCommitDocuments }) => {
	const t = useTranslate();
	const fileInputRef = useRef<HTMLInputElement>(null);

	// Staged pills matching Figma View 1: [Document 1.pdf ✕] [Document 2.doc ✕]
	const [stagedFiles, setStagedFiles] = useState<SystemDocument[]>([
		{
			id: "staged_1",
			name: "Document 1.pdf",
			date: new Date().toISOString().split("T")[0],
			fileType: "PDF",
			url: "#",
		},
		{
			id: "staged_2",
			name: "Document 2.doc",
			date: new Date().toISOString().split("T")[0],
			fileType: "DOC",
			url: "#",
		},
	]);

	const removeStaged = (id: string) => {
		setStagedFiles((prev) => prev.filter((item) => item.id !== id));
	};

	const handleNativeFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (!files || files.length === 0) return;
		const today = new Date().toISOString().split("T")[0];

		const added: SystemDocument[] = Array.from(files).map((file) => {
			const ext = file.name.split(".").pop()?.toUpperCase() || "PDF";
			return {
				id: `staged_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
				name: file.name,
				date: today,
				fileType: ext,
				url: "#",
			};
		});

		setStagedFiles((prev) => [...prev, ...added]);
		if (fileInputRef.current) fileInputRef.current.value = "";
	};

	const handleUploadClick = () => {
		if (stagedFiles.length === 0) {
			fileInputRef.current?.click();
			return;
		}
		onCommitDocuments(stagedFiles);
		setStagedFiles([]);
		showToast(
			"success",
			t(localizationConstants.dataItSystemCreateUploadStagedUploadedToast),
		);
	};

	return (
		<div className="mt-5 space-y-2">
			<p className="text-xs font-semibold text-slate-800">
				{t(localizationConstants.dataItSystemCreateUploadHintTitle)}
			</p>
			<p className="text-xs text-slate-500">
				{t(localizationConstants.dataItSystemCreateUploadHintDesc)}
			</p>

			<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
				{/* Multi-pill container matching Figma View 1 */}
				<div className="relative flex min-h-10 flex-1 flex-wrap items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 transition-colors focus-within:border-slate-400">
					{stagedFiles.length === 0 ? (
						<button
							type="button"
							onClick={() => fileInputRef.current?.click()}
							className="text-left text-xs text-slate-400 hover:text-slate-600"
						>
							{t(localizationConstants.dataItSystemCreateUploadStagedNone)}
						</button>
					) : (
						stagedFiles.map((doc) => (
							<span
								key={doc.id}
								className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700"
							>
								<span className="truncate max-w-[140px]">{doc.name}</span>
								<button
									type="button"
									onClick={() => removeStaged(doc.id)}
									className="text-slate-400 hover:text-slate-700 transition-colors"
									aria-label={`${t(localizationConstants.dataItSystemClose)} ${doc.name}`}
								>
									<X className="h-3 w-3" />
								</button>
							</span>
						))
					)}

					{/* Template picker quick trigger */}
					<div className="ml-auto flex items-center gap-1 pl-2">
						<select
							onChange={(e) => {
								if (e.target.value) {
									const tpl = AVAILABLE_SYSTEM_DOCUMENT_TEMPLATES.find(
										(item: SystemDocument) => item.id === e.target.value,
									);
									if (tpl) {
										setStagedFiles((prev) => [
											...prev,
											{
												...tpl,
												id: `staged_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
											},
										]);
									}
									e.target.value = "";
								}
							}}
							defaultValue=""
							className="absolute inset-0 h-full w-full opacity-0 cursor-pointer"
							aria-label={t(localizationConstants.dataItSystemCreateUploadSelectPlaceholder)}
						>
							<option value="" disabled>
								{t(localizationConstants.dataItSystemCreateUploadSelectPlaceholder)}
							</option>
							{AVAILABLE_SYSTEM_DOCUMENT_TEMPLATES.map((tpl: SystemDocument) => (
								<option key={tpl.id} value={tpl.id}>
									{tpl.name} ({tpl.fileType})
								</option>
							))}
						</select>
						<ChevronDown className="pointer-events-none h-4 w-4 text-slate-400" />
					</div>
				</div>

				{/* Native File Input (Hidden) */}
				<input
					ref={fileInputRef}
					type="file"
					multiple
					accept=".png,.jpg,.jpeg,.pdf"
					onChange={handleNativeFileUpload}
					className="hidden"
				/>

				{/* Upload Button */}
				<button
					type="button"
					onClick={handleUploadClick}
					className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-slate-900 px-5 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 transition-colors shrink-0"
				>
					<Upload className="h-4 w-4" />
					<span>{t(localizationConstants.dataItSystemCreateUploadBtn)}</span>
				</button>
			</div>
		</div>
	);
};

export default SystemCreateDocumentUpload;
