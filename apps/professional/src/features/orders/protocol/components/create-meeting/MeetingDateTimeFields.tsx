"use client";

import React, { useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
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
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { PROTOCOL_CONSTANTS } from "../../constants/protocol.constants";
import type { CreateProtocolFormData } from "../CreateProtocolModal";

export interface MeetingDateTimeFieldsProps {
	form: UseFormReturn<CreateProtocolFormData>;
}

export function MeetingDateTimeFields({ form }: MeetingDateTimeFieldsProps) {
	const [startDatePickerOpen, setStartDatePickerOpen] = useState(false);
	const [endDatePickerOpen, setEndDatePickerOpen] = useState(false);

	const formatDisplayDate = (dateString: string) => {
		const dateObj = parseDateValue(dateString);
		if (!dateObj) return dateString;
		const dayPrefix = PROTOCOL_CONSTANTS.DAY_NAMES[dateObj.getDay()];
		return `${dayPrefix} ${format(dateObj, "yyyy-MM-dd")}`;
	};

	return (
		<div className="space-y-4">
			{/* Row 7: Start tid (Label on top, Date & Time side by side) */}
			<div className="space-y-1">
				<p className="text-xs font-semibold text-slate-900">
					<Translate text={localizationConstants.protocolStartTimeLabel} />
				</p>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
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
												<span>{formatDisplayDate(field.value || PROTOCOL_CONSTANTS.DEFAULT_UPLOAD_DATE)}</span>
											</Button>
										</FormControl>
									</PopoverTrigger>
									<PopoverContent className="w-auto p-0 bg-white border border-slate-200 shadow-lg rounded-lg z-50" align="start">
										<Calendar
											mode="single"
											selected={parseDateValue(field.value || PROTOCOL_CONSTANTS.DEFAULT_UPLOAD_DATE)}
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

			{/* Row 8: Slut tid (Label on top, Date & Time side by side) */}
			<div className="space-y-1">
				<p className="text-xs font-semibold text-slate-900">
					<Translate text={localizationConstants.protocolEndTimeLabel} />
				</p>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
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
												<span>{formatDisplayDate(field.value || PROTOCOL_CONSTANTS.DEFAULT_UPLOAD_DATE)}</span>
											</Button>
										</FormControl>
									</PopoverTrigger>
									<PopoverContent className="w-auto p-0 bg-white border border-slate-200 shadow-lg rounded-lg z-50" align="start">
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
	);
}

export default MeetingDateTimeFields;
