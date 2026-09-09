"use client";

import React, { useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { Video, Calendar as CalendarIcon, ChevronUp, ChevronDown, Plus, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TimePicker } from "@/components/ui/time-picker";
import { Calendar } from "@/components/ui/calendar";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
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
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { parseDateValue } from "@/utils/date";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { PROTOCOL_CONSTANTS } from "../../constants/protocol.constants";
import type { EditProtocolFormData } from "../../validation/protocol.validation";

export interface EditProtocolNextMeetingSectionProps {
	form: UseFormReturn<EditProtocolFormData>;
	defaultOpen?: boolean;
}

export function EditProtocolNextMeetingSection({
	form,
	defaultOpen = true,
}: EditProtocolNextMeetingSectionProps) {
	const t = useTranslate();
	const [isOpen, setIsOpen] = useState(defaultOpen);
	const [startDatePickerOpen, setStartDatePickerOpen] = useState(false);
	const [endDatePickerOpen, setEndDatePickerOpen] = useState(false);

	const selectedParticipants = form.watch("nextMeetingParticipants") || [];

	const handleAddParticipant = (userName: string) => {
		if (!selectedParticipants.includes(userName)) {
			form.setValue("nextMeetingParticipants", [...selectedParticipants, userName], {
				shouldValidate: true,
				shouldDirty: true,
			});
		}
	};

	const handleRemoveParticipant = (userName: string) => {
		form.setValue(
			"nextMeetingParticipants",
			selectedParticipants.filter((p) => p !== userName),
			{
				shouldValidate: true,
				shouldDirty: true,
			}
		);
	};

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
					<Video className="h-6 w-6 size-6 text-slate-800 shrink-0" strokeWidth={1.75} aria-hidden="true" />
					<span className="font-sans text-base font-medium leading-6 tracking-normal text-slate-900 truncate">
						<Translate text={localizationConstants.protocolNextMeeting} />
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
					{/* Row 1: Ansvarig & Rubrik */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
						{/* Ansvarig */}
						<FormField
							control={form.control}
							name="nextMeetingResponsible"
							render={({ field }) => (
								<FormItem className="space-y-1">
									<FormLabel className="text-xs font-semibold text-slate-900">
										<Translate text={localizationConstants.protocolFieldResponsible} />
									</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder={PROTOCOL_CONSTANTS.DEFAULT_RESPONSIBLE}
											className="h-10 rounded-lg border-slate-200 bg-white text-slate-900 text-sm shadow-none focus-visible:ring-slate-900"
										/>
									</FormControl>
									<FormMessage className="text-xs font-medium text-red-500 mt-1" />
								</FormItem>
							)}
						/>

						{/* Rubrik */}
						<FormField
							control={form.control}
							name="nextMeetingRubrik"
							render={({ field }) => (
								<FormItem className="space-y-1">
									<FormLabel className="text-xs font-semibold text-slate-900">
										<Translate text={localizationConstants.protocolFieldTitle} />
									</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder={t(localizationConstants.protocolFieldTitle)}
											className="h-10 rounded-lg border-slate-200 bg-white text-slate-900 text-sm shadow-none focus-visible:ring-slate-900"
										/>
									</FormControl>
									<FormMessage className="text-xs font-medium text-red-500 mt-1" />
								</FormItem>
							)}
						/>
					</div>

					{/* Row 2: Kategori & Adress */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
						{/* Kategori */}
						<FormField
							control={form.control}
							name="nextMeetingCategory"
							render={({ field }) => (
								<FormItem className="space-y-1">
									<FormLabel className="text-xs font-semibold text-slate-900">
										<Translate text={localizationConstants.protocolFieldCategory} />
									</FormLabel>
									<Select onValueChange={field.onChange} value={field.value || PROTOCOL_CONSTANTS.CATEGORIES[0]}>
										<FormControl>
											<SelectTrigger className="w-full h-10 rounded-lg border-slate-200 bg-white text-slate-900 text-sm shadow-none focus-visible:ring-slate-900">
												<SelectValue placeholder={t(localizationConstants.protocolFieldCategory)} />
											</SelectTrigger>
										</FormControl>
										<SelectContent className="w-[var(--radix-select-trigger-width)] bg-white border border-slate-200 shadow-md rounded-lg">
											{PROTOCOL_CONSTANTS.CATEGORIES.map((cat) => (
												<SelectItem key={cat} value={cat} className="text-sm cursor-pointer">
													{cat}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage className="text-xs font-medium text-red-500 mt-1" />
								</FormItem>
							)}
						/>

						{/* Adress */}
						<FormField
							control={form.control}
							name="nextMeetingAddress"
							render={({ field }) => (
								<FormItem className="space-y-1">
									<FormLabel className="text-xs font-semibold text-slate-900">
										<Translate text={localizationConstants.protocolFieldAddress} />
									</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder={t(localizationConstants.protocolFieldAddress)}
											className="h-10 rounded-lg border-slate-200 bg-white text-slate-900 text-sm shadow-none focus-visible:ring-slate-900"
										/>
									</FormControl>
									<FormMessage className="text-xs font-medium text-red-500 mt-1" />
								</FormItem>
							)}
						/>
					</div>

					{/* Row 3: Post nr & Ort */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
						{/* Post nr */}
						<FormField
							control={form.control}
							name="nextMeetingPostalCode"
							render={({ field }) => (
								<FormItem className="space-y-1">
									<FormLabel className="text-xs font-semibold text-slate-900">
										<Translate text={localizationConstants.protocolFieldPostalCode} />
									</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder={PROTOCOL_CONSTANTS.DEFAULT_POSTAL_CODE}
											className="h-10 rounded-lg border-slate-200 bg-white text-slate-900 text-sm shadow-none focus-visible:ring-slate-900"
										/>
									</FormControl>
									<FormMessage className="text-xs font-medium text-red-500 mt-1" />
								</FormItem>
							)}
						/>

						{/* Ort */}
						<FormField
							control={form.control}
							name="nextMeetingCity"
							render={({ field }) => (
								<FormItem className="space-y-1">
									<FormLabel className="text-xs font-semibold text-slate-900">
										<Translate text={localizationConstants.protocolFieldCity} />
									</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder={PROTOCOL_CONSTANTS.DEFAULT_CITY}
											className="h-10 rounded-lg border-slate-200 bg-white text-slate-900 text-sm shadow-none focus-visible:ring-slate-900"
										/>
									</FormControl>
									<FormMessage className="text-xs font-medium text-red-500 mt-1" />
								</FormItem>
							)}
						/>
					</div>

					{/* Row 4: Lägg till deltagare */}
					<FormField
						control={form.control}
						name="nextMeetingParticipants"
						render={() => (
							<FormItem className="space-y-1">
								<FormLabel className="text-xs font-semibold text-slate-900">
									<Translate text={localizationConstants.protocolFieldAddParticipants} />
								</FormLabel>
								<DropdownMenu>
									<div className="min-h-[40px] rounded-lg border border-slate-200 bg-white p-1.5 flex flex-wrap items-center gap-1.5 justify-between">
										<div className="flex flex-wrap items-center gap-1.5 flex-1 min-w-0">
											{selectedParticipants.map((p) => (
												<span
													key={p}
													className="inline-flex items-center gap-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 text-xs px-2 py-0.5 rounded transition-colors"
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
														className="h-3.5 w-3.5 p-0 text-zinc-500 hover:text-zinc-900 hover:bg-transparent cursor-pointer"
													>
														<X className="h-3 w-3 text-zinc-500" />
													</Button>
												</span>
											))}
										</div>
										<DropdownMenuTrigger asChild>
											<Button
												type="button"
												variant="ghost"
												size="icon"
												className="h-6 w-6 p-0 text-zinc-500 hover:text-zinc-900 hover:bg-transparent cursor-pointer shrink-0"
												aria-label={t(localizationConstants.protocolFieldAddParticipants)}
											>
												<ChevronDown className="h-4 w-4 text-zinc-500" />
											</Button>
										</DropdownMenuTrigger>
									</div>
									<DropdownMenuContent align="start" className="w-56 bg-white border border-slate-200 shadow-lg rounded-lg p-1 z-50">
										{PROTOCOL_CONSTANTS.AVAILABLE_PARTICIPANTS.map((cand) => (
											<DropdownMenuItem
												key={cand}
												onClick={() => handleAddParticipant(cand)}
												disabled={selectedParticipants.includes(cand)}
												className="cursor-pointer text-xs text-slate-700 focus:bg-slate-100 focus:text-slate-900 flex items-center justify-between"
											>
												<span>{cand}</span>
												<Plus className="h-3.5 w-3.5 text-zinc-500" />
											</DropdownMenuItem>
										))}
									</DropdownMenuContent>
								</DropdownMenu>
								<FormMessage className="text-xs font-medium text-red-500 mt-1" />
							</FormItem>
						)}
					/>

					{/* Row 5: Plats */}
					<FormField
						control={form.control}
						name="nextMeetingLocation"
						render={({ field }) => (
							<FormItem className="space-y-1">
								<FormLabel className="text-xs font-semibold text-slate-900">
									<Translate text={localizationConstants.protocolFieldLocation} />
								</FormLabel>
								<FormControl>
									<Input
										{...field}
										placeholder={PROTOCOL_CONSTANTS.DEFAULT_LOCATION}
										className="h-10 rounded-lg border-slate-200 bg-white text-slate-900 text-sm shadow-none focus-visible:ring-slate-900"
									/>
								</FormControl>
								<FormMessage className="text-xs font-medium text-red-500 mt-1" />
							</FormItem>
						)}
					/>

					{/* Row 6: Start tid */}
					<div className="space-y-1">
						<p className="text-xs font-semibold text-slate-900">
							<Translate text={localizationConstants.protocolFieldStartTime} />
						</p>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
							{/* Start Date */}
							<FormField
								control={form.control}
								name="nextMeetingStartDate"
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
								name="nextMeetingStartTime"
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

					{/* Row 7: Slut tid */}
					<div className="space-y-1">
						<p className="text-xs font-semibold text-slate-900">
							<Translate text={localizationConstants.protocolFieldEndTime} />
						</p>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
							{/* End Date */}
							<FormField
								control={form.control}
								name="nextMeetingEndDate"
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
								name="nextMeetingEndTime"
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

					{/* Row 8: Ange information för det här nya mötet... */}
					<FormField
						control={form.control}
						name="nextMeetingInfo"
						render={({ field }) => (
							<FormItem className="space-y-1">
								<FormLabel className="text-xs font-semibold text-slate-900">
									<Translate text={localizationConstants.protocolFieldMeetingInfo} />
								</FormLabel>
								<FormControl>
									<Textarea
										{...field}
										placeholder={t(localizationConstants.protocolFieldMeetingInfo)}
										className="min-h-[72px] rounded-lg border-slate-200 bg-white text-slate-900 text-sm p-3 shadow-none focus-visible:ring-slate-900 resize-y"
									/>
								</FormControl>
								<FormMessage className="text-xs font-medium text-red-500 mt-1" />
							</FormItem>
						)}
					/>
				</div>
			)}
		</div>
	);
}

export default EditProtocolNextMeetingSection;
