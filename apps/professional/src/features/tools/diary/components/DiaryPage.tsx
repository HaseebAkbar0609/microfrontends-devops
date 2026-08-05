"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Plus, Search } from "lucide-react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { TablePagination } from "@/components/table/TablePagination";
import { DynamicBreadcrumb } from "@/components/common";
import { cn } from "@/lib/utils";
import { useQueryParams } from "@/hooks/useQueryParams";
import { usePagination } from "@/hooks/usePagination";
import { mockDate } from "@/features/widgetdashboard/utils/mockDates";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { DiaryEntry, MONTH_KEYS } from "../constants/mockData";
import { useDiaryFilters } from "../hooks/useDiaryFilters";
import { DiaryValues } from "../schemas/diary.schema";
import {
	createDiaryEntry,
	listDiaryEntries,
	markDiaryEntryRead,
	removeDiaryEntry,
	updateDiaryEntry,
} from "../services/diaryService";
import { buildDays } from "../utils/calendar";
import DiaryCalendar from "./DiaryCalendar";
import DiaryFormDialog from "./DiaryFormDialog";
import DiaryTable from "./DiaryTable";

const VIEW_OPTIONS = [
	{ value: "table", labelKey: localizationConstants.diaryTableView },
	{ value: "calendar", labelKey: localizationConstants.diaryCalendarView },
] as const;

const REF_YEAR = Number(mockDate(0).slice(0, 4));
const YEAR_OPTIONS = [REF_YEAR - 1, REF_YEAR, REF_YEAR + 1];

type DiaryView = (typeof VIEW_OPTIONS)[number]["value"];

