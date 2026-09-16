"use client";

import React, { useState, useMemo, useCallback } from "react";
import { ChevronDown, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableHeader,
	TableBody,
	TableRow,
	TableHead,
	TableCell,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { OrderTimeplan, OrderTimeplanTask } from "../../types/timeplan.types";
import {
	generateTimelineGrid,
	computeTaskGanttMetrics,
} from "../../utils/timeplan.utils";
import { OrderTimeplanAddTaskModal } from "../create/OrderTimeplanAddTaskModal";

interface OrderTimeplanViewGanttTabProps {
	plan: OrderTimeplan | null;
	tasks: OrderTimeplanTask[];
	onAddTask: (newTask: Partial<OrderTimeplanTask>, parentId?: string) => void;
}

export function OrderTimeplanViewGanttTab({
	plan,
	tasks,
	onAddTask,
}: OrderTimeplanViewGanttTabProps) {
	const t = useTranslate();
	const [collapsedRows, setCollapsedRows] = useState<Record<string, boolean>>({});
	const [selectedParentTask, setSelectedParentTask] = useState<OrderTimeplanTask | null>(null);
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);

	// Generate real dynamic calendar grid based on plan start date or earliest task start date
	const baseStartDate = plan?.startDate || (tasks.length > 0 ? tasks[0].startDate : null);
	const timelineGrid = useMemo(() => {
		return generateTimelineGrid(baseStartDate, 4);
	}, [baseStartDate]);

	const toggleCollapse = useCallback((id: string) => {
		setCollapsedRows((prev) => ({ ...prev, [id]: !prev[id] }));
	}, []);

	// Filter visible rows based on parent collapsed state
	const visibleRows = useMemo(() => {
		return tasks.filter((task) => {
			let currentParentId = task.parentId;
			while (currentParentId) {
				if (collapsedRows[currentParentId]) {
					return false;
				}
				const parent = tasks.find((r) => r.id === currentParentId);
				currentParentId = parent?.parentId;
			}
			return true;
		});
	}, [tasks, collapsedRows]);

	const handleOpenAddModal = (task: OrderTimeplanTask) => {
		setSelectedParentTask(task);
		setIsAddModalOpen(true);
	};

	return (
		<div className="flex flex-col space-y-4 w-full font-sans">
			{/* Subtitle matching Figma: "Gantt-schemat visar hur ditt projekt framskrider" */}
			<div className="w-full pl-0 sm:pl-7 pb-1">
				<p className="font-sans font-medium sm:font-semibold text-sm sm:text-base md:text-xl leading-snug sm:leading-7 tracking-normal text-slate-700 sm:text-slate-900">
					<Translate text={localizationConstants.orderTimeplanGanttSubtitle} />
				</p>
			</div>

			{/* Fully Dynamic Gantt Matrix Table matching Figma specifications */}
			<div className="w-full pl-0 sm:pl-7">
				<div className="flex flex-col border border-slate-200 bg-white overflow-hidden rounded-xl shadow-2xs w-full">
					<Table className="w-full border-collapse text-left text-sm min-w-[1100px]">
						<TableHeader className="bg-white">
							{/* Top Row: Task, Start, (+), and Dynamic Month Headers */}
							<TableRow className="bg-white hover:bg-white border-b-0">
								<TableHead
									rowSpan={3}
									className="p-3.5 font-semibold text-slate-900 w-52 border-r border-b border-slate-200 text-xs align-middle"
								>
									<Translate text={localizationConstants.orderTimeplanGanttColTask} />
								</TableHead>
								<TableHead
									rowSpan={3}
									className="p-3.5 font-semibold text-slate-900 w-32 border-r border-b border-slate-200 text-xs align-middle"
								>
									<Translate text={localizationConstants.orderTimeplanGanttColStart} />
								</TableHead>
								<TableHead
									rowSpan={3}
									className="p-2 font-semibold text-slate-900 w-10 border-r border-b border-slate-200 text-center text-xs align-middle"
								/>
								{timelineGrid.months.map((month, mIdx) => (
									<TableHead
										key={mIdx}
										colSpan={month.colSpan}
										className="p-2.5 font-semibold text-slate-900 text-center text-xs border-b border-r border-slate-200 last:border-r-0"
									>
										{month.monthName} {month.year}
									</TableHead>
								))}
							</TableRow>

							{/* Middle Row: Dynamic ISO Weeks */}
							<TableRow className="border-b border-slate-200 bg-white hover:bg-white">
								{timelineGrid.weeks.map((week, idx) => (
									<TableHead
										key={idx}
										colSpan={week.days.length}
										className="p-2 font-semibold text-slate-900 text-center text-xs border-r border-slate-200 last:border-r-0"
									>
										<Translate text={localizationConstants.orderTimeplanGanttWeekPrefix} /> {week.weekNumber}
									</TableHead>
								))}
							</TableRow>

							{/* Bottom Header Row: Dynamic Calendar Days */}
							<TableRow className="border-b border-slate-200 bg-white hover:bg-white">
								{timelineGrid.weeks.flatMap((w) => w.days).map((day, dIdx) => (
									<TableHead
										key={dIdx}
										className={cn(
											"w-8 h-7 text-center font-medium text-slate-700 text-[11px] border-r border-slate-100 last:border-r-0 p-0",
											day.isToday && "bg-amber-50 text-amber-900 font-bold"
										)}
									>
										{day.dayNumber}
									</TableHead>
								))}
							</TableRow>
						</TableHeader>

						<TableBody>
							{visibleRows.map((task) => {
								const isCollapsed = collapsedRows[task.id];
								const isLevel0 = task.level === 0;

								const leftBgClass = isLevel0
									? "bg-slate-100 group-hover:bg-slate-200"
									: "bg-white group-hover:bg-slate-50";

								const gridBgClass = isLevel0
									? "bg-slate-100 group-hover:bg-slate-200"
									: "bg-white group-hover:bg-slate-50";

								const metrics = computeTaskGanttMetrics(
									task,
									timelineGrid.startDate,
									timelineGrid.totalDays
								);

								return (
									<TableRow
										key={task.id}
										className="group border-b border-slate-200 last:border-b-0 transition-colors hover:bg-transparent"
									>
										{/* 1. Task Column with Tree Indentation & Chevron */}
										<TableCell className="py-1 pl-2 pr-0">
											<div
												className={`${leftBgClass} h-10 flex items-center px-3 rounded-l-md transition-colors text-slate-900 text-xs`}
											>
												<div className="flex items-center gap-1.5 overflow-hidden">
													{task.level === 1 && <span className="w-3 shrink-0" />}
													{task.level === 2 && <span className="w-6 shrink-0" />}

													{task.hasChildren ? (
														<Button
															type="button"
															variant="ghost"
															size="icon"
															onClick={() => toggleCollapse(task.id)}
															className="h-5 w-5 p-0.5 text-slate-600 hover:text-slate-900 rounded cursor-pointer shrink-0"
															aria-label={isCollapsed ? "Expand row" : "Collapse row"}
														>
															{isCollapsed ? (
																<ChevronRight className="h-3.5 w-3.5" />
															) : (
																<ChevronDown className="h-3.5 w-3.5" />
															)}
														</Button>
													) : (
														<span className="w-3 shrink-0" />
													)}

													<span
														className={`truncate ${
															task.level === 0
																? "font-bold text-slate-900"
																: task.level === 1
																? "font-bold text-slate-900"
																: "font-normal text-slate-700"
														}`}
													>
														{task.name}
													</span>
												</div>
											</div>
										</TableCell>

										{/* 2. Start Date Column */}
										<TableCell className="py-1 px-0">
											<div
												className={`${leftBgClass} h-10 flex items-center px-3 transition-colors text-xs ${
													task.level === 0
														? "font-bold text-slate-900"
														: task.level === 1
														? "font-bold text-slate-900"
														: "font-normal text-slate-700"
												}`}
											>
												{task.startDate}
											</div>
										</TableCell>

										{/* 3. Add (+) Button Column */}
										<TableCell className="py-1 px-0">
											<div
												className={`${leftBgClass} h-10 flex items-center justify-center px-1 transition-colors`}
											>
												<Button
													type="button"
													variant="ghost"
													size="icon"
													onClick={() => handleOpenAddModal(task)}
													className="h-5 w-5 rounded flex items-center justify-center hover:bg-slate-300/60 text-slate-600 hover:text-slate-900 mx-auto cursor-pointer transition-colors p-0"
													title={t(localizationConstants.orderTimeplanAddTaskTooltip)}
													aria-label={t(localizationConstants.orderTimeplanAddTaskTooltip)}
												>
													<Plus className="h-3.5 w-3.5" />
												</Button>
											</div>
										</TableCell>

										{/* 4. Timeline Grid Cell with Dynamically Positioned Gantt Bar & Tag */}
										<TableCell colSpan={timelineGrid.totalDays} className="py-1 pl-0 pr-2">
											<div
												className={`${gridBgClass} h-10 relative rounded-r-md overflow-visible transition-colors`}
											>
												{/* Vertical Day Lines */}
												<div className="absolute inset-0 flex pointer-events-none">
													{Array.from({ length: timelineGrid.totalDays }).map((_, colIdx) => (
														<div
															key={colIdx}
															className={cn(
																"flex-1 border-r border-slate-100 last:border-r-0 h-full",
																colIdx === timelineGrid.todayIndex && "border-r-amber-400 bg-amber-50/20"
															)}
														/>
													))}
												</div>

												{/* Timeline Bar & Attached Pill Tag */}
												{metrics.isWithinRange && task.color && task.color !== "transparent" ? (
													<div
														className="absolute top-2 bottom-2 flex items-center z-10 pointer-events-none"
														style={{
															left: `${metrics.leftPercent}%`,
															width: `${metrics.widthPercent}%`,
														}}
													>
														{/* Left Tag (e.g. for Pour concrete tag) */}
														{task.tag && task.tagPosition === "left" && (
															<div className="absolute right-full mr-2 top-1/2 -translate-y-1/2 h-5 px-2 rounded-[3px] bg-slate-900 text-white text-[11px] font-medium flex items-center justify-center shadow-xs whitespace-nowrap z-20 pointer-events-auto leading-none">
																{task.tag}
															</div>
														)}

														{/* The Color Segmented Bar */}
														<div
															className={cn(
																"h-full w-full flex rounded-[3px] overflow-hidden shadow-xs pointer-events-auto",
																task.color?.startsWith("bg-") ? task.color : "bg-cyan-500"
															)}
														>
															{Array.from({ length: metrics.durationDays }).map((_, segmentIdx) => (
																<div
																	key={segmentIdx}
																	className="flex-1 border-r border-white/50 last:border-r-0 h-full"
																/>
															))}
														</div>

														{/* Right Tag (Standard attached badge) */}
														{task.tag && task.tagPosition !== "left" && (
															<div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 h-5 px-2 rounded-[3px] bg-slate-900 text-white text-[11px] font-medium flex items-center justify-center shadow-xs whitespace-nowrap z-20 pointer-events-auto leading-none">
																{task.tag}
															</div>
														)}
													</div>
												) : null}
											</div>
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</div>
			</div>

			{/* Modal for adding task / milestone */}
			<OrderTimeplanAddTaskModal
				isOpen={isAddModalOpen}
				parentTask={selectedParentTask}
				onClose={() => setIsAddModalOpen(false)}
				onAdd={onAddTask}
			/>
		</div>
	);
}

export default OrderTimeplanViewGanttTab;
