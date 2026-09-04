"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { ArrowLeft, Info, Plus } from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { PersonnelTaskPopoverCard } from "./PersonnelTaskPopover";
import type {
	GridTaskItem,
	PersonnelScheduleItem,
	PlanningAssignee,
} from "../../types/planning.types";

interface PersonnelDayDetailsDrawerProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	dayHeader?: { dayNumber: number; dayNameKey: string; hours?: number };
	dayIndex: number;
	currentMonthKey?: string;
	currentYear?: number;
	tasks: GridTaskItem[];
	employeesList: { id: string; name: string; initials: string; avatarUrl?: string }[];
	onOpenCreateModal?: (dayNumber?: number) => void;
	onOpenEditModal?: (item: PersonnelScheduleItem) => void;
	onDeleteTask?: (itemId: string) => void;
	onAddAssignee?: (item: PersonnelScheduleItem, assignee: PlanningAssignee) => void;
}

const START_HOUR = 7; // 7:00 AM

const TIME_SLOTS = Array.from({ length: 24 }, (_, i) => {
	const h = (START_HOUR + i) % 24;
	if (h === 0) return { label: "12 AM", hour: 0 };
	if (h < 12) return { label: `${h} AM`, hour: h };
	if (h === 12) return { label: "12 PM", hour: 12 };
	return { label: `${h - 12} PM`, hour: h };
});

const SLOT_HEIGHT = 105; // 105px height for each hour slot below GMT
const TOTAL_MINUTES = 24 * 60; // 1440 minutes in 24 hours

interface PositionedGridTaskItem extends GridTaskItem {
	colIndex: number;
	totalCols: number;
}

function calculateDayTaskPositions(dayTasks: GridTaskItem[]): PositionedGridTaskItem[] {
	if (dayTasks.length === 0) return [];

	const getEffectiveEnd = (t: GridTaskItem) => t.topMinutes + Math.max(t.durationMinutes, 60);

	const sorted = [...dayTasks].sort((a, b) => {
		if (a.topMinutes !== b.topMinutes) return a.topMinutes - b.topMinutes;
		return b.durationMinutes - a.durationMinutes;
	});

	const clusters: GridTaskItem[][] = [];
	let currentCluster: GridTaskItem[] = [];
	let clusterEnd = -1;

	for (const task of sorted) {
		const taskStart = task.topMinutes;
		const taskEnd = getEffectiveEnd(task);

		if (currentCluster.length === 0) {
			currentCluster.push(task);
			clusterEnd = taskEnd;
		} else {
			if (taskStart < clusterEnd) {
				currentCluster.push(task);
				clusterEnd = Math.max(clusterEnd, taskEnd);
			} else {
				clusters.push(currentCluster);
				currentCluster = [task];
				clusterEnd = taskEnd;
			}
		}
	}
	if (currentCluster.length > 0) {
		clusters.push(currentCluster);
	}

	const result: PositionedGridTaskItem[] = [];

	for (const cluster of clusters) {
		const columns: number[] = [];
		const placements: { task: GridTaskItem; colIndex: number }[] = [];

		for (const task of cluster) {
			const taskStart = task.topMinutes;
			const taskEnd = getEffectiveEnd(task);

			let placedCol = -1;
			for (let i = 0; i < columns.length; i++) {
				if (columns[i] <= taskStart) {
					placedCol = i;
					columns[i] = taskEnd;
					break;
				}
			}

			if (placedCol === -1) {
				placedCol = columns.length;
				columns.push(taskEnd);
			}

			placements.push({ task, colIndex: placedCol });
		}

		const totalCols = Math.max(1, columns.length);

		for (const p of placements) {
			result.push({
				...p.task,
				colIndex: p.colIndex,
				totalCols,
			});
		}
	}

	return result;
}

