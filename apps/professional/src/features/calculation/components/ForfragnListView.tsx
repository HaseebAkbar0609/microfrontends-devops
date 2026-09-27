"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronDown, MoreVertical, Plus } from "lucide-react";
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
import { TablePagination } from "@/components/table/TablePagination";
import { cn } from "@/lib/utils";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { renderSortIcon } from "@/utils/renderSortIcon";
import { useTableSort } from "@/hooks/useTableSort";
import { sortItems } from "@/utils/tableSort";
import type { ForfragnRow, ForfragnStatus } from "../types/forfragan";

// ── Badge ─────────────────────────────────────────────────────────────────────

const STATUS_CLASSES: Record<ForfragnStatus, string> = {
	pagar: "bg-emerald-100 text-emerald-700",
	"ej-paborjad": "bg-amber-100 text-amber-700",
	avslutad: "bg-slate-100 text-slate-600",
};

function statusLabel(status: ForfragnStatus, t: (k: string) => string): string {
	if (status === "pagar") return t(localizationConstants.calcForfragnStatusPagar);
	if (status === "ej-paborjad") return t(localizationConstants.calcForfragnStatusEjPaborjad);
	return status;
}

// ── Main component ─────────────────────────────────────────────────────────────

type SortField = keyof Pick<ForfragnRow, "kalkylNr" | "datum" | "forfragan" | "status">;

interface ForfragnListViewProps {
	calcId: string;
	rows: ForfragnRow[];
}

