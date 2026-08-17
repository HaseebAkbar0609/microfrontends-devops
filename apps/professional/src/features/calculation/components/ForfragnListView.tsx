"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, MoreVertical, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

// ── Pagination ────────────────────────────────────────────────────────────────

interface PaginationProps {
	page: number;
	totalPages: number;
	rowsPerPage: number;
	onPageChange: (p: number) => void;
}

function Pagination({ page, totalPages, rowsPerPage, onPageChange }: PaginationProps) {
	return (
		<div className="flex items-center justify-between border-t border-slate-200 px-5 py-3 text-sm text-slate-600">
			<div className="flex items-center gap-2">
				<Translate text={localizationConstants.rowsPerPageLabel} />
				<span className="flex h-8 w-12 items-center justify-between rounded border border-slate-200 px-2 text-sm">
					{rowsPerPage}
					<ChevronDown className="h-3 w-3 text-slate-400" />
				</span>
			</div>
			<div className="flex items-center gap-3">
				<span>
					Page {page} of {totalPages}
				</span>
				<div className="flex items-center gap-1">
					<Button variant="ghost" size="sm" className="h-7 w-7 cursor-pointer p-0" onClick={() => onPageChange(1)} disabled={page === 1}>«</Button>
					<Button variant="ghost" size="sm" className="h-7 w-7 cursor-pointer p-0" onClick={() => onPageChange(page - 1)} disabled={page === 1}>‹</Button>
					<Button variant="ghost" size="sm" className="h-7 w-7 cursor-pointer p-0" onClick={() => onPageChange(page + 1)} disabled={page === totalPages}>›</Button>
					<Button variant="ghost" size="sm" className="h-7 w-7 cursor-pointer p-0" onClick={() => onPageChange(totalPages)} disabled={page === totalPages}>»</Button>
				</div>
			</div>
		</div>
	);
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
	const [page, setPage] = useState(1);
	const rowsPerPage = 10;

	const { sortField, sortDir, toggleSort } = useTableSort<SortField>();

	const filtered = useMemo(() => {
		const q = search.toLowerCase();
		return rows.filter(
			(r) =>
				r.kalkylNr.toLowerCase().includes(q) ||
				r.forfragan.toLowerCase().includes(q),
		);
	}, [rows, search]);

	const sorted = useMemo(
		() => sortItems(filtered, sortField, sortDir, (r, f) => r[f as keyof ForfragnRow]),
		[filtered, sortField, sortDir],
	);

	const totalPages = Math.max(1, Math.ceil(sorted.length / rowsPerPage));
	const paginated = sorted.slice((page - 1) * rowsPerPage, page * rowsPerPage);

	const base = `/module/business/calculation/overview/${calcId}/inquiry`;

	const TH =
		"cursor-pointer select-none whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-slate-500 hover:text-slate-800";

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
			<div className="flex items-center justify-between gap-3 border-b border-slate-200 px-5 py-3">
				<div className="flex items-center gap-2">
					<div className="relative">
						<Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
						<Input
							value={search}
							onChange={(e) => { setSearch(e.target.value); setPage(1); }}
							placeholder={t(localizationConstants.search)}
							className="h-9 w-64 pl-9 text-sm"
						/>
					</div>
					<Button variant="outline" size="sm" className="h-9 cursor-pointer gap-1 text-sm">
						<Translate text={localizationConstants.filter} />
						<ChevronDown className="h-3.5 w-3.5" />
					</Button>
				</div>
				<Button
					size="sm"
					onClick={() => router.push(`${base}/ny`)}
					className="h-9 cursor-pointer gap-1.5 bg-[#111721] px-4 text-sm text-white hover:bg-slate-800"
				>
					<Plus className="h-4 w-4" />
					<Translate text={localizationConstants.calcForfragnNy} />
				</Button>
			</div>

			{/* Table */}
			<div className="flex-1 overflow-y-auto">
				<table className="w-full border-collapse text-sm">
					<thead className="sticky top-0 z-10 bg-white">
						<tr className="border-b border-slate-200">
							<th className={TH} onClick={() => toggleSort("kalkylNr")}>
								<div className="flex items-center gap-1">
									<Translate text={localizationConstants.calcForfragnKalkylNr} />
									{renderSortIcon("kalkylNr", sortField, sortDir)}
								</div>
							</th>
							<th className={TH} onClick={() => toggleSort("datum")}>
								<div className="flex items-center gap-1">
									<Translate text={localizationConstants.agreementDetailDatum} />
									{renderSortIcon("datum", sortField, sortDir)}
								</div>
							</th>
							<th className={TH} onClick={() => toggleSort("forfragan")}>
								<div className="flex items-center gap-1">
									<Translate text={localizationConstants.calcForfragnForfragan} />
									{renderSortIcon("forfragan", sortField, sortDir)}
								</div>
							</th>
							<th className={TH} onClick={() => toggleSort("status")}>
								<div className="flex items-center gap-1">
									<Translate text={localizationConstants.statusHeader} />
									{renderSortIcon("status", sortField, sortDir)}
								</div>
							</th>
							<th className="w-32 px-4 py-3" />
							<th className="w-10 px-2 py-3" />
						</tr>
					</thead>
					<tbody>
						{paginated.length === 0 ? (
							<tr>
								<td colSpan={6} className="h-32 text-center text-sm text-slate-400">
									<Translate text={localizationConstants.noDataFound} />
								</td>
							</tr>
						) : (
							paginated.map((row) => (
								<tr key={row.id} className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50">
									<td className="px-4 py-3 font-medium text-slate-700">{row.kalkylNr}</td>
									<td className="px-4 py-3 text-slate-600">{row.datum}</td>
									<td className="px-4 py-3 text-slate-700">{row.forfragan}</td>
									<td className="px-4 py-3">
										<span
											className={cn(
												"inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
												STATUS_CLASSES[row.status],
											)}
										>
											{statusLabel(row.status, t)}
										</span>
									</td>
									<td className="px-4 py-3">
										<Button
											variant="outline"
											size="sm"
											className="h-8 cursor-pointer text-xs"
											onClick={() => router.push(`${base}/${row.id}`)}
										>
											<Translate text={localizationConstants.calcForfragnSeForfragan} />
										</Button>
									</td>
									<td className="px-2 py-3">
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<button
													type="button"
													className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700"
												>
													<MoreVertical className="h-4 w-4" />
												</button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end" className="w-32">
												<DropdownMenuItem className="cursor-pointer gap-2 text-sm">
													<Translate text={localizationConstants.calcForfragnArchive} />
												</DropdownMenuItem>
												<DropdownMenuItem className="cursor-pointer gap-2 text-sm text-red-600 focus:text-red-600">
													<Translate text={localizationConstants.calcArchiveDelete} />
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>

			<Pagination
				page={page}
				totalPages={totalPages}
				rowsPerPage={rowsPerPage}
				onPageChange={setPage}
			/>
		</div>
	);
}
