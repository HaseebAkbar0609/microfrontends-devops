"use client";

import React, { useState, useRef, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
	X,
	Calendar as CalendarIcon,
	ChevronDown,
	Loader2,
	Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TimePicker } from "@/components/ui/time-picker";
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from "@/components/ui/form";
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
import axiosInstance from "@/lib/axiosInstance";
import { API_PATH } from "@/constants/api";
import { PROTOCOL_CONSTANTS } from "../constants/protocol.constants";
import type { CreateProtocolPayload } from "../types/protocol.types";

export interface AttachedProtocolDocument {
	id: string;
	name: string;
	fileUrl?: string;
	fileType: string;
	fileSize?: string;
	file?: File;
}

const uploadProtocolSchema = (
	dateRequiredMsg: string,
	typeRequiredMsg: string
) =>
	z.object({
		type: z.string().min(1, typeRequiredMsg),
		category: z.string().optional(),
		address: z.string().optional(),
		postalCode: z.string().optional(),
		city: z.string().optional(),
		location: z.string().optional(),
		startDate: z.string().min(1, dateRequiredMsg),
		startTime: z.string().optional(),
		endDate: z.string().optional(),
		endTime: z.string().optional(),
		notes: z.string().optional(),
	});

export type UploadProtocolFormData = z.infer<
	ReturnType<typeof uploadProtocolSchema>
>;

export interface UploadProtocolModalProps {
	isOpen: boolean;
	orderId?: string;
	projectNumber?: string;
	projectName?: string;
	onClose: () => void;
	onUpload: (payload: CreateProtocolPayload) => Promise<void> | void;
}

