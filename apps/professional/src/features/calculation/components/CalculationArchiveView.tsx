"use client";

import { useState, useMemo } from "react";
import { ArchiveRestore, ChevronDown, Eye, MoreHorizontal, Plus, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DynamicBreadcrumb } from "@/components/common";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { useTableSort } from "@/hooks/useTableSort";
import { sortItems } from "@/utils/tableSort";
import { renderSortIcon } from "@/utils/renderSortIcon";
import { OfferTablePagination } from "@/features/offer/components/OfferTablePagination";

// ── Types ──────────────────────────────────────────────────────────────────

type ArchiveViewType = "kalkyl" | "project";

type ArchiveRow = {
	id: string;
	kalkylNr: string;
	projektNamn: string;
	koppling: string;
	bestellare: string;
	offertDatum: string;
	typ: string;
	status: "inProgress" | "notStarted";
	viewType: ArchiveViewType;
};

type SortField = keyof Pick<
	ArchiveRow,
	"kalkylNr" | "projektNamn" | "koppling" | "bestellare" | "offertDatum" | "typ" | "status"
>;

// ── Mock data ──────────────────────────────────────────────────────────────

const DUMMY_ARCHIVE_ROWS: ArchiveRow[] = [
	{
		id: "a1",
		kalkylNr: "K001",
		projektNamn: "Köksrenoverings...",
		koppling: "Order OR001",
		bestellare: "Fastighetsbolag",
		offertDatum: "2026-01-15",
		typ: "Total",
		status: "inProgress",
		viewType: "kalkyl",
	},
	{
		id: "a2",
		kalkylNr: "K002",
		projektNamn: "Ombyggnad",
		koppling: "Order OR001",
		bestellare: "Fastighetsbolag",
		offertDatum: "2026-01-28",
		typ: "General",
		status: "notStarted",
		viewType: "project",
	},
	{
		id: "a3",
		kalkylNr: "K003",
		projektNamn: "Tillbyggnad",
		koppling: "Order OR001",
		bestellare: "Fastighetsbolag",
		offertDatum: "2026-01-15",
		typ: "Löpande",
		status: "notStarted",
		viewType: "kalkyl",
	},
	{
		id: "a4",
		kalkylNr: "PRJ001",
		projektNamn: "Målare",
		koppling: "Order OR001",
		bestellare: "Fastighetsbolag",
		offertDatum: "2026-01-15",
		typ: "Samverkan",
		status: "inProgress",
		viewType: "kalkyl",
	},
	{
		id: "a5",
		kalkylNr: "PRJ001",
		projektNamn: "Kök Reno Job",
		koppling: "Order OR001",
		bestellare: "Fastighetsbolag",
		offertDatum: "2026-01-15",
		typ: "Total",
		status: "inProgress",
		viewType: "kalkyl",
	},
	{
		id: "a6",
		kalkylNr: "PRJ001",
		projektNamn: "Målare",
		koppling: "Order OR001",
		bestellare: "Fastighetsbolag",
		offertDatum: "2026-01-15",
		typ: "General",
		status: "inProgress",
		viewType: "kalkyl",
	},
];

const TH_SORTABLE =
	"cursor-pointer select-none whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-slate-500 hover:text-slate-800";
const TH_PLAIN =
	"whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-slate-500";

// ── Sub-components (module level) ──────────────────────────────────────────

interface KopplingBadgeProps {
	label: string;
}

function KopplingBadge({ label }: KopplingBadgeProps) {
	return (
		<span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-900">
			{label}
		</span>
	);
}

interface StatusBadgeProps {
	status: ArchiveRow["status"];
}

function StatusBadge({ status }: StatusBadgeProps) {
	if (status === "inProgress") {
		return (
			<span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
				<Translate text={localizationConstants.calcOverviewStatusInProgress} />
			</span>
		);
	}
	return (
		<span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
			<Translate text={localizationConstants.calcOverviewStatusNotStarted} />
		</span>
	);
}

// ── Main component ─────────────────────────────────────────────────────────

