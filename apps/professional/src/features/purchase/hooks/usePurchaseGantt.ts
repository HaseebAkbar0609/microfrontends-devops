"use client";

import { useMemo, useState } from "react";
import {
	addDays,
	differenceInCalendarDays,
	eachMonthOfInterval,
	eachWeekOfInterval,
	endOfISOWeek,
	endOfMonth,
	format,
	getISOWeek,
	parseISO,
	startOfISOWeek,
	startOfMonth,
} from "date-fns";
import { enUS, sv } from "date-fns/locale";
import { useTranslation } from "react-i18next";

import {
	MOCK_PURCHASE_GANTT,
	PURCHASE_GANTT_ANCHOR,
} from "../data/purchaseGantt.mock";
import type {
	PurchaseGanttRow,
	PurchaseGanttZoom,
} from "../types/purchase.types";

/** A single timeline column: one day, one ISO week or one month. */
export interface GanttColumn {
	key: string;
	label: string;
	start: Date;
	/** Days the column covers; partial weeks and months at the edges are shorter. */
	days: number;
}

/** The header band above the columns: weeks over days, months over weeks. */
export interface GanttColumnGroup {
	key: string;
	label: string;
	/** Number of leaf columns beneath, used directly as the header colSpan. */
	columnSpan: number;
}

/** A row flattened for rendering, with bar geometry as percentages. */
export interface GanttRenderRow {
	row: PurchaseGanttRow;
	depth: 0 | 1;
	hasChildren: boolean;
	isExpanded: boolean;
	/** Pale track: order date through estimated delivery. */
	plannedLeft: number;
	plannedWidth: number;
	/** Solid bar: delivery through monitoring. */
	actualLeft: number;
	actualWidth: number;
}

/** Weeks shown by the day zoom when no explicit range is picked. */
const DAY_ZOOM_WEEKS = 6;

/**
 * Timeline state for the purchase Gantt: search, status filter, explicit date
 * range, zoom and row expansion.
 *
 * Bars are positioned in *column* fractions rather than day fractions, so they
 * stay aligned with the evenly-sized table columns even at week and month zoom
 * where the underlying periods differ in length.
 */