function getTaskThemeCardStyles(theme: GridTaskItem["colorTheme"]) {
	switch (theme) {
		case "yellow":
			return {
				bg: "bg-[#FEFCE8]",
				text: "text-amber-950",
				border: "border-l-[2px] border-amber-500",
				badgeBg: "bg-transparent",
				badgeBorder: "border-amber-300",
				badgeText: "text-amber-800",
			};
		case "green":
			return {
				bg: "bg-[#F0FDF4]",
				text: "text-emerald-950",
				border: "border-l-[2px] border-emerald-500",
				badgeBg: "bg-transparent",
				badgeBorder: "border-emerald-300",
				badgeText: "text-emerald-800",
			};
		case "blue":
			return {
				bg: "bg-[#EFF6FF]",
				text: "text-blue-950",
				border: "border-l-[2px] border-blue-500",
				badgeBg: "bg-transparent",
				badgeBorder: "border-blue-300",
				badgeText: "text-blue-800",
			};
		case "purple":
			return {
				bg: "bg-[#FAF5FF]",
				text: "text-purple-950",
				border: "border-l-[2px] border-purple-500",
				badgeBg: "bg-transparent",
				badgeBorder: "border-purple-300",
				badgeText: "text-purple-800",
			};
		case "pink":
		case "red":
			return {
				bg: "bg-[#FFF1F2]",
				text: "text-rose-950",
				border: "border-l-[2px] border-rose-500",
				badgeBg: "bg-transparent",
				badgeBorder: "border-rose-300",
				badgeText: "text-rose-800",
			};
		default:
			return {
				bg: "bg-slate-50",
				text: "text-slate-900",
				border: "border-l-[2px] border-slate-700",
				badgeBg: "bg-transparent",
				badgeBorder: "border-slate-300",
				badgeText: "text-slate-700",
			};
	}
}

function getStatusBadgeLabel(status: GridTaskItem["status"]) {
	switch (status) {
		case "in_progress":
			return localizationConstants.planningInProgress;
		case "completed":
			return localizationConstants.planningCompleted;
		case "waiting":
			return localizationConstants.planningWaiting;
		case "cancelled":
			return localizationConstants.planningCancelled;
		case "not_started":
			return localizationConstants.planningNotStarted;
		case "due":
			return localizationConstants.planningDue;
		default:
			return localizationConstants.planningCompleted;
	}
}

