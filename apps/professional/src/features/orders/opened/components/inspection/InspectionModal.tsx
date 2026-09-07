"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Save, X, Calendar as CalendarIcon } from "lucide-react";
import { format, parseISO, parse, isValid } from "date-fns";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { ORDER_DATE_FORMAT } from "../../constants/orderOpened.constants";
import {
	INSPECTION_TYPES,
	INSPECTION_TYPE_TRANSLATION_MAP,
	DEFAULT_INSPECTION_STATUS,
	DEFAULT_INSPECTION_TYPE,
} from "../../constants/orderInspection.constants";
import type {
	OrderInspectionItem,
	InspectionDocument,
	CreateInspectionInput,
} from "../../types/orderInspection.types";
import { InspectionDocumentUpload } from "./InspectionDocumentUpload";

interface InspectionModalProps {
	isOpen: boolean;
	onClose: () => void;
	inspection?: OrderInspectionItem | null;
	onSave: (item: OrderInspectionItem | CreateInspectionInput) => Promise<unknown>;
	onUploadDocument: (file: File) => Promise<InspectionDocument | null>;
}

interface FormValues {
	date: string;
	type: string;
	inspectionDate: string;
}

function parseSafeDate(dateStr?: string): Date | undefined {
	if (!dateStr || !dateStr.trim()) return undefined;
	const iso = parseISO(dateStr);
	if (isValid(iso)) return iso;
	const parsed = parse(dateStr.trim(), ORDER_DATE_FORMAT, new Date());
	if (isValid(parsed)) return parsed;
	return undefined;
}

