"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import {
	CalendarMinus2,
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	Info,
	Plus,
} from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { Button } from "@/components/ui/button";
import { PersonnelTaskPopover } from "./PersonnelTaskPopover";
import { PersonnelDayDetailsDrawer } from "./PersonnelDayDetailsDrawer";
import type {
	PersonnelScheduleItem,
	PlanningAssignee,
	GridTaskItem,
} from "../../types/planning.types";
import {
	MOCK_PERSONNEL_SAMPLE_ASSIGNEES,
	MOCK_PERSONNEL_GRID_TASKS,
} from "../../data/personnelPlanning.mock";

interface PersonnelScheduleGridProps {
	currentMonthKey?: string;
	currentYear?: number;
	currentWeekNumber?: number;
	daysHeader?: { dayNumber: number; dayNameKey: string; hours?: number }[];
	employeesList: { id: string; name: string; initials: string; avatarUrl?: string }[];
	filteredItems?: PersonnelScheduleItem[];
	searchQuery?: string;
	selectedStatus?: string;
	selectedAssignee?: string;
	selectedProject?: string;
	activePopoverId?: string | null;
	setActivePopoverId?: (id: string | null) => void;
	onPrevWeek?: () => void;
	onNextWeek?: () => void;
	onOpenCreateModal?: () => void;
	onOpenEditModal?: (item: PersonnelScheduleItem) => void;
	onDeleteTask?: (itemId: string) => void;
	onAddAssignee?: (item: PersonnelScheduleItem, assignee: PlanningAssignee) => void;
}

const START_HOUR = 7; // Starts at 7:00 AM

const TIME_SLOTS = Array.from({ length: 24 }, (_, i) => {
	const h = (START_HOUR + i) % 24;
	if (h === 0) return { label: "12 AM", hour: 0 };
	if (h < 12) return { label: `${h} AM`, hour: h };
	if (h === 12) return { label: "12 PM", hour: 12 };
	return { label: `${h - 12} PM`, hour: h };
});

const SLOT_HEIGHT = 76; // px per 60 minutes
const TOTAL_MINUTES = 24 * 60; // 1440 minutes in 24 hours

interface PositionedGridTaskItem extends GridTaskItem {
	colIndex: number;
	totalCols: number;
}

function getTaskThemeStyles(theme: GridTaskItem["colorTheme"]) {
	switch (theme) {
		case "yellow":
			return {
				bg: "bg-yellow-50",
				text: "text-yellow-800",
				border: "border-l-[2px] border-yellow-500",
			};
		case "purple":
			return {
				bg: "bg-purple-50",
				text: "text-purple-800",
				border: "border-l-[2px] border-purple-500",
			};
		case "blue":
			return {
				bg: "bg-blue-50",
				text: "text-blue-800",
				border: "border-l-[2px] border-blue-500",
			};
		case "green":
			return {
				bg: "bg-emerald-50",
				text: "text-emerald-800",
				border: "border-l-[2px] border-emerald-500",
			};
		case "pink":
		case "red":
			return {
				bg: "bg-rose-50",
				text: "text-rose-800",
				border: "border-l-[2px] border-rose-500",
			};
		default:
			return {
				bg: "bg-slate-50",
				text: "text-slate-900",
				border: "border-l-[2px] border-slate-900",
			};
	}
}

/**
 * Greedy Interval Clustering Algorithm:
 * Groups overlapping tasks into interval clusters and assigns them parallel column tracks.
 */
