"use client";

import React, { useEffect } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Save, Timer, Info, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from "@/components/ui/form";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { parseDateValue } from "@/utils/date";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { TIMEPLAN_CONSTANTS } from "../../constants/timeplan.constants";
import type { OrderTimeplanFormData } from "../../types/timeplan.types";
import { orderTimeplanStep1Schema } from "../../validation/timeplan.validation";

interface OrderTimeplanStep1FormProps {
	formData: OrderTimeplanFormData;
	onChange: (field: keyof OrderTimeplanFormData, value: string) => void;
	onNext: () => void;
	onSave: () => void;
	onCancel: () => void;
	isSubmitting?: boolean;
}

export function OrderTimeplanStep1Form({
	formData,
	onChange,
	onNext,
	onSave,
	onCancel,
	isSubmitting = false,
}: OrderTimeplanStep1FormProps) {
	const t = useTranslate();

	const form = useForm<OrderTimeplanFormData>({
		resolver: zodResolver(orderTimeplanStep1Schema) as Resolver<OrderTimeplanFormData>,
		defaultValues: formData,
		mode: "onChange",
	});

	const {
		control,
		handleSubmit,
		watch,
	} = form;

	// Watch and sync with parent onChange
	useEffect(() => {
		const subscription = watch((value, { name }) => {
			if (name && value[name as keyof OrderTimeplanFormData] !== undefined) {
				onChange(
					name as keyof OrderTimeplanFormData,
					value[name as keyof OrderTimeplanFormData] || ""
				);
			}
		});
		return () => subscription.unsubscribe();
	}, [watch, onChange]);

	const selectedAuthorName = watch("createdBy") || TIMEPLAN_CONSTANTS.AUTHORS[0].name;
	const selectedAuthor =
		TIMEPLAN_CONSTANTS.AUTHORS.find((a) => a.name === selectedAuthorName) ||
		TIMEPLAN_CONSTANTS.AUTHORS[0];

	const handleNextClick = handleSubmit(() => {
		onNext();
	});

	const handleSaveClick = handleSubmit(() => {
		onSave();
	});

	return (
		<div className="flex flex-col flex-1 min-h-[calc(100vh-140px)] -ml-4 sm:-ml-[3.25rem] -mr-4 sm:-mr-6 -mt-px -mb-4 px-3 sm:px-6 pt-5 sm:pt-7 pb-0 bg-slate-50 justify-between font-sans">
			<Form {...form}>
				<form
					onSubmit={(e) => {
						e.preventDefault();
					}}
					className="flex flex-col flex-1 w-full space-y-4"
				>
					{/* Header: Back arrow & Title (sitting at the left edge) */}
					<div className="flex items-start gap-2.5 pb-1">
						<Button
							type="button"
							variant="ghost"
							size="icon"
							onClick={onCancel}
							className="size-7 shrink-0 rounded-md text-slate-900 hover:bg-slate-100 cursor-pointer flex items-center justify-center p-0 mt-0.5 shadow-none"
							aria-label={t(localizationConstants.orderTimeplanBtnCancel)}
						>
							<ArrowLeft className="size-5 text-slate-900" aria-hidden="true" />
						</Button>
						<div className="flex flex-col">
							<h1 className="font-sans font-semibold text-xl sm:text-2xl leading-8 text-slate-900">
								<Translate text={localizationConstants.orderTimeplanStep1Title} />
							</h1>
						</div>
					</div>

					{/* Main Cards Container: Placed with left spacing (pl-0 sm:pl-7) and max-w-4xl */}
					<div className="space-y-4 sm:space-y-6 w-full max-w-4xl pb-10 pl-0 sm:pl-7">
						{/* Card 1: Tidsplan */}
						<div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm w-full flex flex-col">
							{/* Card Header with Timer Icon */}
							<div className="flex h-14 min-h-14 w-full items-center px-5 sm:px-6 py-0 border-b border-slate-200 bg-white">
								<div className="flex items-center gap-2.5 min-w-0 pr-2">
									<Timer className="size-6 text-slate-700 shrink-0" strokeWidth={1.75} aria-hidden="true" />
									<span className="font-sans text-base font-medium text-slate-900 truncate">
										<Translate text={localizationConstants.orderTimeplanCardDetailsTitle} />
									</span>
								</div>
							</div>

							{/* Card Body */}
							<div className="p-5 sm:p-6 space-y-4">
								{/* Row 1: Tidsplan & Typ */}
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 items-start w-full">
									{/* Tidsplan */}
									<FormField
										control={control}
										name="planName"
										render={({ field }) => (
											<FormItem className="flex flex-col gap-1.5 w-full">
												<FormLabel className="font-sans font-medium text-sm leading-5 tracking-normal text-slate-900">
													<Translate text={localizationConstants.orderTimeplanFieldPlanName} />
													<span className="text-rose-500 ml-0.5">*</span>
												</FormLabel>
												<Select
													value={field.value || TIMEPLAN_CONSTANTS.KINDS.MAIN}
													onValueChange={field.onChange}
												>
													<FormControl>
														<SelectTrigger className="h-10 w-full rounded-lg border-slate-200 bg-white text-slate-900 text-sm shadow-none focus-visible:ring-1 focus-visible:ring-slate-900">
															<SelectValue placeholder={t(localizationConstants.orderTimeplanFieldPlanNamePlaceholder)} />
														</SelectTrigger>
													</FormControl>
													<SelectContent className="bg-white">
														<SelectItem value={TIMEPLAN_CONSTANTS.KINDS.MAIN}>
															<Translate text={localizationConstants.orderTimeplanKindMain} />
														</SelectItem>
														<SelectItem value={TIMEPLAN_CONSTANTS.KINDS.PARTIAL}>
															<Translate text={localizationConstants.orderTimeplanKindPartial} />
														</SelectItem>
													</SelectContent>
												</Select>
												<FormMessage className="text-xs text-rose-500 font-sans" />
											</FormItem>
										)}
									/>

									{/* Typ */}
									<FormField
										control={control}
										name="type"
										render={({ field }) => (
											<FormItem className="flex flex-col gap-1.5 w-full">
												<FormLabel className="font-sans font-medium text-sm leading-5 tracking-normal text-slate-900">
													<Translate text={localizationConstants.orderTimeplanFieldType} />
												</FormLabel>
												<Select
													value={field.value || TIMEPLAN_CONSTANTS.DEFAULT_TYPE}
													onValueChange={field.onChange}
												>
													<FormControl>
														<SelectTrigger className="h-10 w-full rounded-lg border-slate-200 bg-white text-slate-900 text-sm shadow-none focus-visible:ring-1 focus-visible:ring-slate-900">
															<SelectValue placeholder={t(localizationConstants.orderTimeplanFieldTypePlaceholder)} />
														</SelectTrigger>
													</FormControl>
													<SelectContent className="bg-white">
														{TIMEPLAN_CONSTANTS.TYPES.map((typeOption) => (
															<SelectItem key={typeOption.value} value={typeOption.value}>
																<Translate text={localizationConstants[typeOption.labelKey as keyof typeof localizationConstants]} />
															</SelectItem>
														))}
													</SelectContent>
												</Select>
												<FormMessage className="text-xs text-rose-500 font-sans" />
											</FormItem>
										)}
									/>
								</div>

								{/* Row 2: Start datum & Slut datum */}
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 items-start w-full">
									{/* Start datum */}
									<FormField
										control={control}
										name="startDate"
										render={({ field }) => (
											<FormItem className="flex flex-col gap-1.5 w-full">
												<FormLabel className="font-sans font-medium text-sm leading-5 tracking-normal text-slate-900">
													<Translate text={localizationConstants.orderTimeplanFieldStartDate} />
													<span className="text-rose-500 ml-0.5">*</span>
												</FormLabel>
												<Popover>
													<PopoverTrigger asChild>
														<FormControl>
															<Button
																type="button"
																variant="outline"
																className="h-10 w-full rounded-lg border-slate-200 bg-white text-slate-900 text-sm font-normal px-3 flex items-center justify-start gap-2 shadow-none hover:bg-slate-50 cursor-pointer"
															>
																<CalendarIcon className="h-4 w-4 text-zinc-500 shrink-0" />
																<span className={field.value ? "text-slate-900" : "text-slate-400"}>
																	{field.value || t(localizationConstants.orderTimeplanFieldStartDate)}
																</span>
															</Button>
														</FormControl>
													</PopoverTrigger>
													<PopoverContent className="w-auto p-0 bg-white border border-slate-200 shadow-lg rounded-lg z-50" align="start">
														<Calendar
															mode="single"
															selected={parseDateValue(field.value)}
															onSelect={(date) => {
																if (date) {
																	field.onChange(format(date, "yyyy-MM-dd"));
																}
															}}
														/>
													</PopoverContent>
												</Popover>
												<FormMessage className="text-xs text-rose-500 font-sans" />
											</FormItem>
										)}
									/>

									{/* Slut datum */}
									<FormField
										control={control}
										name="endDate"
										render={({ field }) => (
											<FormItem className="flex flex-col gap-1.5 w-full">
												<FormLabel className="font-sans font-medium text-sm leading-5 tracking-normal text-slate-900">
													<Translate text={localizationConstants.orderTimeplanFieldEndDate} />
													<span className="text-rose-500 ml-0.5">*</span>
												</FormLabel>
												<Popover>
													<PopoverTrigger asChild>
														<FormControl>
															<Button
																type="button"
																variant="outline"
																className="h-10 w-full rounded-lg border-slate-200 bg-white text-slate-900 text-sm font-normal px-3 flex items-center justify-start gap-2 shadow-none hover:bg-slate-50 cursor-pointer"
															>
																<CalendarIcon className="h-4 w-4 text-zinc-500 shrink-0" />
																<span className={field.value ? "text-slate-900" : "text-slate-400"}>
																	{field.value || t(localizationConstants.orderTimeplanFieldEndDate)}
																</span>
															</Button>
														</FormControl>
													</PopoverTrigger>
													<PopoverContent className="w-auto p-0 bg-white border border-slate-200 shadow-lg rounded-lg z-50" align="start">
														<Calendar
															mode="single"
															selected={parseDateValue(field.value)}
															onSelect={(date) => {
																if (date) {
																	field.onChange(format(date, "yyyy-MM-dd"));
																}
															}}
														/>
													</PopoverContent>
												</Popover>
												<FormMessage className="text-xs text-rose-500 font-sans" />
											</FormItem>
										)}
									/>
								</div>
							</div>
						</div>

						{/* Card 2: Other information / Övrig information */}
						<div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm w-full flex flex-col">
							{/* Card Header with Info Icon */}
							<div className="flex h-14 min-h-14 w-full items-center px-5 sm:px-6 py-0 border-b border-slate-200 bg-white">
								<div className="flex items-center gap-2.5 min-w-0 pr-2">
									<Info className="size-6 text-slate-700 shrink-0" strokeWidth={1.75} aria-hidden="true" />
									<span className="font-sans text-base font-medium text-slate-900 truncate">
										<Translate text={localizationConstants.orderTimeplanCardOtherInfoTitle} />
									</span>
								</div>
							</div>

							{/* Card Body */}
							<div className="p-5 sm:p-6 space-y-4">
								{/* Row 1: Order nr & Customer */}
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 items-start w-full">
									{/* Order nr */}
									<FormField
										control={control}
										name="orderNr"
										render={({ field }) => (
											<FormItem className="flex flex-col gap-1.5 w-full">
												<FormLabel className="font-sans font-medium text-sm leading-5 tracking-normal text-slate-900">
													<Translate text={localizationConstants.orderTimeplanFieldOrderNr} />
												</FormLabel>
												<FormControl>
													<Input
														{...field}
														disabled
														className="h-10 w-full rounded-lg border-slate-200 bg-slate-100 text-slate-700 font-medium text-sm shadow-none cursor-not-allowed"
													/>
												</FormControl>
												<FormMessage className="text-xs text-rose-500 font-sans" />
											</FormItem>
										)}
									/>

									{/* Customer */}
									<FormField
										control={control}
										name="customer"
										render={({ field }) => (
											<FormItem className="flex flex-col gap-1.5 w-full">
												<FormLabel className="font-sans font-medium text-sm leading-5 tracking-normal text-slate-900">
													<Translate text={localizationConstants.orderTimeplanFieldCustomer} />
												</FormLabel>
												<FormControl>
													<Input
														{...field}
														disabled
														className="h-10 w-full rounded-lg border-slate-200 bg-slate-100 text-slate-700 font-medium text-sm shadow-none cursor-not-allowed"
													/>
												</FormControl>
												<FormMessage className="text-xs text-rose-500 font-sans" />
											</FormItem>
										)}
									/>
								</div>

								{/* Row 2: Skapat av */}
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 items-start w-full">
									<FormField
										control={control}
										name="createdBy"
										render={({ field }) => (
											<FormItem className="flex flex-col gap-1.5 w-full">
												<FormLabel className="font-sans font-medium text-sm leading-5 tracking-normal text-slate-900">
													<Translate text={localizationConstants.orderTimeplanFieldCreatedBy} />
												</FormLabel>
												<Select
													value={field.value || selectedAuthor.name}
													onValueChange={field.onChange}
												>
													<FormControl>
														<SelectTrigger className="h-10 w-full rounded-lg border-slate-200 bg-white text-slate-900 text-sm shadow-none focus-visible:ring-1 focus-visible:ring-slate-900">
															<div className="flex items-center gap-2 truncate">
																<div className="h-5 w-5 rounded-full bg-amber-700 text-white text-[10px] font-medium flex items-center justify-center shrink-0">
																	{selectedAuthor.avatar}
																</div>
																<span className="font-medium text-slate-900 text-xs truncate">
																	{selectedAuthor.name}
																</span>
																<span className="text-slate-400 text-xs">
																	{selectedAuthor.handle}
																</span>
															</div>
														</SelectTrigger>
													</FormControl>
													<SelectContent className="bg-white">
														{TIMEPLAN_CONSTANTS.AUTHORS.map((author) => (
															<SelectItem key={author.id} value={author.name}>
																<div className="flex items-center gap-2">
																	<div className="h-5 w-5 rounded-full bg-amber-700 text-white text-[10px] font-medium flex items-center justify-center shrink-0">
																		{author.avatar}
																	</div>
																	<span className="font-medium text-slate-900 text-xs">
																		{author.name}
																	</span>
																	<span className="text-slate-400 text-xs">
																		{author.handle}
																	</span>
																</div>
															</SelectItem>
														))}
													</SelectContent>
												</Select>
												<FormMessage className="text-xs text-rose-500 font-sans" />
											</FormItem>
										)}
									/>
								</div>

								{/* Row 3: Datum & Reviderat datum */}
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 items-start w-full">
									{/* Datum */}
									<FormField
										control={control}
										name="date"
										render={({ field }) => (
											<FormItem className="flex flex-col gap-1.5 w-full">
												<FormLabel className="font-sans font-medium text-sm leading-5 tracking-normal text-slate-900">
													<Translate text={localizationConstants.orderTimeplanFieldDate} />
												</FormLabel>
												<Popover>
													<PopoverTrigger asChild>
														<FormControl>
															<Button
																type="button"
																variant="outline"
																className="h-10 w-full rounded-lg border-slate-200 bg-white text-slate-900 text-sm font-normal px-3 flex items-center justify-start gap-2 shadow-none hover:bg-slate-50 cursor-pointer"
															>
																<CalendarIcon className="h-4 w-4 text-zinc-500 shrink-0" />
																<span className={field.value ? "text-slate-900" : "text-slate-400"}>
																	{field.value || t(localizationConstants.orderTimeplanFieldDate)}
																</span>
															</Button>
														</FormControl>
													</PopoverTrigger>
													<PopoverContent className="w-auto p-0 bg-white border border-slate-200 shadow-lg rounded-lg z-50" align="start">
														<Calendar
															mode="single"
															selected={parseDateValue(field.value)}
															onSelect={(date) => {
																if (date) {
																	field.onChange(format(date, "yyyy-MM-dd"));
																}
															}}
														/>
													</PopoverContent>
												</Popover>
												<FormMessage className="text-xs text-rose-500 font-sans" />
											</FormItem>
										)}
									/>

									{/* Reviderat datum */}
									<FormField
										control={control}
										name="revisedDate"
										render={({ field }) => (
											<FormItem className="flex flex-col gap-1.5 w-full">
												<FormLabel className="font-sans font-medium text-sm leading-5 tracking-normal text-slate-900">
													<Translate text={localizationConstants.orderTimeplanFieldRevisedDate} />
												</FormLabel>
												<Popover>
													<PopoverTrigger asChild>
														<FormControl>
															<Button
																type="button"
																variant="outline"
																className="h-10 w-full rounded-lg border-slate-200 bg-white text-slate-900 text-sm font-normal px-3 flex items-center justify-start gap-2 shadow-none hover:bg-slate-50 cursor-pointer"
															>
																<CalendarIcon className="h-4 w-4 text-zinc-500 shrink-0" />
																<span className={field.value ? "text-slate-900" : "text-slate-400"}>
																	{field.value || t(localizationConstants.orderTimeplanFieldRevisedDate)}
																</span>
															</Button>
														</FormControl>
													</PopoverTrigger>
													<PopoverContent className="w-auto p-0 bg-white border border-slate-200 shadow-lg rounded-lg z-50" align="start">
														<Calendar
															mode="single"
															selected={parseDateValue(field.value)}
															onSelect={(date) => {
																if (date) {
																	field.onChange(format(date, "yyyy-MM-dd"));
																}
															}}
														/>
													</PopoverContent>
												</Popover>
												<FormMessage className="text-xs text-rose-500 font-sans" />
											</FormItem>
										)}
									/>
								</div>

								{/* Row 4: Beskrivning (Full width textarea) */}
								<FormField
									control={control}
									name="description"
									render={({ field }) => (
										<FormItem className="flex flex-col gap-1.5 w-full">
											<FormLabel className="font-sans font-medium text-sm leading-5 tracking-normal text-slate-900">
												<Translate text={localizationConstants.orderTimeplanFieldDescription} />
											</FormLabel>
											<FormControl>
												<Textarea
													{...field}
													placeholder={t(localizationConstants.orderTimeplanFieldDescriptionPlaceholder)}
													rows={4}
													className="w-full rounded-lg border-slate-200 text-sm shadow-none focus-visible:ring-1 focus-visible:ring-slate-900 resize-y min-h-[90px] p-3 text-slate-900"
												/>
											</FormControl>
											<FormMessage className="text-xs text-rose-500 font-sans" />
										</FormItem>
									)}
								/>
							</div>
						</div>
					</div>

					{/* Sticky Bottom Action Bar matching exact Protocol/Order pattern */}
					<div className="mt-auto sticky -bottom-4 -mx-3 sm:-mx-6 -mb-4 px-4 sm:px-6 py-3 bg-white border-t border-slate-200 z-30 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 shadow-md">
						<Button
							type="button"
							variant="outline"
							onClick={onCancel}
							className="w-full sm:w-auto min-w-0 sm:min-w-[120px] h-10 px-4 sm:px-6 rounded-lg border border-slate-200 bg-transparent hover:bg-slate-100 text-slate-900 text-sm font-medium cursor-pointer shadow-none"
						>
							<Translate text={localizationConstants.orderTimeplanBtnCancel} />
						</Button>

						<Button
							type="button"
							variant="outline"
							onClick={handleSaveClick}
							disabled={isSubmitting}
							className="w-full sm:w-auto min-w-0 sm:min-w-[120px] h-10 px-4 sm:px-6 rounded-lg border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-900 text-sm font-medium cursor-pointer shadow-none flex items-center justify-center gap-2"
						>
							<Save className="h-4 w-4 text-slate-700" />
							<Translate text={localizationConstants.orderTimeplanBtnSave} />
						</Button>

						<Button
							type="button"
							onClick={handleNextClick}
							disabled={isSubmitting}
							className="w-full sm:w-auto min-w-0 sm:min-w-[130px] h-10 px-4 sm:px-6 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium border-0 gap-2 cursor-pointer shadow-none flex items-center justify-center"
						>
							<Translate text={localizationConstants.orderTimeplanBtnNextTimeplan} />
							<ArrowRight className="h-4 w-4 text-white" />
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
}