export function PersonnelDayDetailsDrawer({
	isOpen,
	onOpenChange,
	dayHeader,
	dayIndex,
	currentMonthKey = "monthDec",
	currentYear = 2025,
	tasks,
	employeesList,
	onOpenCreateModal,
	onOpenEditModal,
	onDeleteTask,
	onAddAssignee,
}: PersonnelDayDetailsDrawerProps) {
	const [activePopoverId, setActivePopoverId] = useState<string | null>(null);

	const dayNumber = dayHeader?.dayNumber ?? 10;
	const dayNameKey = dayHeader?.dayNameKey ?? "monday";
	const dayHours = dayHeader?.hours ?? 40;

	// Tasks belonging to this selected day
	const dayTasks = useMemo(() => {
		return tasks.filter((t) => t.dayIndex === dayIndex);
	}, [tasks, dayIndex]);

	const positionedTasks = useMemo(() => {
		return calculateDayTaskPositions(dayTasks);
	}, [dayTasks]);

	const activeTaskItem = useMemo(() => {
		if (!activePopoverId) return null;
		return dayTasks.find((t) => t.id === activePopoverId) || null;
	}, [activePopoverId, dayTasks]);

	return (
		<Sheet open={isOpen} onOpenChange={onOpenChange}>
			<SheetContent
				side="right"
				className="w-full sm:max-w-[540px] md:max-w-[580px] h-full p-0 flex flex-col bg-white border-l border-slate-200 overflow-hidden font-sans focus:outline-none shadow-2xl"
			>
				{/* ── Top Header (No border) ── */}
				<div className="flex items-center justify-between px-4 sm:px-5 pt-3.5 sm:pt-4 pb-1">
					<div className="flex items-start gap-2.5 sm:gap-3 min-w-0">
						<Button
							type="button"
							variant="ghost"
							size="icon"
							onClick={() => onOpenChange(false)}
							className="h-8 w-8 text-slate-900 hover:text-slate-600 rounded-md hover:bg-slate-100 transition-colors cursor-pointer -ml-1 shrink-0 mt-0.5"
							aria-label="Back"
						>
							<ArrowLeft className="w-5 h-5 stroke-[2]" />
						</Button>
						<div className="flex flex-col min-w-0">
							<SheetTitle className="font-sans font-semibold text-xl sm:text-2xl leading-[100%] tracking-[-0.6px] text-slate-900 truncate m-0 p-0">
								<Translate
									text={
										localizationConstants[
										dayNameKey as keyof typeof localizationConstants
										] || dayNameKey
									}
								/>{" "}
								{dayNumber}{" "}
								<Translate
									text={
										localizationConstants[
										currentMonthKey as keyof typeof localizationConstants
										] || localizationConstants.monthDec
									}
								/>
								, {currentYear}
							</SheetTitle>
							<span className="text-xs text-slate-500 font-normal mt-1 leading-tight">
								<Translate text={localizationConstants.totalaArbetstimmar} />: {dayHours}h
							</span>
						</div>
					</div>

					{/* + Skapa ny button */}
					<Button
						onClick={() => {
							if (onOpenCreateModal) onOpenCreateModal(dayNumber);
						}}
						className="bg-zinc-900 hover:bg-black text-white text-xs h-8 sm:h-9 px-2.5 sm:px-3.5 gap-1.5 rounded-md transition-colors shrink-0 shadow-2xs font-medium cursor-pointer"
					>
						<Plus className="w-4 h-4" />
						<Translate text={localizationConstants.skapaNy} />
					</Button>
				</div>

				{/* ── 1-Day Table (Scroll locked when popup is open) ── */}
				<div className={`flex-1 ${activePopoverId ? "overflow-hidden" : "overflow-y-auto"} px-4 pb-12 pt-1`}>
					<div className="w-full flex items-stretch min-w-0">
						{/* Outer Left Time Gutter */}
						<div className="w-[42px] sm:w-[56px] shrink-0 flex flex-col select-none pr-1.5 sm:pr-2 pt-4">
							{/* GMT +2 label (105px space before 7 AM) */}
							<div
								className="flex items-center justify-end font-sans font-semibold text-[11px] sm:text-xs leading-4 tracking-normal text-slate-500 text-right whitespace-nowrap"
								style={{ height: "105px" }}
							>
								<Translate text={localizationConstants.gmtLabel} />
							</div>

							{/* Time labels (105px gap each) */}
							{TIME_SLOTS.map((slot) => (
								<div
									key={slot.hour}
									className="flex items-center justify-end font-sans font-semibold text-[11px] sm:text-xs leading-4 tracking-normal text-slate-500 text-right whitespace-nowrap"
									style={{ height: `${SLOT_HEIGHT}px` }}
								>
									{slot.label}
								</div>
							))}
						</div>

						{/* Main 1-Day Bordered Table Column */}
						<div className="flex-1 min-w-0 flex flex-col bg-white border border-slate-200 shadow-2xs">
							{/* 1-Day Column Header */}
							<div className="h-[60px] px-2.5 sm:px-3 py-2 flex items-center justify-between border-b border-slate-200 bg-[#F8FAFC] text-xs font-semibold text-slate-900 shrink-0">
								<div className="flex flex-col">
									<span className="h-[28px] shrink-0 font-sans font-semibold text-lg sm:text-xl leading-7 tracking-normal text-slate-900 flex items-center">
										{dayNumber}
									</span>
									<span className="font-sans font-normal text-[11px] sm:text-xs leading-4 tracking-normal text-[#374151]">
										<Translate
											text={
												localizationConstants[
												dayNameKey as keyof typeof localizationConstants
												] || dayNameKey
											}
										/>
									</span>
								</div>

								<div className="flex flex-col items-end justify-center gap-1 sm:gap-1.5 shrink-0">
									<Info className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500 stroke-[1.5] shrink-0" />
									<span className="font-sans font-normal text-[11px] sm:text-xs leading-4 tracking-normal text-[#374151] whitespace-nowrap">
										{dayHours} h
									</span>
								</div>
							</div>

							{/* 1 Column Grid Canvas */}
							<div
								className="relative bg-white w-full"
								style={{ height: `${105 + SLOT_HEIGHT * TIME_SLOTS.length}px` }}
							>
								{/* Background Horizontal Guidelines */}
								<div className="absolute inset-0 flex flex-col pointer-events-none">
									<div
										className="w-full border-b border-slate-100"
										style={{ height: "105px" }}
									/>
									{TIME_SLOTS.map((slot) => (
										<div
											key={`line-${slot.hour}`}
											className="w-full border-b border-slate-100 last:border-b-0"
											style={{ height: `${SLOT_HEIGHT}px` }}
										/>
									))}
								</div>

								{/* Placed Task Cards */}
								{positionedTasks.map((item) => {
									const style = getTaskThemeCardStyles(item.colorTheme);
									const topPx = 105 + (item.topMinutes / TOTAL_MINUTES) * (SLOT_HEIGHT * TIME_SLOTS.length);
									const heightPx = Math.max(76, (item.durationMinutes / TOTAL_MINUTES) * (SLOT_HEIGHT * TIME_SLOTS.length));
									const isCompact = heightPx < 98;

									const colWidthPercent = 100 / item.totalCols;
									const leftPercent = item.colIndex * colWidthPercent;

									const primaryAssignee = item.assignees && item.assignees.length > 0 ? item.assignees[0] : null;
									const remainingAssigneesCount = item.assignees && item.assignees.length > 1 ? item.assignees.length - 1 : 0;

									return (
										<div
											key={item.id}
											className="absolute transition-all duration-150 group z-10"
											style={{
												top: `${topPx}px`,
												height: `${heightPx}px`,
												left: `calc(${leftPercent}% + 4px)`,
												width: `calc(${colWidthPercent}% - 8px)`,
											}}
										>
											<Button
												type="button"
												variant="ghost"
												onClick={() => setActivePopoverId(item.id)}
												className={`w-full h-full ${isCompact ? "p-1.5 sm:p-2" : "p-2.5"} rounded-[4px] text-left ${style.bg} ${style.border} cursor-pointer shadow-2xs flex flex-col justify-between items-start overflow-hidden font-sans border-0 border-l-[2px]`}
											>
												{/* Top Section: Title, Time, and Status Badge with comfortable gaps */}
												<div className="flex flex-col gap-2 w-full min-w-0">
													<div className="flex flex-col gap-0.5 w-full min-w-0">
														<span className="font-sans font-medium text-sm leading-5 tracking-normal text-slate-900 line-clamp-1 break-words">
															{item.title}
														</span>
														<span className="text-[10px] sm:text-[11px] text-slate-500 font-normal leading-none">
															{item.timeRange || "10:00 - 18:00"}
														</span>
													</div>

													{!isCompact && (
														<div className="pt-0.5">
															<span
																className={`inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-medium border ${style.badgeBg} ${style.badgeBorder} ${style.badgeText}`}
															>
																<Translate text={getStatusBadgeLabel(item.status)} />
															</span>
														</div>
													)}
												</div>

												{isCompact ? (
													/* Compact Bottom: Status Badge + 24px Avatars in Single Inline Row */
													<div className="flex items-center justify-between gap-1 w-full mt-auto pt-0.5 min-w-0">
														<span
															className={`inline-flex items-center px-1.5 py-0.5 rounded-[3px] text-[9px] font-medium border ${style.badgeBg} ${style.badgeBorder} ${style.badgeText} truncate shrink-0 max-w-[50%]`}
														>
															<Translate text={getStatusBadgeLabel(item.status)} />
														</span>

														<div className="flex items-center gap-1 shrink-0">
															<div className="flex items-center -space-x-1 shrink-0">
																{primaryAssignee?.avatarUrl ? (
																	<div className="w-6 h-6 rounded-full border-[1.5px] border-[#FAFAFA] overflow-hidden shrink-0 shadow-2xs flex items-center justify-center">
																		<Image
																			src={primaryAssignee.avatarUrl}
																			alt={primaryAssignee.name}
																			width={24}
																			height={24}
																			className="w-full h-full object-cover"
																		/>
																	</div>
																) : (
																	<div className="w-6 h-6 rounded-full bg-slate-200/90 border-[1.5px] border-[#FAFAFA] text-slate-700 font-semibold text-[10px] flex items-center justify-center shrink-0 shadow-2xs">
																		{primaryAssignee?.initials || "EM"}
																	</div>
																)}

																{remainingAssigneesCount > 0 && (
																	<div className="w-6 h-6 rounded-full bg-slate-100 border-[1.5px] border-[#FAFAFA] text-slate-600 font-medium text-[10px] flex items-center justify-center shrink-0 shadow-2xs">
																		+{remainingAssigneesCount}
																	</div>
																)}
															</div>

															<div className="w-6 h-6 rounded-full border border-dashed border-slate-300 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:border-slate-400 transition-colors">
																<Plus className="w-3.5 h-3.5" />
															</div>
														</div>
													</div>
												) : (
													/* Standard Bottom: 24px Avatars at Bottom */
													<div className="flex items-center gap-1.5 mt-auto pt-1">
														<div className="flex items-center -space-x-1 shrink-0">
															{primaryAssignee?.avatarUrl ? (
																<div className="w-6 h-6 rounded-full border-[1.5px] border-[#FAFAFA] overflow-hidden shrink-0 shadow-2xs flex items-center justify-center">
																	<Image
																		src={primaryAssignee.avatarUrl}
																		alt={primaryAssignee.name}
																		width={24}
																		height={24}
																		className="w-full h-full object-cover"
																	/>
																</div>
															) : (
																<div className="w-6 h-6 rounded-full bg-slate-200/90 border-[1.5px] border-[#FAFAFA] text-slate-700 font-semibold text-[10px] flex items-center justify-center shrink-0 shadow-2xs">
																	{primaryAssignee?.initials || "EM"}
																</div>
															)}

															{remainingAssigneesCount > 0 && (
																<div className="w-6 h-6 rounded-full bg-slate-100 border-[1.5px] border-[#FAFAFA] text-slate-600 font-medium text-[10px] flex items-center justify-center shrink-0 shadow-2xs">
																	+{remainingAssigneesCount}
																</div>
															)}
														</div>

														<div className="w-6 h-6 rounded-full border border-dashed border-slate-300 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:border-slate-400 transition-colors">
															<Plus className="w-3.5 h-3.5" />
														</div>
													</div>
												)}
											</Button>
										</div>
									);
								})}
							</div>
						</div>
					</div>
				</div>

				{/* ── Task Detail Popover Modal strictly inside the Drawer (Clean Transparent Backdrop) ── */}
				{activeTaskItem && (
					<div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-transparent">
						<div
							className="absolute inset-0 cursor-pointer"
							onClick={() => setActivePopoverId(null)}
						/>
						<div className="relative z-10 w-full max-w-[340px] flex justify-center">
							<PersonnelTaskPopoverCard
								item={{
									id: activeTaskItem.id,
									employeeId: "emp-1",
									employeeName: "Göran Andersson",
									employeeInitials: "GA",
									dayStart: dayNumber,
									daySpan: 1,
									title: activeTaskItem.title,
									dateText: `${dayNumber} Dec, ${currentYear}`,
									timeRange: activeTaskItem.timeRange,
									status: activeTaskItem.status,
									colorTheme: activeTaskItem.colorTheme,
									assignees: activeTaskItem.assignees || [],
								}}
								onClose={() => setActivePopoverId(null)}
								onEdit={(it) => {
									if (onOpenEditModal) onOpenEditModal(it);
								}}
								onDelete={(id) => {
									if (onDeleteTask) onDeleteTask(id);
									setActivePopoverId(null);
								}}
								onAddAssignee={(it, ass) => {
									if (onAddAssignee) onAddAssignee(it, ass);
								}}
								employeesList={employeesList}
							/>
						</div>
					</div>
				)}
			</SheetContent>
		</Sheet>
	);
}

export default PersonnelDayDetailsDrawer;