const DiaryPage = () => {
	const t = useTranslate();
	const { query, changeQueries } = useQueryParams();
	const view: DiaryView =
		query.get("view") === "calendar" ? "calendar" : "table";
	const setView = (value: string) =>
		changeQueries({ view: value === "table" ? null : value });

	const [entries, setEntries] = useState<DiaryEntry[]>(() =>
		listDiaryEntries(),
	);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [editingEntry, setEditingEntry] = useState<DiaryEntry | null>(null);
	const [deletingEntry, setDeletingEntry] = useState<DiaryEntry | null>(null);
	const filters = useDiaryFilters(entries);

	const projectOptions = useMemo(
		() => [...new Set(entries.map((entry) => entry.projectName))],
		[entries],
	);

	const calendarDays = useMemo(
		() => buildDays(filters.year, filters.month, filters.filtered),
		[filters.year, filters.month, filters.filtered],
	);
	const dayPagination = usePagination(calendarDays);

	const openCreate = () => {
		setEditingEntry(null);
		setDialogOpen(true);
	};

	const openEntry = (entry: DiaryEntry) => {
		if (!entry.read) setEntries(markDiaryEntryRead(entry.id));
		setEditingEntry(entry);
		setDialogOpen(true);
	};

	const handleSave = (values: DiaryValues) => {
		if (editingEntry) {
			setEntries(updateDiaryEntry(editingEntry.id, values));
		} else {
			setEntries(
				createDiaryEntry({
					id: `temp-${crypto.randomUUID()}`,
					...values,
					read: true,
				}),
			);
		}
		showToast("success", t(localizationConstants.diarySavedToast));
	};

	const handleDelete = () => {
		if (!deletingEntry) return;
		setEntries(removeDiaryEntry(deletingEntry.id));
		setDeletingEntry(null);
		showToast("success", t(localizationConstants.diaryDeletedToast));
	};

	return (
		<div className="flex flex-col gap-5 p-6">
			<div>
				<h1 className="text-2xl font-bold text-slate-900">
					<Translate text={localizationConstants.diary} />
				</h1>
				<DynamicBreadcrumb
					variant="small"
					className="mt-1"
					items={[
						{
							translationKey: localizationConstants.home,
							href: "/home",
						},
						{ translationKey: localizationConstants.diary },
					]}
				/>
			</div>

			<div className="flex flex-wrap items-center justify-between gap-4">
				<div className="flex flex-wrap items-center gap-4">
					<div className="relative w-full max-w-xs">
						<Search className="pointer-events-none absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
						<Input
							value={filters.search}
							onChange={(event) =>
								filters.setSearch(event.target.value)
							}
							placeholder={t(localizationConstants.search)}
							className="h-9 rounded-none border-0 border-b border-slate-200 bg-transparent pl-6 text-sm shadow-none focus-visible:border-slate-400 focus-visible:ring-0"
						/>
					</div>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								type="button"
								variant="outline"
								className="h-9 gap-1.5 rounded-md border-slate-200 bg-white px-3 text-sm font-medium text-slate-900 hover:bg-slate-50"
							>
								<Translate
									text={localizationConstants.filter}
								/>
								<ChevronDown className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							align="start"
							className="w-48 rounded-md border border-slate-200 bg-white p-1 shadow-md"
						>
							<DropdownMenuItem
								onClick={() => filters.setFilter("all")}
								className={cn(
									"cursor-pointer rounded-md px-3 py-2 text-sm text-slate-700",
									filters.filter === "all" &&
										"bg-slate-100 font-medium text-slate-900",
								)}
							>
								<Translate
									text={localizationConstants.diaryFilterAll}
								/>
							</DropdownMenuItem>
							{projectOptions.map((project) => (
								<DropdownMenuItem
									key={project}
									onClick={() => filters.setFilter(project)}
									className={cn(
										"cursor-pointer rounded-md px-3 py-2 text-sm text-slate-700",
										filters.filter === project &&
											"bg-slate-100 font-medium text-slate-900",
									)}
								>
									{project}
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
				<Button
					type="button"
					onClick={openCreate}
					className="h-11 gap-2 rounded-md bg-slate-900 px-5 text-sm font-medium text-white hover:bg-slate-900/90"
				>
					<Plus className="h-4 w-4" />
					<Translate text={localizationConstants.diaryCreateNew} />
				</Button>
			</div>

			<div className="rounded-md border border-slate-200 bg-white">
				<div className="flex flex-wrap items-center justify-between gap-3 rounded-t-md bg-slate-100 px-5 py-3">
					<span className="text-sm font-semibold text-slate-900">
						<Translate text={localizationConstants.diaryPersonal} />
					</span>
					<Select value={view} onValueChange={setView}>
						<SelectTrigger className="h-9 w-44 border-slate-200 bg-white text-sm">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{VIEW_OPTIONS.map((option) => (
								<SelectItem
									key={option.value}
									value={option.value}
								>
									{t(option.labelKey)}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className="flex flex-wrap items-center gap-3 px-5 py-4">
					<Select
						value={String(filters.month)}
						onValueChange={(value) =>
							filters.setMonth(Number(value))
						}
					>
						<SelectTrigger className="h-10 w-40 border-slate-200 text-sm">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{MONTH_KEYS.map((monthKey, index) => (
								<SelectItem
									key={monthKey}
									value={String(index + 1)}
								>
									{t(monthKey)}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Select
						value={String(filters.year)}
						onValueChange={(value) =>
							filters.setYear(Number(value))
						}
					>
						<SelectTrigger className="h-10 w-28 border-slate-200 text-sm">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{YEAR_OPTIONS.map((yearOption) => (
								<SelectItem
									key={yearOption}
									value={String(yearOption)}
								>
									{yearOption}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{view === "table" ? (
					<DiaryTable
						entries={filters.paged}
						sortField={filters.sortField}
						onToggleSort={() => filters.toggleSort("date")}
						onOpen={openEntry}
						onDelete={setDeletingEntry}
					/>
				) : (
					<DiaryCalendar
						month={filters.month}
						days={dayPagination.paged}
						onOpen={openEntry}
					/>
				)}
			</div>

			{view === "table" ? (
				<TablePagination
					currentPage={filters.page}
					totalPages={filters.totalPages}
					pageSize={filters.pageSize}
					onPageChange={filters.setPage}
					onPageSizeChange={filters.setPageSize}
				/>
			) : (
				<TablePagination
					currentPage={dayPagination.page}
					totalPages={dayPagination.totalPages}
					pageSize={dayPagination.pageSize}
					onPageChange={dayPagination.setPage}
					onPageSizeChange={dayPagination.setPageSize}
				/>
			)}

			<DiaryFormDialog
				open={dialogOpen}
				editingEntry={editingEntry}
				onClose={() => setDialogOpen(false)}
				onSave={handleSave}
			/>

			<AlertDialog
				open={deletingEntry !== null}
				onOpenChange={(value) => !value && setDeletingEntry(null)}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							<Translate
								text={
									localizationConstants.diaryDeleteConfirmTitle
								}
							/>
						</AlertDialogTitle>
						<AlertDialogDescription>
							<Translate
								text={
									localizationConstants.protocolDeleteConfirmDesc
								}
							/>
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>
							<Translate text={localizationConstants.cancel} />
						</AlertDialogCancel>
						<AlertDialogAction onClick={handleDelete}>
							<Translate
								text={
									localizationConstants.subscriptionPaymentDelete
								}
							/>
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
};

export default DiaryPage;
