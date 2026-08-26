"use client";

import {
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
	Info,
	RotateCcw,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { Search } from "@/components/search/Search";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { usePurchaseGantt } from "../hooks/usePurchaseGantt";
import type {
	PurchaseGanttRow,
	PurchaseGanttZoom,
	PurchaseStatus,
} from "../types/purchase.types";
import { PurchaseStatusBadge } from "./PurchaseBadges";

/** Pale planned track and solid actual bar, per status. */
const BAR_COLORS: Record<PurchaseStatus, { track: string; bar: string }> = {
	not_started: { track: "#E2E8F0", bar: "#94A3B8" },
	ongoing: { track: "#FDE68A", bar: "#D97706" },
	delayed: { track: "#FECACA", bar: "#DC2626" },
	completed: { track: "#BBF7D0", bar: "#16A34A" },
};

const ZOOM_OPTIONS: { value: PurchaseGanttZoom; label: string }[] = [
	{ value: "day", label: localizationConstants.purchaseGanttZoomDay },
	{ value: "week", label: localizationConstants.purchaseGanttZoomWeek },
	{ value: "month", label: localizationConstants.purchaseGanttZoomMonth },
];

/** Matches the Order schedule: light band cells, white column rules. */
const BAND_CELL =
	"bg-[#EBEFF5] group-hover:bg-[#E2E8F0] h-10 flex items-center transition-colors";

const MIN_COLUMN_WIDTH: Record<PurchaseGanttZoom, number> = {
	day: 32,
	week: 56,
	month: 84,
};

function GanttDetails({ row }: { row: PurchaseGanttRow }) {
	const items: [string, string][] = [
		[localizationConstants.purchaseGanttOrderDate, row.orderDate],
		[
			localizationConstants.purchaseGanttEstimatedDelivery,
			row.estimatedDelivery,
		],
		[localizationConstants.purchaseGanttDelivery, row.delivery],
		[localizationConstants.purchaseGanttMonitoring, row.monitoring],
	];

	return (
		<div className="flex flex-col gap-1.5">
			<ul className="space-y-1">
				{items.map(([label, value]) => (
					<li key={label} className="flex items-center gap-1.5">
						<span aria-hidden>&bull;</span>
						<span>
							<Translate text={label} />: {value}
						</span>
					</li>
				))}
			</ul>
			<div>
				<PurchaseStatusBadge status={row.status} />
			</div>
		</div>
	);
}

/**
 * Timeline cell for one row. Same presentation as the Order schedule's
 * GanttChartGrid — a light band with white column rules and segmented bars —
 * extended with the pale planned track and the today marker.
 */
function PurchaseGanttGrid({
	columnCount,
	planned,
	actual,
	colors,
	todayPercent,
}: {
	columnCount: number;
	planned: { left: number; width: number };
	actual: { left: number; width: number };
	colors: { track: string; bar: string };
	todayPercent: number | null;
}) {
	return (
		<div className="relative h-10 overflow-hidden rounded-r-md bg-[#EBEFF5] transition-colors group-hover:bg-[#E2E8F0]">
			{/* Column rules */}
			<div className="absolute inset-0 flex">
				{Array.from({ length: columnCount }).map((_, index) => (
					<div
						key={index}
						className="h-full flex-1 border-r-2 border-white last:border-r-0"
					/>
				))}
			</div>

			{planned.width > 0 && (
				<div
					className="absolute top-2 bottom-2 rounded-xs"
					style={{
						left: `${planned.left}%`,
						width: `${planned.width}%`,
						backgroundColor: colors.track,
					}}
				/>
			)}

			{actual.width > 0 && (
				<div
					className="absolute top-2 bottom-2 z-10 overflow-hidden rounded-xs shadow-2xs"
					style={{
						left: `${actual.left}%`,
						width: `${actual.width}%`,
						backgroundColor: colors.bar,
					}}
				/>
			)}

			{todayPercent !== null && (
				<div
					aria-hidden
					className="absolute top-0 bottom-0 z-20 w-0.5 bg-red-500"
					style={{ left: `${todayPercent}%` }}
				/>
			)}
		</div>
	);
}

export function PurchaseGanttTab() {
	const { t } = useTranslation();
	const {
		zoom,
		setZoom,
		searchQuery,
		setSearchQuery,
		statusFilter,
		setStatusFilter,
		rangeFrom,
		setRangeFrom,
		rangeTo,
		setRangeTo,
		resetRange,
		toggleRow,
		columns,
		groups,
		superGroups,
		renderRows,
		todayPercent,
		totalPages,
		currentPage,
		setCurrentPage,
		pageSize,
		setPageSize,
	} = usePurchaseGantt();

	const columnCount = columns.length;
	const timelineWidth = columnCount * MIN_COLUMN_WIDTH[zoom];
	/** Four identity columns, matching the header widths below. */
	const leftWidth = 130 + 170 + 160 + 180;

	return (
		<TooltipProvider delayDuration={150}>
			<div className="flex flex-col gap-4">
				{/* Controls */}
				<div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
					<div className="flex w-full flex-col items-stretch gap-3 sm:flex-row sm:items-center xl:w-auto">
						<Search
							value={searchQuery}
							onChange={(value) => {
								setSearchQuery(value);
								setCurrentPage(1);
							}}
							placeholder={localizationConstants.search}
							className="h-10 w-full"
							wrapperClassName="w-full sm:w-[220px]"
						/>

						<Select
							value={statusFilter}
							onValueChange={(value) => {
								setStatusFilter(value);
								setCurrentPage(1);
							}}
						>
							<SelectTrigger className="h-10 w-full cursor-pointer border-slate-200 bg-white text-xs font-normal text-slate-700 shadow-2xs sm:w-[150px]">
								<SelectValue
									placeholder={t(
										localizationConstants.purchaseFilterLabel,
									)}
								/>
							</SelectTrigger>
							<SelectContent className="bg-white">
								<SelectItem value="all">
									<Translate
										text={
											localizationConstants.purchaseFilterAllStatuses
										}
									/>
								</SelectItem>
								<SelectItem value="not_started">
									<Translate
										text={
											localizationConstants.purchaseStatusNotStarted
										}
									/>
								</SelectItem>
								<SelectItem value="ongoing">
									<Translate
										text={
											localizationConstants.purchaseStatusOngoing
										}
									/>
								</SelectItem>
								<SelectItem value="delayed">
									<Translate
										text={
											localizationConstants.purchaseStatusDelayed
										}
									/>
								</SelectItem>
								<SelectItem value="completed">
									<Translate
										text={
											localizationConstants.purchaseStatusCompleted
										}
									/>
								</SelectItem>
							</SelectContent>
						</Select>

						<div className="flex items-center gap-2">
							<Input
								type="date"
								aria-label={t(
									localizationConstants.purchaseGanttFrom,
								)}
								value={rangeFrom}
								onChange={(event) =>
									setRangeFrom(event.target.value)
								}
								className="h-10 w-[150px] border-slate-200 bg-white text-xs text-slate-700"
							/>
							<span className="text-xs text-slate-400">
								<Translate
									text={localizationConstants.purchaseGanttTo}
								/>
							</span>
							<Input
								type="date"
								aria-label={t(
									localizationConstants.purchaseGanttTo,
								)}
								value={rangeTo}
								onChange={(event) =>
									setRangeTo(event.target.value)
								}
								className="h-10 w-[150px] border-slate-200 bg-white text-xs text-slate-700"
							/>
							{(rangeFrom || rangeTo) && (
								<Button
									type="button"
									variant="ghost"
									size="icon"
									onClick={resetRange}
									aria-label={t(
										localizationConstants.purchaseGanttResetRange,
									)}
									className="h-9 w-9 cursor-pointer text-slate-500 hover:text-slate-900"
								>
									<RotateCcw className="h-4 w-4" />
								</Button>
							)}
						</div>
					</div>

					{/* Zoom toggle */}
					<div className="flex items-center gap-1 rounded-md border border-slate-200 bg-white p-1">
						{ZOOM_OPTIONS.map((option) => (
							<button
								key={option.value}
								type="button"
								onClick={() => setZoom(option.value)}
								aria-pressed={zoom === option.value}
								className={cn(
									"cursor-pointer rounded px-3 py-1.5 text-xs font-medium transition-colors",
									"focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:outline-none",
									zoom === option.value
										? "bg-[#111721] text-white"
										: "text-slate-600 hover:bg-slate-100",
								)}
							>
								<Translate text={option.label} />
							</button>
						))}
					</div>
				</div>

				{/* Schedule */}
				<div className="mt-2 flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xs">
					<div className="overflow-x-auto">
						<table
							className="w-full border-collapse text-left text-sm"
							style={{ minWidth: leftWidth + timelineWidth }}
						>
							<thead>
								{superGroups.length > 0 && (
									<tr className="border-b border-slate-200 bg-white">
										<th
											colSpan={4}
											className="border-r border-slate-200"
										/>
										{superGroups.map((band) => (
											<th
												key={band.key}
												colSpan={band.columnSpan}
												className="border-r border-b border-slate-200 p-2 text-center text-xs font-semibold text-slate-900 last:border-r-0"
											>
												{band.label}
											</th>
										))}
									</tr>
								)}

								<tr className="border-b border-slate-200 bg-white">
									<th
										rowSpan={2}
										className="w-32 border-r border-slate-200 p-3 align-middle text-xs font-semibold text-slate-900"
									>
										<Translate
											text={
												localizationConstants.purchaseColNumber
											}
										/>
									</th>
									<th
										rowSpan={2}
										className="w-44 border-r border-slate-200 p-3 align-middle text-xs font-semibold text-slate-900"
									>
										<Translate
											text={
												localizationConstants.purchaseGanttColObject
											}
										/>
									</th>
									<th
										rowSpan={2}
										className="w-40 border-r border-slate-200 p-3 align-middle text-xs font-semibold text-slate-900"
									>
										<Translate
											text={
												localizationConstants.purchaseGanttColConnection
											}
										/>
									</th>
									<th
										rowSpan={2}
										className="w-44 border-r border-slate-200 p-3 align-middle text-xs font-semibold text-slate-900"
									>
										<Translate
											text={
												localizationConstants.purchaseColOrderer
											}
										/>
									</th>

									{groups.map((group) => (
										<th
											key={group.key}
											colSpan={group.columnSpan}
											className="border-r border-slate-200 p-2 text-center text-xs font-semibold text-slate-900 last:border-r-0"
										>
											{zoom === "day" ? (
												<>
													<Translate
														text={
															localizationConstants.purchaseGanttWeekAbbrev
														}
													/>{" "}
													{group.label}
												</>
											) : (
												group.label
											)}
										</th>
									))}
								</tr>

								<tr className="border-b border-slate-200 bg-white">
									{columns.map((column) => (
										<th
											key={column.key}
											className="h-7 border-r border-slate-100 text-center text-[11px] font-medium text-slate-700 last:border-r-0"
										>
											{column.label}
										</th>
									))}
								</tr>
							</thead>

							<tbody>
								{renderRows.length === 0 ? (
									<tr>
										<td
											colSpan={4 + columnCount}
											className="py-12 text-center text-sm text-slate-500"
										>
											<Translate
												text={
													localizationConstants.purchaseGanttNoRows
												}
											/>
										</td>
									</tr>
								) : (
									renderRows.map((entry) => {
										const { row, depth } = entry;
										const colors = BAR_COLORS[row.status];

										return (
											<tr
												key={row.id}
												className="group border-b border-slate-200 last:border-b-0"
											>
												<td className="py-1.5 pr-0 pl-2">
													<div
														className={cn(
															BAND_CELL,
															"rounded-l-md px-2.5 text-xs font-normal text-slate-900",
														)}
													>
														<div className="flex items-center gap-1">
															{entry.hasChildren ? (
																<button
																	type="button"
																	onClick={() =>
																		toggleRow(
																			row.id,
																		)
																	}
																	aria-expanded={
																		entry.isExpanded
																	}
																	aria-label={t(
																		localizationConstants.purchaseGanttExpandRow,
																	)}
																	className="cursor-pointer rounded p-0.5 text-slate-500 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:outline-none"
																>
																	{entry.isExpanded ? (
																		<ChevronDown className="h-3.5 w-3.5" />
																	) : (
																		<ChevronRight className="h-3.5 w-3.5" />
																	)}
																</button>
															) : (
																<span
																	className={cn(
																		"inline-block",
																		depth ===
																			1
																			? "w-6"
																			: "w-4.5",
																	)}
																/>
															)}
															<span>
																{row.purchaseNo}
															</span>
														</div>
													</div>
												</td>

												<td className="px-0 py-1.5">
													<div
														className={cn(
															BAND_CELL,
															"max-w-[170px] truncate px-2.5 text-xs font-medium text-slate-900",
														)}
													>
														{row.objectName}
													</div>
												</td>

												<td className="px-0 py-1.5">
													<div
														className={cn(
															BAND_CELL,
															"px-2.5 text-xs text-slate-700",
														)}
													>
														{row.connection}
													</div>
												</td>

												<td className="px-0 py-1.5">
													<div
														className={cn(
															BAND_CELL,
															"justify-between gap-1 px-2.5 text-xs text-slate-700",
														)}
													>
														<span className="truncate">
															{row.orderer}
														</span>
														<Tooltip>
															<TooltipTrigger
																asChild
															>
																<button
																	type="button"
																	aria-label={t(
																		localizationConstants.purchaseGanttDetails,
																	)}
																	className="cursor-pointer rounded-full text-slate-400 hover:text-slate-700 focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:outline-none"
																>
																	<Info className="h-4 w-4" />
																</button>
															</TooltipTrigger>
															<TooltipContent className="max-w-xs">
																<GanttDetails
																	row={row}
																/>
															</TooltipContent>
														</Tooltip>
													</div>
												</td>

												<td
													colSpan={columnCount}
													className="py-1.5 pr-2 pl-0"
												>
													<Tooltip>
														<TooltipTrigger asChild>
															<div className="cursor-pointer">
																<PurchaseGanttGrid
																	columnCount={
																		columnCount
																	}
																	planned={{
																		left: entry.plannedLeft,
																		width: entry.plannedWidth,
																	}}
																	actual={{
																		left: entry.actualLeft,
																		width: entry.actualWidth,
																	}}
																	colors={
																		colors
																	}
																	todayPercent={
																		todayPercent
																	}
																/>
															</div>
														</TooltipTrigger>
														<TooltipContent className="max-w-xs">
															<GanttDetails
																row={row}
															/>
														</TooltipContent>
													</Tooltip>
												</td>
											</tr>
										);
									})
								)}
							</tbody>
						</table>
					</div>
				</div>

				{/* Pagination */}
				<div className="flex flex-wrap items-center justify-center gap-6 px-1 py-2 text-sm text-slate-600 sm:justify-end">
					<div className="flex items-center gap-2">
						<span className="text-sm font-medium text-slate-700">
							<Translate
								text={localizationConstants.rowsPerPage}
							/>
						</span>
						<Select
							value={String(pageSize)}
							onValueChange={(value) => {
								setPageSize(Number(value));
								setCurrentPage(1);
							}}
						>
							<SelectTrigger className="h-9 w-18 border-slate-200 bg-transparent text-sm font-medium text-slate-700 hover:bg-slate-50 focus:ring-0">
								<SelectValue />
							</SelectTrigger>
							<SelectContent className="bg-white">
								{[5, 10, 20, 30, 50].map((size) => (
									<SelectItem
										key={size}
										value={String(size)}
									>
										{size}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="flex items-center gap-1 text-sm font-medium text-slate-700 select-none">
						<span>
							<Translate text={localizationConstants.pageLabel} />
						</span>
						<span>{currentPage}</span>
						<span>
							<Translate text={localizationConstants.ofLabel} />
						</span>
						<span>{totalPages}</span>
					</div>

					<div className="flex items-center gap-1">
						<Button
							variant="outline"
							size="icon"
							className="h-9 w-9 cursor-pointer rounded-md border border-slate-200 bg-transparent text-slate-600 hover:bg-slate-50 disabled:opacity-40"
							disabled={currentPage <= 1}
							onClick={() => setCurrentPage(1)}
						>
							<ChevronsLeft className="h-4 w-4" />
						</Button>
						<Button
							variant="outline"
							size="icon"
							className="h-9 w-9 cursor-pointer rounded-md border border-slate-200 bg-transparent text-slate-600 hover:bg-slate-50 disabled:opacity-40"
							disabled={currentPage <= 1}
							onClick={() =>
								setCurrentPage((previous) =>
									Math.max(1, previous - 1),
								)
							}
						>
							<ChevronLeft className="h-4 w-4" />
						</Button>
						<Button
							variant="outline"
							size="icon"
							className="h-9 w-9 cursor-pointer rounded-md border border-slate-200 bg-transparent text-slate-600 hover:bg-slate-50 disabled:opacity-40"
							disabled={currentPage >= totalPages}
							onClick={() =>
								setCurrentPage((previous) =>
									Math.min(totalPages, previous + 1),
								)
							}
						>
							<ChevronRight className="h-4 w-4" />
						</Button>
						<Button
							variant="outline"
							size="icon"
							className="h-9 w-9 cursor-pointer rounded-md border border-slate-200 bg-transparent text-slate-600 hover:bg-slate-50 disabled:opacity-40"
							disabled={currentPage >= totalPages}
							onClick={() => setCurrentPage(totalPages)}
						>
							<ChevronsRight className="h-4 w-4" />
						</Button>
					</div>
				</div>
			</div>
		</TooltipProvider>
	);
}

export default PurchaseGanttTab;