export function UploadProtocolModal({
	isOpen,
	orderId = PROTOCOL_CONSTANTS.DEFAULT_ORDER_ID,
	projectNumber = PROTOCOL_CONSTANTS.DEFAULT_PROJECT_NUMBER,
	projectName = PROTOCOL_CONSTANTS.DEFAULT_PROJECT_NAME,
	onClose,
	onUpload,
}: UploadProtocolModalProps) {
	const t = useTranslate();
	const fileInputRef = useRef<HTMLInputElement>(null);

	const [startDatePickerOpen, setStartDatePickerOpen] = useState(false);
	const [endDatePickerOpen, setEndDatePickerOpen] = useState(false);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [uploadedFileName, setUploadedFileName] = useState<string>("");
	const [attachedDocuments, setAttachedDocuments] = useState<AttachedProtocolDocument[]>([]);
	const [isUploading, setIsUploading] = useState(false);
	const [participants, setParticipants] = useState<string[]>([
		...PROTOCOL_CONSTANTS.DEFAULT_PARTICIPANTS,
	]);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const schema = useMemo(
		() =>
			uploadProtocolSchema(
				t(localizationConstants.validationProtocolDateRequired),
				t(localizationConstants.validationProtocolTypeRequired)
			),
		[t]
	);

	const form = useForm<UploadProtocolFormData>({
		resolver: zodResolver(schema),
		defaultValues: {
			type: PROTOCOL_CONSTANTS.UPLOAD_PROTOCOL_TYPES[0],
			category: PROTOCOL_CONSTANTS.CATEGORIES[0],
			address: "",
			postalCode: PROTOCOL_CONSTANTS.DEFAULT_POSTAL_CODE,
			city: PROTOCOL_CONSTANTS.DEFAULT_CITY,
			location: PROTOCOL_CONSTANTS.DEFAULT_LOCATION,
			startDate: PROTOCOL_CONSTANTS.DEFAULT_UPLOAD_DATE,
			startTime: PROTOCOL_CONSTANTS.DEFAULT_START_TIME,
			endDate: PROTOCOL_CONSTANTS.DEFAULT_UPLOAD_DATE,
			endTime: PROTOCOL_CONSTANTS.DEFAULT_END_TIME,
			notes: "",
		},
	});

	React.useEffect(() => {
		if (!isOpen) {
			form.reset();
			setSelectedFile(null);
			setUploadedFileName("");
			setAttachedDocuments([]);
			setParticipants([...PROTOCOL_CONSTANTS.DEFAULT_PARTICIPANTS]);
			if (fileInputRef.current) fileInputRef.current.value = "";
		}
	}, [isOpen, form]);

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files && files.length > 0) {
			const file = files[0];
			if (file.size > PROTOCOL_CONSTANTS.MAX_FILE_SIZE_BYTES) {
				showToast("error", t(localizationConstants.validationFileSizeLimit));
				if (fileInputRef.current) fileInputRef.current.value = "";
				return;
			}
			const ext = file.name.split(".").pop()?.toLowerCase() || "";
			if (ext && !(PROTOCOL_CONSTANTS.ALLOWED_EXTENSIONS as readonly string[]).includes(ext)) {
				showToast("error", t(localizationConstants.validationFileTypeInvalid));
				if (fileInputRef.current) fileInputRef.current.value = "";
				return;
			}
			setSelectedFile(file);
			setUploadedFileName(file.name);
		}
	};

	const handleUploadAction = async () => {
		if (!selectedFile) {
			fileInputRef.current?.click();
			return;
		}

		setIsUploading(true);
		try {
			let uploadedUrl: string | undefined;
			try {
				const formData = new FormData();
				formData.append("file", selectedFile);
				const res = await axiosInstance.post<{ url: string }>(API_PATH.ORDERS.UPLOAD_FILE, formData, {
					headers: { "Content-Type": "multipart/form-data" },
				});
				if (res?.data?.url) {
					uploadedUrl = res.data.url;
				}
			} catch (apiErr) {
				console.warn("[UploadProtocolModal] Simulated upload fallback:", apiErr);
			}

			const ext = selectedFile.name.split(".").pop()?.toLowerCase() || PROTOCOL_CONSTANTS.DEFAULT_FILE_TYPE;
			const newDoc: AttachedProtocolDocument = {
				id: `doc-${Date.now()}`,
				name: selectedFile.name,
				fileUrl: uploadedUrl,
				fileType: ext,
				fileSize: `${(selectedFile.size / 1024).toFixed(1)} KB`,
				file: selectedFile,
			};

			setAttachedDocuments((prev) => [...prev, newDoc]);
			showToast("success", t(localizationConstants.toastFileUploaded));
			setSelectedFile(null);
			setUploadedFileName("");
			if (fileInputRef.current) fileInputRef.current.value = "";
		} catch (error) {
			console.error("[UploadProtocolModal] Failed to upload file:", error);
			showToast("error", t(localizationConstants.toastProtocolUploadFailed));
		} finally {
			setIsUploading(false);
		}
	};

	const handleRemoveDocument = (indexToRemove: number) => {
		setAttachedDocuments((prev) => prev.filter((_, idx) => idx !== indexToRemove));
	};

	const handleRemoveParticipant = (name: string) => {
		setParticipants((prev) => prev.filter((p) => p !== name));
	};

	const handleAddParticipant = (name: string) => {
		if (!participants.includes(name)) {
			setParticipants((prev) => [...prev, name]);
		}
	};

	const onSubmit = async (values: UploadProtocolFormData) => {
		try {
			setIsSubmitting(true);
			const primaryDoc = attachedDocuments[0];
			await onUpload({
				orderId,
				projectNumber,
				projectName,
				date: values.startDate,
				type: values.type,
				category: values.category,
				address: values.address,
				postalCode: values.postalCode,
				city: values.city,
				participants,
				location: values.location,
				startTime: values.startTime,
				endTime: values.endTime,
				protocolName: primaryDoc?.name
					? primaryDoc.name.replace(/\.[^/.]+$/, "")
					: `${values.type} ${values.startDate}`,
				documentName: primaryDoc?.name || uploadedFileName || PROTOCOL_CONSTANTS.DEFAULT_FALLBACK_DOCUMENT_NAME,
				templateType: PROTOCOL_CONSTANTS.TEMPLATE_TYPES.UPLOAD,
				notes: values.notes,
				file: primaryDoc?.file || selectedFile || undefined,
			});
			onClose();
		} catch (error) {
			console.error("[UploadProtocolModal] Submission error:", error);
			showToast("error", t(localizationConstants.toastProtocolUploadFailed));
		} finally {
			setIsSubmitting(false);
		}
	};

	const formatDisplayDate = (dateString: string) => {
		const dateObj = parseDateValue(dateString);
		if (!dateObj) return dateString;
		const dayPrefix = PROTOCOL_CONSTANTS.DAY_NAMES[dateObj.getDay()];
		return `${dayPrefix} ${format(dateObj, "yyyy-MM-dd")}`;
	};

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent
				showCloseButton={false}
				className="w-[calc(100vw-2rem)] sm:w-[620px] sm:max-w-[620px] rounded-2xl bg-white p-6 sm:p-7 border border-slate-200 shadow-2xl max-h-[90vh] overflow-y-auto"
			>
				<DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
					<DialogTitle className="font-sans font-bold text-xl sm:text-2xl text-slate-900 tracking-tight">
						<Translate text={localizationConstants.uploadProtocolTitle} />
					</DialogTitle>
					<Button
						type="button"
						variant="ghost"
						size="icon"
						onClick={onClose}
						className="h-8 w-8 p-1 text-slate-900 hover:bg-slate-100 rounded-md cursor-pointer shrink-0"
						aria-label={t(localizationConstants.ariaLabelCloseModal)}
					>
						<X className="h-5 w-5" />
					</Button>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-1">
						{/* Hidden real file input */}
						<input
							type="file"
							ref={fileInputRef}
							onChange={handleFileSelect}
							accept={PROTOCOL_CONSTANTS.ALLOWED_FILE_TYPES}
							className="hidden"
						/>

						{/* Row 1: Projekt nr & Projekt namn */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div>
								<p className="text-xs font-semibold text-slate-900 mb-1">
									<Translate text={localizationConstants.projectNumberLabel} />
								</p>
								<p className="text-sm text-slate-500 font-normal">
									{projectNumber}
								</p>
							</div>
							<div>
								<p className="text-xs font-semibold text-slate-900 mb-1">
									<Translate text={localizationConstants.projectNameLabel} />
								</p>
								<p className="text-sm text-slate-500 font-normal">
									{projectName}
								</p>
							</div>
						</div>

						{/* Row 2: Typ & Kategori */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							{/* Typ */}
							<FormField
								control={form.control}
								name="type"
								render={({ field }) => (
									<FormItem className="space-y-1">
										<FormLabel className="text-xs font-semibold text-slate-900">
											<Translate text={localizationConstants.protocolTypeLabel} />
										</FormLabel>
										<FormControl>
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button
														type="button"
														variant="outline"
														className="h-10 w-full rounded-lg border-slate-200 bg-white text-slate-900 text-sm font-normal px-3 flex justify-between items-center shadow-none hover:bg-slate-50 cursor-pointer"
													>
														<span>{field.value || PROTOCOL_CONSTANTS.UPLOAD_PROTOCOL_TYPES[0]}</span>
														<ChevronDown className="h-4 w-4 text-slate-500 shrink-0" />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align="start" className="w-56 bg-white border border-slate-200 shadow-md rounded-lg p-1">
													{PROTOCOL_CONSTANTS.UPLOAD_PROTOCOL_TYPES.map((tItem) => (
														<DropdownMenuItem
															key={tItem}
															onClick={() => field.onChange(tItem)}
															className="cursor-pointer text-xs text-slate-700 focus:bg-slate-100 focus:text-slate-900"
														>
															{tItem}
														</DropdownMenuItem>
													))}
												</DropdownMenuContent>
											</DropdownMenu>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Kategori */}
							<FormField
								control={form.control}
								name="category"
								render={({ field }) => (
									<FormItem className="space-y-1">
										<FormLabel className="text-xs font-semibold text-slate-900">
											<Translate text={localizationConstants.protocolCategoryLabel} />
										</FormLabel>
										<FormControl>
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button
														type="button"
														variant="outline"
														className="h-10 w-full rounded-lg border-slate-200 bg-white text-slate-900 text-sm font-normal px-3 flex justify-between items-center shadow-none hover:bg-slate-50 cursor-pointer"
													>
														<span>{field.value || PROTOCOL_CONSTANTS.CATEGORIES[0]}</span>
														<ChevronDown className="h-4 w-4 text-slate-500 shrink-0" />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align="start" className="w-56 bg-white border border-slate-200 shadow-md rounded-lg p-1">
													{PROTOCOL_CONSTANTS.CATEGORIES.map((cat) => (
														<DropdownMenuItem
															key={cat}
															onClick={() => field.onChange(cat)}
															className="cursor-pointer text-xs text-slate-700 focus:bg-slate-100 focus:text-slate-900"
														>
															{cat}
														</DropdownMenuItem>
													))}
												</DropdownMenuContent>
											</DropdownMenu>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						{/* Row 3: Adress (full width) */}
						<FormField
							control={form.control}
							name="address"
							render={({ field }) => (
								<FormItem className="space-y-1">
									<FormLabel className="text-xs font-semibold text-slate-900">
										<Translate text={localizationConstants.protocolAddressLabel} />
									</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder={t(localizationConstants.protocolAddressLabel)}
											className="h-10 rounded-lg border-slate-200 bg-white text-slate-900 text-sm shadow-none focus-visible:ring-slate-900"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Row 4: Post nr & Ort */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="postalCode"
								render={({ field }) => (
									<FormItem className="space-y-1">
										<FormLabel className="text-xs font-semibold text-slate-900">
											<Translate text={localizationConstants.protocolPostalCodeLabel} />
										</FormLabel>
										<FormControl>
											<Input
												{...field}
												placeholder="-"
												className="h-10 rounded-lg border-slate-200 bg-white text-slate-900 text-sm shadow-none focus-visible:ring-slate-900"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="city"
								render={({ field }) => (
									<FormItem className="space-y-1">
										<FormLabel className="text-xs font-semibold text-slate-900">
											<Translate text={localizationConstants.protocolCityLabel} />
										</FormLabel>
										<FormControl>
											<Input
												{...field}
												placeholder="-"
												className="h-10 rounded-lg border-slate-200 bg-white text-slate-900 text-sm shadow-none focus-visible:ring-slate-900"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						{/* Row 5: Lägg till deltagare & Plats */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							{/* Lägg till deltagare */}
							<div className="space-y-1">
								<p className="text-xs font-semibold text-slate-900">
									<Translate text={localizationConstants.protocolAddParticipantsLabel} />
								</p>
								<DropdownMenu>
									<div className="min-h-[40px] rounded-lg border border-slate-200 bg-white p-1.5 flex flex-wrap items-center gap-1.5 justify-between">
										<div className="flex flex-wrap items-center gap-1.5 flex-1">
											{participants.map((p) => (
												<span
													key={p}
													className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs px-2 py-0.5 rounded transition-colors"
												>
													<span>{p}</span>
													<Button
														type="button"
														variant="ghost"
														size="icon"
														onClick={(e) => {
															e.stopPropagation();
															handleRemoveParticipant(p);
														}}
														className="h-3.5 w-3.5 p-0 text-slate-500 hover:text-slate-900 hover:bg-transparent cursor-pointer"
													>
														<X className="h-3 w-3" />
													</Button>
												</span>
											))}
										</div>
										<DropdownMenuTrigger asChild>
											<Button
												type="button"
												variant="ghost"
												size="icon"
												className="h-6 w-6 p-0 text-slate-400 hover:text-slate-700 hover:bg-transparent cursor-pointer"
												aria-label={t(localizationConstants.ariaLabelAddParticipant)}
											>
												<ChevronDown className="h-4 w-4" />
											</Button>
										</DropdownMenuTrigger>
									</div>
									<DropdownMenuContent align="start" className="w-48 bg-white border border-slate-200 shadow-md rounded-lg p-1">
										{PROTOCOL_CONSTANTS.AVAILABLE_PARTICIPANTS.map((cand) => (
											<DropdownMenuItem
												key={cand}
												onClick={() => handleAddParticipant(cand)}
												disabled={participants.includes(cand)}
												className="cursor-pointer text-xs text-slate-700 focus:bg-slate-100 focus:text-slate-900"
											>
												<Plus className="h-3.5 w-3.5 mr-1.5 text-slate-500" />
												{cand}
											</DropdownMenuItem>
										))}
									</DropdownMenuContent>
								</DropdownMenu>
							</div>

							{/* Plats */}
							<FormField
								control={form.control}
								name="location"
								render={({ field }) => (
									<FormItem className="space-y-1">
										<FormLabel className="text-xs font-semibold text-slate-900">
											<Translate text={localizationConstants.protocolLocationLabel} />
										</FormLabel>
										<FormControl>
											<Input
												{...field}
												placeholder={t(localizationConstants.protocolLocationPlaceholder)}
												className="h-10 rounded-lg border-slate-200 bg-white text-slate-900 text-sm shadow-none focus-visible:ring-slate-900"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						{/* Row 6: Start tid (Date + Reusable TimePicker) */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							{/* Start Date */}
							<FormField
								control={form.control}
								name="startDate"
								render={({ field }) => (
									<FormItem className="space-y-1">
										<FormLabel className="text-xs font-semibold text-slate-900">
											<Translate text={localizationConstants.protocolStartTimeLabel} />
										</FormLabel>
										<Popover open={startDatePickerOpen} onOpenChange={setStartDatePickerOpen}>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														type="button"
														variant="outline"
														className="h-10 w-full rounded-lg border-slate-200 bg-white text-slate-900 text-sm font-normal px-3 flex items-center justify-start gap-2 shadow-none hover:bg-slate-50 cursor-pointer"
													>
														<CalendarIcon className="h-4 w-4 text-slate-500 shrink-0" />
														<span>{formatDisplayDate(field.value)}</span>
													</Button>
												</FormControl>
											</PopoverTrigger>
											<PopoverContent className="w-auto p-0 bg-white border border-slate-200 shadow-lg rounded-lg" align="start">
												<Calendar
													mode="single"
													selected={parseDateValue(field.value)}
													onSelect={(date) => {
														if (date) {
															field.onChange(format(date, "yyyy-MM-dd"));
															setStartDatePickerOpen(false);
														}
													}}
												/>
											</PopoverContent>
										</Popover>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Start Time with Reused TimePicker */}
							<FormField
								control={form.control}
								name="startTime"
								render={({ field }) => (
									<FormItem className="space-y-1 sm:pt-5">
										<FormControl>
											<TimePicker
												value={field.value}
												onChange={field.onChange}
												placeholder="15:00"
												className="h-10 rounded-lg border-slate-200 bg-white text-slate-900 text-sm shadow-none focus-visible:ring-slate-900"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						{/* Row 7: Slut tid (Date + Reusable TimePicker) */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							{/* End Date */}
							<FormField
								control={form.control}
								name="endDate"
								render={({ field }) => (
									<FormItem className="space-y-1">
										<FormLabel className="text-xs font-semibold text-slate-900">
											<Translate text={localizationConstants.protocolEndTimeLabel} />
										</FormLabel>
										<Popover open={endDatePickerOpen} onOpenChange={setEndDatePickerOpen}>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														type="button"
														variant="outline"
														className="h-10 w-full rounded-lg border-slate-200 bg-white text-slate-900 text-sm font-normal px-3 flex items-center justify-start gap-2 shadow-none hover:bg-slate-50 cursor-pointer"
													>
														<CalendarIcon className="h-4 w-4 text-slate-500 shrink-0" />
														<span>{formatDisplayDate(field.value || PROTOCOL_CONSTANTS.DEFAULT_UPLOAD_DATE)}</span>
													</Button>
												</FormControl>
											</PopoverTrigger>
											<PopoverContent className="w-auto p-0 bg-white border border-slate-200 shadow-lg rounded-lg" align="start">
												<Calendar
													mode="single"
													selected={parseDateValue(field.value || PROTOCOL_CONSTANTS.DEFAULT_UPLOAD_DATE)}
													onSelect={(date) => {
														if (date) {
															field.onChange(format(date, "yyyy-MM-dd"));
															setEndDatePickerOpen(false);
														}
													}}
												/>
											</PopoverContent>
										</Popover>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* End Time with Reused TimePicker */}
							<FormField
								control={form.control}
								name="endTime"
								render={({ field }) => (
									<FormItem className="space-y-1 sm:pt-5">
										<FormControl>
											<TimePicker
												value={field.value}
												onChange={field.onChange}
												placeholder="17:00"
												className="h-10 rounded-lg border-slate-200 bg-white text-slate-900 text-sm shadow-none focus-visible:ring-slate-900"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						{/* Row 8: Notes textarea & Underskrift upload */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
							{/* Notes */}
							<FormField
								control={form.control}
								name="notes"
								render={({ field }) => (
									<FormItem className="space-y-1">
										<FormLabel className="text-xs font-semibold text-slate-900">
											<Translate text={localizationConstants.protocolMeetingInfoLabel} />
										</FormLabel>
										<FormControl>
											<Textarea
												{...field}
												placeholder={t(localizationConstants.protocolMeetingInfoPlaceholder)}
												className="min-h-[85px] rounded-lg border-slate-200 bg-white text-slate-900 text-sm p-3 shadow-none focus-visible:ring-slate-900 resize-y"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Underskrift Upload Field matching prototype */}
							<div className="space-y-1">
								<p className="text-xs font-semibold text-slate-900">
									<Translate text={localizationConstants.protocolSignatureLabel} />
								</p>
								<div className="flex items-center gap-2">
									<Button
										type="button"
										variant="outline"
										onClick={() => fileInputRef.current?.click()}
										className="flex-1 min-w-0 h-10 rounded-lg border border-slate-200 bg-white px-3 flex items-center justify-start gap-2 text-left cursor-pointer hover:bg-slate-50 transition-colors shadow-none font-normal"
										title={uploadedFileName || PROTOCOL_CONSTANTS.DEFAULT_FALLBACK_FILE_NAME}
									>
										<span className="font-semibold text-sm text-slate-900 shrink-0">
											<Translate text={localizationConstants.protocolUpload} />
										</span>
										<span className="text-sm text-slate-700 truncate min-w-0 flex-1">
											{uploadedFileName || PROTOCOL_CONSTANTS.DEFAULT_FALLBACK_FILE_NAME}
										</span>
									</Button>
									<Button
										type="button"
										onClick={handleUploadAction}
										disabled={isUploading}
										className="h-10 px-5 rounded-lg bg-slate-500 hover:bg-black text-white font-medium text-sm cursor-pointer shrink-0 shadow-none whitespace-nowrap flex items-center gap-1.5 transition-colors"
									>
										{isUploading && <Loader2 className="h-4 w-4 animate-spin" />}
										<Translate text={localizationConstants.protocolSignatureBtn} />
									</Button>
								</div>
								<p className="text-xs text-slate-500 mt-1">
									<Translate text={localizationConstants.protocolSignatureFileHelp} />
								</p>

								{/* Attached documents list displayed after uploading via API */}
								{attachedDocuments.length > 0 && (
									<div className="min-h-[40px] w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 flex items-center justify-between gap-2 mt-2">
										<div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
											{attachedDocuments.map((doc, idx) => (
												<div
													key={`${doc.id}-${idx}`}
													className="flex items-center gap-1.5 bg-zinc-100 text-slate-900 text-xs sm:text-sm font-normal px-2.5 py-1 rounded-md shrink-0 border-0 max-w-full"
												>
													<span className="truncate max-w-[140px] sm:max-w-[200px]">{doc.name}</span>
													<Button
														type="button"
														variant="ghost"
														size="icon"
														onClick={() => handleRemoveDocument(idx)}
														className="h-4 w-4 p-0 text-slate-400 hover:text-slate-700 hover:bg-transparent cursor-pointer ml-1 shrink-0 inline-flex items-center justify-center"
														aria-label={`${t(localizationConstants.ariaLabelRemoveFile)}: ${doc.name}`}
													>
														<X className="h-3.5 w-3.5" />
													</Button>
												</div>
											))}
										</div>
									</div>
								)}
							</div>
						</div>

						{/* Row 9 (Footer Buttons - border removed) */}
						<div className="flex items-center justify-end gap-3 pt-4">
							<Button
								type="button"
								variant="outline"
								onClick={onClose}
								className="h-10 px-6 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-900 text-sm font-normal cursor-pointer shadow-none"
							>
								<Translate text={localizationConstants.closeButton} />
							</Button>
							<Button
								type="submit"
								disabled={isSubmitting}
								className="h-10 px-8 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium cursor-pointer shadow-none flex items-center gap-2"
							>
								{isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
								<span><Translate text={localizationConstants.protocolNextButton} /></span>
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}

export default UploadProtocolModal;