export function ForfragnListView({ calcId, rows }: ForfragnListViewProps) {
	const t = useTranslate();
	const router = useRouter();
	const [search, setSearch] = useState("");
	const [filterStatus, setFilterStatus] = useState<ForfragnStatus | null>(null);
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);

	const { sortField, sortDir, toggleSort } = useTableSort<SortField>();

	const filtered = useMemo(() => {
		let result = rows;
		if (filterStatus) {
			result = result.filter((r) => r.status === filterStatus);
		}
		const q = search.toLowerCase().trim();
		if (q) {
			result = result.filter(
				(r) =>
					r.kalkylNr.toLowerCase().includes(q) ||
					r.forfragan.toLowerCase().includes(q),
			);
		}
		return result;
	}, [rows, search, filterStatus]);

	const sorted = useMemo(
		() => sortItems(filtered, sortField, sortDir, (r, f) => r[f as keyof ForfragnRow]),
		[filtered, sortField, sortDir],
	);

	const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
	const paginated = sorted.slice((page - 1) * pageSize, page * pageSize);

	const base = `/module/business/calculation/overview/${calcId}/inquiry`;

	const TH =
		"cursor-pointer select-none whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-slate-500 hover:text-slate-800";

	const statusOptions: { value: ForfragnStatus; label: string }[] = [
		{ value: "pagar", label: t(localizationConstants.calcForfragnStatusPagar) },
		{ value: "ej-paborjad", label: t(localizationConstants.calcForfragnStatusEjPaborjad) },
	];

	const activeFilterLabel = filterStatus
		? (statusOptions.find((o) => o.value === filterStatus)?.label ?? filterStatus)
		: t(localizationConstants.filter);

	return (
		<div className="flex flex-1 flex-col overflow-hidden bg-white">
			{/* Page title */}
			<div className="border-b border-slate-200 px-6 py-4">
				<h1 className="text-2xl font-semibold">
					<span className="text-slate-400">
						<Translate text={localizationConstants.calcKalkyl} /> {calcId} /{" "}
					</span>
					<Translate text={localizationConstants.calcForfragnTitle} />
				</h1>
			</div>

			{/* Toolbar */}
			<div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex items-center gap-2">
					<Search
						value={search}
						onChange={(val) => {
							setSearch(val);
							setPage(1);
						}}
						placeholder={localizationConstants.search}
						className="h-9 w-full"
						wrapperClassName="w-64 sm:w-72"
					/>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="outline"
								size="sm"
								className="h-9 cursor-pointer gap-2 border-slate-200 text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 shadow-none"
							>
								<span>{activeFilterLabel}</span>
								<ChevronDown className="h-3.5 w-3.5 text-slate-500" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="start" className="w-44 bg-white shadow-md border-slate-200">
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
					className="h-9 cursor-pointer gap-1.5 bg-neutral-950 px-4 text-sm text-white hover:bg-neutral-800"
				>
					<Plus className="h-4 w-4" />
					<Translate text={localizationConstants.calcForfragnNy} />
				</Button>
			</div>

			{/* Table */}
			<div className="flex-1 overflow-y-auto px-5 py-2">
				<Table className="w-full min-w-max border-collapse text-sm">
					<TableHeader>
						<TableRow className="border-b border-slate-200 bg-white hover:bg-transparent">
							<TableHead className={TH} onClick={() => toggleSort("kalkylNr")}>
								<div className="flex items-center gap-1">
									<Translate text={localizationConstants.calcForfragnKalkylNr} />
									{renderSortIcon("kalkylNr", sortField, sortDir)}
								</div>
							</TableHead>
							<TableHead className={TH} onClick={() => toggleSort("datum")}>
								<div className="flex items-center gap-1">
									<Translate text={localizationConstants.agreementDetailDatum} />
									{renderSortIcon("datum", sortField, sortDir)}
								</div>
							</TableHead>
							<TableHead className={TH} onClick={() => toggleSort("forfragan")}>
								<div className="flex items-center gap-1">
									<Translate text={localizationConstants.calcForfragnForfragan} />
									{renderSortIcon("forfragan", sortField, sortDir)}
								</div>
							</TableHead>
							<TableHead className={TH} onClick={() => toggleSort("status")}>
								<div className="flex items-center gap-1">
									<Translate text={localizationConstants.statusHeader} />
									{renderSortIcon("status", sortField, sortDir)}
								</div>
							</TableHead>
							<TableHead className="w-32 px-4 py-3 text-right" />
							<TableHead className="w-10 px-2 py-3" />
						</TableRow>
					</TableHeader>
					<TableBody className="[&_tr:last-child]:border-b [&_tr:last-child]:border-slate-200">
						{paginated.length === 0 ? (
							<TableRow>
								<TableCell colSpan={6} className="h-32 text-center text-sm text-slate-400">
									<Translate text={localizationConstants.noDataFound} />
								</TableCell>
							</TableRow>
						) : (
							paginated.map((row) => (
								<TableRow key={row.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
									<TableCell className="px-4 py-3 font-medium text-slate-700">{row.kalkylNr}</TableCell>
									<TableCell className="px-4 py-3 text-slate-600">{row.datum}</TableCell>
									<TableCell className="px-4 py-3 text-slate-700">{row.forfragan}</TableCell>
									<TableCell className="px-4 py-3">
										<span
											className={cn(
												"inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
												STATUS_CLASSES[row.status],
											)}
										>
											{statusLabel(row.status, t)}
										</span>
									</TableCell>
									<TableCell className="px-4 py-3 text-right">
										<Button
											variant="outline"
											size="sm"
											className="h-8 cursor-pointer text-xs font-medium border-slate-200 bg-white hover:bg-slate-50 shadow-none"
											onClick={() => router.push(`${base}/${row.id}`)}
										>
											<Translate text={localizationConstants.calcForfragnSeForfragan} />
										</Button>
									</TableCell>
									<TableCell className="px-2 py-3">
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<button
													type="button"
													className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700"
												>
													<MoreVertical className="h-4 w-4" />
												</button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end" className="w-32 bg-white shadow-md border-slate-200">
												<DropdownMenuItem className="cursor-pointer gap-2 text-sm">
													<Translate text={localizationConstants.calcForfragnArchive} />
												</DropdownMenuItem>
												<DropdownMenuItem className="cursor-pointer gap-2 text-sm text-red-600 focus:text-red-600">
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

			<div className="px-5 py-3 border-t border-slate-200">
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
		</div>
	);
}

