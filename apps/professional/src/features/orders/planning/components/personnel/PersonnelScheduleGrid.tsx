"use client";

import Image from "next/image";
import {
	Calendar,
	ChevronLeft,
	ChevronRight,
	Info,
	Plus,
} from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { Button } from "@/components/ui/button";
import { PersonnelTaskPopover } from "./PersonnelTaskPopover";
import type {
	PersonnelScheduleItem,
	PlanningAssignee,
} from "../../types/planning.types";

interface PersonnelScheduleGridProps {
	currentMonthKey: string;
	currentYear: number;
	currentWeekNumber: number;
	daysHeader: { dayNumber: number; dayNameKey: string }[];
	employeesList: { id: string; name: string; initials: string; avatarUrl?: string }[];
	filteredItems: PersonnelScheduleItem[];
	activePopoverId: string | null;
	setActivePopoverId: (id: string | null) => void;
	onPrevWeek: () => void;
	onNextWeek: () => void;
	onOpenCreateModal: () => void;
	onOpenEditModal: (item: PersonnelScheduleItem) => void;
	onDeleteTask: (itemId: string) => void;
	onAddAssignee: (item: PersonnelScheduleItem, assignee: PlanningAssignee) => void;
}

function getItemColorStyle(theme: PersonnelScheduleItem["colorTheme"]) {
	switch (theme) {
		case "yellow":
			return {
				bg: "bg-[#FEF9C3] hover:bg-[#FEF08A]",
				text: "text-[#854D0E]",
				leftBar: "border-l-4 border-[#CA8A04]",
			};
		case "blue":
			return {
				bg: "bg-[#DBEAFE] hover:bg-[#BFDBFE]",
				text: "text-[#1E40AF]",
				leftBar: "border-l-4 border-[#2563EB]",
			};
		case "green":
			return {
				bg: "bg-[#DCFCE7] hover:bg-[#BBF7D0]",
				text: "text-[#166534]",
				leftBar: "border-l-4 border-[#16A34A]",
			};
		case "purple":
			return {
				bg: "bg-[#F3E8FF] hover:bg-[#E9D5FF]",
				text: "text-[#6B21A8]",
				leftBar: "border-l-4 border-[#9333EA]",
			};
		case "light-purple":
			return {
				bg: "bg-[#FAF5FF] hover:bg-[#F3E8FF]",
				text: "text-[#7E22CE]",
				leftBar: "border-l-4 border-[#A855F7]",
			};
		case "pink":
			return {
				bg: "bg-[#FCE7F3] hover:bg-[#FBCFE8]",
				text: "text-[#9D174D]",
				leftBar: "border-l-4 border-[#DB2777]",
			};
		case "light-yellow":
			return {
				bg: "bg-[#FEFCE8] hover:bg-[#FEF9C3]",
				text: "text-[#713F12]",
				leftBar: "border-l-4 border-[#EAB308]",
			};
		default:
			return {
				bg: "bg-[#F1F5F9] hover:bg-[#E2E8F0]",
				text: "text-[#334155]",
				leftBar: "border-l-4 border-[#64748B]",
			};
	}
}

