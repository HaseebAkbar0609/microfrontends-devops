"use client";

import React, { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Save, X, Loader2, FileText, CheckCircle2 } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogClose,
	DialogFooter,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { DOCUMENTS_CONSTANTS, type DocumentsSubTab } from "../constants/documents.constants";
import type { UploadDocumentPayload } from "../types/documents.types";
import { uploadDocumentFile } from "@/api-actions/orders/documents";

interface FormValues {
	name: string;
	fileName: string;
	file: File | null;
}

interface UploadedDocumentState {
	name: string;
	fileName: string;
	fileSize: number;
	fileUrl?: string;
	file: File;
}

interface UploadDocumentModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSave: (payload: UploadDocumentPayload) => Promise<void>;
	activeSubtab: DocumentsSubTab;
}

function formatFileSize(bytes: number): string {
	if (!bytes || bytes === 0) return "0 B";
	const k = 1024;
	const sizes = ["B", "KB", "MB", "GB"];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function UploadDocumentModal({
	isOpen,
	onClose,
	onSave,
	activeSubtab,
}: UploadDocumentModalProps) {
	const t = useTranslate();
	const fileInputRef = useRef<HTMLInputElement>(null);

	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [selectedFileName, setSelectedFileName] = useState<string>("");
	const [isUploading, setIsUploading] = useState(false);
	const [uploadProgress, setUploadProgress] = useState(0);
	const [uploadedDocument, setUploadedDocument] = useState<UploadedDocumentState | null>(null);

	const form = useForm<FormValues>({
		defaultValues: {
			name: "",
			fileName: "",
			file: null,
		},
	});

	useEffect(() => {
		if (isOpen) {
			form.reset({
				name: "",
				fileName: "",
				file: null,
			});
			setSelectedFile(null);
			setSelectedFileName("");
			setUploadedDocument(null);
			setIsUploading(false);
			setUploadProgress(0);
			if (fileInputRef.current) fileInputRef.current.value = "";
		}
	}, [isOpen, form]);

	const validateSelectedFile = (file: File): string | null => {
		if (!file || file.size === 0) {
			return t(localizationConstants.orderHandlingarValFileEmpty);
		}

		if (file.size > DOCUMENTS_CONSTANTS.MAX_FILE_SIZE_BYTES) {
			return t(localizationConstants.orderHandlingarValFileSizeExceeded);
		}

		const ext = `.${file.name.split(".").pop()?.toLowerCase()}`;
		if (!(DOCUMENTS_CONSTANTS.ALLOWED_EXTENSIONS as readonly string[]).includes(ext)) {
			return t(localizationConstants.orderHandlingarValInvalidFileType);
		}

		return null;
	};

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		const errorMsg = validateSelectedFile(file);
		if (errorMsg) {
			form.setError("file", {
				type: "manual",
				message: errorMsg,
			});
			if (fileInputRef.current) fileInputRef.current.value = "";
			return;
		}

		form.clearErrors("file");
		setSelectedFile(file);
		setSelectedFileName(file.name);

		// Auto-populate name if empty
		if (!form.getValues("name")?.trim()) {
			const baseName =
				file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
			form.setValue("name", baseName, { shouldValidate: true });
		}
	};

	const handleUploadButtonClick = async () => {
		if (!selectedFile) {
			fileInputRef.current?.click();
			return;
		}

		const validationError = validateSelectedFile(selectedFile);
		if (validationError) {
			form.setError("file", {
				type: "manual",
				message: validationError,
			});
			return;
		}

		setIsUploading(true);
		setUploadProgress(10);
		try {
			// Real media upload via API
			const uploadedUrl = await uploadDocumentFile(selectedFile, (progress) => {
				setUploadProgress(Math.max(10, progress));
			});

			const newUploadedDoc: UploadedDocumentState = {
				name: form.getValues("name")?.trim() || selectedFile.name,
				fileName: selectedFile.name,
				fileSize: selectedFile.size,
				fileUrl: uploadedUrl,
				file: selectedFile,
			};

			setUploadedDocument(newUploadedDoc);
			form.setValue("file", selectedFile, { shouldValidate: true });
			form.setValue("fileName", selectedFile.name, { shouldValidate: true });
			form.clearErrors("file");

			// Clear temporary selection so upload button resets
			setSelectedFile(null);
			setSelectedFileName("");
			if (fileInputRef.current) fileInputRef.current.value = "";
		} catch (uploadErr) {
			console.error("[UploadDocumentModal] File upload error:", uploadErr);
			form.setError("file", {
				type: "manual",
				message: t(localizationConstants.orderHandlingarToastUploadError),
			});
		} finally {
			setIsUploading(false);
			setUploadProgress(0);
		}
	};

	const handleRemoveUploadedDoc = () => {
		setUploadedDocument(null);
		form.setValue("file", null);
		form.setValue("fileName", "");
		if (fileInputRef.current) fileInputRef.current.value = "";
	};

	const onSubmit = async (values: FormValues) => {
		const trimmedName = values.name?.trim();
		if (!trimmedName) {
			form.setError("name", {
				type: "manual",
				message: t(localizationConstants.orderHandlingarValNameRequired),
			});
			return;
		}

		let finalFile = uploadedDocument?.file || selectedFile || values.file;
		let finalFileName = uploadedDocument?.fileName || selectedFileName || values.fileName;
		let finalFileUrl = uploadedDocument?.fileUrl;

		if (!finalFile && !finalFileName) {
			form.setError("file", {
				type: "manual",
				message: t(localizationConstants.orderHandlingarValFileRequired),
			});
			return;
		}

		// If a file was selected but not uploaded before clicking Spara, upload it now
		if (selectedFile && !finalFileUrl) {
			setIsUploading(true);
			try {
				finalFileUrl = await uploadDocumentFile(selectedFile);
				finalFile = selectedFile;
				finalFileName = selectedFile.name;
			} catch (err) {
				console.error("[UploadDocumentModal] Auto-upload on submit error:", err);
				form.setError("file", {
					type: "manual",
					message: t(localizationConstants.orderHandlingarToastUploadError),
				});
				setIsUploading(false);
				return;
			} finally {
				setIsUploading(false);
			}
		}

		const kind =
			activeSubtab === DOCUMENTS_CONSTANTS.SUBTABS.DRAWINGS
				? DOCUMENTS_CONSTANTS.KINDS.DRAWING
				: DOCUMENTS_CONSTANTS.KINDS.DOCUMENT;

		const resolvedFileName =
			finalFile instanceof File
				? finalFile.name
				: finalFileName || trimmedName;

		try {
			await onSave({
				name: trimmedName,
				file: finalFile instanceof File ? finalFile : null,
				fileName: resolvedFileName,
				kind,
			});
			onClose();
		} catch (saveErr) {
			console.error("[UploadDocumentModal] Submit save error:", saveErr);
		}
	};

	const hasFileSelected = Boolean(selectedFile);

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent
				showCloseButton={false}
				className="w-[95vw] sm:max-w-[580px] md:max-w-[619px] max-h-[90vh] overflow-y-auto bg-white border border-slate-200 p-4 sm:p-6 gap-4 rounded-lg shadow-xl"
			>
				{/* Dialog Header */}
				<DialogHeader className="flex flex-row items-center justify-between pb-1">
					<DialogTitle className="font-sans text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
						<Translate text={localizationConstants.orderHandlingarUploadModalTitle} />
					</DialogTitle>
					<DialogDescription className="sr-only">
						{t(localizationConstants.orderHandlingarUploadModalTitle)}
					</DialogDescription>
					<DialogClose asChild>
						<Button
							type="button"
							variant="ghost"
							size="icon"
							className="h-8 w-8 rounded-md text-slate-900 hover:bg-slate-100 cursor-pointer"
						>
							<X className="h-5 w-5 text-slate-900" />
						</Button>
					</DialogClose>
				</DialogHeader>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						noValidate
						className="flex flex-col gap-4.5 mt-1"
					>
						{/* Field 1: Name / Benämning */}
						<FormField
							control={form.control}
							name="name"
							rules={{
								required: t(localizationConstants.orderHandlingarValNameRequired),
							}}
							render={({ field, fieldState }) => (
								<FormItem className="flex flex-col gap-1.5 justify-start">
									<FormLabel className="font-sans text-sm font-semibold text-slate-900">
										<Translate text={localizationConstants.orderHandlingarFieldName} />
									</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder={t(localizationConstants.orderHandlingarFieldPlaceholderName)}
											className={`h-10 bg-white text-slate-900 text-sm rounded-md ${
												fieldState.error
													? "border-red-500 focus-visible:border-red-500"
													: "border-slate-200 focus-visible:border-slate-900"
											}`}
										/>
									</FormControl>
									<FormMessage className="text-xs text-red-500 font-normal" />
								</FormItem>
							)}
						/>

						{/* Field 2: Documents (File upload) */}
						<FormField
							control={form.control}
							name="file"
							render={({ fieldState }) => {
								return (
									<FormItem className="flex flex-col gap-1.5 justify-start">
										<FormLabel className="font-sans text-sm font-semibold text-slate-900">
											<Translate text={localizationConstants.orderHandlingarFieldDocument} />
										</FormLabel>
										<FormControl>
											<div className="flex flex-col gap-1.5 w-full min-w-0">
												{/* 100% shadcn/ui Input primitive for file upload */}
												<Input
													ref={fileInputRef}
													type="file"
													accept={DOCUMENTS_CONSTANTS.ACCEPT_EXTENSIONS_STRING}
													onChange={handleFileSelect}
													className="hidden"
												/>

												{/* Field + Upload Button */}
												<div className="flex flex-row items-center gap-2 w-full min-w-0 flex-nowrap">
													<Input
														type="text"
														readOnly
														value={selectedFileName || ""}
														placeholder={t(localizationConstants.orderHandlingarUploadFileBtn)}
														onClick={() => fileInputRef.current?.click()}
														className="h-10 bg-white border-slate-200 text-slate-900 text-sm cursor-pointer truncate flex-1 min-w-0 focus-visible:border-slate-900 rounded-md"
													/>

													<Button
														type="button"
														disabled={form.formState.isSubmitting || isUploading}
														onClick={handleUploadButtonClick}
														className={`h-10 px-5 shrink-0 whitespace-nowrap font-medium text-sm rounded-md shadow-none flex items-center justify-center gap-1.5 transition-colors ${
															hasFileSelected
																? "bg-slate-900 hover:bg-slate-800 text-white cursor-pointer"
																: "bg-slate-400 hover:bg-slate-500 text-white cursor-pointer"
														}`}
													>
														{isUploading && <Loader2 className="h-4 w-4 animate-spin" />}
														<Translate text={localizationConstants.orderHandlingarUploadFileBtn} />
													</Button>
												</div>

												{/* Upload Progress Bar during network transfer */}
												{isUploading && (
													<div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden mt-1">
														<div
															className="bg-slate-900 h-full transition-all duration-300 rounded-full"
															style={{ width: `${uploadProgress || 30}%` }}
														/>
													</div>
												)}

												{/* Uploaded Document Chip / Card Preview */}
												{uploadedDocument && (
													<div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 mt-1.5 transition-all">
														<div className="flex items-center gap-2.5 min-w-0 flex-1">
															<div className="h-8 w-8 rounded bg-white border border-slate-200 flex items-center justify-center text-slate-600 shrink-0">
																<FileText className="h-4 w-4" />
															</div>
															<div className="flex flex-col min-w-0 flex-1">
																<span
																	className="text-xs sm:text-sm font-medium text-slate-900 truncate"
																	title={uploadedDocument.fileName}
																>
																	{uploadedDocument.fileName}
																</span>
																<span className="text-[11px] text-slate-500 font-normal">
																	{formatFileSize(uploadedDocument.fileSize)}
																</span>
															</div>
															<span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full shrink-0">
																<CheckCircle2 className="h-3 w-3" />
																<span>
																	<Translate text={localizationConstants.orderHandlingarStatusUploaded} />
																</span>
															</span>
														</div>
														<Button
															type="button"
															variant="ghost"
															size="icon"
															onClick={handleRemoveUploadedDoc}
															className="h-7 w-7 p-0 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-md cursor-pointer ml-2 shrink-0 inline-flex items-center justify-center"
															aria-label={t(localizationConstants.orderHandlingarActionDelete)}
														>
															<X className="h-4 w-4" />
														</Button>
													</div>
												)}
											</div>
										</FormControl>

										{fieldState.error ? (
											<FormMessage className="text-xs text-red-500 font-normal" />
										) : (
											<span className="text-xs text-slate-500 font-normal">
												<Translate text={localizationConstants.orderHandlingarFileHint} />
											</span>
										)}
									</FormItem>
								);
							}}
						/>

						{/* Dialog Footer Actions */}
						<DialogFooter className="flex flex-row items-center justify-end gap-4 pt-3 mt-1 border-t border-slate-100 flex-nowrap">
							<Button
								type="button"
								variant="outline"
								onClick={onClose}
								disabled={form.formState.isSubmitting || isUploading}
								className="w-30 h-10 min-w-20 px-3 py-2 rounded-md border-slate-200 text-slate-700 bg-transparent hover:bg-slate-50 cursor-pointer font-medium text-sm shadow-none shrink-0 whitespace-nowrap"
							>
								<Translate text={localizationConstants.orderHandlingarBtnCancel} />
							</Button>
							<Button
								type="submit"
								disabled={form.formState.isSubmitting || isUploading}
								className="w-30 h-10 min-w-20 px-3 py-2 rounded-md bg-slate-900 text-white hover:bg-slate-800 cursor-pointer font-medium text-sm flex items-center justify-center gap-2 shadow-none shrink-0 whitespace-nowrap"
							>
								{form.formState.isSubmitting ? (
									<Loader2 className="h-4 w-4 animate-spin" />
								) : (
									<Save className="h-4 w-4" />
								)}
								<span>
									<Translate text={localizationConstants.orderHandlingarBtnSave} />
								</span>
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}

export default UploadDocumentModal;