export function CalculationArchiveView() {
	const t = useTranslate();

	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	const rowsPerPage = 10;
	const { sortField, sortDir, toggleSort } = useTableSort<SortField>();

	const filtered = useMemo(() => {
		const q = search.toLowerCase();
		if (!q) return DUMMY_ARCHIVE_ROWS;
		return DUMMY_ARCHIVE_ROWS.filter(
			(r) =>
				r.kalkylNr.toLowerCase().includes(q) ||
				r.projektNamn.toLowerCase().includes(q) ||
				r.koppling.toLowerCase().includes(q) ||
				r.bestellare.toLowerCase().includes(q) ||
				r.offertDatum.includes(q) ||
				r.typ.toLowerCase().includes(q),
		);
	}, [search]);

	const sorted = useMemo(
		() =>
			sortItems(
				filtered,
				sortField,
				sortDir,
				(item, field) => item[field as keyof ArchiveRow] as string,
			),
		[filtered, sortField, sortDir],
	);

	const totalPages = Math.max(1, Math.ceil(sorted.length / rowsPerPage));
	const paginated = sorted.slice((page - 1) * rowsPerPage, page * rowsPerPage);

	return (
		<div className="flex flex-1 flex-col overflow-y-auto bg-slate-50">
			{/* Heading */}
			<div className="bg-slate-50 px-6 pt-5 pb-4">
				<h1 className="mb-0.5 text-2xl font-semibold tracking-tight text-slate-950">
					<Translate text={localizationConstants.archive} />
				</h1>
				<DynamicBreadcrumb
					variant="small"
					items={[
						{ translationKey: localizationConstants.home, href: "/home" },
						{
							translationKey: localizationConstants.moduleItem,
							href: "/module/business",
						},
						{
							translationKey: localizationConstants.calculation,
							href: "/module/business/calculation",
						},
						{ translationKey: localizationConstants.archive },
					]}
				/>
			</div>

			<div className="flex flex-col gap-5 px-6 pb-8">
				<div className="rounded-lg border border-slate-200 bg-white">
					{/* Toolbar */}
					<div className="flex items-center gap-2 px-5 py-3">
						<div className="relative w-64">
							<Search
								size={15}
								className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
								aria-hidden
							/>
							<Input
								placeholder={t(localizationConstants.search)}
								value={search}
								onChange={(e) => {
									setSearch(e.target.value);
									setPage(1);
								}}
								className="h-9 rounded-none border-0 border-b border-slate-200 pl-8 text-sm shadow-none focus-visible:ring-0"
							/>
						</div>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="outline"
									size="sm"
									className="h-8 cursor-pointer gap-1.5 border-slate-200 text-sm font-medium text-slate-700"
								>
									{t(localizationConstants.filter)}
									<ChevronDown size={13} aria-hidden />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="start" className="w-44">
								<DropdownMenuItem
									className="cursor-pointer text-sm"
									onClick={() => setSearch("")}
								>
									{t(localizationConstants.adminUsersFilterAll)}
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
						<div className="ml-auto">
							<Button
								size="sm"
								className="h-8 cursor-pointer gap-1.5 bg-neutral-950 text-sm font-medium text-white hover:bg-neutral-800"
							>
								<Plus size={14} aria-hidden />
							</Button>
						</div>
					</div>

					{/* Table */}
					<div className="b2b-table-scroll overflow-x-auto">
						<table className="w-full min-w-max text-sm">
							<thead>
								<tr className="border-b border-slate-200 bg-white">
									<th
										scope="col"
										className={TH_SORTABLE}
										onClick={() => toggleSort("kalkylNr")}
									>
										<span className="flex items-center gap-1">
											{t(localizationConstants.calcNo)}
											{renderSortIcon("kalkylNr", sortField, sortDir)}
										</span>
									</th>
									<th
										scope="col"
										className={TH_SORTABLE}
										onClick={() => toggleSort("projektNamn")}
									>
										<span className="flex items-center gap-1">
											{t(localizationConstants.projectName)}
											{renderSortIcon("projektNamn", sortField, sortDir)}
										</span>
									</th>
									<th
										scope="col"
										className={TH_SORTABLE}
										onClick={() => toggleSort("koppling")}
									>
										<span className="flex items-center gap-1">
											{t(localizationConstants.calcOverviewConnection)}
											{renderSortIcon("koppling", sortField, sortDir)}
										</span>
									</th>
									<th
										scope="col"
										className={TH_SORTABLE}
										onClick={() => toggleSort("bestellare")}
									>
										<span className="flex items-center gap-1">
											{t(localizationConstants.calcStatBestellare)}
											{renderSortIcon("bestellare", sortField, sortDir)}
										</span>
									</th>
									<th
										scope="col"
										className={TH_SORTABLE}
										onClick={() => toggleSort("offertDatum")}
									>
										<span className="flex items-center gap-1">
											{t(localizationConstants.calcOverviewOffertDatum)}
											{renderSortIcon("offertDatum", sortField, sortDir)}
										</span>
									</th>
									<th
										scope="col"
										className={TH_SORTABLE}
										onClick={() => toggleSort("typ")}
									>
										<span className="flex items-center gap-1">
											{t(localizationConstants.calcProType)}
											{renderSortIcon("typ", sortField, sortDir)}
										</span>
									</th>
									<th
										scope="col"
										className={TH_SORTABLE}
										onClick={() => toggleSort("status")}
									>
										<span className="flex items-center gap-1">
											{t(localizationConstants.statusHeader)}
											{renderSortIcon("status", sortField, sortDir)}
										</span>
									</th>
									<th scope="col" className={TH_PLAIN} />
								</tr>
							</thead>
							<tbody>
								{paginated.length === 0 ? (
									<tr>
										<td
											colSpan={8}
											className="px-4 py-12 text-center text-sm text-slate-400"
										>
											{t(localizationConstants.noDataFound)}
										</td>
									</tr>
								) : (
									paginated.map((row) => (
										<tr
											key={row.id}
											className="border-b border-slate-200 last:border-0 hover:bg-slate-50"
										>
											<td className="whitespace-nowrap px-4 py-3 font-medium text-slate-900">
												{row.kalkylNr}
											</td>
											<td className="whitespace-nowrap px-4 py-3 text-slate-700">
												{row.projektNamn}
											</td>
											<td className="whitespace-nowrap px-4 py-3">
												<KopplingBadge label={row.koppling} />
											</td>
											<td className="whitespace-nowrap px-4 py-3 text-slate-600">
												{row.bestellare}
											</td>
											<td className="whitespace-nowrap px-4 py-3 tabular-nums text-slate-600">
												{row.offertDatum}
											</td>
											<td className="whitespace-nowrap px-4 py-3 text-slate-600">
												{row.typ}
											</td>
											<td className="whitespace-nowrap px-4 py-3">
												<StatusBadge status={row.status} />
											</td>
											<td className="whitespace-nowrap px-4 py-3">
												<div className="flex items-center justify-end gap-2">
													<button
														type="button"
														className="cursor-pointer rounded-md border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
													>
														{row.viewType === "kalkyl"
															? t(localizationConstants.calcOverviewSeKalkyl)
															: t(localizationConstants.calcArchiveSeProject)}
													</button>
													<DropdownMenu>
														<DropdownMenuTrigger asChild>
															<button
																type="button"
																className="flex cursor-pointer items-center justify-center rounded-md p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
																aria-label="Actions"
															>
																<MoreHorizontal size={16} aria-hidden />
															</button>
														</DropdownMenuTrigger>
														<DropdownMenuContent align="end" className="w-40">
															<DropdownMenuItem className="cursor-pointer gap-2 text-sm">
																<Eye size={14} aria-hidden />
																{t(localizationConstants.calcAPrisOpen)}
															</DropdownMenuItem>
															<DropdownMenuItem className="cursor-pointer gap-2 text-sm">
																<ArchiveRestore size={14} aria-hidden />
																{t(localizationConstants.calcArchiveUnarchive)}
															</DropdownMenuItem>
															<DropdownMenuItem className="cursor-pointer gap-2 text-sm text-red-600 focus:text-red-600">
																<Trash2 size={14} aria-hidden />
																{t(localizationConstants.calcArchiveDelete)}
															</DropdownMenuItem>
														</DropdownMenuContent>
													</DropdownMenu>
												</div>
											</td>
										</tr>
									))
								)}
							</tbody>
						</table>
					</div>

					<div className="border-t border-slate-200 px-5 py-3">
						<OfferTablePagination
							page={page}
							totalPages={totalPages}
							rowsPerPage={rowsPerPage}
							onPageChange={setPage}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
