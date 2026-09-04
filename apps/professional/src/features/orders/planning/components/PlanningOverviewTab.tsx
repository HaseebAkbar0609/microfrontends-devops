"use client";

import { useState, useMemo, useCallback } from "react";
import { ChevronDown, ChevronRight, ChevronLeft, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { differenceInCalendarDays, startOfMonth, addMonths, subMonths } from "date-fns";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { GanttChartGrid } from "@/features/orders/components/OrderGanttTab";
import { GANTT_DATA_ROWS } from "../data/planning.mock";
import type { PlanningGanttRow } from "../types/planning.types";
import {
	CreatePlanningTaskModal,
	type PlanningTaskFormData,
} from "./CreatePlanningTaskModal";

const TOTAL_DAYS = 28;

/** Helper to parse a task date string (e.g. "2024/01/01" or "2024-01-01") */
function parseTaskDate(dateStr?: string | null): Date {
	if (!dateStr) return new Date();
	const clean = dateStr.replace(/\//g, "-");
	const parts = clean.split("-").map(Number);
	if (parts.length === 3) {
		const parsed = new Date(parts[0], parts[1] - 1, parts[2]);
		if (!isNaN(parsed.getTime())) {
			return parsed;
		}
	}
	const fallback = new Date(dateStr);
	return isNaN(fallback.getTime()) ? new Date() : fallback;
}

/** Dynamically calculates initial date from dataset, falling back to start of current month */
function getInitialTimelineDate(dataRows: PlanningGanttRow[]): Date {
	if (!dataRows || dataRows.length === 0) {
		return startOfMonth(new Date());
	}
	const validDates = dataRows
		.map((r) => parseTaskDate(r.startDate))
		.filter((d) => !isNaN(d.getTime()));

	if (validDates.length === 0) {
		return startOfMonth(new Date());
	}

	const earliestTimestamp = Math.min(...validDates.map((d) => d.getTime()));
	return startOfMonth(new Date(earliestTimestamp));
}

interface ProcessedPlanningRow extends PlanningGanttRow {
	durationDays: number;
	startDayIndex: number;
}

export function PlanningOverviewTab() {
	const { i18n } = useTranslation();
	const t = useTranslate();
	const currentLang = i18n.language || "sv";

	const [rows, setRows] = useState<PlanningGanttRow[]>(GANTT_DATA_ROWS);
	// Active Date dynamically initialized from data rows or current date
	const [activeDate, setActiveDate] = useState<Date>(() => getInitialTimelineDate(GANTT_DATA_ROWS));
	const [collapsedRows, setCollapsedRows] = useState<Record<string, boolean>>({});

	// Modal State for adding new sub-task / activity
	const [selectedParentRow, setSelectedParentRow] = useState<PlanningGanttRow | null>(null);

	const year = activeDate.getFullYear();
	const month = activeDate.getMonth();

	// Dynamic Navigation Handlers using date-fns
	const handlePrevMonth = useCallback(() => {
		setActiveDate((prev) => subMonths(startOfMonth(prev), 1));
	}, []);

	const handleNextMonth = useCallback(() => {
		setActiveDate((prev) => addMonths(startOfMonth(prev), 1));
	}, []);

	// Dynamic Month Label & Weeks Calculation
	const { displayMonth, WEEKS, viewStartDate } = useMemo(() => {
		const langCode = currentLang === "sv" ? "sv-SE" : "en-US";
		const weekPrefix = currentLang === "sv" ? "Vecka" : "Week";

		const formattedMonth = activeDate.toLocaleDateString(langCode, {
			month: "long",
			year: "numeric",
		});
		const monthTitle = formattedMonth.charAt(0).toUpperCase() + formattedMonth.slice(1);

		const firstDayOfMonth = new Date(year, month, 1);
		const baseWeekNumber = Math.max(
			1,
			Math.ceil(
				(differenceInCalendarDays(firstDayOfMonth, new Date(year, 0, 1)) +
					new Date(year, 0, 1).getDay() +
					1) /
					7
			)
		);

		const weeks = Array.from({ length: 4 }).map((_, wIdx) => {
			const weekNum = baseWeekNumber + wIdx;
			const days = Array.from({ length: 7 }).map((_, dIdx) => {
				const dayDate = new Date(year, month, 1 + wIdx * 7 + dIdx);
				return dayDate.getDate();
			});
			return {
				label: `${weekPrefix} ${weekNum}`,
				days,
			};
		});

		return {
			displayMonth: monthTitle,
			WEEKS: weeks,
			viewStartDate: firstDayOfMonth,
		};
	}, [activeDate, month, year, currentLang]);

	const toggleCollapse = useCallback((id: string) => {
		setCollapsedRows((prev) => ({ ...prev, [id]: !prev[id] }));
	}, []);

	const handleOpenAddModal = useCallback((row: PlanningGanttRow) => {
		setSelectedParentRow(row);
	}, []);

	const handleSaveTask = useCallback((formData: PlanningTaskFormData) => {
		if (!selectedParentRow) return;

		const targetLevel = (selectedParentRow.level === 0 ? 1 : 2) as 1 | 2;
		const newRowId = `${selectedParentRow.id}-${Date.now()}`;

		const newRow: PlanningGanttRow = {
			id: newRowId,
			parentId: selectedParentRow.id,
			name: formData.taskName.trim(),
			startDate: formData.startDate,
			level: targetLevel,
			durationDays: Number(formData.duration) || 0,
			startDayIndex: Number(formData.startDayIndex) || 0,
			color: formData.color,
		};

		setRows((prevRows) => {
			const index = prevRows.findIndex((r) => r.id === selectedParentRow.id);
			if (index === -1) return [...prevRows, newRow];

			const updatedRows = [...prevRows];
			updatedRows[index] = { ...updatedRows[index], hasChildren: true };

			let insertIndex = index + 1;
			while (
				insertIndex < updatedRows.length &&
				updatedRows[insertIndex].parentId === selectedParentRow.id
			) {
				insertIndex++;
			}
			updatedRows.splice(insertIndex, 0, newRow);
			return updatedRows;
		});

		setCollapsedRows((prev) => ({ ...prev, [selectedParentRow.id]: false }));
		setSelectedParentRow(null);
	}, [selectedParentRow]);

	// Performance optimization: Memoized visible rows calculation
	const visibleRows = useMemo(() => {
		return rows.filter((row) => {
			let currentParentId = row.parentId;
			while (currentParentId) {
				if (collapsedRows[currentParentId]) {
					return false;
				}
				const parentRow = rows.find((r) => r.id === currentParentId);
				currentParentId = parentRow?.parentId;
			}
			return true;
		});
	}, [rows, collapsedRows]);

	// Performance optimization: Pre-compute timeline positioning parameters for all visible rows
	const processedVisibleRows: ProcessedPlanningRow[] = useMemo(() => {
		return visibleRows.map((row) => {
			const taskStart = parseTaskDate(row.startDate);
			const taskDuration = row.durationDays || 1;
			const diffFromViewStart = differenceInCalendarDays(taskStart, viewStartDate);

			let startDayIndex = diffFromViewStart;
			let durationDays = taskDuration;

			if (startDayIndex < 0) {
				durationDays = Math.max(0, taskDuration + startDayIndex);
				startDayIndex = 0;
			}

			if (startDayIndex >= TOTAL_DAYS || durationDays <= 0) {
				return {
					...row,
					durationDays: 0,
					startDayIndex: 0,
				};
			}

			durationDays = Math.min(durationDays, TOTAL_DAYS - startDayIndex);

			return {
				...row,
				durationDays: Math.max(0, durationDays),
				startDayIndex: Math.max(0, startDayIndex),
			};
		});
	}, [visibleRows, viewStartDate]);

	return (
		<div className="flex flex-col w-full bg-white rounded-lg overflow-hidden border border-slate-200 shadow-2xs font-sans">
			{/* Timeline Grid Table without any top toolbar */}
			<div className="overflow-x-auto w-full">
				<table className="w-full border-collapse text-left text-sm min-w-[1150px]">
					<thead>
						<tr className="border-b border-slate-200 bg-white">
							<th rowSpan={3} className="p-3.5 font-semibold text-slate-900 w-52 border-r border-slate-200 text-xs align-middle text-left">
								<Translate text={localizationConstants.planningTask} />
							</th>
							<th rowSpan={3} className="p-3.5 font-semibold text-slate-900 w-32 border-r border-slate-200 text-xs align-middle text-left">
								<Translate text={localizationConstants.planningStart} />
							</th>
							<th rowSpan={3} className="p-2 font-semibold text-slate-900 w-10 border-r border-slate-200 text-center text-xs align-middle"></th>

							<th colSpan={TOTAL_DAYS} className="p-2 font-semibold text-slate-900 text-center text-xs border-b border-r border-slate-200">
								<div className="flex items-center justify-center gap-6 px-4">
									<button
										type="button"
										onClick={handlePrevMonth}
										className="p-1 rounded-md hover:bg-slate-200/60 text-slate-500 hover:text-slate-900 cursor-pointer transition-colors"
										title={t(localizationConstants.prevMonthTooltip)}
										aria-label={t(localizationConstants.prevMonthTooltip)}
									>
										<ChevronLeft className="w-4 h-4" />
									</button>
									<span className="font-semibold text-slate-900 min-w-[110px] inline-block text-center">{displayMonth}</span>
									<button
										type="button"
										onClick={handleNextMonth}
										className="p-1 rounded-md hover:bg-slate-200/60 text-slate-500 hover:text-slate-900 cursor-pointer transition-colors"
										title={t(localizationConstants.nextMonthTooltip)}
										aria-label={t(localizationConstants.nextMonthTooltip)}
									>
										<ChevronRight className="w-4 h-4" />
									</button>
								</div>
							</th>
						</tr>

						<tr className="border-b border-slate-200 bg-white">
							{WEEKS.map((week, idx) => (
								<th
									key={idx}
									colSpan={7}
									className="p-2.5 font-semibold text-slate-900 text-center text-xs border-r border-slate-200"
								>
									{week.label}
								</th>
							))}
						</tr>

						<tr className="border-b border-slate-200 bg-white">
							{WEEKS.flatMap((w) => w.days).map((day, dIdx) => (
								<th
									key={dIdx}
									className="w-9 h-8 text-center font-medium text-slate-700 text-[11px] border-r border-slate-100"
								>
									{day}
								</th>
							))}
						</tr>
					</thead>

					<tbody>
						{processedVisibleRows.map((row) => {
							const isCollapsed = collapsedRows[row.id];

							const leftBgClass =
								row.level === 0
									? "bg-[#EBEFF5] group-hover:bg-[#E2E8F0]"
									: "bg-[#F9FAFB] group-hover:bg-[#E2E8F0]";

							return (
								<tr key={row.id} className="group border-b border-slate-200 last:border-b-0">
									<td className="py-1.5 pl-2 pr-0">
										<div className={`${leftBgClass} h-11 flex items-center px-3 rounded-l-md transition-colors text-slate-900 text-xs font-normal`}>
											<div className="flex items-center gap-1.5 overflow-hidden">
												{row.level === 1 && <span className="w-4 flex-shrink-0" />}
												{row.level === 2 && <span className="w-8 flex-shrink-0" />}
												{row.hasChildren ? (
													<button
														type="button"
														onClick={() => toggleCollapse(row.id)}
														className="p-0.5 text-slate-500 hover:text-slate-900 rounded cursor-pointer flex-shrink-0"
														aria-label={isCollapsed ? "Expand row" : "Collapse row"}
													>
														{isCollapsed ? (
															<ChevronRight className="h-4 w-4" />
														) : (
															<ChevronDown className="h-4 w-4" />
														)}
													</button>
												) : (
													<span className="w-4 flex-shrink-0" />
												)}
												<span className={`truncate ${row.level === 0 ? "font-bold text-slate-900" : row.level === 1 ? "font-semibold text-slate-800" : "font-normal text-slate-700"}`}>
													{row.name}
												</span>
											</div>
										</div>
									</td>

									<td className="py-1.5 px-0">
										<div className={`${leftBgClass} h-11 flex items-center px-3 transition-colors text-slate-700 text-xs ${row.level === 0 ? "font-bold text-slate-900" : ""}`}>
											{row.startDate}
										</div>
									</td>

									<td className="py-1.5 px-0">
										<div className={`${leftBgClass} h-11 flex items-center justify-center px-1 transition-colors`}>
											<button
												type="button"
												onClick={() => handleOpenAddModal(row)}
												className="h-6 w-6 rounded flex items-center justify-center hover:bg-slate-300/60 text-slate-600 hover:text-slate-900 mx-auto cursor-pointer transition-colors"
												aria-label="Add sub-task"
											>
												<Plus className="h-4 w-4" />
											</button>
										</div>
									</td>

									<td colSpan={TOTAL_DAYS} className="py-1.5 pl-0 pr-2">
										<GanttChartGrid
											totalDays={TOTAL_DAYS}
											durationDays={row.durationDays}
											startDayIndex={row.startDayIndex}
											color={row.color || "transparent"}
											level={row.level}
										/>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>

			{/* Add Activity Modal component with React Hook Form + Zod + shadcn UI */}
			<CreatePlanningTaskModal
				isOpen={!!selectedParentRow}
				parentRow={selectedParentRow}
				onClose={() => setSelectedParentRow(null)}
				onSave={handleSaveTask}
			/>
		</div>
	);
}

export default PlanningOverviewTab;
