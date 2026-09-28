"use client";

import { useRouter } from "next/navigation";
import { Check, ChevronDown, MoreVertical, Plus, FileText, Archive, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Search } from "@/components/search/Search";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Table,
	TableHeader,
	TableBody,
	TableHead,
	TableRow,
	TableCell,
} from "@/components/ui/table";
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
import { Input } from "@/components/ui/input";
import { TablePagination } from "@/components/table/TablePagination";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { renderSortIcon } from "@/utils/renderSortIcon";
import { useInquiryList } from "../hooks/useInquiry";
import type { ForfragnRow, ForfragnStatus } from "../types/forfragan";

const STATUS_CLASSES: Record<ForfragnStatus, string> = {
	pagar: "bg-emerald-600 text-white font-medium",
	"ej-paborjad": "bg-amber-500 text-white font-medium",
	avslutad: "bg-slate-200 text-slate-700 font-medium",
};

interface ForfragnListViewProps {
	calcId: string;
	rows?: ForfragnRow[];
}

export function ForfragnListView({ calcId, rows = [] }: ForfragnListViewProps) {
	const t = useTranslate();
	const router = useRouter();

	const {
		search,
		setSearch,
		filterStatus,
		setFilterStatus,
		page,
		setPage,
		pageSize,
		setPageSize,
		sortField,
		sortDir,
		toggleSort,
		paginated,
		totalPages,
		isLoading,
		declineTarget,
		setDeclineTarget,
		declineReason,
		setDeclineReason,
		handleConfirmDecline,
	} = useInquiryList(calcId, rows);

	const base = `/module/business/calculation/overview/${calcId}/inquiry`;

	const statusOptions: { value: ForfragnStatus; label: string }[] = [
		{ value: "pagar", label: t(localizationConstants.calcForfragnStatusPagar) },
		{ value: "ej-paborjad", label: t(localizationConstants.calcForfragnStatusEjPaborjad) },
	];

	const activeFilterLabel = filterStatus
		? (statusOptions.find((o) => o.value === filterStatus)?.label ?? filterStatus)
		: t(localizationConstants.filter);

	return (
		<div className="flex flex-1 flex-col overflow-hidden bg-white">
			{/* Page Header matching Figma Image 1 */}
			<div className="bg-white">
				<div className="px-6 pt-5 pb-2 sm:pl-15">
					<h1 className="text-lg sm:text-2xl font-semibold tracking-tight text-slate-900">
						<span className="text-slate-400 font-normal">
							<Translate text={localizationConstants.calcKalkyl} /> - {calcId} /{" "}
						</span>
						<Translate text={localizationConstants.calcForfragnTitle} />
					</h1>
				</div>
			</div>

			{/* Search & Actions Toolbar */}
			<div className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between sm:pl-15 sm:pr-6">
				<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
					<Search
						value={search}
						onChange={(val) => {
							setSearch(val);
							setPage(1);
						}}
						placeholder={localizationConstants.search}
						className="h-9 w-full"
						wrapperClassName="w-full sm:w-72"
					/>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="outline"
								size="sm"
								className="h-9 w-full sm:w-auto shrink-0 justify-between sm:justify-center cursor-pointer gap-2 border-slate-200 text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 shadow-none rounded-lg"
							>
								<span>{activeFilterLabel}</span>
								<ChevronDown className="h-3.5 w-3.5 text-slate-500" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="start" className="w-44 bg-white shadow-md border-slate-200 rounded-lg">
							<DropdownMenuItem
								className="cursor-pointer text-sm flex items-center justify-between"
								onClick={() => {
									setFilterStatus(null);
									setPage(1);
								}}
							>
								<Translate text={localizationConstants.adminUsersFilterAll} />
								{!filterStatus && <Check size={14} className="text-slate-900" />}
							</DropdownMenuItem>
							{statusOptions.map((opt) => (
								<DropdownMenuItem
									key={opt.value}
									className="cursor-pointer text-sm flex items-center justify-between"
									onClick={() => {
										setFilterStatus(opt.value);
										setPage(1);
									}}
								>
									<span>{opt.label}</span>
									{filterStatus === opt.value && <Check size={14} className="text-slate-900" />}
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				<Button
					size="sm"
					onClick={() => router.push(`${base}/new`)}
					className="h-9 w-full sm:w-auto shrink-0 justify-center cursor-pointer gap-1.5 bg-neutral-950 px-4 text-sm font-semibold text-white hover:bg-neutral-800 rounded-lg shadow-sm"
				>
					<Plus className="h-4 w-4 stroke-[2.5]" />
					<Translate text={localizationConstants.calcForfragnNy} />
				</Button>
			</div>

			{/* Inquiries Table matching Image 1 */}
			<div className="flex-1 overflow-y-auto px-6 py-2 sm:pl-15 sm:pr-6">
				<Table className="w-full min-w-max border-collapse text-sm">
					<TableHeader>
						<TableRow className="border-b border-slate-200 bg-white hover:bg-transparent">
							<TableHead className="cursor-pointer px-4 py-3.5 text-left text-sm font-semibold text-slate-600 hover:text-slate-900" onClick={() => toggleSort("kalkylNr")}>
								<div className="flex items-center gap-1.5">
									<Translate text={localizationConstants.calcForfragnKalkylNr} />
									{renderSortIcon("kalkylNr", sortField, sortDir)}
								</div>
							</TableHead>
							<TableHead className="cursor-pointer px-4 py-3.5 text-left text-sm font-semibold text-slate-600 hover:text-slate-900" onClick={() => toggleSort("datum")}>
								<div className="flex items-center gap-1.5">
									<Translate text={localizationConstants.agreementDetailDatum} />
									{renderSortIcon("datum", sortField, sortDir)}
								</div>
							</TableHead>
							<TableHead className="cursor-pointer px-4 py-3.5 text-left text-sm font-semibold text-slate-600 hover:text-slate-900" onClick={() => toggleSort("forfragan")}>
								<div className="flex items-center gap-1.5">
									<Translate text={localizationConstants.calcForfragnForfragan} />
									{renderSortIcon("forfragan", sortField, sortDir)}
								</div>
							</TableHead>
							<TableHead className="cursor-pointer px-4 py-3.5 text-left text-sm font-semibold text-slate-600 hover:text-slate-900" onClick={() => toggleSort("status")}>
								<div className="flex items-center gap-1.5">
									<Translate text={localizationConstants.statusHeader} />
									{renderSortIcon("status", sortField, sortDir)}
								</div>
							</TableHead>
							<TableHead className="w-32 px-4 py-3.5 text-right" />
							<TableHead className="w-12 border-l border-slate-200 px-2 py-3.5 text-right" />
						</TableRow>
					</TableHeader>
					<TableBody className="[&_tr:last-child]:border-b [&_tr:last-child]:border-slate-200">
						{isLoading ? (
							Array.from({ length: 5 }).map((_, idx) => (
								<TableRow key={`skeleton_${idx}`} className="border-b border-slate-100">
									<TableCell className="px-4 py-3.5"><Skeleton className="h-4 w-20" /></TableCell>
									<TableCell className="px-4 py-3.5"><Skeleton className="h-4 w-24" /></TableCell>
									<TableCell className="px-4 py-3.5"><Skeleton className="h-4 w-16" /></TableCell>
									<TableCell className="px-4 py-3.5"><Skeleton className="h-6 w-20 rounded-md" /></TableCell>
									<TableCell className="px-4 py-3.5 text-right"><Skeleton className="h-8 w-24 ml-auto rounded-md" /></TableCell>
									<TableCell className="border-l border-slate-200 px-2 py-3.5 text-right"><Skeleton className="h-6 w-6 ml-auto rounded-md" /></TableCell>
								</TableRow>
							))
						) : paginated.length === 0 ? (
							<TableRow>
								<TableCell colSpan={6} className="h-48 text-center text-sm text-slate-400">
									<div className="flex flex-col items-center justify-center gap-2">
										<FileText className="h-8 w-8 text-slate-300" />
										<p><Translate text={localizationConstants.noDataFound} /></p>
									</div>
								</TableCell>
							</TableRow>
						) : (
							paginated.map((row) => (
								<TableRow
									key={row.id}
									className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors cursor-pointer"
									onClick={() => router.push(`/module/business/calculation/overview/${calcId}/forfragan/${row.id}`)}
								>
									<TableCell className="px-4 py-3.5 font-medium text-slate-900">{row.kalkylNr}</TableCell>
									<TableCell className="px-4 py-3.5 text-slate-600">{row.datum}</TableCell>
									<TableCell className="px-4 py-3.5 font-bold text-slate-950">{row.forfragan}</TableCell>
									<TableCell className="px-4 py-3.5">
										<span
											className={cn(
												"inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold tracking-wide",
												STATUS_CLASSES[row.status],
											)}
										>
											{row.status === "pagar"
												? t(localizationConstants.calcForfragnStatusPagar)
												: row.status === "ej-paborjad"
													? t(localizationConstants.calcForfragnStatusEjPaborjad)
													: row.status}
										</span>
									</TableCell>
									<TableCell className="px-4 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
										<Button
											variant="outline"
											size="sm"
											className="h-8 cursor-pointer rounded-lg border-slate-200 bg-slate-100/90 text-xs font-semibold text-slate-900 hover:bg-slate-200/80 shadow-none px-3"
											onClick={() => router.push(`/module/business/calculation/overview/${calcId}/forfragan/${row.id}`)}
										>
											<Translate text={localizationConstants.calcForfragnSeForfragan} />
										</Button>
									</TableCell>
									<TableCell className="border-l border-slate-200 px-2 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button
													variant="ghost"
													size="icon"
													className="h-8 w-8 cursor-pointer text-slate-500 hover:bg-slate-100 hover:text-slate-900 rounded-lg p-0"
												>
													<MoreVertical className="h-4 w-4" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end" className="w-40 bg-white shadow-md border-slate-200 rounded-lg">
												<DropdownMenuItem
													className="cursor-pointer gap-2 text-sm font-medium text-slate-900 focus:text-slate-900"
												>
													<Archive className="h-4 w-4 text-slate-900" />
													<Translate text={localizationConstants.archive} />
												</DropdownMenuItem>
												<DropdownMenuItem
													className="cursor-pointer gap-2 text-sm font-medium text-slate-900 focus:text-slate-900"
												>
													<Trash2 className="h-4 w-4 text-slate-900" />
													<Translate text={localizationConstants.calcArchiveDelete} />
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>

			{/* Pagination Footer */}
			<div className="bg-white px-6 py-3 sm:pl-15 sm:pr-6">
				<TablePagination
					currentPage={page}
					totalPages={totalPages}
					pageSize={pageSize}
					onPageChange={setPage}
					onPageSizeChange={(size) => {
						setPageSize(size);
						setPage(1);
					}}
				/>
			</div>

			{/* Decline Inquiry Modal */}
			<AlertDialog open={Boolean(declineTarget)} onOpenChange={(open) => !open && setDeclineTarget(null)}>
				<AlertDialogContent className="rounded-xl border-slate-200 bg-white shadow-xl">
					<AlertDialogHeader>
						<AlertDialogTitle className="text-lg font-semibold text-slate-900">
							<Translate text={localizationConstants.calcForfragnDecline} />
						</AlertDialogTitle>
						<AlertDialogDescription className="text-sm text-slate-600">
							<Translate text={localizationConstants.calcForfragnDeclineReason} />
						</AlertDialogDescription>
					</AlertDialogHeader>
					<div className="py-2">
						<Input
							value={declineReason}
							onChange={(e) => setDeclineReason(e.target.value)}
							placeholder={t(localizationConstants.calcForfragnDeclineReasonPlaceholder)}
							className="rounded-lg border-slate-300 text-sm focus-visible:ring-slate-900"
						/>
					</div>
					<AlertDialogFooter>
						<AlertDialogCancel onClick={() => setDeclineTarget(null)} className="rounded-lg cursor-pointer">
							<Translate text={localizationConstants.cancel} />
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleConfirmDecline}
							disabled={!declineReason.trim()}
							className="bg-red-600 text-white hover:bg-red-700 rounded-lg cursor-pointer disabled:opacity-50"
						>
							<Translate text={localizationConstants.calcForfragnDecline} />
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
