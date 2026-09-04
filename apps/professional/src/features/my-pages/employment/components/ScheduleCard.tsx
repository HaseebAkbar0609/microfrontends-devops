"use client";

import { useState } from "react";
import { ChevronsUpDown } from "lucide-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import {
	SCHEDULE_DAYS,
	SCHEDULE_HOURS,
	ScheduleEvent,
	ScheduleEventKind,
} from "../constants/mockData";

const EVENT_CLASS: Record<ScheduleEventKind, string> = {
	sick: "bg-orange-500 text-white",
	vab: "bg-green-500 text-white",
	leave: "bg-slate-700 text-white",
};

type ScheduleView = "calendar" | "list";

const RANGE_IDS = ["today", "week", "month", "year"] as const;

const RANGE_LABEL: Record<(typeof RANGE_IDS)[number], string> = {
	today: localizationConstants.myPagesEmpToday,
	week: localizationConstants.myPagesEmpWeek,
	month: localizationConstants.myPagesEmpMonth,
	year: localizationConstants.myPagesEmpYear,
};

const formatHour = (hour: number) => `${String(hour).padStart(2, "0")}:00`;

const ScheduleCard = ({ events }: { events: ScheduleEvent[] }) => {
	const [view, setView] = useState<ScheduleView>("calendar");
	const [range, setRange] = useState<(typeof RANGE_IDS)[number]>("today");

	const rangeIds =
		view === "calendar"
			? RANGE_IDS
			: RANGE_IDS.filter((id) => id !== "today");

	return (
		<div className="overflow-hidden rounded-md border border-slate-200 bg-white">
			<div className="flex flex-wrap items-center justify-between gap-3 bg-slate-200/60 px-5 py-3">
				<h2 className="text-base font-semibold text-slate-800">
					<Translate
						text={localizationConstants.myPagesEmpScheduleTitle}
					/>
				</h2>
				<Select
					value={view}
					onValueChange={(value) => setView(value as ScheduleView)}
				>
					<SelectTrigger className="h-9 w-44 border-slate-200 bg-white text-sm font-medium text-slate-900 focus:ring-0">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="calendar">
							<Translate
								text={
									localizationConstants.myPagesEmpCalendarView
								}
							/>
						</SelectItem>
						<SelectItem value="list">
							<Translate
								text={localizationConstants.myPagesEmpListView}
							/>
						</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<div className="flex flex-wrap items-center gap-4 border-b border-slate-200 px-5 py-4">
				<button
					type="button"
					className="flex h-10 w-full max-w-sm cursor-pointer items-center justify-between rounded-md border border-slate-200 px-3 text-sm text-slate-900"
				>
					11:e Februari
					<ChevronsUpDown className="h-4 w-4 text-slate-500" />
				</button>
				<div className="flex items-center gap-1 rounded-md bg-slate-100 p-1">
					{rangeIds.map((id) => (
						<button
							key={id}
							type="button"
							onClick={() => setRange(id)}
							className={cn(
								"cursor-pointer rounded-md px-4 py-1.5 text-sm font-medium",
								range === id
									? "bg-white text-slate-900 shadow-sm"
									: "text-slate-600",
							)}
						>
							<Translate text={RANGE_LABEL[id]} />
						</button>
					))}
				</div>
			</div>

			{view === "calendar" ? (
				<div className="overflow-x-auto">
					<table className="w-full min-w-[46rem] table-fixed border-collapse">
						<thead>
							<tr>
								<th className="w-20 px-2 py-3" />
								{SCHEDULE_DAYS.map((day) => (
									<th
										key={day.day}
										className="px-2 py-3 text-left align-top"
									>
										<p className="text-lg font-semibold text-slate-900">
											{day.day}
										</p>
										<p className="truncate text-xs font-normal text-slate-500">
											{day.label}
										</p>
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{SCHEDULE_HOURS.map((hour) => (
								<tr
									key={hour}
									className="border-t border-dashed border-slate-200"
								>
									<td className="px-2 py-1 align-top text-sm text-slate-500">
										{formatHour(hour)}
									</td>
									{SCHEDULE_DAYS.map((day) => {
										const event = events.find(
											(entry) =>
												entry.day === day.day &&
												entry.startHour === hour,
										);
										return (
											<td
												key={day.day}
												className="h-12 px-1 py-1 align-top"
											>
												{event && (
													<span
														className={cn(
															"block min-h-6 rounded-md px-2 py-1 text-xs font-medium leading-snug",
															EVENT_CLASS[
																event.kind
															],
														)}
													>
														{event.labelKey && (
															<Translate
																text={
																	event.labelKey
																}
															/>
														)}
													</span>
												)}
											</td>
										);
									})}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			) : (
				<div>
					{SCHEDULE_DAYS.map((day) => {
						const event = events.find(
							(entry) => entry.day === day.day,
						);
						return (
							<div
								key={day.day}
								className="flex items-stretch gap-3 border-t border-slate-100 px-5 py-2"
							>
								<div className="w-28 shrink-0 py-1">
									<p className="text-base font-semibold text-slate-900">
										{day.day}
									</p>
									<p className="text-xs text-slate-500">
										{day.label}
									</p>
								</div>
								<div className="flex-1 py-1">
									{event && (
										<div
											className={cn(
												"min-h-8 rounded-md px-3 py-1.5 text-sm font-medium",
												EVENT_CLASS[event.kind],
											)}
										>
											{event.labelKey && (
												<Translate
													text={event.labelKey}
												/>
											)}
											<span className="block text-xs font-normal">
												{formatHour(event.startHour)} -{" "}
												{formatHour(
													event.startHour +
														event.durationHours,
												)}
											</span>
										</div>
									)}
								</div>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
};

export default ScheduleCard;
