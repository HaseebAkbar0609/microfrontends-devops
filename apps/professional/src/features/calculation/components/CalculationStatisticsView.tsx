"use client";

import { useState, useMemo } from "react";
import {
	ChevronDown,
	CircleX,
	LayoutList,
	Search,
	Trophy,
	X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { DynamicBreadcrumb } from "@/components/common";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { useTableSort } from "@/hooks/useTableSort";
import { sortItems } from "@/utils/tableSort";
import { renderSortIcon } from "@/utils/renderSortIcon";
import { OfferTablePagination } from "@/features/offer/components/OfferTablePagination";

// ── Types ──────────────────────────────────────────────────────────────────

type StatRow = {
	id: string;
	datum: string;
	bestellare: string;
	kategori: string;
	typ: string;
	entreprenadform: string;
	antalOffert: number;
	vunna: number;
	forlorade: number;
};

type SortField = keyof Pick<
	StatRow,
	| "datum"
	| "bestellare"
	| "kategori"
	| "typ"
	| "entreprenadform"
	| "antalOffert"
	| "vunna"
	| "forlorade"
>;

// ── Mock data ──────────────────────────────────────────────────────────────

const DUMMY_STAT_ROWS: StatRow[] = [
	{
		id: "s1",
		datum: "2025-12-14 - 2025-12-30",
		bestellare: "Fastighetsbolaget",
		kategori: "Service",
		typ: "B2B",
		entreprenadform: "Totalentreprenad",
		antalOffert: 60,
		vunna: 10,
		forlorade: 50,
	},
	{
		id: "s2",
		datum: "2025-12-01 - 2025-12-30",
		bestellare: "Fastighetsbolaget",
		kategori: "Entreprend",
		typ: "B2C-Offert",
		entreprenadform: "General",
		antalOffert: 40,
		vunna: 20,
		forlorade: 20,
	},
	{
		id: "s3",
		datum: "2025-12-01 - 2025-12-30",
		bestellare: "Fastighetsbolaget",
		kategori: "Service",
		typ: "Express",
		entreprenadform: "Totalentreprenad",
		antalOffert: 23,
		vunna: 33,
		forlorade: 33,
	},
	{
		id: "s4",
		datum: "2025-12-01 - 2025-12-30",
		bestellare: "Fastighetsbolaget",
		kategori: "Entreprend",
		typ: "Hyra IN",
		entreprenadform: "Totalentreprenad",
		antalOffert: 35,
		vunna: 11,
		forlorade: 11,
	},
	{
		id: "s5",
		datum: "2025-12-01 - 2025-12-30",
		bestellare: "Fastighetsbolaget",
		kategori: "Service",
		typ: "Hyra UT",
		entreprenadform: "Totalentreprenad",
		antalOffert: 76,
		vunna: 66,
		forlorade: 66,
	},
	{
		id: "s6",
		datum: "2025-12-14 - 2025-12-30",
		bestellare: "ff2",
		kategori: "Entreprend",
		typ: "B2B",
		entreprenadform: "Totalentreprenad",
		antalOffert: 112,
		vunna: 9,
		forlorade: 9,
	},
];

const BESTELLARE_OPTIONS = [...new Set(DUMMY_STAT_ROWS.map((r) => r.bestellare))];
const KATEGORI_OPTIONS = [...new Set(DUMMY_STAT_ROWS.map((r) => r.kategori))];
const TYP_OPTIONS = [...new Set(DUMMY_STAT_ROWS.map((r) => r.typ))];
const ENTREPRENADFORM_OPTIONS = [...new Set(DUMMY_STAT_ROWS.map((r) => r.entreprenadform))];

const TH_SORTABLE =
	"cursor-pointer select-none whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-slate-500 hover:text-slate-800";
const TH_PLAIN =
	"whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-slate-500";

// ── Sub-components (module level) ──────────────────────────────────────────

interface KpiCardProps {
	labelKey: string;
	value: string;
	icon: React.ComponentType<{ size?: number; className?: string }>;
}

function KpiCard({ labelKey, value, icon: Icon }: KpiCardProps) {
	return (
		<div className="flex flex-1 items-center gap-4 rounded-lg bg-slate-900 px-6 py-5 text-white">
			<div className="flex shrink-0 items-center justify-center rounded-full bg-white/10 p-2.5">
				<Icon size={20} className="text-white" />
			</div>
			<div className="flex flex-col gap-0.5">
				<span className="text-xs font-medium text-white/60">
					<Translate text={labelKey} />
				</span>
				<span className="text-2xl font-bold tabular-nums tracking-tight">
					{value}
				</span>
			</div>
		</div>
	);
}

interface MultiTagSelectProps {
	label: string;
	options: string[];
	selected: string[];
	onToggle: (val: string) => void;
}

function MultiTagSelect({ label, options, selected, onToggle }: MultiTagSelectProps) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button
					type="button"
					className="flex min-h-9 w-full cursor-pointer flex-wrap items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-left text-sm focus:outline-none"
				>
					{selected.length === 0 ? (
						<span className="text-slate-400">{label}</span>
					) : (
						selected.map((val) => (
							<span
								key={val}
								className="inline-flex items-center gap-1 rounded bg-slate-100 px-1.5 py-0.5 text-xs font-medium text-slate-700"
								onClick={(e) => {
									e.stopPropagation();
									onToggle(val);
								}}
							>
								{val}
								<X size={10} aria-hidden />
							</span>
						))
					)}
					<ChevronDown size={13} className="ml-auto shrink-0 text-slate-400" aria-hidden />
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start" className="w-48">
				{options.map((opt) => (
					<DropdownMenuCheckboxItem
						key={opt}
						checked={selected.includes(opt)}
						onCheckedChange={() => onToggle(opt)}
						className="cursor-pointer text-sm"
					>
						{opt}
					</DropdownMenuCheckboxItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

// ── Main component ─────────────────────────────────────────────────────────

export function CalculationStatisticsView() {
	const t = useTranslate();

	// Filter state
	const [bestellare, setBestellare] = useState("");
	const [selectedKategori, setSelectedKategori] = useState<string[]>([]);
	const [selectedTyp, setSelectedTyp] = useState<string[]>([]);
	const [entreprenadform, setEntreprenadform] = useState("");
	const [startDate, setStartDate] = useState("2025-12-24");
	const [endDate, setEndDate] = useState("2025-12-30");
	const [appliedFilters, setAppliedFilters] = useState({
		bestellare: "",
		kategori: [] as string[],
		typ: [] as string[],
		entreprenadform: "",
	});

	// Table state
	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	const rowsPerPage = 10;
	const { sortField, sortDir, toggleSort } = useTableSort<SortField>();

	const hasActiveFilters =
		!!appliedFilters.bestellare ||
		appliedFilters.kategori.length > 0 ||
		appliedFilters.typ.length > 0 ||
		!!appliedFilters.entreprenadform;

	function handleToggleKategori(val: string) {
		setSelectedKategori((prev) =>
			prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val],
		);
	}

	function handleToggleTyp(val: string) {
		setSelectedTyp((prev) =>
			prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val],
		);
	}

	function handleApply() {
		setAppliedFilters({
			bestellare,
			kategori: selectedKategori,
			typ: selectedTyp,
			entreprenadform,
		});
		setPage(1);
	}

	function handleReset() {
		setBestellare("");
		setSelectedKategori([]);
		setSelectedTyp([]);
		setEntreprenadform("");
		setAppliedFilters({ bestellare: "", kategori: [], typ: [], entreprenadform: "" });
		setPage(1);
	}

	const filtered = useMemo(() => {
		let result = DUMMY_STAT_ROWS;
		if (appliedFilters.bestellare)
			result = result.filter((r) => r.bestellare === appliedFilters.bestellare);
		if (appliedFilters.kategori.length > 0)
			result = result.filter((r) => appliedFilters.kategori.includes(r.kategori));
		if (appliedFilters.typ.length > 0)
			result = result.filter((r) => appliedFilters.typ.includes(r.typ));
		if (appliedFilters.entreprenadform)
			result = result.filter((r) => r.entreprenadform === appliedFilters.entreprenadform);
		const q = search.toLowerCase();
		if (!q) return result;
		return result.filter(
			(r) =>
				r.bestellare.toLowerCase().includes(q) ||
				r.kategori.toLowerCase().includes(q) ||
				r.typ.toLowerCase().includes(q) ||
				r.datum.includes(q),
		);
	}, [appliedFilters, search]);

	const sorted = useMemo(
		() =>
			sortItems(
				filtered,
				sortField,
				sortDir,
				(item, field) => item[field as keyof StatRow] as string | number,
			),
		[filtered, sortField, sortDir],
	);

	const totalPages = Math.max(1, Math.ceil(sorted.length / rowsPerPage));
	const paginated = sorted.slice((page - 1) * rowsPerPage, page * rowsPerPage);

	const kpiTotal = DUMMY_STAT_ROWS.reduce((s, r) => s + r.antalOffert, 0);
	const kpiWon = DUMMY_STAT_ROWS.reduce((s, r) => s + r.vunna, 0);
	const kpiLost = DUMMY_STAT_ROWS.reduce((s, r) => s + r.forlorade, 0);

	return (
		<div className="flex flex-1 flex-col overflow-y-auto bg-slate-50">
			{/* Heading */}
			<div className="bg-slate-50 px-6 pt-5 pb-4">
				<h1 className="mb-0.5 text-2xl font-semibold tracking-tight text-slate-950">
					<Translate text={localizationConstants.calcStatistics} />
				</h1>
				<DynamicBreadcrumb
					variant="small"
					items={[
						{ translationKey: localizationConstants.home, href: "/home" },
						{ translationKey: localizationConstants.moduleItem, href: "/module/business" },
						{ translationKey: localizationConstants.calculation, href: "/module/business/calculation" },
						{ translationKey: localizationConstants.calcStatistics },
					]}
				/>
			</div>

			<div className="flex flex-col gap-5 px-6 pb-8">
				{/* KPI cards */}
				<div className="flex gap-4">
					<KpiCard
						labelKey={localizationConstants.calcStatKpiTotal}
						value={kpiTotal.toLocaleString("sv-SE")}
						icon={LayoutList}
					/>
					<KpiCard
						labelKey={localizationConstants.calcStatKpiWon}
						value={kpiWon.toLocaleString("sv-SE")}
						icon={Trophy}
					/>
					<KpiCard
						labelKey={localizationConstants.calcStatKpiLost}
						value={kpiLost.toLocaleString("sv-SE")}
						icon={CircleX}
					/>
				</div>

				{/* Filter section */}
				<div className="rounded-lg border border-slate-200 bg-white p-5">
					<div className="mb-4 flex items-center justify-between">
						<span className="text-sm font-semibold text-slate-800">
							<Translate text={localizationConstants.calcStatFilterTitle} />
						</span>
						{hasActiveFilters && (
							<button
								type="button"
								onClick={handleReset}
								className="flex cursor-pointer items-center gap-1 text-sm text-slate-500 hover:text-slate-800"
							>
								<Translate text={localizationConstants.calcStatReset} />
								<X size={13} aria-hidden />
							</button>
						)}
					</div>

					{/* Row 1: 4 filters */}
					<div className="grid grid-cols-4 gap-4">
						{/* Beställare */}
						<div className="flex flex-col gap-1">
							<label className="text-xs font-medium text-slate-600">
								{t(localizationConstants.calcStatBestellare)}
							</label>
							<Select value={bestellare} onValueChange={setBestellare}>
								<SelectTrigger className="h-9 border-slate-200 text-sm">
									<SelectValue placeholder={t(localizationConstants.calcStatBestellare)} />
								</SelectTrigger>
								<SelectContent>
									{BESTELLARE_OPTIONS.map((opt) => (
										<SelectItem key={opt} value={opt}>
											{opt}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{/* Kategori multi-select */}
						<div className="flex flex-col gap-1">
							<label className="text-xs font-medium text-slate-600">
								{t(localizationConstants.category)}
							</label>
							<MultiTagSelect
								label={t(localizationConstants.category)}
								options={KATEGORI_OPTIONS}
								selected={selectedKategori}
								onToggle={handleToggleKategori}
							/>
						</div>

						{/* Typ multi-select */}
						<div className="flex flex-col gap-1">
							<label className="text-xs font-medium text-slate-600">
								{t(localizationConstants.calcProType)}
							</label>
							<MultiTagSelect
								label={t(localizationConstants.calcProType)}
								options={TYP_OPTIONS}
								selected={selectedTyp}
								onToggle={handleToggleTyp}
							/>
						</div>

						{/* Entreprenadform */}
						<div className="flex flex-col gap-1">
							<label className="text-xs font-medium text-slate-600">
								{t(localizationConstants.calcStatEntreprenadform)}
							</label>
							<Select value={entreprenadform} onValueChange={setEntreprenadform}>
								<SelectTrigger className="h-9 border-slate-200 text-sm">
									<SelectValue placeholder={t(localizationConstants.calcStatEntreprenadform)} />
								</SelectTrigger>
								<SelectContent>
									{ENTREPRENADFORM_OPTIONS.map((opt) => (
										<SelectItem key={opt} value={opt}>
											{opt}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>

					{/* Row 2: date range + apply */}
					<div className="mt-4 flex items-end gap-4">
						<div className="flex flex-col gap-1">
							<label className="text-xs font-medium text-slate-600">
								{t(localizationConstants.calcStatStartDate)}
							</label>
							<Select value={startDate} onValueChange={setStartDate}>
								<SelectTrigger className="h-9 w-40 border-slate-200 text-sm">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="2025-12-24">2025-12-24</SelectItem>
									<SelectItem value="2025-12-01">2025-12-01</SelectItem>
									<SelectItem value="2025-11-01">2025-11-01</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="flex flex-col gap-1">
							<label className="text-xs font-medium text-slate-600">
								{t(localizationConstants.calcStatEndDate)}
							</label>
							<Select value={endDate} onValueChange={setEndDate}>
								<SelectTrigger className="h-9 w-40 border-slate-200 text-sm">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="2025-12-30">2025-12-30</SelectItem>
									<SelectItem value="2025-12-31">2025-12-31</SelectItem>
									<SelectItem value="2026-01-31">2026-01-31</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<Button
							size="sm"
							onClick={handleApply}
							className="h-9 cursor-pointer bg-neutral-950 px-6 text-sm font-semibold text-white hover:bg-neutral-800"
						>
							<Translate text={localizationConstants.calcStatApply} />
						</Button>
					</div>
				</div>

				{/* Statistics information table */}
				<div className="rounded-lg border border-slate-200 bg-white">
					<div className="border-b border-slate-200 px-5 py-4">
						<h2 className="text-sm font-semibold text-slate-800">
							<Translate text={localizationConstants.calcStatInfoTitle} />
						</h2>
					</div>

					{/* Table toolbar */}
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
					</div>

					{/* Table */}
					<div className="b2b-table-scroll overflow-x-auto">
						<table className="min-w-max w-full text-sm">
							<thead>
								<tr className="border-b border-slate-200 bg-white">
									<th scope="col" className={TH_SORTABLE} onClick={() => toggleSort("datum")}>
										<span className="flex items-center gap-1">
											{t(localizationConstants.date)}
											{renderSortIcon("datum", sortField, sortDir)}
										</span>
									</th>
									<th scope="col" className={TH_SORTABLE} onClick={() => toggleSort("bestellare")}>
										<span className="flex items-center gap-1">
											{t(localizationConstants.calcStatBestellare)}
											{renderSortIcon("bestellare", sortField, sortDir)}
										</span>
									</th>
									<th scope="col" className={TH_SORTABLE} onClick={() => toggleSort("kategori")}>
										<span className="flex items-center gap-1">
											{t(localizationConstants.category)}
											{renderSortIcon("kategori", sortField, sortDir)}
										</span>
									</th>
									<th scope="col" className={TH_SORTABLE} onClick={() => toggleSort("typ")}>
										<span className="flex items-center gap-1">
											{t(localizationConstants.calcProType)}
											{renderSortIcon("typ", sortField, sortDir)}
										</span>
									</th>
									<th scope="col" className={TH_SORTABLE} onClick={() => toggleSort("entreprenadform")}>
										<span className="flex items-center gap-1">
											{t(localizationConstants.calcStatEntreprenadform)}
											{renderSortIcon("entreprenadform", sortField, sortDir)}
										</span>
									</th>
									<th scope="col" className={TH_SORTABLE} onClick={() => toggleSort("antalOffert")}>
										<span className="flex items-center gap-1">
											{t(localizationConstants.calcStatAntalOffert)}
											{renderSortIcon("antalOffert", sortField, sortDir)}
										</span>
									</th>
									<th scope="col" className={TH_SORTABLE} onClick={() => toggleSort("vunna")}>
										<span className="flex items-center gap-1">
											{t(localizationConstants.calcStatVunna)}
											{renderSortIcon("vunna", sortField, sortDir)}
										</span>
									</th>
									<th scope="col" className={TH_SORTABLE} onClick={() => toggleSort("forlorade")}>
										<span className="flex items-center gap-1">
											{t(localizationConstants.calcStatForlorade)}
											{renderSortIcon("forlorade", sortField, sortDir)}
										</span>
									</th>
									<th scope="col" className={TH_PLAIN} />
								</tr>
							</thead>
							<tbody>
								{paginated.length === 0 ? (
									<tr>
										<td
											colSpan={9}
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
											<td className="whitespace-nowrap px-4 py-3 tabular-nums text-slate-600">
												{row.datum}
											</td>
											<td className="whitespace-nowrap px-4 py-3 font-medium text-slate-900">
												{row.bestellare}
											</td>
											<td className="whitespace-nowrap px-4 py-3 text-slate-600">
												{row.kategori}
											</td>
											<td className="whitespace-nowrap px-4 py-3 text-slate-600">
												{row.typ}
											</td>
											<td className="whitespace-nowrap px-4 py-3 text-slate-600">
												{row.entreprenadform}
											</td>
											<td className="whitespace-nowrap px-4 py-3 tabular-nums text-slate-800">
												{row.antalOffert}
											</td>
											<td className="whitespace-nowrap px-4 py-3 tabular-nums text-emerald-700">
												{row.vunna}
											</td>
											<td className="whitespace-nowrap px-4 py-3 tabular-nums text-red-600">
												{row.forlorade}
											</td>
											<td className="whitespace-nowrap px-4 py-3">
												<button
													type="button"
													className="cursor-pointer rounded-md border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
												>
													{t(localizationConstants.calcStatSeList)}
												</button>
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