function calculateDayTaskPositions(dayTasks: GridTaskItem[]): PositionedGridTaskItem[] {
	if (dayTasks.length === 0) return [];

	const sorted = [...dayTasks].sort((a, b) => {
		if (a.topMinutes !== b.topMinutes) return a.topMinutes - b.topMinutes;
		return b.durationMinutes - a.durationMinutes;
	});

	const clusters: GridTaskItem[][] = [];
	let currentCluster: GridTaskItem[] = [];
	let clusterEnd = -1;

	for (const task of sorted) {
		const taskStart = task.topMinutes;
		const taskEnd = task.topMinutes + task.durationMinutes;

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
		const columns: { end: number }[] = [];
		const clusterPositions: { task: GridTaskItem; colIndex: number }[] = [];

		for (const task of cluster) {
			const taskStart = task.topMinutes;
			const taskEnd = task.topMinutes + task.durationMinutes;

			let placed = false;
			for (let i = 0; i < columns.length; i++) {
				if (columns[i].end <= taskStart) {
					columns[i].end = taskEnd;
					clusterPositions.push({ task, colIndex: i });
					placed = true;
					break;
				}
			}
			if (!placed) {
				columns.push({ end: taskEnd });
				clusterPositions.push({ task, colIndex: columns.length - 1 });
			}
		}

		const totalCols = columns.length;
		for (const pos of clusterPositions) {
			result.push({
				...pos.task,
				colIndex: pos.colIndex,
				totalCols,
			});
		}
	}

	return result;
}

const DEFAULT_GRID_TASKS = MOCK_PERSONNEL_GRID_TASKS;

const DEFAULT_DAYS_HEADER = [
	{ dayNumber: 10, dayNameKey: "monday", hours: 40 },
	{ dayNumber: 11, dayNameKey: "tuesday", hours: 38 },
	{ dayNumber: 12, dayNameKey: "wednesday", hours: 42 },
	{ dayNumber: 13, dayNameKey: "thursday", hours: 35 },
	{ dayNumber: 14, dayNameKey: "friday", hours: 45 },
	{ dayNumber: 15, dayNameKey: "saturday", hours: 30 },
	{ dayNumber: 16, dayNameKey: "sunday", hours: 50 },
];



