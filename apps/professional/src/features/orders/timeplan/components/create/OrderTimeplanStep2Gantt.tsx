"use client";

import React, { useState, useMemo, useCallback } from "react";
import { ArrowLeft, ChevronDown, ChevronRight, Plus, Save } from "lucide-react";
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
import type { OrderTimeplanTask } from "../../types/timeplan.types";
import {
	generateTimelineGrid,
	computeTaskGanttMetrics,
} from "../../utils/timeplan.utils";
import { OrderTimeplanAddTaskModal } from "./OrderTimeplanAddTaskModal";

interface OrderTimeplanStep2GanttProps {
	tasks: OrderTimeplanTask[];
	onBack: () => void;
	onSave: () => void;
	onCancel: () => void;
	onAddTask: (newTask: Partial<OrderTimeplanTask>, parentId?: string) => void;
	onToggleExpand: (taskId: string) => void;
	isSubmitting?: boolean;
}

export function OrderTimeplanStep2Gantt({
	tasks,
	onBack,
	onSave,
	onCancel,
	onAddTask,
	isSubmitting = false,
}: OrderTimeplanStep2GanttProps) {
	const t = useTranslate();
	const [collapsedRows, setCollapsedRows] = useState<Record<string, boolean>>({});
	const [selectedParentTask, setSelectedParentTask] = useState<OrderTimeplanTask | null>(null);
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);

	// Generate dynamic calendar timeline grid based on earliest task date
	const baseStartDate = tasks.length > 0 ? tasks[0].startDate : null;
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
		<div className="flex flex-col flex-1 min-h-[calc(100vh-140px)] -ml-4 sm:-ml-[3.25rem] -mr-4 sm:-mr-6 -mt-px -mb-4 px-3 sm:px-6 pt-5 sm:pt-7 pb-0 bg-slate-50 justify-between font-sans">
			<div className="flex flex-col flex-1 space-y-4 w-full pb-10">
				{/* Top Header matching Figma: "← View tidsplan" + Subtitle */}
				<div className="flex items-start gap-2.5 pb-1">
					<Button
						type="button"
						variant="ghost"
						size="icon"
						onClick={onBack}
						className="size-7 shrink-0 rounded-md text-slate-900 hover:bg-slate-200/60 cursor-pointer flex items-center justify-center p-0 mt-0.5 shadow-none"
						aria-label={t(localizationConstants.orderTimeplanBtnBackTo)}
					>
						<ArrowLeft className="size-5 text-slate-900" aria-hidden="true" />
					</Button>
					<div className="flex flex-col">
						<h1 className="font-sans font-semibold text-lg sm:text-2xl leading-7 sm:leading-8 text-slate-900">
							<Translate text={localizationConstants.orderTimeplanGanttViewTitle} />
						</h1>
						<p className="font-sans font-medium sm:font-semibold text-sm sm:text-base md:text-xl leading-snug sm:leading-7 tracking-normal text-slate-700 sm:text-slate-900 mt-1 sm:mt-3">
							<Translate text={localizationConstants.orderTimeplanGanttSubtitle} />
						</p>
					</div>
				</div>

				{/* Dynamic Gantt Matrix Table: Indented with pl-0 sm:pl-7 to preserve cards/table left position */}
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
															{/* Left Tag */}
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

															{/* Right Tag */}
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
			</div>

			{/* Sticky Bottom Action Footer matching exact Figma Screenshot */}
			<div className="mt-auto sticky -bottom-4 -mx-3 sm:-mx-6 -mb-4 px-4 sm:px-6 py-3 sm:py-3.5 bg-white border-t border-slate-200 z-30 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 shadow-md">
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
					onClick={onBack}
					className="w-full sm:w-auto min-w-0 sm:min-w-[140px] h-10 px-4 sm:px-6 rounded-lg border border-slate-200 bg-zinc-100 hover:bg-zinc-200 text-slate-900 text-sm font-medium cursor-pointer shadow-none flex items-center justify-center gap-2"
				>
					<ArrowLeft className="h-4 w-4" />
					<Translate text={localizationConstants.orderTimeplanBtnBackTo} />
				</Button>

				<Button
					type="button"
					onClick={onSave}
					disabled={isSubmitting}
					className="w-full sm:w-auto min-w-0 sm:min-w-[130px] h-10 px-4 sm:px-6 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-medium cursor-pointer shadow-none flex items-center justify-center gap-2"
				>
					<Save className="h-4 w-4 text-white" />
					<Translate text={localizationConstants.orderTimeplanBtnSave} />
				</Button>
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

export default OrderTimeplanStep2Gantt;
