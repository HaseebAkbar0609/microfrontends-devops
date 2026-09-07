"use client";

import React, { useState, useRef, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
	X,
	Calendar as CalendarIcon,
	ChevronDown,
	Save,
	FileText,
	Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { PROTOCOL_CONSTANTS, type ProtocolTemplateType } from "../constants/protocol.constants";
import type { CreateProtocolPayload } from "../types/protocol.types";

const createProtocolSchema = (dateRequiredMsg: string, typeRequiredMsg: string) =>
	z.object({
		date: z.string().min(1, dateRequiredMsg),
		type: z.string().min(1, typeRequiredMsg),
		protocolName: z.string().optional(),
		notes: z.string().optional(),
	});

export type CreateProtocolFormData = z.infer<ReturnType<typeof createProtocolSchema>>;

export interface CreateProtocolModalProps {
	isOpen: boolean;
	templateType: ProtocolTemplateType;
	onClose: () => void;
	onSave: (data: CreateProtocolPayload) => void;
}

export function CreateProtocolModal({
	isOpen,
	templateType,
	onClose,
	onSave,
}: CreateProtocolModalProps) {
	const t = useTranslate();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [datePickerOpen, setDatePickerOpen] = useState(false);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [uploadedFileName, setUploadedFileName] = useState<string>(
		PROTOCOL_CONSTANTS.DEFAULT_FALLBACK_DOCUMENT_NAME
	);

	const protocolSchema = useMemo(
		() =>
			createProtocolSchema(
				t(localizationConstants.validationProtocolDateRequired),
				t(localizationConstants.validationProtocolTypeRequired)
			),
		[t]
	);

	const form = useForm<CreateProtocolFormData>({
		resolver: zodResolver(protocolSchema),
		defaultValues: {
			date: PROTOCOL_CONSTANTS.DEFAULT_FALLBACK_DATE,
			type: PROTOCOL_CONSTANTS.DEFAULT_FALLBACK_TYPE,
			protocolName: "",
			notes: "",
		},
	});

	const currentDateVal = form.watch("date");
	const currentTypeVal = form.watch("type");
	const parsedSelectedDate = parseDateValue(currentDateVal);

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files && files.length > 0) {
			const file = files[0];
			setSelectedFile(file);
			setUploadedFileName(file.name);
		}
	};

	const onSubmit = (data: CreateProtocolFormData) => {
		onSave({
			date: data.date,
			type: data.type,
			protocolName: data.protocolName || `${data.type} ${data.date}`,
			documentName: uploadedFileName || PROTOCOL_CONSTANTS.DEFAULT_FALLBACK_DOCUMENT_NAME,
			templateType,
			notes: data.notes || "",
			file: selectedFile || undefined,
		});
		form.reset();
		setSelectedFile(null);
		setUploadedFileName(PROTOCOL_CONSTANTS.DEFAULT_FALLBACK_DOCUMENT_NAME);
		onClose();
	};

	const titleText =
		templateType === PROTOCOL_CONSTANTS.TEMPLATE_TYPES.ACTION
			? localizationConstants.createProtocolActionTitle
			: localizationConstants.createProtocolStandardTitle;

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent
				showCloseButton={false}
				className="w-[calc(100vw-2rem)] sm:w-[580px] sm:max-w-[580px] max-h-[90vh] overflow-y-auto rounded-lg bg-white p-4 sm:p-7 border border-slate-200 shadow-xl gap-0 flex flex-col justify-between"
			>
				{/* Modal Header */}
				<DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-slate-100">
					<div className="flex items-center gap-2">
						<FileText className="h-5 w-5 text-slate-700 shrink-0" />
						<DialogTitle className="font-sans font-semibold text-xl sm:text-2xl text-slate-900">
							<Translate text={titleText} />
						</DialogTitle>
					</div>
					<Button
						type="button"
						variant="ghost"
						size="icon"
						onClick={onClose}
						className="h-8 w-8 p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer rounded-md"
						aria-label="Close modal"
					>
						<X className="h-5 w-5" />
					</Button>
				</DialogHeader>

				{/* Modal Form */}
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4 flex-1 flex flex-col justify-between">
						<div className="space-y-4">
							{/* Field 1: Date */}
							<FormField
								control={form.control}
								name="date"
								render={({ field }) => (
									<FormItem className="flex flex-col gap-1.5 space-y-0">
										<FormLabel className="font-sans font-medium text-sm text-slate-900">
											<Translate text={localizationConstants.protocolColDate} />
										</FormLabel>
										<FormControl>
											<Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
												<PopoverTrigger asChild>
													<Button
														type="button"
														variant="outline"
														className="relative flex items-center justify-start h-10 w-full rounded-lg border border-slate-200 bg-white px-3.5 text-left text-sm text-slate-900 focus:outline-none focus:border-slate-900 cursor-pointer hover:bg-slate-50 gap-2.5 font-normal shadow-none"
													>
														<CalendarIcon className="h-4 w-4 text-slate-500 shrink-0 pointer-events-none" />
														<span className="font-normal truncate text-sm text-slate-900">
															{field.value || "YYYY-MM-DD"}
														</span>
													</Button>
												</PopoverTrigger>
												<PopoverContent className="w-auto p-0 border border-slate-200 bg-white shadow-lg rounded-xl z-50" align="start">
													<Calendar
														mode="single"
														selected={parsedSelectedDate}
														onSelect={(date) => {
															if (date) {
																form.setValue("date", format(date, "yyyy-MM-dd"), { shouldValidate: true });
															} else {
																form.setValue("date", "", { shouldValidate: true });
															}
															setDatePickerOpen(false);
														}}
													/>
												</PopoverContent>
											</Popover>
										</FormControl>
										<FormMessage className="text-xs font-medium text-red-500" />
									</FormItem>
								)}
							/>

							{/* Field 2: Type */}
							<FormField
								control={form.control}
								name="type"
								render={() => (
									<FormItem className="flex flex-col gap-1.5 space-y-0">
										<FormLabel className="font-sans font-medium text-sm text-slate-900">
											<Translate text={localizationConstants.protocolTypeLabel} />
										</FormLabel>
										<FormControl>
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button
														type="button"
														variant="outline"
														className="h-10 w-full rounded-lg border-slate-200 bg-white px-3.5 text-left text-sm font-normal text-slate-900 hover:bg-slate-50 flex items-center justify-between cursor-pointer shadow-none"
													>
														<span>{currentTypeVal || PROTOCOL_CONSTANTS.DEFAULT_FALLBACK_TYPE}</span>
														<ChevronDown className="h-4 w-4 text-slate-500 shrink-0" />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align="start" className="w-full min-w-[280px] bg-white border border-slate-200 shadow-md">
													{PROTOCOL_CONSTANTS.PROTOCOL_TYPES.map((pt) => (
														<DropdownMenuItem
															key={pt}
															onClick={() => form.setValue("type", pt, { shouldValidate: true })}
															className="cursor-pointer text-sm"
														>
															{pt}
														</DropdownMenuItem>
													))}
												</DropdownMenuContent>
											</DropdownMenu>
										</FormControl>
										<FormMessage className="text-xs font-medium text-red-500" />
									</FormItem>
								)}
							/>

							{/* Field 3: Protocol Name */}
							<FormField
								control={form.control}
								name="protocolName"
								render={({ field }) => (
									<FormItem className="flex flex-col gap-1.5 space-y-0">
										<FormLabel className="font-sans font-medium text-sm text-slate-900">
											<Translate text={localizationConstants.protocolNameLabel} />
										</FormLabel>
										<FormControl>
											<Input
												type="text"
												placeholder={t(localizationConstants.protocolNameLabel)}
												{...field}
												className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 shadow-none"
											/>
										</FormControl>
										<FormMessage className="text-xs font-medium text-red-500" />
									</FormItem>
								)}
							/>

							{/* Field 4: Document File Upload */}
							<div className="flex flex-col gap-1.5">
								<FormLabel className="font-sans font-medium text-sm text-slate-900">
									<Translate text={localizationConstants.protocolColPdf} />
								</FormLabel>
								<input
									type="file"
									ref={fileInputRef}
									onChange={handleFileSelect}
									accept={PROTOCOL_CONSTANTS.ALLOWED_FILE_TYPES}
									className="hidden"
								/>
								<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full min-w-0">
									<Button
										type="button"
										variant="outline"
										onClick={() => fileInputRef.current?.click()}
										className="flex-1 min-w-0 h-10 rounded-lg border border-slate-200 bg-white px-3.5 flex items-center justify-start gap-2 text-left cursor-pointer hover:bg-slate-50 shadow-none font-normal"
									>
										<Upload className="h-4 w-4 text-slate-500 shrink-0" />
										<span className="text-sm text-slate-900 truncate min-w-0 flex-1">
											{uploadedFileName}
										</span>
									</Button>
									<Button
										type="button"
										onClick={() => fileInputRef.current?.click()}
										className="w-full sm:w-auto h-10 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm cursor-pointer shrink-0 shadow-none whitespace-nowrap"
									>
										<Translate text={localizationConstants.protocolUpload} />
									</Button>
								</div>
							</div>

							{/* Field 5: Notes / Description */}
							<FormField
								control={form.control}
								name="notes"
								render={({ field }) => (
									<FormItem className="flex flex-col gap-1.5 space-y-0">
										<FormLabel className="font-sans font-medium text-sm text-slate-900">
											<Translate text={localizationConstants.protocolNotesLabel} />
										</FormLabel>
										<FormControl>
											<Textarea
												placeholder={t(localizationConstants.protocolNotesLabel)}
												{...field}
												rows={3}
												className="w-full min-h-[80px] rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 resize-y shadow-none"
											/>
										</FormControl>
										<FormMessage className="text-xs font-medium text-red-500" />
									</FormItem>
								)}
							/>
						</div>

						{/* Modal Footer */}
						<div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 pt-4 border-t border-slate-100">
							<Button
								type="button"
								variant="outline"
								onClick={onClose}
								className="w-full sm:w-[120px] h-10 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-900 font-medium text-sm cursor-pointer shadow-none"
							>
								<Translate text={localizationConstants.cancel} />
							</Button>
							<Button
								type="submit"
								className="w-full sm:w-[120px] h-10 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm cursor-pointer flex items-center justify-center gap-2 shadow-none"
							>
								<Save className="h-4 w-4" />
								<span><Translate text={localizationConstants.saveButton} /></span>
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}

export default CreateProtocolModal;

