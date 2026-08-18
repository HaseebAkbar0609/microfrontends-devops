"use client";

import { type RefObject, useEffect, useMemo, useRef, useState } from "react";
import {
	Archive,
	ArrowUpDown,
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
	MoreVertical,
	Pencil,
	Plus,
	Search,
	SlidersHorizontal,
	Star,
	Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { sortItems } from "@/utils/tableSort";
import { useTableSort } from "@/hooks/useTableSort";
import type { KmaItem, KmaMallGruppItem, KmaStatus, KmaType, KmaSecureStatus } from "../types/overview";
import { MOCK_KMA_MALL_GRUPP } from "../constants/overviewMock";

// Constants

const ROWS_PER_PAGE = 10;

const GANTT_MONTHS = [
	"Jan", "Feb", "Mar", "Apr", "May", "Jun",
	"Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const GANTT_YEAR = 2026;

const STATUS_FILTER_VALUES: KmaStatus[] = ["ongoing", "overdue", "done"];

// Utility

function statusBadgeClass(status: KmaStatus): string {
	if (status === "ongoing") return "bg-emerald-100 text-emerald-700";
	if (status === "overdue") return "bg-red-100 text-red-700";
	return "bg-slate-100 text-slate-600";
}

function secureStatusDot(status: KmaSecureStatus): string {
	if (status === "ok") return "bg-emerald-500";
	if (status === "warning") return "bg-amber-500";
	return "bg-red-500";
}

// Sub-components

interface PaginationProps {
	page: number;
	totalPages: number;
	onPageChange: (p: number) => void;
}

function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
	return (
		<div className="flex items-center justify-between border-t border-slate-200 px-5 py-3 text-sm text-slate-600">
			<div className="flex items-center gap-2">
				<Translate text={localizationConstants.rowsPerPageLabel} />
				<span className="flex h-8 w-12 items-center justify-between rounded border border-slate-200 px-2 text-sm">
					{ROWS_PER_PAGE}
					<ChevronDown className="h-3 w-3 text-slate-400" />
				</span>
			</div>
			<div className="flex items-center gap-3">
				<span>
					Page {page} of {totalPages}
				</span>
				<div className="flex items-center gap-1">
					<Button aria-label="First page" variant="ghost" size="sm" className="h-7 w-7 cursor-pointer p-0" onClick={() => onPageChange(1)} disabled={page === 1}><ChevronsLeft className="h-4 w-4" /></Button>
					<Button aria-label="Previous page" variant="ghost" size="sm" className="h-7 w-7 cursor-pointer p-0" onClick={() => onPageChange(page - 1)} disabled={page === 1}><ChevronLeft className="h-4 w-4" /></Button>
					<Button aria-label="Next page" variant="ghost" size="sm" className="h-7 w-7 cursor-pointer p-0" onClick={() => onPageChange(page + 1)} disabled={page === totalPages}><ChevronRight className="h-4 w-4" /></Button>
					<Button aria-label="Last page" variant="ghost" size="sm" className="h-7 w-7 cursor-pointer p-0" onClick={() => onPageChange(totalPages)} disabled={page === totalPages}><ChevronsRight className="h-4 w-4" /></Button>
				</div>
			</div>
		</div>
	);
}

interface CreateDropdownProps {
	open: boolean;
	onToggle: () => void;
	dropdownRef: RefObject<HTMLDivElement | null>;
}

function CreateDropdown({ open, onToggle, dropdownRef }: CreateDropdownProps) {
	useEffect(() => {
		function handleClickOutside(e: MouseEvent) {
			if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
				if (open) onToggle();
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [open, onToggle, dropdownRef]);

	return (
		<div className="relative" ref={dropdownRef}>
			<button
				type="button"
				onClick={onToggle}
				className="flex h-10 min-w-36 cursor-pointer items-center gap-2 rounded-md bg-[#18181B] px-4 text-sm font-medium text-white shadow-sm hover:bg-zinc-800"
			>
				<Plus className="h-5 w-5" />
				<Translate text={localizationConstants.kmaListCreateBtn} />
			</button>
			{open && (
				<div className="absolute right-0 z-20 mt-1 w-52 rounded-md border border-slate-200 bg-white py-1 shadow-md">
					<button
						type="button"
						className="w-full cursor-pointer px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
					>
						<Translate text={localizationConstants.kmaListCreateNew} />
					</button>
					<button
						type="button"
						className="w-full cursor-pointer px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
					>
						<Translate text={localizationConstants.kmaListUseGroup} />
					</button>
				</div>
			)}
		</div>
	);
}

// TypeBadge

function TypeBadge({ type, label }: { type: KmaType; label: string }) {
	return (
		<span
			className={cn(
				"inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
				type === "order"
					? "bg-[#0F172A] text-[#F8FAFC]"
					: "bg-[#F1F5F9] text-[#0F172A]",
			)}
		>
			{label}
		</span>
	);
}

// KMA List Tab

type SortField = keyof Pick<
	KmaItem,
	"id" | "object" | "description" | "startDate" | "customer" | "responsible"
>;

interface KmaListTabProps {
	items: KmaItem[];
}

function KmaListTab({ items }: KmaListTabProps) {
	const t = useTranslate();
	const [page, setPage] = useState(1);
	const [typeOrder, setTypeOrder] = useState(true);
	const [typeProject, setTypeProject] = useState(true);
	const [statusFilter, setStatusFilter] = useState<KmaStatus | "">("");
	const [startDateFilter, setStartDateFilter] = useState("");
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const { sortField, sortDir, toggleSort } = useTableSort<SortField>();

	const filtered = useMemo(() => {
		return items.filter((item) => {
			const matchType =
				(item.type === "order" && typeOrder) ||
				(item.type === "project" && typeProject);
			const matchStatus = statusFilter ? item.status === statusFilter : true;
			const matchDate = startDateFilter ? item.startDate >= startDateFilter : true;
			return matchType && matchStatus && matchDate;
		});
	}, [items, typeOrder, typeProject, statusFilter, startDateFilter]);

	const sorted = useMemo(
		() => sortItems(filtered, sortField, sortDir, (r, f) => r[f as SortField]),
		[filtered, sortField, sortDir],
	);

	const totalPages = Math.max(1, Math.ceil(sorted.length / ROWS_PER_PAGE));
	const paginated = sorted.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);

	function statusLabel(s: KmaStatus): string {
		if (s === "ongoing") return t(localizationConstants.kmaListStatusPagaende);
		if (s === "overdue") return t(localizationConstants.kmaListStatusForfallt);
		return t(localizationConstants.kmaListStatusDone);
	}

	function handleReset() {
		setTypeOrder(true);
		setTypeProject(true);
		setStatusFilter("");
		setStartDateFilter("");
		setPage(1);
	}

	const TH_BTN =
		"flex cursor-pointer select-none items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-800 whitespace-nowrap";

	return (
		<div className="flex flex-1 flex-col overflow-hidden">
			{/* Figma toolbar - h-[86px], px-5, gap-5 */}
			<div className="flex items-center gap-5 border-b border-slate-200 px-5" style={{ minHeight: 86 }}>

				{/* Type checkboxes section */}
				<div className="flex w-50 shrink-0 flex-col gap-2">
					<p className="text-sm font-medium text-[#09090B]">
						<Translate text={localizationConstants.kmaListFilterType} />
					</p>
					<div className="flex items-center gap-6">
						<label className="flex cursor-pointer items-center gap-2">
							<span className="relative flex h-4 w-4 items-center justify-center">
								<input
									type="checkbox"
									checked={typeOrder}
									onChange={(e) => { setTypeOrder(e.target.checked); setPage(1); }}
									className="peer sr-only"
								/>
								<span
									className={cn(
										"flex h-4 w-4 items-center justify-center rounded border-0",
										typeOrder
											? "bg-[#18181B] shadow-sm"
											: "border border-slate-300 bg-white",
									)}
								>
									{typeOrder && (
										<svg width="10" height="8" viewBox="0 0 10 8" fill="none">
											<path d="M1 4L3.5 6.5L9 1" stroke="#FAFAFA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
										</svg>
									)}
								</span>
							</span>
							<span className="text-sm font-medium text-[#09090B]">
								<Translate text={localizationConstants.kmaListTypeOrder} />
							</span>
						</label>
						<label className="flex cursor-pointer items-center gap-2">
							<span className="relative flex h-4 w-4 items-center justify-center">
								<input
									type="checkbox"
									checked={typeProject}
									onChange={(e) => { setTypeProject(e.target.checked); setPage(1); }}
									className="peer sr-only"
								/>
								<span
									className={cn(
										"flex h-4 w-4 items-center justify-center rounded border-0",
										typeProject
											? "bg-[#18181B] shadow-sm"
											: "border border-slate-300 bg-white",
									)}
								>
									{typeProject && (
										<svg width="10" height="8" viewBox="0 0 10 8" fill="none">
											<path d="M1 4L3.5 6.5L9 1" stroke="#FAFAFA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
										</svg>
									)}
								</span>
							</span>
							<span className="text-sm font-medium text-[#09090B]">
								<Translate text={localizationConstants.kmaListTypeProject} />
							</span>
						</label>
					</div>
				</div>

				{/* Vertical separator */}
				<div className="h-15.5 w-px shrink-0 bg-slate-200" />

				{/* Filter dropdowns */}
				<div className="flex flex-1 items-end gap-3 pb-0">
					{/* Status combobox */}
					<div className="flex flex-col gap-1">
						<label className="text-sm font-medium text-[#09090B]">
							<Translate text={localizationConstants.statusHeader} />
						</label>
						<div className="relative">
							<select
								value={statusFilter}
								onChange={(e) => { setStatusFilter(e.target.value as KmaStatus | ""); setPage(1); }}
								className="h-9 w-30 cursor-pointer appearance-none rounded-md border border-[#E4E4E7] bg-white py-2 pl-3 pr-8 text-sm text-[#09090B] shadow-[0_1px_2px_rgba(16,24,40,0.05)] focus:outline-none"
							>
								<option value="">{t(localizationConstants.statusHeader)}</option>
								{STATUS_FILTER_VALUES.map((v) => (
									<option key={v} value={v}>{statusLabel(v)}</option>
								))}
							</select>
							<ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-[#71717A]" />
						</div>
					</div>

					{/* Start date filter */}
					<div className="flex flex-col gap-1">
						<label className="text-sm font-medium text-[#09090B]">
							<Translate text={localizationConstants.kmaListColStartDate} />
						</label>
						<div className="relative">
							<input
								type="date"
								value={startDateFilter}
								onChange={(e) => { setStartDateFilter(e.target.value); setPage(1); }}
								className="h-9 w-50 cursor-pointer rounded-md border border-[#E4E4E7] bg-white px-3 text-sm text-[#71717A] shadow-[0_1px_2px_rgba(16,24,40,0.05)] focus:outline-none"
							/>
						</div>
					</div>

					{/* SÃ¶k / Reset button */}
					<button
						type="button"
						onClick={handleReset}
						className="h-9 cursor-pointer rounded-md border border-slate-200 bg-white px-4 text-sm font-medium text-[#A1A1AA] hover:border-slate-300 hover:text-slate-500"
					>
						<Translate text={localizationConstants.kmaListResetAll} />
					</button>
				</div>

				{/* Create KMA button */}
				<div className="flex shrink-0 items-end pb-0">
					<CreateDropdown
						open={dropdownOpen}
						onToggle={() => setDropdownOpen((v) => !v)}
						dropdownRef={dropdownRef}
					/>
				</div>
			</div>

			{/* Table wrapper */}
			<div className="flex-1 overflow-auto px-5 py-4">
				<div className="overflow-x-auto rounded-lg border border-[#E2E8F0] bg-white">
					<table className="w-full min-w-max border-collapse text-sm">
						<thead>
							<tr className="border-b border-[#E2E8F0]">
								<th className="h-12 px-0">
									<button type="button" onClick={() => toggleSort("id")} className={TH_BTN}>
										<Translate text={localizationConstants.kmaListColId} />
										<ArrowUpDown className="h-4 w-4 text-slate-400" />
									</button>
								</th>
								<th className="h-12 px-0">
									<button type="button" onClick={() => toggleSort("object")} className={TH_BTN}>
										<Translate text={localizationConstants.kmaListColObject} />
										<ArrowUpDown className="h-4 w-4 text-slate-400" />
									</button>
								</th>
								<th className="h-12 px-0">
									<button type="button" onClick={() => toggleSort("description")} className={TH_BTN}>
										<Translate text={localizationConstants.kmaListColDesc} />
										<ArrowUpDown className="h-4 w-4 text-slate-400" />
									</button>
								</th>
								<th className="h-12 px-0">
									<button type="button" onClick={() => toggleSort("startDate")} className={TH_BTN}>
										<Translate text={localizationConstants.kmaListColStartDate} />
										<ArrowUpDown className="h-4 w-4 text-slate-400" />
									</button>
								</th>
								<th className="h-12 px-0">
									<button type="button" onClick={() => toggleSort("customer")} className={TH_BTN}>
										<Translate text={localizationConstants.kmaListColCustomer} />
										<ArrowUpDown className="h-4 w-4 text-slate-400" />
									</button>
								</th>
								<th className="h-12 px-0">
									<button type="button" onClick={() => toggleSort("responsible")} className={TH_BTN}>
										<Translate text={localizationConstants.kmaListColResponsible} />
										<ArrowUpDown className="h-4 w-4 text-slate-400" />
									</button>
								</th>
								<th className="h-12 whitespace-nowrap px-4 text-left text-sm font-medium text-slate-500">
									<Translate text={localizationConstants.kmaListColActivities} />
								</th>
								<th className="h-12 whitespace-nowrap px-4 text-left text-sm font-medium text-slate-500">
									<Translate text={localizationConstants.kmaListColSecureCheck} />
								</th>
								<th className="h-12 whitespace-nowrap px-4 text-left text-sm font-medium text-slate-500">
									<Translate text={localizationConstants.kmaListColSecureStatus} />
								</th>
								<th className="h-12 whitespace-nowrap px-4 text-left text-sm font-medium text-slate-500">
									<Translate text={localizationConstants.kmaListColSafetyRound} />
								</th>
								<th className="h-12 w-10 px-2" />
							</tr>
						</thead>
						<tbody>
							{paginated.length === 0 ? (
								<tr>
									<td colSpan={11} className="h-32 text-center text-sm text-slate-400">
										<Translate text={localizationConstants.noDataFound} />
									</td>
								</tr>
							) : (
								paginated.map((item) => (
									<tr key={item.id} className="border-b border-[#E2E8F0] last:border-b-0 hover:bg-slate-50">
										<td className="h-14 px-4 text-sm text-[#020617]">
											<TypeBadge
												type={item.type}
												label={item.type === "order" ? t(localizationConstants.kmaListTypeOrder) : t(localizationConstants.kmaListTypeProject)}
											/>
										</td>
										<td className="h-14 px-4 text-sm font-semibold text-[#020617]">{item.object}</td>
										<td className="h-14 px-4 text-sm font-semibold text-[#020617]">{item.description}</td>
										<td className="h-14 whitespace-nowrap px-4 text-sm text-[#020617]">{item.startDate}</td>
										<td className="h-14 px-4 text-sm text-[#020617]">{item.customer}</td>
										<td className="h-14 px-4 text-sm text-[#020617]">{item.responsible}</td>
										<td className="h-14 whitespace-nowrap px-4 text-sm text-[#020617]">
											{item.activitiesCompleted} / {item.activitiesTotal}
										</td>
										<td className="h-14 px-4 text-sm text-[#020617]">{item.secureCheck}</td>
										<td className="h-14 px-4">
											<span className="inline-flex items-center gap-1.5">
												<span
													className={cn(
														"h-2 w-2 rounded-full shrink-0",
														secureStatusDot(item.secureStatus),
													)}
												/>
												<span
													className={cn(
														"inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
														statusBadgeClass(item.status),
													)}
												>
													{statusLabel(item.status)}
												</span>
											</span>
										</td>
										<td className="h-14 px-4 text-sm text-[#020617]">{item.safetyRounds}</td>
										<td className="h-14 px-2">
											<button
												type="button"
												className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700"
											>
												<MoreVertical className="h-4 w-4" />
											</button>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			</div>

			<Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
		</div>
	);
}

// Gantt Tab

interface TooltipState {
	item: KmaItem;
	x: number;
	y: number;
}

interface GanttTabProps {
	items: KmaItem[];
}

function ganttItemColor(item: KmaItem): string {
	if (item.status === "overdue") return "#CA8A04";
	if (item.type === "project") return "#1D4ED8";
	return "#16A34A";
}

function monthOffset(dateStr: string): number {
	const d = new Date(dateStr);
	return (d.getFullYear() - GANTT_YEAR) * 12 + d.getMonth();
}

interface GanttBarInfo {
	present: boolean;
	isStart: boolean;
	isEnd: boolean;
}

function getGanttBarInfo(item: KmaItem, mIdx: number): GanttBarInfo {
	const start = monthOffset(item.startDate);
	const end = monthOffset(item.endDate);
	const present = mIdx >= start && mIdx <= end;
	return { present, isStart: present && mIdx === start, isEnd: present && mIdx === end };
}

function GanttTab({ items }: GanttTabProps) {
	const t = useTranslate();
	const [tooltip, setTooltip] = useState<TooltipState | null>(null);
	const [search, setSearch] = useState("");

	const filtered = search.trim()
		? items.filter(
				(item) =>
					item.object.toLowerCase().includes(search.toLowerCase()) ||
					item.customer.toLowerCase().includes(search.toLowerCase()),
		  )
		: items;

	return (
		<div className="flex flex-1 flex-col overflow-hidden">
			{/* Toolbar - h-16, px-5, py-3, justify-between */}
			<div
				className="flex items-center justify-between border-b border-slate-200 px-5"
				style={{ height: 64, paddingTop: 12, paddingBottom: 12 }}
			>
				{/* Left: search + view selector */}
				<div className="flex items-center gap-2">
					{/* Search input - bottom-border only, no radius */}
					<div
						className="flex items-center gap-2 px-3"
						style={{
							width: 300,
							height: 40,
							borderBottom: "1px solid #E2E8F0",
							borderRadius: 0,
						}}
					>
						<Search className="h-4 w-4 shrink-0 text-[#020617] opacity-50" />
						<input
							type="text"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder={t(localizationConstants.kmaListGanttControl)}
							className="flex-1 bg-transparent text-sm text-[#020617] placeholder:text-[#020617] placeholder:opacity-50 focus:outline-none"
						/>
					</div>

					{/* View selector button */}
					<button
						type="button"
						className="flex cursor-pointer items-center justify-center gap-1 rounded-md border border-[#E2E8F0] px-2 text-sm font-medium text-[#0F172A]"
						style={{ width: 75, height: 36 }}
					>
						<span className="truncate">{t(localizationConstants.kmaListTabGantt)}</span>
						<ChevronDown className="h-4 w-4 shrink-0" />
					</button>
				</div>
			</div>

			{/* Schedule block - px-5 pb-4, rounded-lg border rgba(71,85,105,0.1) */}
			<div className="flex-1 overflow-auto px-5 pb-4 pt-3">
				<div
					className="overflow-x-auto bg-white"
					style={{ border: "1px solid rgba(71, 85, 105, 0.1)", borderRadius: 8 }}
				>
					{/* Flex-row table */}
					<div className="flex min-w-max">
						{/* Column 1 - ID/Object (128px) */}
						{/* Column 1 - ID/Object (128px) */}
						<div style={{ width: 128, flexShrink: 0 }}>
							<div className="flex h-12 items-center border-b border-[#E2E8F0] pr-4">
								<button
									type="button"
									className="flex cursor-pointer items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-[#64748B]"
								>
									<span>{t(localizationConstants.kmaListColId)}</span>
									<ArrowUpDown className="h-4 w-4" />
								</button>
							</div>
							{filtered.map((item, i) => (
								<div
									key={item.id}
									className={cn(
										"flex h-14 items-center px-4 text-sm text-[#020617]",
										i < filtered.length - 1 && "border-b border-[#E2E8F0]",
									)}
								>
									{item.id}
								</div>
							))}
						</div>

						{/* Column 2 - Customer (127px) */}
						{/* Column 2 - Customer (127px) */}
						<div style={{ width: 127, flexShrink: 0 }}>
							<div className="flex h-12 items-center border-b border-[#E2E8F0] pr-4">
								<button
									type="button"
									className="flex cursor-pointer items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-[#64748B]"
									style={{ minWidth: 127 }}
								>
									<span>{t(localizationConstants.kmaListGanttKund)}</span>
									<ArrowUpDown className="h-4 w-4" />
								</button>
							</div>
							{filtered.map((item, i) => (
								<div
									key={item.id}
									className={cn(
										"flex h-14 items-center px-4 gap-3",
										i < filtered.length - 1 && "border-b border-[#E2E8F0]",
									)}
								>
									<span className="max-w-24 truncate text-sm font-medium text-[#0F172A]">
										{item.customer}
									</span>
								</div>
							))}
						</div>

						{/* Month columns (~72px each, flex-grow) */}
						{GANTT_MONTHS.map((month, mIdx) => (
							<div key={month} className="flex flex-col" style={{ flex: 1, minWidth: 64 }}>
								{/* Month header */}
								<div className="flex h-12 items-center border-b border-[#E2E8F0] pr-4">
									<button
										type="button"
										className="flex cursor-pointer items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-[#64748B]"
									>
										{month}
									</button>
								</div>

								{/* Month cells */}
								{filtered.map((item, i) => {
									const bar = getGanttBarInfo(item, mIdx);
									const color = ganttItemColor(item);

									let pl = 0;
									let pr = 0;
									let borderRadius = "0px";

									if (bar.present) {
										if (bar.isStart && bar.isEnd) {
											pl = 4; pr = 4;
											borderRadius = "4px";
										} else if (bar.isStart) {
											pl = 4;
											borderRadius = "4px 0px 0px 4px";
										} else if (bar.isEnd) {
											pr = 4;
											borderRadius = "0px 4px 4px 0px";
										}
									}

									return (
										<div
											key={item.id}
											className={cn(
												"flex items-center",
												i < filtered.length - 1 && "border-b border-[#E2E8F0]",
											)}
											style={{
												height: 56,
												borderRight: "1px solid #F4F4F5",
												paddingTop: 8,
												paddingBottom: 8,
												paddingLeft: pl,
												paddingRight: pr,
											}}
										>
											{bar.present && (
												<div
													className="flex-1 cursor-pointer"
													style={{ height: 24, background: color, borderRadius }}
													onMouseEnter={(e) =>
														setTooltip({ item, x: e.clientX, y: e.clientY })
													}
													onMouseLeave={() => setTooltip(null)}
												/>
											)}
										</div>
									);
								})}
							</div>
						))}
					</div>
				</div>
			</div>

			{tooltip && (
				<div
					className="pointer-events-none fixed z-50 w-52 rounded-lg border border-slate-200 bg-white p-3 text-xs shadow-lg"
					style={{ left: tooltip.x + 12, top: tooltip.y - 10 }}
				>
					<p className="mb-1 font-semibold text-slate-900">{tooltip.item.object}</p>
					<p className="text-slate-600">
						<span className="font-medium">{t(localizationConstants.kmaListGanttKund)}:</span>{" "}
						{tooltip.item.customer}
					</p>
					<p className="text-slate-600">
						<span className="font-medium">{t(localizationConstants.kmaListGanttControl)}:</span>{" "}
						{tooltip.item.secureCheck}
					</p>
					<p className="text-slate-600">
						{tooltip.item.startDate} &rarr; {tooltip.item.endDate}
					</p>
				</div>
			)}
		</div>
	);
}

// Mall Grupp Tab
// Mall Grupp Tab

type MallGruppSortField = keyof Pick<KmaMallGruppItem, "id" | "title" | "version" | "lastUpdated" | "createdBy">;

function KmaMallGruppTab() {
	const t = useTranslate();
	const [search, setSearch] = useState("");
	const [items, setItems] = useState<KmaMallGruppItem[]>(MOCK_KMA_MALL_GRUPP);
	const [openMenuId, setOpenMenuId] = useState<string | null>(null);
	const [filterOpen, setFilterOpen] = useState(false);
	const [filterStarred, setFilterStarred] = useState(false);
	const [filterCreatedBy, setFilterCreatedBy] = useState("");
	const menuRef = useRef<HTMLDivElement>(null);
	const filterRef = useRef<HTMLDivElement>(null);

	const { sortField, sortDir, toggleSort } = useTableSort<MallGruppSortField>();

	useEffect(() => {
		function handleClickOutside(e: MouseEvent) {
			if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
				setOpenMenuId(null);
			}
			if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
				setFilterOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const createdByOptions = useMemo(
		() => [...new Set(items.map((i) => i.createdBy))],
		[items],
	);

	const filtered = useMemo(() => {
		const q = search.toLowerCase();
		return items.filter((item) => {
			const matchSearch =
				item.id.toLowerCase().includes(q) ||
				item.title.toLowerCase().includes(q) ||
				item.createdBy.toLowerCase().includes(q);
			const matchStarred = filterStarred ? item.starred : true;
			const matchCreatedBy = filterCreatedBy ? item.createdBy === filterCreatedBy : true;
			return matchSearch && matchStarred && matchCreatedBy;
		});
	}, [items, search, filterStarred, filterCreatedBy]);

	const sorted = useMemo(
		() => sortItems(filtered, sortField, sortDir, (r, f) => r[f as MallGruppSortField]),
		[filtered, sortField, sortDir],
	);

	// TODO: Persist via API when endpoint is available
	function toggleStar(id: string) {
		setItems((prev) =>
			prev.map((item) => (item.id === id ? { ...item, starred: !item.starred } : item)),
		);
	}

	const TH_BTN =
		"flex cursor-pointer select-none items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-800 whitespace-nowrap";

	return (
		<div className="flex flex-1 flex-col overflow-hidden">
			{/* Toolbar */}
			<div className="flex items-center justify-between gap-3 border-b border-[#E2E8F0] px-5 py-3">
				<div className="flex items-center gap-2">
					{/* Search */}
					<div className="relative">
						<Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50" style={{ color: "#020617" }} />
						<input
							type="text"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder={t(localizationConstants.search)}
							className="h-10 w-75 rounded-none border-0 border-b border-[#E2E8F0] bg-white pl-8 pr-3 text-sm text-[#020617] focus:outline-none"
						/>
					</div>
					{/* Filter */}
					<div className="relative" ref={filterRef}>
						<button
							type="button"
							onClick={() => setFilterOpen((v) => !v)}
							className="flex h-9 cursor-pointer items-center gap-1.5 rounded-md border border-[#E2E8F0] bg-white px-3 text-sm font-medium text-[#0F172A] shadow-none hover:bg-slate-50"
						>
							<SlidersHorizontal className="h-4 w-4" />
							<Translate text={localizationConstants.filter} />
							<ChevronDown className="h-4 w-4" />
						</button>
						{filterOpen && (
							<div className="absolute left-0 z-20 mt-1 w-60 rounded-md border border-slate-200 bg-white p-4 shadow-md">
								{/* Starred only */}
								<label className="mb-3 flex cursor-pointer items-center gap-2 text-sm text-slate-700">
									<input
										type="checkbox"
										checked={filterStarred}
										onChange={(e) => setFilterStarred(e.target.checked)}
										className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-slate-800"
									/>
									<Translate text={localizationConstants.kmaMallGruppFilterStarred} />
								</label>
								{/* Created by */}
								<div className="mb-3">
									<p className="mb-1 text-xs font-medium text-slate-500">
										<Translate text={localizationConstants.kmaMallGruppColCreatedBy} />
									</p>
									<select
										value={filterCreatedBy}
										onChange={(e) => setFilterCreatedBy(e.target.value)}
										className="h-8 w-full cursor-pointer rounded border border-slate-200 px-2 text-sm text-slate-700 focus:outline-none"
									>
										<option value="">{t(localizationConstants.filterAll)}</option>
										{createdByOptions.map((name) => (
											<option key={name} value={name}>{name}</option>
										))}
									</select>
								</div>
								{/* Reset */}
								<button
									type="button"
									onClick={() => { setFilterStarred(false); setFilterCreatedBy(""); setFilterOpen(false); }}
									className="w-full cursor-pointer rounded border border-slate-200 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
								>
									<Translate text={localizationConstants.resetFilter} />
								</button>
							</div>
						)}
					</div>
				</div>

				{/* Create button */}
				<button
					type="button"
					className="flex h-10 min-w-36 cursor-pointer items-center gap-2 rounded-md bg-[#18181B] px-4 text-sm font-medium text-white shadow-sm hover:bg-zinc-800"
				>
					<Plus className="h-5 w-5" />
					<Translate text={localizationConstants.kmaMallGruppCreate} />
				</button>
			</div>

			{/* Section heading + table */}
			<div className="flex-1 overflow-auto px-5 py-4">
				<h2 className="mb-4 text-lg font-semibold text-[#020617]">
					<Translate text={localizationConstants.kmaMallGruppTitle} />
				</h2>

				<div className="overflow-x-auto rounded-lg border border-[#E2E8F0] bg-white">
					<table className="w-full min-w-max border-collapse text-sm">
						<thead>
							<tr className="border-b border-[#E2E8F0]">
								{/* Star column */}
								<th className="h-12 w-10 px-3" />
								<th className="h-12 px-0">
									<button type="button" onClick={() => toggleSort("id")} className={TH_BTN}>
										<Translate text={localizationConstants.kmaMallGruppColId} />
										<ArrowUpDown className="h-4 w-4 text-slate-400" />
									</button>
								</th>
								<th className="h-12 px-0">
									<button type="button" onClick={() => toggleSort("title")} className={TH_BTN}>
										<Translate text={localizationConstants.kmaMallGruppColDoc} />
										<ArrowUpDown className="h-4 w-4 text-slate-400" />
									</button>
								</th>
								<th className="h-12 px-0">
									<button type="button" onClick={() => toggleSort("version")} className={TH_BTN}>
										<Translate text={localizationConstants.kmaMallGruppColVersion} />
										<ArrowUpDown className="h-4 w-4 text-slate-400" />
									</button>
								</th>
								<th className="h-12 px-0">
									<button type="button" onClick={() => toggleSort("lastUpdated")} className={TH_BTN}>
										<Translate text={localizationConstants.kmaMallGruppColLastUpdated} />
										<ArrowUpDown className="h-4 w-4 text-slate-400" />
									</button>
								</th>
								<th className="h-12 px-0">
									<button type="button" onClick={() => toggleSort("createdBy")} className={TH_BTN}>
										<Translate text={localizationConstants.kmaMallGruppColCreatedBy} />
										<ArrowUpDown className="h-4 w-4 text-slate-400" />
									</button>
								</th>
								{/* Add column + actions */}
								<th className="h-12 w-8 px-2 text-center">
									<button type="button" className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-slate-400 hover:bg-slate-100">
										<Plus className="h-4 w-4" />
									</button>
								</th>
								<th className="h-12 w-10 px-2" />
							</tr>
						</thead>
						<tbody>
							{sorted.length === 0 ? (
								<tr>
									<td colSpan={8} className="h-32 text-center text-sm text-slate-400">
										<Translate text={localizationConstants.noDataFound} />
									</td>
								</tr>
							) : (
								sorted.map((item) => (
									<tr key={item.id} className="border-b border-[#E2E8F0] last:border-b-0 hover:bg-slate-50">
										{/* Star */}
										<td className="h-14 px-3">
											<button
												type="button"
												onClick={() => toggleStar(item.id)}
												className="flex cursor-pointer items-center justify-center text-slate-300 hover:text-amber-400"
											>
												<Star
													className="h-4 w-4"
													fill={item.starred ? "#F59E0B" : "none"}
													stroke={item.starred ? "#F59E0B" : "currentColor"}
												/>
											</button>
										</td>
										<td className="h-14 px-4 text-sm font-semibold text-[#020617]">{item.id}</td>
										<td className="h-14 px-4 text-sm font-semibold text-[#020617]">{item.title}</td>
										<td className="h-14 px-4 text-sm text-[#020617]">{item.version}</td>
										<td className="h-14 whitespace-nowrap px-4 text-sm text-[#020617]">{item.lastUpdated}</td>
										<td className="h-14 px-4 text-sm text-[#020617]">{item.createdBy}</td>
										<td className="h-14 px-2" />
										{/* Row actions */}
										<td className="h-14 px-2">
											<div className="relative" ref={openMenuId === item.id ? menuRef : undefined}>
												<button
													type="button"
													onClick={() => setOpenMenuId(openMenuId === item.id ? null : item.id)}
													className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700"
												>
													<MoreVertical className="h-4 w-4" />
												</button>
												{openMenuId === item.id && (
													<div className="absolute right-0 z-20 mt-1 w-40 rounded-md border border-slate-200 bg-white py-1 shadow-md">
														<button
															type="button"
															className="flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
															onClick={() => setOpenMenuId(null)}
														>
															<Pencil className="h-4 w-4 text-slate-400" />
															<Translate text={localizationConstants.actionEdit} />
														</button>
														<button
															type="button"
															className="flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-slate-50"
															onClick={() => setOpenMenuId(null)}
														>
															<Trash2 className="h-4 w-4" />
															<Translate text={localizationConstants.actionDelete} />
														</button>
														<button
															type="button"
															className="flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
															onClick={() => setOpenMenuId(null)}
														>
															<Archive className="h-4 w-4 text-slate-400" />
															<Translate text={localizationConstants.archive} />
														</button>
													</div>
												)}
											</div>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}

// Main component

type TabId = "list" | "gantt" | "templates";

interface KmaOverviewPageProps {
	items: KmaItem[];
}

export function KmaOverviewPage({ items }: KmaOverviewPageProps) {
	const [activeTab, setActiveTab] = useState<TabId>("list");

	const TABS: { id: TabId; labelKey: string }[] = [
		{ id: "list", labelKey: localizationConstants.kmaListTabList },
		{ id: "gantt", labelKey: localizationConstants.kmaListTabGantt },
		{ id: "templates", labelKey: localizationConstants.kmaListTabTemplates },
	];

	return (
		<div className="flex flex-1 flex-col overflow-hidden bg-white">
			{/* Page title */}
			<div className="border-b border-slate-200 px-6 py-4">
				<h1 className="text-2xl font-semibold">
					<Translate text={localizationConstants.kmaListTitle} />
				</h1>
			</div>

			{/* Sub-tab bar */}
			<div className="border-b border-slate-200 px-6">
				<div className="flex gap-6">
					{TABS.map((tab) => (
						<button
							key={tab.id}
							type="button"
							onClick={() => setActiveTab(tab.id)}
							className={cn(
								"cursor-pointer whitespace-nowrap border-b-2 py-3 text-sm font-medium transition-colors",
								activeTab === tab.id
									? "border-slate-900 text-slate-900"
									: "border-transparent text-slate-500 hover:text-slate-700",
							)}
						>
							<Translate text={tab.labelKey} />
						</button>
					))}
				</div>
			</div>

			{activeTab === "list" && <KmaListTab items={items} />}
			{activeTab === "gantt" && <GanttTab items={items} />}
			{activeTab === "templates" && <KmaMallGruppTab />}
		</div>
	);
}