export function InspectionModal({
	isOpen,
	onClose,
	inspection,
	onSave,
	onUploadDocument,
}: InspectionModalProps) {
	const t = useTranslate();
	const isEdit = Boolean(inspection?.id);
	const [documents, setDocuments] = useState<InspectionDocument[]>([]);
	const [dateOpen, setDateOpen] = useState(false);
	const [inspectDateOpen, setInspectDateOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const todayStr = format(new Date(), ORDER_DATE_FORMAT);

	const form = useForm<FormValues>({
		defaultValues: {
			date: todayStr,
			type: DEFAULT_INSPECTION_TYPE,
			inspectionDate: todayStr,
		},
	});

	useEffect(() => {
		if (isOpen) {
			if (inspection) {
				form.reset({
					date: inspection.date || todayStr,
					type: inspection.type || DEFAULT_INSPECTION_TYPE,
					inspectionDate: inspection.inspectionDate || todayStr,
				});
				setDocuments(inspection.documents || []);
			} else {
				form.reset({
					date: todayStr,
					type: DEFAULT_INSPECTION_TYPE,
					inspectionDate: todayStr,
				});
				setDocuments([]);
			}
			setIsSubmitting(false);
		}
	}, [isOpen, inspection, form, todayStr]);

	const onSubmit = async (values: FormValues) => {
		try {
			setIsSubmitting(true);
			if (isEdit && inspection) {
				await onSave({
					...inspection,
					date: values.date,
					type: values.type,
					inspectionDate: values.inspectionDate,
					documents,
				});
			} else {
				await onSave({
					date: values.date,
					type: values.type,
					inspectionDate: values.inspectionDate,
					status: DEFAULT_INSPECTION_STATUS,
					comments: "",
					documents,
				});
			}
			onClose();
		} catch (error) {
			console.error("[Inspection Modal] Save error:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && !isSubmitting && onClose()}>
			<DialogContent
				showCloseButton={false}
				className="w-full sm:max-w-xl bg-white border border-zinc-200 p-6 rounded-lg shadow-lg flex flex-col justify-between overflow-y-auto max-h-[90vh]"
			>
				<DialogHeader className="flex flex-row items-center justify-between pb-0">
					<DialogTitle className="font-sans text-lg sm:text-2xl font-bold tracking-tight text-slate-950">
						{isEdit
							? t(localizationConstants.editInspectionModalTitle)
							: t(localizationConstants.addInspectionModalTitle)}
					</DialogTitle>
					<DialogDescription className="sr-only">
						{isEdit
							? t(localizationConstants.editInspectionModalTitle)
							: t(localizationConstants.addInspectionModalTitle)}
					</DialogDescription>
					<DialogClose asChild>
						<Button
							type="button"
							variant="ghost"
							size="icon"
							disabled={isSubmitting}
							className="h-8 w-8 rounded-md text-slate-900 hover:bg-zinc-100 cursor-pointer"
						>
							<X className="h-5 w-5 text-slate-900" />
						</Button>
					</DialogClose>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-1">
						{/* 1. Datum */}
						<FormField
							control={form.control}
							name="date"
							rules={{ required: t(localizationConstants.inspectionDateRequired) }}
							render={({ field, fieldState }) => {
								const dateValue = parseSafeDate(field.value);
								return (
									<FormItem className="flex flex-col gap-1.5 justify-start w-full">
										<FormLabel className="font-sans text-sm font-medium leading-5 tracking-normal text-slate-900">
											{t(localizationConstants.inspectionDateFieldLabel)}
										</FormLabel>
										<Popover open={dateOpen} onOpenChange={setDateOpen}>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														type="button"
														variant="outline"
														className={`w-full justify-start text-left font-normal h-11 bg-white text-slate-900 hover:bg-slate-50 cursor-pointer rounded-md focus:border-slate-900 ${
															fieldState.error ? "border-red-500" : "border-zinc-200"
														}`}
													>
														<CalendarIcon className="mr-2 h-4 w-4 text-slate-600 shrink-0" />
														{dateValue ? (
															format(dateValue, ORDER_DATE_FORMAT)
														) : (
															<span className="text-slate-400">
																{t(localizationConstants.pickDatePlaceholder)}
															</span>
														)}
													</Button>
												</FormControl>
											</PopoverTrigger>
											<PopoverContent className="w-auto p-0 bg-white border-zinc-200" align="start">
												<Calendar
													mode="single"
													selected={dateValue}
													onSelect={(date) => {
														field.onChange(date ? format(date, ORDER_DATE_FORMAT) : "");
														setDateOpen(false);
													}}
												/>
											</PopoverContent>
										</Popover>
										<FormMessage className="text-xs text-red-500 font-normal" />
									</FormItem>
								);
							}}
						/>

						{/* 2. Typ */}
						<FormField
							control={form.control}
							name="type"
							rules={{ required: t(localizationConstants.inspectionTypeRequired) }}
							render={({ field, fieldState }) => (
								<FormItem className="flex flex-col gap-1.5 justify-start w-full">
									<FormLabel className="font-sans text-sm font-medium leading-5 tracking-normal text-slate-900">
										{t(localizationConstants.inspectionTypeFieldLabel)}
									</FormLabel>
									<Select onValueChange={field.onChange} value={field.value}>
										<FormControl>
											<SelectTrigger
												className={`w-full h-11 bg-white text-slate-900 text-sm rounded-md focus:border-slate-900 [&_svg]:text-slate-600 [&_svg]:opacity-100 ${
													fieldState.error ? "border-red-500" : "border-zinc-200"
												}`}
											>
												<SelectValue placeholder={t(localizationConstants.inspectionTypeFieldLabel)} />
											</SelectTrigger>
										</FormControl>
										<SelectContent className="w-full bg-white border-zinc-200">
											{INSPECTION_TYPES.map((tp) => {
												const trKey = INSPECTION_TYPE_TRANSLATION_MAP[tp];
												return (
													<SelectItem key={tp} value={tp} className="text-sm cursor-pointer">
														{trKey ? t(trKey) : tp}
													</SelectItem>
												);
											})}
										</SelectContent>
									</Select>
									<FormMessage className="text-xs text-red-500 font-normal" />
								</FormItem>
							)}
						/>

						{/* 3. Besiktningsdatum */}
						<FormField
							control={form.control}
							name="inspectionDate"
							rules={{ required: t(localizationConstants.inspectionInspectDateRequired) }}
							render={({ field, fieldState }) => {
								const dateValue = parseSafeDate(field.value);
								return (
									<FormItem className="flex flex-col gap-1.5 justify-start w-full">
										<FormLabel className="font-sans text-sm font-medium leading-5 tracking-normal text-slate-900">
											{t(localizationConstants.inspectionDateInspectFieldLabel)}
										</FormLabel>
										<Popover open={inspectDateOpen} onOpenChange={setInspectDateOpen}>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														type="button"
														variant="outline"
														className={`w-full justify-start text-left font-normal h-11 bg-white text-slate-900 hover:bg-slate-50 cursor-pointer rounded-md focus:border-slate-900 ${
															fieldState.error ? "border-red-500" : "border-zinc-200"
														}`}
													>
														<CalendarIcon className="mr-2 h-4 w-4 text-slate-600 shrink-0" />
														{dateValue ? (
															format(dateValue, ORDER_DATE_FORMAT)
														) : (
															<span className="text-slate-400">
																{t(localizationConstants.pickDatePlaceholder)}
															</span>
														)}
													</Button>
												</FormControl>
											</PopoverTrigger>
											<PopoverContent className="w-auto p-0 bg-white border-zinc-200" align="start">
												<Calendar
													mode="single"
													selected={dateValue}
													onSelect={(date) => {
														field.onChange(date ? format(date, ORDER_DATE_FORMAT) : "");
														setInspectDateOpen(false);
													}}
												/>
											</PopoverContent>
										</Popover>
										<FormMessage className="text-xs text-red-500 font-normal" />
									</FormItem>
								);
							}}
						/>

						{/* 4. Dokument Upload & Chips List */}
						<InspectionDocumentUpload
							documents={documents}
							onAddDocument={(doc) => setDocuments((prev) => [...prev, doc])}
							onRemoveDocument={(id) => setDocuments((prev) => prev.filter((d) => d.id !== id))}
							onUpload={onUploadDocument}
							isSubmitting={isSubmitting}
							isEdit={isEdit}
						/>

						{/* Footer */}
						<DialogFooter className="flex items-center justify-end gap-3 pt-4 sm:justify-end">
							<Button
								type="button"
								variant="outline"
								onClick={onClose}
								disabled={isSubmitting}
								className="h-11 min-w-[100px] px-5 rounded-md border-zinc-200 text-slate-900 bg-white hover:bg-zinc-50 cursor-pointer font-medium text-sm shadow-none"
							>
								{t(localizationConstants.buttonClose)}
							</Button>
							<Button
								type="submit"
								disabled={isSubmitting}
								className="h-11 min-w-[110px] px-5 rounded-md bg-slate-900 text-white hover:bg-slate-800 cursor-pointer font-medium text-sm flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
							>
								<Save className="h-4 w-4" />
								<span>{t(localizationConstants.buttonSave)}</span>
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}

export default InspectionModal;
