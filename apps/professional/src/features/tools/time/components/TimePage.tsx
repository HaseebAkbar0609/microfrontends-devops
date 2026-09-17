"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
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
import { today, deleteRecord } from "@/features/my-pages/shared/api";
import { MyPagesQueryState, useMyPagesAction } from "@/features/my-pages/shared/feedback";
import { MONTH_KEYS } from "@/features/tools/diary/constants/data";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { WorkDay } from "../constants/data";
import { TimeFilter, useTimeFilters } from "../hooks/useTimeFilters";
import TimeTable from "./TimeTable";

const REF_YEAR = Number(today().slice(0, 4));
const YEAR_OPTIONS = [REF_YEAR - 1, REF_YEAR, REF_YEAR + 1];

const FILTER_OPTIONS: { value: TimeFilter; labelKey: string }[] = [
	{ value: "all", labelKey: localizationConstants.timeFilterAll },
	{ value: "order", labelKey: localizationConstants.timeTypeOrder },
	{ value: "project", labelKey: localizationConstants.timeTypeProject },
	{ value: "overhead", labelKey: localizationConstants.timeTypeOverhead },
	{ value: "pending", labelKey: localizationConstants.timeStatusPending },
	{ value: "approved", labelKey: localizationConstants.timeStatusApproved },
];

const TimePage = () => {
	const t = useTranslate();
	const router = useRouter();
	const filters = useTimeFilters();
	const { queryResult } = filters;
	const action = useMyPagesAction();
	const [deletingDay, setDeletingDay] = useState<WorkDay | null>(null);

	const monthOptions = useMemo(
		() => MONTH_KEYS.map((key, index) => ({ key, value: index + 1 })),
		[],
	);

	const openDay = (day: WorkDay) =>
		router.push(`/tools/time/register?id=${day.id}`);

	const handleDelete = async () => {
		if (!deletingDay) return;
		if (await action.run(() => deleteRecord(deletingDay), localizationConstants.timeDeletedToast)) setDeletingDay(null);
	};

	return (
		<div className="flex flex-col gap-5 p-6">
			<MyPagesQueryState query={queryResult} />
			<div>
				<h1 className="text-2xl font-bold text-slate-900">
					<Translate text={localizationConstants.timePageTitle} />
				</h1>
				<DynamicBreadcrumb
					variant="small"
					className="mt-1"
					items={[
						{
							translationKey: localizationConstants.home,
							href: "/home",
						},
						{ translationKey: localizationConstants.timeItem },
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
								<Translate text={localizationConstants.filter} />
								<ChevronDown className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							align="start"
							className="w-48 rounded-md border border-slate-200 bg-white p-1 shadow-md"
						>
							{FILTER_OPTIONS.map((option) => (
								<DropdownMenuItem
									key={option.value}
									onClick={() =>
										filters.setFilter(option.value)
									}
									className={cn(
										"cursor-pointer rounded-md px-3 py-2 text-sm text-slate-700",
										filters.filter === option.value &&
											"bg-slate-100 font-medium text-slate-900",
									)}
								>
									<Translate text={option.labelKey} />
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
				<Button
					type="button"
					onClick={() => router.push("/tools/time/register")}
					className="h-11 gap-2 rounded-md bg-slate-900 px-5 text-sm font-medium text-white hover:bg-slate-900/90"
				>
					<Plus className="h-4 w-4" />
					<Translate text={localizationConstants.timeRegisterButton} />
				</Button>
			</div>

			<div className="rounded-md border border-slate-200 bg-white">
				<div className="flex flex-wrap items-center justify-between gap-3 rounded-t-md bg-slate-100 px-5 py-3">
					<span className="text-sm font-semibold text-slate-900">
						<Translate text={localizationConstants.timeMyHours} />
					</span>
					<div className="flex items-center gap-3">
						<Select
							value={String(filters.month)}
							onValueChange={(value) =>
								filters.setMonth(Number(value))
							}
						>
							<SelectTrigger className="h-9 w-36 border-slate-200 bg-white text-sm">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{monthOptions.map((option) => (
									<SelectItem
										key={option.key}
										value={String(option.value)}
									>
										{t(option.key)}
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
							<SelectTrigger className="h-9 w-24 border-slate-200 bg-white text-sm">
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
				</div>

				<TimeTable
					workDays={filters.paged}
					sortField={filters.sortField}
					onToggleSort={filters.toggleSort}
					onView={openDay}
					onDelete={setDeletingDay}
				/>
			</div>

			<TablePagination
				currentPage={filters.page}
				totalPages={filters.totalPages}
				pageSize={filters.pageSize}
				onPageChange={filters.setPage}
				onPageSizeChange={filters.setPageSize}
			/>

			<AlertDialog
				open={deletingDay !== null}
				onOpenChange={(value) => !value && setDeletingDay(null)}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							<Translate
								text={
									localizationConstants.timeDeleteConfirmTitle
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

export default TimePage;