export function usePurchaseGantt(
	initialRows: PurchaseGanttRow[] = MOCK_PURCHASE_GANTT,
) {
	const { i18n } = useTranslation();
	const locale = i18n.language?.startsWith("sv") ? sv : enUS;

	const [rows] = useState<PurchaseGanttRow[]>(initialRows);
	const [zoom, setZoom] = useState<PurchaseGanttZoom>("day");
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState<string>("all");
	const [rangeFrom, setRangeFrom] = useState<string>("");
	const [rangeTo, setRangeTo] = useState<string>("");
	const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>(
		{},
	);
	const [pageSize, setPageSize] = useState(10);
	const [currentPage, setCurrentPage] = useState(1);

	const toggleRow = (id: string) =>
		setExpandedRows((previous) => ({ ...previous, [id]: !previous[id] }));

	const resetRange = () => {
		setRangeFrom("");
		setRangeTo("");
	};

	const filteredRows = useMemo(() => {
		const query = searchQuery.trim().toLowerCase();

		return rows.filter((row) => {
			if (query) {
				const haystack = [
					row.purchaseNo,
					row.objectName,
					row.connection,
					row.orderer,
				];
				if (
					!haystack.some((field) =>
						field.toLowerCase().includes(query),
					)
				) {
					return false;
				}
			}

			if (statusFilter !== "all" && row.status !== statusFilter) {
				return false;
			}

			// A row is in range when its span overlaps the requested period.
			if (rangeFrom && row.monitoring < rangeFrom) return false;
			if (rangeTo && row.orderDate > rangeTo) return false;

			return true;
		});
	}, [rows, searchQuery, statusFilter, rangeFrom, rangeTo]);

	const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
	const pagedRows = useMemo(() => {
		const start = (currentPage - 1) * pageSize;
		return filteredRows.slice(start, start + pageSize);
	}, [filteredRows, currentPage, pageSize]);

	/**
	 * Window covering the visible bars, snapped outward to whole columns.
	 *
	 * Week and month zooms span the whole data range. Day zoom would need ~190
	 * columns for the same range, so it opens on a short window around the
	 * anchor and widens only when a range is picked explicitly.
	 */
	const window = useMemo(() => {
		const source = pagedRows.length > 0 ? pagedRows : rows;
		const starts = source.map((row) => parseISO(row.orderDate).getTime());
		const ends = source.map((row) => parseISO(row.monitoring).getTime());

		let start = new Date(Math.min(...starts));
		let end = new Date(Math.max(...ends));

		if (zoom === "day" && !rangeFrom && !rangeTo) {
			const anchor = parseISO(PURCHASE_GANTT_ANCHOR);
			start = startOfISOWeek(addDays(anchor, -7));
			end = endOfISOWeek(addDays(start, DAY_ZOOM_WEEKS * 7 - 1));
		} else {
			if (rangeFrom) start = parseISO(rangeFrom);
			if (rangeTo) end = parseISO(rangeTo);

			if (zoom === "month") {
				start = startOfMonth(start);
				end = endOfMonth(end);
			} else {
				start = startOfISOWeek(start);
				end = endOfISOWeek(end);
			}
		}

		return { start, end };
	}, [pagedRows, rows, zoom, rangeFrom, rangeTo]);

	const { columns, groups, superGroups } = useMemo(() => {
		const { start, end } = window;

		if (zoom === "day") {
			const dayColumns: GanttColumn[] = [];
			const weekGroups: GanttColumnGroup[] = [];
			const monthBand: GanttColumnGroup[] = [];

			eachWeekOfInterval({ start, end }, { weekStartsOn: 1 }).forEach(
				(weekStart) => {
					let columnsInWeek = 0;

					for (let day = 0; day < 7; day++) {
						const date = addDays(weekStart, day);
						if (date < start || date > end) continue;
						columnsInWeek += 1;
						dayColumns.push({
							key: format(date, "yyyy-MM-dd"),
							label: format(date, "d"),
							start: date,
							days: 1,
						});

						// Month band across the top, as in the design.
						const monthLabel = format(date, "LLLL yyyy", {
							locale,
						});
						const lastMonth = monthBand[monthBand.length - 1];
						if (lastMonth && lastMonth.label === monthLabel) {
							lastMonth.columnSpan += 1;
						} else {
							monthBand.push({
								key: `${monthLabel}-${dayColumns.length}`,
								label: monthLabel,
								columnSpan: 1,
							});
						}
					}

					if (columnsInWeek > 0) {
						weekGroups.push({
							key: `w-${format(weekStart, "yyyy-ww")}`,
							label: String(getISOWeek(weekStart)),
							columnSpan: columnsInWeek,
						});
					}
				},
			);

			return {
				columns: dayColumns,
				groups: weekGroups,
				superGroups: monthBand,
			};
		}

		if (zoom === "week") {
			const weekColumns: GanttColumn[] = [];
			const monthGroups: GanttColumnGroup[] = [];

			eachWeekOfInterval({ start, end }, { weekStartsOn: 1 }).forEach(
				(weekStart) => {
					const weekEnd = endOfISOWeek(weekStart);
					const from = weekStart < start ? start : weekStart;
					const to = weekEnd > end ? end : weekEnd;
					const days = differenceInCalendarDays(to, from) + 1;
					if (days <= 0) return;

					weekColumns.push({
						key: format(weekStart, "yyyy-ww"),
						label: String(getISOWeek(weekStart)),
						start: from,
						days,
					});

					const label = format(from, "LLLL yyyy", { locale });
					const last = monthGroups[monthGroups.length - 1];
					if (last && last.label === label) {
						last.columnSpan += 1;
					} else {
						monthGroups.push({
							key: `${label}-${weekColumns.length}`,
							label,
							columnSpan: 1,
						});
					}
				},
			);

			return { columns: weekColumns, groups: monthGroups, superGroups: [] };
		}

		const monthColumns: GanttColumn[] = [];
		const yearGroups: GanttColumnGroup[] = [];

		eachMonthOfInterval({ start, end }).forEach((monthStart) => {
			const monthEnd = endOfMonth(monthStart);
			const from = monthStart < start ? start : monthStart;
			const to = monthEnd > end ? end : monthEnd;
			const days = differenceInCalendarDays(to, from) + 1;
			if (days <= 0) return;

			monthColumns.push({
				key: format(monthStart, "yyyy-MM"),
				label: format(monthStart, "LLL", { locale }),
				start: from,
				days,
			});

			const label = format(monthStart, "yyyy");
			const last = yearGroups[yearGroups.length - 1];
			if (last && last.label === label) {
				last.columnSpan += 1;
			} else {
				yearGroups.push({ key: label, label, columnSpan: 1 });
			}
		});

		return { columns: monthColumns, groups: yearGroups, superGroups: [] };
	}, [window, zoom, locale]);

	/**
	 * Position of a date measured in columns, so a value of 2.5 sits halfway
	 * through the third column. Dates before or after the window clamp to the
	 * respective edge.
	 */
	const dateToColumnOffset = useMemo(() => {
		return (date: Date): number => {
			for (let index = 0; index < columns.length; index++) {
				const column = columns[index];
				if (date < column.start) return index;
				const daysIn = differenceInCalendarDays(date, column.start);
				if (daysIn < column.days) {
					return index + daysIn / column.days;
				}
			}
			return columns.length;
		};
	}, [columns]);

	const renderRows = useMemo<GanttRenderRow[]>(() => {
		const totalColumns = columns.length;

		/** Clamp a span to the window and express it as percentages. */
		const span = (fromISO: string, toISO: string) => {
			if (totalColumns === 0) return { left: 0, width: 0 };

			const from = dateToColumnOffset(parseISO(fromISO));
			// End dates are inclusive, so measure to the start of the next day.
			const to = dateToColumnOffset(addDays(parseISO(toISO), 1));

			const left = Math.max(0, Math.min(totalColumns, from));
			const right = Math.max(0, Math.min(totalColumns, to));
			if (right <= left) return { left: 0, width: 0 };

			return {
				left: (left / totalColumns) * 100,
				width: ((right - left) / totalColumns) * 100,
			};
		};

		const geometry = (row: PurchaseGanttRow, depth: 0 | 1) => {
			const planned = span(row.orderDate, row.estimatedDelivery);
			const actual = span(row.delivery, row.monitoring);

			return {
				row,
				depth,
				hasChildren: !!row.children?.length,
				isExpanded: !!expandedRows[row.id],
				plannedLeft: planned.left,
				plannedWidth: planned.width,
				actualLeft: actual.left,
				actualWidth: actual.width,
			};
		};

		return pagedRows.flatMap((row) => {
			const parent = geometry(row, 0);
			if (!parent.isExpanded || !row.children?.length) return [parent];
			return [parent, ...row.children.map((child) => geometry(child, 1))];
		});
	}, [pagedRows, columns, dateToColumnOffset, expandedRows]);

	/** Percentage offset of the anchor date, or null when it is off-window. */
	const todayPercent = useMemo(() => {
		if (columns.length === 0) return null;
		const today = parseISO(PURCHASE_GANTT_ANCHOR);
		if (today < window.start || today > window.end) return null;
		return (dateToColumnOffset(today) / columns.length) * 100;
	}, [columns, dateToColumnOffset, window]);

	return {
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
		totalCount: filteredRows.length,
		totalPages,
		currentPage,
		setCurrentPage,
		pageSize,
		setPageSize,
	};
}