export function PersonnelScheduleGrid({
	currentMonthKey = "monthDec",
	currentYear = 2025,
	currentWeekNumber = 40,
	daysHeader = DEFAULT_DAYS_HEADER,
	employeesList,
	searchQuery,
	selectedStatus,
	selectedAssignee,
	selectedProject,
	activePopoverId,
	setActivePopoverId,
	onPrevWeek,
	onNextWeek,
	onOpenCreateModal,
	onOpenEditModal,
	onDeleteTask,
	onAddAssignee,
}: PersonnelScheduleGridProps) {
	const [localActivePopoverId, setLocalActivePopoverId] = useState<string | null>(null);
	const [tasks, setTasks] = useState<GridTaskItem[]>(DEFAULT_GRID_TASKS);
	const [selectedDayDrawer, setSelectedDayDrawer] = useState<{
		day: { dayNumber: number; dayNameKey: string; hours?: number };
		index: number;
	} | null>(null);

	const activeId = activePopoverId !== undefined ? activePopoverId : localActivePopoverId;
	const handleSetActiveId = (id: string | null) => {
		if (setActivePopoverId) {
			setActivePopoverId(id);
		} else {
			setLocalActivePopoverId(id);
		}
	};

	const handleDeleteTask = (taskId: string) => {
		setTasks((prev) => prev.filter((t) => t.id !== taskId));
		handleSetActiveId(null);
		if (onDeleteTask) onDeleteTask(taskId);
	};

	const handleAddAssigneeInternal = (
		item: PersonnelScheduleItem,
		newAssignee: PlanningAssignee
	) => {
		setTasks((prev) =>
			prev.map((t) => {
				if (t.id === item.id) {
					const current = t.assignees || [];
					const exists = current.some((a) => a.id === newAssignee.id || a.name === newAssignee.name);
					if (exists) return t;
					return {
						...t,
						assignees: [newAssignee, ...current],
					};
				}
				return t;
			})
		);
		if (onAddAssignee) onAddAssignee(item, newAssignee);
	};

	const tableScrollRef = useRef<HTMLDivElement>(null);

	// Lock table scroll while keeping the scrollbar visible
	useEffect(() => {
		const el = tableScrollRef.current;
		if (!el) return;

		if (activeId !== null) {
			const currentScrollLeft = el.scrollLeft;
			const handleWheel = (e: WheelEvent) => {
				e.preventDefault();
			};
			const handleTouch = (e: TouchEvent) => {
				e.preventDefault();
			};
			const handleScroll = () => {
				el.scrollLeft = currentScrollLeft;
			};

			el.addEventListener("wheel", handleWheel, { passive: false });
			el.addEventListener("touchmove", handleTouch, { passive: false });
			el.addEventListener("scroll", handleScroll);

			return () => {
				el.removeEventListener("wheel", handleWheel);
				el.removeEventListener("touchmove", handleTouch);
				el.removeEventListener("scroll", handleScroll);
			};
		}
	}, [activeId]);

	const activeTasks = useMemo(() => {
		return tasks.filter((task) => {
			if (searchQuery && searchQuery.trim()) {
				const q = searchQuery.toLowerCase().trim();
				const matchTitle = task.title.toLowerCase().includes(q);
				const matchAssignee = task.assignees?.some(
					(a) => a.name.toLowerCase().includes(q) || a.initials.toLowerCase().includes(q)
				);
				if (!matchTitle && !matchAssignee) return false;
			}
			if (selectedStatus && selectedStatus !== "all") {
				if (task.status !== selectedStatus) return false;
			}
			if (selectedAssignee && selectedAssignee !== "all") {
				const matchAssignee = task.assignees?.some((a) => a.id === selectedAssignee);
				if (!matchAssignee) return false;
			}
			if (selectedProject && selectedProject !== "all") {
				const codes = selectedProject.split(",").map((c) => c.trim().toLowerCase()).filter(Boolean);
				if (codes.length > 0) {
					const taskTitleLower = task.title.toLowerCase();
					const match = codes.some((code) => taskTitleLower.includes(code));
					if (!match) return false;
				}
			}
			return true;
		});
	}, [tasks, searchQuery, selectedStatus, selectedAssignee, selectedProject]);

	return (
    <div className="flex flex-col gap-3.5 w-full font-sans">
      {/* ── Month/Week Navigation Header & Skapa ny (gap: 12px) ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-3 flex-wrap">
          <Button
            type="button"
            variant="ghost"
            className="p-0 h-auto font-sans font-bold text-lg leading-7 tracking-normal text-slate-900 flex items-center gap-1 hover:text-slate-700 hover:bg-transparent cursor-pointer whitespace-nowrap shadow-none border-0"
          >
            <Translate
              text={
                localizationConstants[
                  currentMonthKey as keyof typeof localizationConstants
                ] || localizationConstants.monthDec
              }
            />{" "}
            {currentYear}
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          </Button>

          <span className="text-slate-300 font-medium">/</span>

          <div className="flex items-center gap-1.5 text-slate-400 h-7">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onPrevWeek}
              className="w-7 h-7 p-1 hover:bg-slate-100 rounded transition-colors cursor-pointer flex items-center justify-center text-slate-400 hover:text-slate-600"
              aria-label="Previous Week"
            >
              <ChevronLeft className="w-4 h-4 text-slate-400" />
            </Button>
            <div className="h-7 shrink-0 flex items-center justify-center gap-1.5 whitespace-nowrap">
              <CalendarMinus2 className="w-5 h-5 text-slate-400 shrink-0" />
              <span className="font-sans font-medium text-lg leading-7 tracking-normal text-slate-400">
                W{currentWeekNumber}
              </span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onNextWeek}
              className="w-7 h-7 p-1 hover:bg-slate-100 rounded transition-colors cursor-pointer flex items-center justify-center text-slate-400 hover:text-slate-600"
              aria-label="Next Week"
            >
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Button>
          </div>
        </div>

        <Button
          onClick={onOpenCreateModal}
          className="bg-zinc-900 text-white hover:bg-black h-9 px-3.5 gap-1.5 rounded-md transition-colors w-full sm:w-auto justify-center cursor-pointer shadow-2xs text-xs font-medium"
        >
          <Plus className="h-4 w-4" />
          <Translate text={localizationConstants.skapaNy} />
        </Button>
      </div>

			{/* ── 7-Day Hourly Timeline Grid ── */}
			<div ref={tableScrollRef} className="w-full overflow-x-auto">
				<div className="min-w-[1180px] w-full flex items-stretch">
					{/* Outer Left Time Gutter (width: 56px, pr: 8px) */}
					<div className="w-[56px] shrink-0 flex flex-col select-none pr-2 pt-[18px]">
						{/* GMT +2 label with exact slot height */}
						<div
							className="flex items-center justify-end font-sans font-semibold text-xs leading-4 tracking-normal text-slate-500 text-right whitespace-nowrap"
							style={{ height: `${SLOT_HEIGHT}px` }}
						>
							<Translate text={localizationConstants.gmtLabel} />
						</div>

            {/* Time labels */}
            {TIME_SLOTS.map((slot) => (
              <div
                key={slot.hour}
                className="flex items-center justify-end font-sans font-semibold text-xs leading-4 tracking-normal text-slate-500 text-right whitespace-nowrap"
                style={{ height: `${SLOT_HEIGHT}px` }}
              >
                {slot.label}
              </div>
            ))}
          </div>

					{/* Main 7-Day Bordered Table */}
					<div className="flex-1 min-w-[1115px] flex flex-col bg-white border border-slate-200 shadow-2xs">
						{/* 7 Day Column Headers (Height: 60px, bg: #F8FAFC, padding: 8px 12px) */}
						<div className="grid grid-cols-7 divide-x divide-slate-200 border-b border-slate-200 bg-[#F8FAFC] text-xs font-semibold text-slate-900 h-[60px] sticky top-0 z-20">
							{daysHeader.map((day, index) => (
								<div
									key={day.dayNumber}
									onClick={() => setSelectedDayDrawer({ day, index })}
									className="h-[60px] px-3 py-2 flex items-center justify-between min-w-[159px] cursor-pointer hover:bg-slate-100/80 transition-colors select-none"
								>
									<div className="flex flex-col">
										<span className="w-[23px] h-[28px] shrink-0 font-sans font-semibold text-xl leading-7 tracking-normal text-slate-900 flex items-center">
											{day.dayNumber}
										</span>
										<span className="font-sans font-normal text-xs leading-4 tracking-normal text-[#374151]">
											<Translate
												text={
													localizationConstants[
														day.dayNameKey as keyof typeof localizationConstants
													] || day.dayNameKey
												}
											/>
										</span>
									</div>

									<div className="flex flex-col items-end justify-center gap-1.5 shrink-0">
										<Info className="w-4 h-4 text-slate-500 stroke-[1.5] shrink-0" />
										<span className="font-sans font-normal text-xs leading-4 tracking-normal text-[#374151] whitespace-nowrap">
											{day.hours ?? 40} h
										</span>
									</div>
								</div>
							))}
						</div>

						{/* 7 Columns Grid Canvas */}
						<div
							className="grid grid-cols-7 divide-x divide-slate-200 relative bg-white"
							style={{ height: `${SLOT_HEIGHT + SLOT_HEIGHT * TIME_SLOTS.length}px` }}
						>
							{/* Background Horizontal Guidelines */}
							<div className="absolute inset-0 flex flex-col pointer-events-none">
								<div
									className="w-full border-b border-slate-100"
									style={{ height: `${SLOT_HEIGHT}px` }}
								/>
								{TIME_SLOTS.map((slot) => (
									<div
										key={`line-${slot.hour}`}
										className="w-full border-b border-slate-100 last:border-b-0"
										style={{ height: `${SLOT_HEIGHT}px` }}
									/>
								))}
							</div>

              {/* Day Columns */}
              {daysHeader.map((day, dayIdx) => {
                const dayTasks = activeTasks.filter(
                  (t) => t.dayIndex === dayIdx,
                );
                const positionedTasks = calculateDayTaskPositions(dayTasks);

								return (
									<div key={day.dayNumber} className="relative h-full">
										{positionedTasks.map((item) => {
											const style = getTaskThemeStyles(item.colorTheme);
											const topPx = SLOT_HEIGHT + (item.topMinutes / TOTAL_MINUTES) * (SLOT_HEIGHT * TIME_SLOTS.length);
											const heightPx = Math.max(34, (item.durationMinutes / TOTAL_MINUTES) * (SLOT_HEIGHT * TIME_SLOTS.length));

                      const colWidthPercent = 100 / item.totalCols;
                      const leftPercent = item.colIndex * colWidthPercent;

                      const scheduleItem: PersonnelScheduleItem = {
                        id: item.id,
                        employeeId: "emp-1",
                        employeeName: "Göran Andersson",
                        employeeInitials: "GA",
                        title: item.title,
                        dayStart: day.dayNumber,
                        daySpan: 1,
                        colorTheme:
                          item.colorTheme === "red" ? "pink" : item.colorTheme,
                        status: item.status,
                        timeRange: item.timeRange,
                        dateText: item.dateText,
                        assignees:
                          item.assignees || MOCK_PERSONNEL_SAMPLE_ASSIGNEES,
                      };

											return (
												<div
													key={item.id}
													className="absolute z-10"
													style={{
														top: `${topPx}px`,
														height: `${heightPx}px`,
														left: `calc(${leftPercent}% + 2px)`,
														width: `calc(${colWidthPercent}% - 4px)`,
													}}
												>
													<PersonnelTaskPopover
														item={scheduleItem}
														isOpen={activeId === item.id}
														onOpenChange={(open) => handleSetActiveId(open ? item.id : null)}
														onEdit={(it) => {
															if (onOpenEditModal) onOpenEditModal(it);
														}}
														onDelete={handleDeleteTask}
														onAddAssignee={handleAddAssigneeInternal}
														employeesList={employeesList}
														side={dayIdx >= 4 ? "left" : "right"}
														align="start"
														sideOffset={8}
													>
														<Button
															type="button"
															variant="ghost"
															onClick={() => handleSetActiveId(item.id)}
															className={`w-full h-full p-0 px-2 pt-1.5 pb-1 rounded-[4px] text-left ${style.bg} ${style.text} ${style.border} cursor-pointer shadow-2xs flex flex-col items-start justify-start overflow-hidden font-sans font-medium text-sm leading-snug tracking-normal border-0 border-l-[2px]`}
														>
															<span className="line-clamp-2 break-words w-full select-none text-left">{item.title}</span>
														</Button>
													</PersonnelTaskPopover>
												</div>
											);
										})}
									</div>
								);
							})}
						</div>
					</div>
				</div>
			</div>

			{/* ── Day Details Sheet (Drawer) ── */}
			{selectedDayDrawer && (
				<PersonnelDayDetailsDrawer
					isOpen={Boolean(selectedDayDrawer)}
					onOpenChange={(open) => {
						if (!open) setSelectedDayDrawer(null);
					}}
					dayHeader={selectedDayDrawer.day}
					dayIndex={selectedDayDrawer.index}
					currentMonthKey={currentMonthKey}
					currentYear={currentYear}
					tasks={tasks}
					employeesList={employeesList}
					onOpenCreateModal={() => {
						if (onOpenCreateModal) onOpenCreateModal();
					}}
					onOpenEditModal={onOpenEditModal}
					onDeleteTask={handleDeleteTask}
					onAddAssignee={handleAddAssigneeInternal}
				/>
			)}
		</div>
	);
}

export default PersonnelScheduleGrid;
