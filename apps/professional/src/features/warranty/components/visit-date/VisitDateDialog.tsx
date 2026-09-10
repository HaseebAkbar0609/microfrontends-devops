"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
	X,
	Calendar as CalendarIcon,
	ChevronDown,
	Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { parseDateValue } from "@/utils/date";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { showToast } from "@/lib/toast";
import { WARRANTY_CONSTANTS } from "../../constants/warranty.constants";
import { MOCK_RECIPIENTS } from "../../data/warranty.mock";
import type {
	InspectionDateItem,
	RecipientItem,
	AttachedDocumentItem,
} from "../../types/warranty.types";

const createVisitDateSchema = (errorMessage: string) =>
	z.object({
		date: z.string().min(1, errorMessage),
		rule: z.string().optional(),
	});

export type VisitDateFormData = z.infer<ReturnType<typeof createVisitDateSchema>>;

export interface VisitDateDialogProps {
	isOpen: boolean;
	initialData?: InspectionDateItem | null;
	onClose: () => void;
	onSave: (dateItem: Omit<InspectionDateItem, "id">) => void;
}

export function VisitDateDialog({
	isOpen,
	initialData,
	onClose,
	onSave,
}: VisitDateDialogProps) {
	const t = useTranslate();

	const fileInputRef = useRef<HTMLInputElement>(null);
	const [selectedRecipients, setSelectedRecipients] = useState<RecipientItem[]>([]);
	const [attachedDocuments, setAttachedDocuments] = useState<AttachedDocumentItem[]>([]);
	const [uploadedFileName, setUploadedFileName] = useState<string>(
		WARRANTY_CONSTANTS.DEFAULT_FALLBACK_DOCUMENT_NAME
	);

	const [datePickerOpen, setDatePickerOpen] = useState(false);

	const visitDateSchema = useMemo(
		() => createVisitDateSchema(t(localizationConstants.validationVisitDateRequired)),
		[t]
	);

	const {
		register,
		handleSubmit,
		reset,
		setValue,
		watch,
		formState: { errors },
	} = useForm<VisitDateFormData>({
		resolver: zodResolver(visitDateSchema),
		defaultValues: {
			date: WARRANTY_CONSTANTS.DEFAULT_FALLBACK_DATE,
			rule: "",
		},
	});

	const currentDateVal = watch("date");
	const parsedSelectedDate = parseDateValue(currentDateVal);

	// Initialize form on open or initialData change
	useEffect(() => {
		if (isOpen) {
			if (initialData) {
				setValue("date", initialData.date || WARRANTY_CONSTANTS.DEFAULT_FALLBACK_DATE);
				setValue("rule", initialData.rule || "");
				setSelectedRecipients(
					initialData.recipients && initialData.recipients.length > 0
						? initialData.recipients
						: [
								MOCK_RECIPIENTS[0],
								MOCK_RECIPIENTS[1],
								MOCK_RECIPIENTS[2],
								MOCK_RECIPIENTS[3],
								MOCK_RECIPIENTS[0],
						  ]
				);
				setAttachedDocuments(
					initialData.documents && initialData.documents.length > 0
						? initialData.documents
						: [
								{ id: "doc-1", name: "Document 1.pdf", fileType: "pdf" },
								{ id: "doc-2", name: "Document 2.pdf", fileType: "pdf" },
						  ]
				);
				setUploadedFileName(
					initialData.documentName || WARRANTY_CONSTANTS.DEFAULT_FALLBACK_DOCUMENT_NAME
				);
			} else {
				reset({
					date: WARRANTY_CONSTANTS.DEFAULT_FALLBACK_DATE,
					rule: "",
				});
				setSelectedRecipients([
					MOCK_RECIPIENTS[0],
					MOCK_RECIPIENTS[1],
					MOCK_RECIPIENTS[2],
					MOCK_RECIPIENTS[3],
					MOCK_RECIPIENTS[0],
				]);
				setAttachedDocuments([
					{ id: "doc-1", name: "Document 1.pdf", fileType: "pdf" },
					{ id: "doc-2", name: "Document 2.pdf", fileType: "pdf" },
				]);
				setUploadedFileName(WARRANTY_CONSTANTS.DEFAULT_FALLBACK_DOCUMENT_NAME);
			}
		}
	}, [isOpen, initialData, reset, setValue]);

	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [isUploading, setIsUploading] = useState(false);

	const handleRemoveRecipient = (indexToRemove: number) => {
		setSelectedRecipients((prev) => prev.filter((_, idx) => idx !== indexToRemove));
	};

	const handleRemoveDocument = (indexToRemove: number) => {
		setAttachedDocuments((prev) => prev.filter((_, idx) => idx !== indexToRemove));
	};

	const handleAddRecipient = (recipient: RecipientItem) => {
		setSelectedRecipients((prev) => [...prev, recipient]);
	};

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files && files.length > 0) {
			const file = files[0];
			setSelectedFile(file);
			setUploadedFileName(file.name);
		}
	};

	const handleUploadAction = async () => {
		if (
			!uploadedFileName ||
			(uploadedFileName === WARRANTY_CONSTANTS.DEFAULT_FALLBACK_DOCUMENT_NAME && !selectedFile)
		) {
			fileInputRef.current?.click();
			return;
		}

		setIsUploading(true);
		try {
			const ext =
				uploadedFileName.split(".").pop()?.toLowerCase() ||
				WARRANTY_CONSTANTS.DEFAULT_FILE_TYPE;
			const newDoc: AttachedDocumentItem = {
				id: `doc-${Date.now()}`,
				name: uploadedFileName,
				fileType:
					ext === "png" || ext === "jpg" || ext === "doc"
						? ext
						: WARRANTY_CONSTANTS.DEFAULT_FILE_TYPE,
				fileSize: selectedFile
					? `${(selectedFile.size / 1024).toFixed(1)} KB`
					: "1.2 MB",
			};
			setAttachedDocuments((prev) => [...prev, newDoc]);
			showToast("success", t(localizationConstants.toastFileUploaded));
			setSelectedFile(null);
			if (fileInputRef.current) fileInputRef.current.value = "";
		} catch (error) {
			console.error("[VisitDateDialog] Failed to upload file:", error);
			showToast("error", t(localizationConstants.genericError));
		} finally {
			setIsUploading(false);
		}
	};

	const onSubmit = (data: VisitDateFormData) => {
		const emails =
			selectedRecipients.map((r) => r.email).join(", ") ||
			WARRANTY_CONSTANTS.DEFAULT_FALLBACK_EMAIL;
		const docName =
			uploadedFileName || WARRANTY_CONSTANTS.DEFAULT_FALLBACK_DOCUMENT_NAME;

		onSave({
			date: data.date,
			reminderEmail: emails,
			rule: data.rule || WARRANTY_CONSTANTS.DEFAULT_FALLBACK_RULE,
			documentName: docName,
			fileType: WARRANTY_CONSTANTS.DEFAULT_FILE_TYPE,
			recipients: selectedRecipients,
			documents: attachedDocuments,
		});
		onClose();
	};

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent
				showCloseButton={false}
				className="w-[calc(100vw-2rem)] sm:w-[619px] sm:max-w-[619px] max-h-[90vh] overflow-y-auto rounded-lg bg-white p-4 sm:p-7 border border-slate-200 shadow-xl gap-0 flex flex-col justify-between"
			>
				{/* Header matching prototype */}
				<DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
					<DialogTitle className="font-sans font-semibold text-2xl leading-[100%] tracking-[-0.6px] text-slate-900">
						{initialData ? (
							<Translate text={localizationConstants.editVisitDateTitle} />
						) : (
							<Translate text={localizationConstants.createVisitDateTitle} />
						)}
					</DialogTitle>
					<Button
						type="button"
						variant="ghost"
						size="icon"
						onClick={onClose}
						className="h-8 w-8 p-1 text-slate-900 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer rounded-md"
						aria-label="Close modal"
					>
						<X className="h-5 w-5" />
					</Button>
				</DialogHeader>

				{/* Form */}
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1 flex-1 flex flex-col justify-between">
					<div className="space-y-4">
						{/* Field 1: Date */}
						<div className="flex flex-col gap-1.5">
							<Label className="font-sans font-medium text-sm leading-5 tracking-normal text-slate-900">
								<Translate text={localizationConstants.dateHeaderLabel} />
							</Label>
							<Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
								<PopoverTrigger asChild>
									<Button
										type="button"
										variant="outline"
										className="relative flex items-center justify-start h-11 w-full rounded-lg border border-slate-200 bg-white px-3.5 text-left text-sm text-slate-900 focus:outline-none focus:border-slate-900 cursor-pointer hover:bg-slate-50 gap-2.5 font-normal shadow-none"
									>
										<CalendarIcon className="h-4 w-4 text-slate-500 shrink-0 pointer-events-none" />
										<span className="font-normal truncate text-sm text-slate-900">
											{currentDateVal || "YYYY-MM-DD"}
										</span>
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-auto p-0 border border-slate-200 bg-white shadow-lg rounded-xl z-50" align="start">
									<Calendar
										mode="single"
										selected={parsedSelectedDate}
										onSelect={(date) => {
											if (date) {
												setValue("date", format(date, "yyyy-MM-dd"), { shouldValidate: true });
											} else {
												setValue("date", "", { shouldValidate: true });
											}
											setDatePickerOpen(false);
										}}
									/>
								</PopoverContent>
							</Popover>
							{errors.date && (
								<span className="text-xs font-medium text-red-500">{errors.date.message}</span>
							)}
						</div>

						{/* Field 2: Reminder email (2-column parallel layout with divider) */}
						<div className="flex flex-col gap-1.5">
							<Label className="font-sans font-medium text-sm leading-5 tracking-normal text-slate-900">
								<Translate text={localizationConstants.reminderEmailLabel} />
							</Label>
							<div className="min-h-[52px] w-full rounded-lg border border-slate-200 bg-white p-2.5 sm:p-3 flex items-center justify-between gap-2 sm:gap-3">
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-x-4 sm:gap-y-2.5 flex-1 min-w-0 pr-1">
									{selectedRecipients.map((recipient, idx) => {
										const isCol1 = idx % 2 === 0;
										const hasRightNeighbor = idx + 1 < selectedRecipients.length;
										return (
											<div
												key={`${recipient.id}-${idx}`}
												className={`flex items-center justify-between gap-2 text-sm min-w-0 ${
													isCol1 && hasRightNeighbor ? "sm:border-r sm:border-slate-200 sm:pr-3" : ""
												}`}
											>
												<div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
													{recipient.avatarUrl ? (
														<Image
															src={recipient.avatarUrl}
															alt={recipient.name}
															width={24}
															height={24}
															className="h-6 w-6 rounded-full object-cover shrink-0"
														/>
													) : (
														<div className="h-6 w-6 rounded-full bg-slate-300 flex items-center justify-center text-[10px] font-bold text-slate-700 shrink-0">
															{recipient.name.charAt(0)}
														</div>
													)}
													<span className="font-medium text-slate-900 truncate text-xs sm:text-sm">{recipient.name}</span>
													<span className="text-zinc-500 font-normal truncate text-xs sm:text-sm">{recipient.handle}</span>
												</div>
												<Button
													type="button"
													variant="ghost"
													size="icon"
													onClick={() => handleRemoveRecipient(idx)}
													className="h-6 w-6 p-0 text-slate-400 hover:text-slate-700 hover:bg-transparent cursor-pointer shrink-0 ml-0.5"
													aria-label={`Remove ${recipient.name}`}
												>
													<X className="h-3.5 w-3.5" />
												</Button>
											</div>
										);
									})}
								</div>

								{/* Dropdown arrow to add more recipients */}
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											type="button"
											variant="ghost"
											size="icon"
											className="h-7 w-7 p-1 text-slate-400 hover:text-slate-700 hover:bg-transparent cursor-pointer shrink-0 self-center shadow-none"
											aria-label="Add recipient"
										>
											<ChevronDown className="h-4 w-4" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end" className="w-56 bg-white border border-slate-200 shadow-md">
										{MOCK_RECIPIENTS.map((rec) => (
											<DropdownMenuItem
												key={rec.id}
												onClick={() => handleAddRecipient(rec)}
												className="flex items-center gap-2 cursor-pointer text-xs"
											>
												{rec.avatarUrl && (
													<Image
														src={rec.avatarUrl}
														alt={rec.name}
														width={18}
														height={18}
														className="h-4.5 w-4.5 rounded-full object-cover"
													/>
												)}
												<span className="font-medium text-slate-900">{rec.name}</span>
												<span className="text-zinc-500">{rec.handle}</span>
											</DropdownMenuItem>
										))}
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
						</div>

						{/* Field 3: Reminder rule (resizable with corner grip lines) */}
						<div className="flex flex-col gap-1.5">
							<Label className="font-sans font-medium text-sm leading-5 tracking-normal text-slate-900">
								<Translate text={localizationConstants.reminderRuleLabel} />
							</Label>
							<textarea
								placeholder={t(localizationConstants.reminderRuleLabel)}
								{...register("rule")}
								rows={4}
								className="w-full min-h-[96px] rounded-lg border border-slate-200 bg-white p-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 resize-y font-normal"
							/>
						</div>

						{/* Field 4: Document */}
						<div className="flex flex-col gap-1.5">
							<Label className="font-sans font-medium text-sm leading-5 tracking-normal text-slate-900">
								<Translate text={localizationConstants.documentLabel} />
							</Label>

							<input
								type="file"
								ref={fileInputRef}
								onChange={handleFileSelect}
								accept={WARRANTY_CONSTANTS.ALLOWED_FILE_TYPES}
								className="hidden"
							/>

							{/* Upload Box matching prototype */}
							<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full min-w-0">
								<Button
									type="button"
									variant="outline"
									onClick={() => fileInputRef.current?.click()}
									className="flex-1 min-w-0 h-11 rounded-lg border border-slate-200 bg-white px-4 flex items-center justify-start gap-2 text-left cursor-pointer hover:bg-slate-50 transition-colors focus:outline-none focus:border-slate-900 shadow-none font-normal"
									title={uploadedFileName || WARRANTY_CONSTANTS.DEFAULT_FALLBACK_DOCUMENT_NAME}
								>
									<span className="font-semibold text-sm text-slate-900 shrink-0">
										<Translate text={localizationConstants.uploadButton} />
									</span>
									<span className="text-sm text-slate-900 truncate min-w-0 flex-1">
										{uploadedFileName || WARRANTY_CONSTANTS.DEFAULT_FALLBACK_DOCUMENT_NAME}
									</span>
								</Button>
								<Button
									type="button"
									onClick={handleUploadAction}
									disabled={isUploading}
									className="w-full sm:w-auto h-11 px-6 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm cursor-pointer shrink-0 shadow-none whitespace-nowrap"
								>
									<Translate text={localizationConstants.uploadButton} />
								</Button>
							</div>

							<p className="font-sans font-normal text-sm leading-5 tracking-normal text-slate-500 mt-1">
								<Translate text={localizationConstants.allowedFileTypesHelp} />
							</p>

							{/* Attached documents list matching prototype */}
							{attachedDocuments.length > 0 && (
								<div className="min-h-[46px] w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 flex items-center justify-between gap-2 mt-2">
									<div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
										{attachedDocuments.map((doc, idx) => (
											<div
												key={`${doc.id}-${idx}`}
												className="flex items-center gap-1.5 bg-zinc-100 text-slate-900 text-xs sm:text-sm font-normal px-2.5 py-1 rounded-md shrink-0 border-0 max-w-full"
											>
												<span className="truncate max-w-[120px] sm:max-w-[180px]">{doc.name}</span>
												<Button
													type="button"
													variant="ghost"
													size="icon"
													onClick={() => handleRemoveDocument(idx)}
													className="h-5 w-5 p-0 text-slate-400 hover:text-slate-700 hover:bg-transparent cursor-pointer ml-1 shrink-0"
													aria-label={`Remove ${doc.name}`}
												>
													<X className="h-3.5 w-3.5" />
												</Button>
											</div>
										))}
									</div>
									<ChevronDown className="h-4 w-4 text-slate-400 shrink-0 self-center" />
								</div>
							)}
						</div>
					</div>

					{/* Modal Footer matching prototype */}
					<div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 pt-4 sm:pt-6">
						<Button
							type="button"
							variant="outline"
							onClick={onClose}
							className="w-full sm:w-[120px] h-11 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-900 font-medium text-sm cursor-pointer shadow-none"
						>
							<Translate text={localizationConstants.closeButton} />
						</Button>
						<Button
							type="submit"
							className="w-full sm:w-[120px] h-11 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm cursor-pointer flex items-center justify-center gap-2 shadow-none"
						>
							<Save className="h-4 w-4" />
							<span><Translate text={localizationConstants.saveButton} /></span>
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}

export default VisitDateDialog;