export function PersonnelScheduleGrid({
	currentMonthKey,
	currentYear,
	currentWeekNumber,
	daysHeader,
	employeesList,
	filteredItems,
	activePopoverId,
	setActivePopoverId,
	onPrevWeek,
	onNextWeek,
	onOpenCreateModal,
	onOpenEditModal,
	onDeleteTask,
	onAddAssignee,
}: PersonnelScheduleGridProps) {
	return (
		<div className="flex flex-col gap-4 w-full font-sans">
			{/* ── Month/Week Navigation Header & Skapa ny ── */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
				<div className="flex items-center gap-2 flex-wrap">
					<span className="font-bold text-slate-900 flex items-center gap-1.5 text-sm whitespace-nowrap">
						<Translate text={localizationConstants[currentMonthKey as keyof typeof localizationConstants]} />{" "}
						{currentYear}
					</span>
					<span className="text-slate-300 font-medium">/</span>
					<div className="flex items-center gap-0.5">
						<button
							type="button"
							onClick={onPrevWeek}
							className="p-1 hover:bg-slate-100 rounded transition-colors cursor-pointer"
							aria-label="Previous Week"
						>
							<ChevronLeft className="w-4 h-4 text-slate-500" />
						</button>
						<span className="font-medium text-slate-500 flex items-center gap-1.5 px-1 text-sm whitespace-nowrap">
							<Calendar className="w-4 h-4 text-slate-500" />
							<Translate text={localizationConstants.ganttViewWeek} /> {currentWeekNumber}
						</span>
						<button
							type="button"
							onClick={onNextWeek}
							className="p-1 hover:bg-slate-100 rounded transition-colors cursor-pointer"
							aria-label="Next Week"
						>
							<ChevronRight className="w-4 h-4 text-slate-500" />
						</button>
					</div>
				</div>

				<Button
					onClick={onOpenCreateModal}
					className="bg-[#18181B] text-white hover:bg-[#18181B]/90 h-10 px-4 gap-2 rounded-md transition-colors w-full sm:w-auto justify-center cursor-pointer shadow-2xs"
				>
					<Plus className="h-4 w-4" />
					<Translate text={localizationConstants.skapaNy} />
				</Button>
			</div>

			{/* ── Clean Timeline Grid (No outer shadow/border, ends flush on Sunday) ── */}
			<div className="w-full overflow-x-auto bg-white border-0">
				<div className="min-w-[800px] w-full flex flex-col">
					{/* Table Header Row */}
					<div className="flex items-stretch border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-900">
						{/* Employee Column Header - Left Aligned without avatar */}
						<div className="w-52 sm:w-56 shrink-0 py-3.5 px-4 border-r border-slate-200 flex items-center justify-start text-left">
							<span className="text-[14px] font-medium leading-[20px] text-gray-500 tracking-normal truncate">
								<Translate text={localizationConstants.allEmployees} />
							</span>
						</div>

						{/* 7 Days Header (Ends flush on Sunday) */}
						<div className="grid grid-cols-7 flex-1 divide-x divide-slate-200">
							{daysHeader.map((day) => (
								<div key={day.dayNumber} className="py-2.5 px-3 flex flex-col justify-center">
									<div className="flex items-center justify-between text-slate-900">
										<span className="text-sm font-bold">{day.dayNumber}</span>
										<Info className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 cursor-pointer" />
									</div>
									<div className="text-slate-500 text-xs font-normal truncate">
										<Translate
											text={
												localizationConstants[
													day.dayNameKey as keyof typeof localizationConstants
												]
											}
										/>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Employee Rows */}
					<div className="divide-y divide-slate-200">
						{employeesList.map((emp, empIdx) => {
							const empItems = filteredItems.filter((item) => item.employeeId === emp.id);

							return (
								<div
									key={`${emp.id}-${empIdx}`}
									className="flex items-stretch min-h-[76px] hover:bg-slate-50/40 transition-colors"
								>
									{/* Employee Info Cell - Left Aligned */}
									<div className="w-52 sm:w-56 shrink-0 py-4 px-4 border-r border-slate-200 bg-white flex items-center justify-start gap-2.5 text-left">
										{emp.avatarUrl ? (
											<Image
												src={emp.avatarUrl}
												alt={emp.name}
												width={32}
												height={32}
												className="w-8 h-8 rounded-full object-cover shrink-0 border border-slate-100 shadow-2xs"
											/>
										) : (
											<div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-semibold text-xs flex items-center justify-center shrink-0 border border-slate-200">
												{emp.initials}
											</div>
										)}
										<span className="text-[14px] font-medium leading-[20px] text-slate-900 tracking-normal truncate">
											{emp.name}
										</span>
									</div>

									{/* 7 Days Schedule Track - Clamped to 7 days, no right overflow */}
									<div className="grid grid-cols-7 flex-1 divide-x divide-slate-100 relative min-h-[76px] overflow-hidden">
										{daysHeader.map((day, dayIdx) => {
											const itemsForDay = empItems.filter((item) => item.dayStart === day.dayNumber);

											return (
												<div
													key={day.dayNumber}
													className="p-1.5 flex flex-col justify-center gap-1.5 relative min-h-[76px]"
												>
													{itemsForDay.map((item) => {
														const style = getItemColorStyle(item.colorTheme);
														// Clamp span to remaining days in the week so it ends neatly on Sunday without leaking
														const maxDaysRemaining = 7 - dayIdx;
														const visibleSpan = Math.max(1, Math.min(item.daySpan, maxDaysRemaining));
														const spanWidth =
															visibleSpan > 1
																? `calc(${visibleSpan * 100}% + ${(visibleSpan - 1) * 1}px)`
																: "100%";

														return (
															<PersonnelTaskPopover
																key={item.id}
																item={item}
																isOpen={activePopoverId === item.id}
																onOpenChange={(open) =>
																	setActivePopoverId(open ? item.id : null)
																}
																onEdit={onOpenEditModal}
																onDelete={onDeleteTask}
																onAddAssignee={onAddAssignee}
																employeesList={employeesList}
															>
																<button
																	type="button"
																	className={`relative ${
																		visibleSpan > 1 ? "z-20" : "z-10"
																	} py-2.5 px-3 min-h-[40px] rounded-md ${style.bg} ${
																		style.text
																	} ${style.leftBar} cursor-pointer transition-all duration-150 hover:shadow-md text-[11px] font-semibold flex items-center justify-between shadow-2xs text-left truncate`}
																	style={{ width: spanWidth, maxWidth: `calc(${(7 - dayIdx) * 100}% + ${(7 - dayIdx - 1) * 1}px)` }}
																>
																	<span className="truncate">{item.title}</span>
																</button>
															</PersonnelTaskPopover>
														);
													})}
												</div>
											);
										})}
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
}

export default PersonnelScheduleGrid;
