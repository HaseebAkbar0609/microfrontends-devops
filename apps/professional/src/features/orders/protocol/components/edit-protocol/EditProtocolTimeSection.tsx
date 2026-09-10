"use client";

import React, { useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { CalendarMinus2, Calendar as CalendarIcon, ChevronUp } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { TimePicker } from "@/components/ui/time-picker";
import { Calendar } from "@/components/ui/calendar";
import {
	FormField,
	FormItem,
	FormControl,
	FormMessage,
} from "@/components/ui/form";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { parseDateValue } from "@/utils/date";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { PROTOCOL_CONSTANTS } from "../../constants/protocol.constants";
import type { EditProtocolFormData } from "../../validation/protocol.validation";

export interface EditProtocolTimeSectionProps {
	form: UseFormReturn<EditProtocolFormData>;
	defaultOpen?: boolean;
}

export function EditProtocolTimeSection({
	form,
	defaultOpen = true,
}: EditProtocolTimeSectionProps) {
	const t = useTranslate();
	const [isOpen, setIsOpen] = useState(defaultOpen);
	const [startDatePickerOpen, setStartDatePickerOpen] = useState(false);
	const [endDatePickerOpen, setEndDatePickerOpen] = useState(false);

	const formatDisplayDate = (dateString?: string) => {
		if (!dateString) return "";
		try {
			const dateObj = parseDateValue(dateString);
			if (!dateObj || isNaN(dateObj.getTime())) return dateString;
			const dayPrefix = PROTOCOL_CONSTANTS.DAY_NAMES[dateObj.getDay()] || "";
			return `${dayPrefix} ${format(dateObj, "yyyy-MM-dd")}`.trim();
		} catch (_e) {
			return dateString;
		}
	};

	return (
		<div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-2xs w-full flex flex-col">
			{/* Accordion Header */}
			<Button
				type="button"
				variant="ghost"
				onClick={() => setIsOpen((prev) => !prev)}
				className="flex h-14 min-h-14 w-full cursor-pointer items-center justify-between px-6 sm:px-8 py-0 text-left transition-colors hover:bg-slate-50 font-normal rounded-none shadow-none focus:outline-none"
				aria-expanded={isOpen}
			>
				<div className="flex items-center gap-2 sm:gap-3 min-w-0 pr-2">
					<CalendarMinus2 className="h-6 w-6 size-6 text-slate-800 shrink-0" strokeWidth={1.75} aria-hidden="true" />
					<span className="font-sans text-base font-medium leading-6 tracking-normal text-slate-900 truncate">
						<Translate text={localizationConstants.protocolSectionTime} />
					</span>
				</div>
				<ChevronUp
					size={18}
					className={cn(
						"text-zinc-500 transition-transform duration-200 shrink-0",
						!isOpen && "rotate-180"
					)}
					aria-hidden={true}
				/>
			</Button>

			{/* Accordion Body */}
			{isOpen && (
				<div className="border-t border-zinc-200 p-4 sm:p-6 space-y-4">
					{/* Row 1: Start tid */}
					<div className="space-y-1">
						<p className="text-xs font-semibold text-slate-900">
							<Translate text={localizationConstants.protocolFieldStartTime} />
						</p>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
							{/* Start Date */}
							<FormField
								control={form.control}
								name="startDate"
								render={({ field }) => (
									<FormItem className="space-y-0">
										<Popover open={startDatePickerOpen} onOpenChange={setStartDatePickerOpen}>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														type="button"
														variant="outline"
														className="h-10 w-full rounded-lg border-slate-200 bg-white text-slate-900 text-sm font-normal px-3 flex items-center justify-start gap-2 shadow-none hover:bg-slate-50 cursor-pointer"
													>
														<CalendarIcon className="h-4 w-4 text-zinc-500 shrink-0" />
														<span>{formatDisplayDate(field.value) || t(localizationConstants.protocolFieldStartTime)}</span>
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
															setStartDatePickerOpen(false);
														}
													}}
												/>
											</PopoverContent>
										</Popover>
										<FormMessage className="text-xs font-medium text-red-500 mt-1" />
									</FormItem>
								)}
							/>

							{/* Start Time */}
							<FormField
								control={form.control}
								name="startTime"
								render={({ field }) => (
									<FormItem className="space-y-0">
										<FormControl>
											<TimePicker
												value={field.value}
												onChange={field.onChange}
												placeholder={PROTOCOL_CONSTANTS.DEFAULT_START_TIME}
												className="h-10 rounded-lg border-slate-200 bg-white text-slate-900 text-sm shadow-none focus-visible:ring-slate-900"
											/>
										</FormControl>
										<FormMessage className="text-xs font-medium text-red-500 mt-1" />
									</FormItem>
								)}
							/>
						</div>
					</div>

					{/* Row 2: Slut tid */}
					<div className="space-y-1">
						<p className="text-xs font-semibold text-slate-900">
							<Translate text={localizationConstants.protocolFieldEndTime} />
						</p>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
							{/* End Date */}
							<FormField
								control={form.control}
								name="endDate"
								render={({ field }) => (
									<FormItem className="space-y-0">
										<Popover open={endDatePickerOpen} onOpenChange={setEndDatePickerOpen}>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														type="button"
														variant="outline"
														className="h-10 w-full rounded-lg border-slate-200 bg-white text-slate-900 text-sm font-normal px-3 flex items-center justify-start gap-2 shadow-none hover:bg-slate-50 cursor-pointer"
													>
														<CalendarIcon className="h-4 w-4 text-zinc-500 shrink-0" />
														<span>{formatDisplayDate(field.value) || t(localizationConstants.protocolFieldEndTime)}</span>
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
															setEndDatePickerOpen(false);
														}
													}}
												/>
											</PopoverContent>
										</Popover>
										<FormMessage className="text-xs font-medium text-red-500 mt-1" />
									</FormItem>
								)}
							/>

							{/* End Time */}
							<FormField
								control={form.control}
								name="endTime"
								render={({ field }) => (
									<FormItem className="space-y-0">
										<FormControl>
											<TimePicker
												value={field.value}
												onChange={field.onChange}
												placeholder={PROTOCOL_CONSTANTS.DEFAULT_END_TIME}
												className="h-10 rounded-lg border-slate-200 bg-white text-slate-900 text-sm shadow-none focus-visible:ring-slate-900"
											/>
										</FormControl>
										<FormMessage className="text-xs font-medium text-red-500 mt-1" />
									</FormItem>
								)}
							/>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default EditProtocolTimeSection;
