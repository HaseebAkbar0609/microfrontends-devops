"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ChevronsUpDown, ChevronUp, ChevronDown, MoreVertical, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { useDebounce } from "@/hooks/useDebounce";
import { OfferRequest, OFFER_REQUEST_TYPE_BADGE_CLASSES } from "../constants/offerRequests";

type SortField = keyof OfferRequest;
type SortDir = "asc" | "desc" | null;

interface Props {
	offerId: string;
	requests: OfferRequest[];
}

export function OfferRequestView({ offerId, requests }: Props) {
	const t = useTranslate();
	const router = useRouter();
	const [search, setSearch] = useState("");
	const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
	const [selectedMunicipalities, setSelectedMunicipalities] = useState<string[]>([]);
	const [sortField, setSortField] = useState<SortField | null>(null);
	const [sortDir, setSortDir] = useState<SortDir>(null);
	const [page, setPage] = useState(1);
	const [rowsPerPage] = useState(10);

	const debouncedSearch = useDebounce(search, 300);

	const uniqueTypes = useMemo(() => [...new Set(requests.map((r) => r.type))], [requests]);
	const uniqueMunicipalities = useMemo(() => [...new Set(requests.map((r) => r.municipality))], [requests]);
	const activeFilterCount = selectedTypes.length + selectedMunicipalities.length;

	const filtered = useMemo(() => {
		const q = debouncedSearch.toLowerCase();
		return requests.filter((r) => {
			const matchesSearch =
				r.trackingNumber.toLowerCase().includes(q) ||
				r.jobName.toLowerCase().includes(q) ||
				r.customerName.toLowerCase().includes(q);
			const matchesType = selectedTypes.length === 0 || selectedTypes.includes(r.type);
			const matchesMunicipality = selectedMunicipalities.length === 0 || selectedMunicipalities.includes(r.municipality);
			return matchesSearch && matchesType && matchesMunicipality;
		});
	}, [debouncedSearch, selectedTypes, selectedMunicipalities, requests]);

	const sorted = useMemo(() => {
		if (!sortField || !sortDir) return filtered;
		return [...filtered].sort((a, b) => {
			const av = a[sortField as keyof OfferRequest];
			const bv = b[sortField as keyof OfferRequest];
			if (typeof av === "number" && typeof bv === "number")
				return sortDir === "asc" ? av - bv : bv - av;
			return sortDir === "asc"
				? String(av).localeCompare(String(bv))
				: String(bv).localeCompare(String(av));
		});
	}, [filtered, sortField, sortDir]);

	const totalPages = Math.max(1, Math.ceil(sorted.length / rowsPerPage));
	const paginated = sorted.slice((page - 1) * rowsPerPage, page * rowsPerPage);

	const totalBudget = filtered.reduce((sum, r) => sum + r.preliminaryBudget, 0);

	function toggleSort(field: SortField) {
		if (sortField !== field) {
			setSortField(field);
			setSortDir("asc");
		} else if (sortDir === "asc") {
			setSortDir("desc");
		} else {
			setSortField(null);
			setSortDir(null);
		}
	}

	function SortIcon({ field }: { field: SortField }) {
		if (sortField !== field) return <ChevronsUpDown size={14} className="shrink-0 text-slate-400" />;
		if (sortDir === "asc") return <ChevronUp size={14} className="shrink-0" />;
		return <ChevronDown size={14} className="shrink-0" />;
	}

	const columns: { key: SortField; label: string; sortable: boolean }[] = [
		{ key: "trackingNumber", label: t(localizationConstants.offerRequestTrackingNumber), sortable: false },
		{ key: "jobName", label: t(localizationConstants.job), sortable: true },
		{ key: "customerName", label: t(localizationConstants.offerRequestCustomerName), sortable: true },
		{ key: "municipality", label: t(localizationConstants.municipality), sortable: true },
		{ key: "type", label: t(localizationConstants.type), sortable: true },
		{ key: "latestOfferDate", label: t(localizationConstants.offerRequestLatestOfferDate), sortable: true },
		{ key: "preliminaryBudget", label: t(localizationConstants.offerRequestPreliminaryBudget), sortable: true },
		{ key: "assignee", label: t(localizationConstants.offerRequestAssignee), sortable: true },
	];

	return (
		<div className="flex flex-1 flex-col bg-white">
			{/* Toolbar */}
			<div className="flex items-center justify-between gap-2 border-b border-slate-200 px-5 py-3">
				<div className="flex items-center gap-2">
					<div className="relative w-75">
						<Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50 text-slate-900" />
						<Input
							placeholder={t(localizationConstants.search)}
							value={search}
							onChange={(e) => { setSearch(e.target.value); setPage(1); }}
							className="h-10 rounded-none border-0 border-b border-slate-200 pl-8 text-sm shadow-none focus-visible:ring-0"
						/>
					</div>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" size="sm" className="h-9 cursor-pointer gap-1.5 text-sm">
								{t(localizationConstants.filter)}
								{activeFilterCount > 0 && (
									<span className="flex h-4 w-4 items-center justify-center rounded-full bg-neutral-950 text-[10px] text-white">
										{activeFilterCount}
									</span>
								)}
								<ChevronDown size={14} />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="start" className="w-48">
							<DropdownMenuLabel className="text-xs font-medium text-slate-500">
								{t(localizationConstants.type)}
							</DropdownMenuLabel>
							{uniqueTypes.map((type) => (
								<DropdownMenuCheckboxItem
									key={type}
									checked={selectedTypes.includes(type)}
									onCheckedChange={(checked) => {
										setSelectedTypes((prev) => checked ? [...prev, type] : prev.filter((x) => x !== type));
										setPage(1);
									}}
								>
									{type}
								</DropdownMenuCheckboxItem>
							))}
							<DropdownMenuSeparator />
							<DropdownMenuLabel className="text-xs font-medium text-slate-500">
								{t(localizationConstants.municipality)}
							</DropdownMenuLabel>
							{uniqueMunicipalities.map((muni) => (
								<DropdownMenuCheckboxItem
									key={muni}
									checked={selectedMunicipalities.includes(muni)}
									onCheckedChange={(checked) => {
										setSelectedMunicipalities((prev) => checked ? [...prev, muni] : prev.filter((x) => x !== muni));
										setPage(1);
									}}
								>
									{muni}
								</DropdownMenuCheckboxItem>
							))}
							{activeFilterCount > 0 && (
								<>
									<DropdownMenuSeparator />
									<DropdownMenuItem
										className="cursor-pointer text-xs text-slate-500"
										onClick={() => { setSelectedTypes([]); setSelectedMunicipalities([]); setPage(1); }}
									>
										{t(localizationConstants.clearFilters)}
									</DropdownMenuItem>
								</>
							)}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				<Button
					size="sm"
					className="h-10 cursor-pointer bg-neutral-950 px-4 text-sm text-white hover:bg-neutral-800"
				>
					{t(localizationConstants.offerRequestAddNewProject)}
				</Button>
			</div>

			<div className="flex flex-1 flex-col gap-4 px-5 py-4">
				{/* Total budget */}
				<p className="text-base font-semibold text-slate-900">
					{t(localizationConstants.offerRequestTotalBudget)}:{" "}
					{totalBudget.toLocaleString()}
				</p>

				{/* Table — scrollable columns, sticky actions column */}
				<div className="overflow-x-auto rounded-lg border border-slate-200">
					<table className="w-full text-sm" style={{ minWidth: "1000px" }}>
						<thead>
							<tr className="border-b border-slate-200 bg-white">
								{columns.map((col) => (
									<th
										key={col.key}
										className={cn(
											"whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-slate-500",
											col.sortable && "cursor-pointer select-none hover:text-slate-800",
										)}
										onClick={() => col.sortable && toggleSort(col.key)}
									>
										<span className="flex items-center gap-1">
											{col.label}
											{col.sortable && <SortIcon field={col.key} />}
										</span>
									</th>
								))}
								<th className="sticky right-0 border-l border-slate-200 bg-white px-4 py-3" />
							</tr>
						</thead>
						<tbody>
							{paginated.map((row) => (
								<tr
									key={row.id}
									className="group border-b border-slate-200 last:border-0 hover:bg-slate-50"
								>
									<td className="whitespace-nowrap px-4 py-4 text-slate-600">{row.trackingNumber}</td>
									<td className="whitespace-nowrap px-4 py-4 font-semibold text-slate-900">
										<span className="block max-w-36 truncate">{row.jobName}</span>
									</td>
									<td className="whitespace-nowrap px-4 py-4 text-slate-700">{row.customerName}</td>
									<td className="whitespace-nowrap px-4 py-4 text-slate-700">{row.municipality}</td>
									<td className="whitespace-nowrap px-4 py-4">
										<span className={cn(
											"inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium",
											OFFER_REQUEST_TYPE_BADGE_CLASSES[row.type] ?? "bg-slate-100 text-slate-800",
										)}>
											{row.type}
										</span>
									</td>
									<td className="whitespace-nowrap px-4 py-4 text-slate-700">{row.latestOfferDate}</td>
									<td className="whitespace-nowrap px-4 py-4 text-right font-medium text-slate-900">
										{row.preliminaryBudget.toLocaleString()}
									</td>
									<td className="whitespace-nowrap px-4 py-4 text-slate-700">{row.assignee}</td>
									<td className="sticky right-0 border-l border-slate-200 bg-white px-4 py-4 group-hover:bg-slate-50">
										<div className="flex items-center gap-3">
											<Button
												size="sm"
												className="h-9 cursor-pointer bg-slate-100 px-2 py-1.5 text-sm font-medium text-slate-900 hover:bg-slate-200"
												onClick={() => router.push(`/module/business/offer/${offerId}/request/${row.id}`)}
											>
												{t(localizationConstants.viewProject)}
											</Button>
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button variant="ghost" size="sm" className="h-7 w-7 cursor-pointer p-0">
														<MoreVertical size={14} />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align="end">
													<DropdownMenuItem>{t(localizationConstants.viewProject)}</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</div>
									</td>
								</tr>
							))}

							{paginated.length === 0 && (
								<tr>
									<td colSpan={columns.length + 1} className="px-4 py-12 text-center text-sm text-slate-400">
										No requests found
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>

				{/* Pagination */}
				<div className="flex items-center justify-between text-sm text-slate-600">
					<div className="flex items-center gap-2">
						<span>{t(localizationConstants.rowsPerPageLabel)}</span>
						<span className="flex h-8 w-16 items-center justify-between rounded border border-slate-200 px-2 text-sm">
							{rowsPerPage}
							<ChevronsUpDown size={12} className="text-slate-400" />
						</span>
					</div>
					<div className="flex items-center gap-3">
						<span>Page {page} of {totalPages}</span>
						<div className="flex items-center gap-1">
							<Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setPage(1)} disabled={page === 1}>«</Button>
							<Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>‹</Button>
							<Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>›</Button>
							<Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setPage(totalPages)} disabled={page === totalPages}>»</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
