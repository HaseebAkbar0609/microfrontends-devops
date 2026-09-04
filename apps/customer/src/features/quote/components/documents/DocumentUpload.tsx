"use client";

import { ChevronDown, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { useTranslate, Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { useState, useRef } from "react";
import { uploadMediaAPIAction, saveProjectDocumentAPIAction, deleteMediaAPIAction } from "@/api-actions";
import { showToast } from "@/lib/toast";

interface DocumentUploadProps {
	projectId: string;
	onUploadSuccess: () => void;
}

export function DocumentUpload({ projectId, onUploadSuccess }: DocumentUploadProps) {
	const t = useTranslate();
	const [files, setFiles] = useState<File[]>([]);
	const [comments, setComments] = useState("");
	const [uploading, setUploading] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
		}
	};

	const removeFile = (index: number) => {
		setFiles((prev) => prev.filter((_, i) => i !== index));
	};

	const handleSave = async () => {
		if (files.length === 0) return;
		setUploading(true);
		let hasAtLeastOneLinked = false;

		try {
			const filesToProcess = [...files];
			for (const file of filesToProcess) {
				// 1. Upload to S3
				const uploadRes = await uploadMediaAPIAction(file);
				if (!uploadRes.success || !uploadRes.data?.id) {
					throw new Error(uploadRes.error || "Failed to upload file to storage");
				}

				// 2. Link document to the project in DB
				const linkRes = await saveProjectDocumentAPIAction(
					projectId,
					uploadRes.data.id,
					comments,
				);
				if (!linkRes.success) {
					try {
						const cleanupRes = await deleteMediaAPIAction(uploadRes.data.id);
						if (!cleanupRes?.success) {
							console.error("Cleanup failed for media ID:", uploadRes.data.id, cleanupRes?.error);
						}
					} catch (cleanupErr: unknown) {
						console.error("Failed executing media cleanup for ID:", uploadRes.data.id, cleanupErr);
					}
					throw new Error(linkRes.error || "Failed to save document record");
				}

				hasAtLeastOneLinked = true;
				// Immediately remove successfully uploaded & linked file from pending list
				setFiles((prev) => prev.filter((item) => item !== file));
			}

			showToast("success", "Documents uploaded and saved successfully");
			setComments("");
			if (fileInputRef.current) fileInputRef.current.value = "";
			onUploadSuccess();
		} catch (err: unknown) {
			const errorMessage =
				err instanceof Error && err.message
					? err.message
					: "An error occurred during file upload";
			if (hasAtLeastOneLinked) {
				showToast("warning", t(localizationConstants.partialUploadWarning));
				onUploadSuccess();
			} else {
				showToast("error", errorMessage);
			}
		} finally {
			setUploading(false);
		}
	};

	return (
		<div className="space-y-4">
			<div className="space-y-1">
				<label className="text-sm font-semibold text-slate-900">
					<Translate text={localizationConstants.uploadYourFilesLabel} />
				</label>
				<p className="text-sm text-slate-500">
					<Translate text={localizationConstants.allowedFilesLabel} />
				</p>
			</div>

			<div className="flex items-center gap-4">
				{/* Hidden File Input */}
				<input
					type="file"
					multiple
					ref={fileInputRef}
					onChange={handleFileSelect}
					className="hidden"
					accept=".pdf,.png,.jpg,.jpeg"
					disabled={uploading}
				/>

				{/* File Display Area */}
				<div
					className="flex-1 flex items-center justify-between min-h-[44px] border border-slate-200 rounded-md px-3 bg-white cursor-pointer hover:bg-slate-50 transition-colors"
					onClick={() => !uploading && fileInputRef.current?.click()}
				>
					<div className="flex flex-wrap gap-2 py-1.5">
						{files.length > 0 ? (
							files.map((file, index) => (
								<span
									key={index}
									className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 text-xs font-medium text-slate-700"
								>
									{file.name}
									<X
										className="h-3 w-3 cursor-pointer text-slate-400 hover:text-slate-600"
										onClick={(e) => {
											e.stopPropagation();
											removeFile(index);
										}}
									/>
								</span>
							))
						) : (
							<span className="text-sm text-slate-400">
								<Translate text={localizationConstants.noFileChosen} />
							</span>
						)}
					</div>
					<ChevronDown className="h-4 w-4 text-slate-400 mr-1" />
				</div>

				<Button
					type="button"
					className="bg-slate-900 hover:bg-slate-800 text-white h-11 px-8 rounded-md font-medium"
					onClick={() => fileInputRef.current?.click()}
					disabled={uploading}
				>
					<Translate text={localizationConstants.upload} />
				</Button>
			</div>

			<div className="space-y-2 pt-2">
				<label className="text-sm font-semibold text-slate-900">
					<Translate text={localizationConstants.comments} />
				</label>
				<Textarea
					placeholder={t(localizationConstants.writeDescriptionPlaceholder)}
					className="min-h-[100px] resize-none border-slate-200"
					value={comments}
					onChange={(e) => setComments(e.target.value)}
					disabled={uploading}
				/>
			</div>

			<div className="flex justify-end pt-2">
				<Button
					type="button"
					className="bg-slate-900 hover:bg-slate-800 text-white h-11 px-8 rounded-md font-medium gap-2"
					onClick={handleSave}
					disabled={files.length === 0 || uploading}
				>
					{uploading && <Loader2 className="h-4 w-4 animate-spin" />}
					<Translate text={localizationConstants.save} />
				</Button>
			</div>
		</div>
	);
}
