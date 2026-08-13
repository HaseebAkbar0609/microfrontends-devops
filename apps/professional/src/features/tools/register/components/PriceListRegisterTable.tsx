"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
	Plus,
	ChevronDown,
	Eye,
	Trash2,
	Star,
	Tag,
	PenLine,
	Save,
	Check,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search } from "@/components/search/Search";
import {
	DataTable,
	type DataTableColumn,
	type DataTableAction,
} from "@/components/table/DataTable";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { showToast } from "@/lib/toast";
import type { PriceListRegisterRow, PriceListDetail } from "../types";
import {
	getPriceListRegisterListAPIAction,
	getPriceListDetailAPIAction,
	updatePriceListAPIAction,
	togglePriceListFavoriteAPIAction,
	deletePriceListAPIAction,
} from "../api/priceListRegister";

export function PriceListRegisterTable() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const pageParam = searchParams.get("pricelist_page");
	const limitParam = searchParams.get("pricelist_limit");
	const searchParam = searchParams.get("pricelist_search") ?? "";
	const categoryParam = searchParams.get("pricelist_category") ?? "all";
	const sortByParam = searchParams.get("pricelist_sortBy") ?? undefined;
	const sortOrderParam = (searchParams.get("pricelist_sortOrder") as "asc" | "desc") ?? undefined;

	const page = pageParam ? Math.max(1, Number.parseInt(pageParam, 10)) : 1;
	const pageSize = limitParam ? Number.parseInt(limitParam, 10) : 10;

	const [data, setData] = useState<PriceListRegisterRow[]>([]);
	const [totalItems, setTotalItems] = useState(0);
	const [isLoading, setIsLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState(searchParam);

	const createQueryString = useCallback(
		(updates: Record<string, string | null>) => {
			const params = new URLSearchParams(searchParams.toString());
			for (const [key, value] of Object.entries(updates)) {
				if (value === null || value === "") {
					params.delete(key);
				} else {
					params.set(key, value);
				}
			}
			return params.toString();
		},
		[searchParams],
	);

	const updateQueryParams = useCallback(
		(updates: Record<string, string | null>) => {
			const qs = createQueryString(updates);
			router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
		},
		[pathname, router, createQueryString],
	);

	const fetchData = useCallback(async () => {
		setIsLoading(true);
		try {
			const res = await getPriceListRegisterListAPIAction({
				page,
				limit: pageSize,
				search: searchParam,
				category: categoryParam,
				sortBy: sortByParam,
				sortOrder: sortOrderParam,
			});
			setData(res.data);
			setTotalItems(res.total);
		} catch {
			// Error handled in API action
		} finally {
			setIsLoading(false);
		}
	}, [page, pageSize, searchParam, categoryParam, sortByParam, sortOrderParam]);

	useEffect(() => {
		void fetchData();
	}, [fetchData]);

	const filteredData = useMemo(() => {
		if (!categoryParam || categoryParam === "all") return data;
		const target = categoryParam.toLowerCase();
		return data.filter((item) => {
			const cat = (item.kategori || "").toLowerCase();
			if (target === "service" || target === "tjänst") {
				return cat.includes("service") || cat.includes("tjänst");
			}
			if (target === "private" || target === "privat") {
				return cat.includes("private") || cat.includes("privat");
			}
			return cat.includes(target);
		});
	}, [data, categoryParam]);

	const handleCategoryFilterChange = (newCategory: "all" | "service" | "private") => {
		updateQueryParams({
			pricelist_category: newCategory === "all" ? null : newCategory,
			pricelist_page: "1",
		});
	};

	const handleSearchChange = (value: string) => {
		setSearchQuery(value);
		updateQueryParams({
			pricelist_search: value || null,
			pricelist_page: "1",
		});
	};

	const handleSort = (key: string, order: "asc" | "desc" | null) => {
		updateQueryParams({
			pricelist_sortBy: order ? key : null,
			pricelist_sortOrder: order ?? null,
			pricelist_page: "1",
		});
	};

	const handlePageChange = (newPage: number) => {
		updateQueryParams({ pricelist_page: String(newPage) });
	};

	const handlePageSizeChange = (newSize: number) => {
		updateQueryParams({
			pricelist_limit: String(newSize),
			pricelist_page: "1",
		});
	};

	const handleToggleFavorite = useCallback(async (id: string) => {
		setData((prev) =>
			prev.map((item) => (item.id === id ? { ...item, isFavorite: !item.isFavorite } : item)),
		);
		try {
			const success = await togglePriceListFavoriteAPIAction(id);
			if (!success) {
				setData((prev) =>
					prev.map((item) => (item.id === id ? { ...item, isFavorite: !item.isFavorite } : item)),
				);
			}
		} catch {
			setData((prev) =>
				prev.map((item) => (item.id === id ? { ...item, isFavorite: !item.isFavorite } : item)),
			);
		}
	}, []);

	const handleDelete = useCallback(async (id: string) => {
		try {
			const success = await deletePriceListAPIAction(id);
			if (success) {
				setData((prev) => prev.filter((item) => item.id !== id));
				setTotalItems((prev) => prev - 1);
			}
		} catch {
			// Catch unhandled rejection
		}
	}, []);

	const columns: DataTableColumn<PriceListRegisterRow>[] = useMemo(
		() => [
			{
				key: "isFavorite",
				label: "",
				headerClassName: "w-10 text-center",
				cellClassName: "text-center",
				render: (row) => (
					<button
						type="button"
						aria-label="Toggle favorite"
						onClick={(e) => {
							e.stopPropagation();
							handleToggleFavorite(row.id);
						}}
						className="inline-flex items-center justify-center p-1 rounded hover:bg-slate-100 transition-colors"
					>
						<Star
							className={`h-4 w-4 ${
								row.isFavorite
									? "fill-[#111721] text-[#111721]"
									: "text-slate-300"
							}`}
						/>
					</button>
				),
			},
			{
				key: "kod",
				label: localizationConstants.priceListCodeHeader,
				sortable: true,
			},
			{
				key: "prislista",
				label: localizationConstants.priceListNameHeader,
				sortable: true,
			},
			{
				key: "kategori",
				label: localizationConstants.priceListCategoryHeader,
				sortable: true,
			},
			{
				key: "valuta",
				label: localizationConstants.priceListCurrencyLabel,
				sortable: true,
				render: (row) => row.valuta || "SEK",
			},
			{
				key: "status",
				label: localizationConstants.priceListStatusHeader,
				sortable: true,
				render: (row) => {
					const status = row.status || "active";
					const isBgGreen = status === "active";
					const isBgYellow = status === "draft";
					return (
						<span
							className={`inline-flex items-center justify-center rounded-md px-2.5 py-0.5 text-xs font-semibold text-white ${
								isBgGreen ? "bg-[#16A34A]" : isBgYellow ? "bg-amber-500" : "bg-slate-400"
							}`}
						>
							{status === "active" ? (
								<Translate text={localizationConstants.activeStatus} />
							) : status === "draft" ? (
								<Translate text={localizationConstants.draftStatus} />
							) : (
								<Translate text={localizationConstants.inactiveStatus} />
							)}
						</span>
					);
				},
			},
			{
				key: "giltigPeriod",
				label: localizationConstants.priceListValidPeriodHeader,
				sortable: true,
				render: (row) =>
					row.giltigFran && row.giltigTill ? `${row.giltigFran} - ${row.giltigTill}` : row.datum || "-",
			},
			{
				key: "kopplad",
				label: localizationConstants.priceListLinkedHeader,
				sortable: true,
			},
			{
				key: "skapadAv",
				label: localizationConstants.priceListCreatedByHeader,
				sortable: true,
			},
			{
				key: "datum",
				label: localizationConstants.priceListDateHeader,
				sortable: true,
			},
			{
				key: "senastUppdaterad",
				label: localizationConstants.priceListLastUpdatedHeader,
				sortable: true,
			},
			{
				key: "view",
				label: "",
				headerClassName: "w-10 text-center",
				cellClassName: "text-center",
				render: (row) => (
					<button
						type="button"
						aria-label="View price list details"
						onClick={(e) => {
							e.stopPropagation();
							router.push(`/tools/register/price-list/${row.id}`);
						}}
						className="inline-flex items-center justify-center p-1.5 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
					>
						<Eye className="h-4 w-4" />
					</button>
				),
			},
		],
		[handleToggleFavorite, router],
	);

	const actions: DataTableAction<PriceListRegisterRow>[] = useMemo(
		() => [
			{
				label: localizationConstants.viewLabel,
				icon: <Eye className="h-4 w-4" />,
				onClick: (row) => router.push(`/tools/register/price-list/${row.id}`),
			},
			{
				label: localizationConstants.deleteLabel,
				icon: <Trash2 className="h-4 w-4" />,
				destructive: true,
				onClick: (row) => handleDelete(row.id),
			},
		],
		[router, handleDelete],
	);

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
				<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full xl:w-auto">
					<Search
						value={searchQuery}
						onChange={handleSearchChange}
						placeholder={localizationConstants.search}
						className="h-10 w-full"
						wrapperClassName="w-full sm:w-[240px] md:w-[260px] lg:w-[300px]"
					/>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="outline"
								className="h-10 w-full sm:w-18.75 sm:min-w-18.75 border-slate-200 text-slate-700 font-normal bg-transparent hover:bg-slate-50 gap-1.5 px-2.5 text-xs shadow-2xs justify-between"
							>
								<Translate text={localizationConstants.filter} />
								<ChevronDown className="h-3.5 w-3.5 text-slate-500 shrink-0" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="start" className="w-36 border border-slate-200 bg-white shadow-md rounded-md p-1">
							<DropdownMenuItem
								onClick={() => handleCategoryFilterChange("all")}
								className="flex items-center justify-between cursor-pointer text-xs text-slate-700 focus:bg-slate-100 focus:text-slate-900"
							>
								<Translate text={localizationConstants.priceListCategoryFilterAll} />
								{(categoryParam === "all" || !categoryParam) && <Check className="h-3.5 w-3.5 text-slate-700" />}
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => handleCategoryFilterChange("service")}
								className="flex items-center justify-between cursor-pointer text-xs text-slate-700 focus:bg-slate-100 focus:text-slate-900"
							>
								<Translate text={localizationConstants.priceListCategoryFilterService} />
								{categoryParam === "service" && <Check className="h-3.5 w-3.5 text-slate-700" />}
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => handleCategoryFilterChange("private")}
								className="flex items-center justify-between cursor-pointer text-xs text-slate-700 focus:bg-slate-100 focus:text-slate-900"
							>
								<Translate text={localizationConstants.priceListCategoryFilterPrivate} />
								{categoryParam === "private" && <Check className="h-3.5 w-3.5 text-slate-700" />}
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				<Link href="/tools/register/price-list/create-price-list">
					<Button className="h-10 w-full sm:w-auto gap-2 rounded-lg bg-[#111721] px-5 text-sm font-medium text-white shadow-2xs hover:bg-slate-800 justify-center self-end">
						<Plus className="h-4 w-4" aria-hidden />
						<Translate text={localizationConstants.registerNew} />
					</Button>
				</Link>
			</div>

			<DataTable
				data={filteredData}
				columns={columns as unknown as DataTableColumn<unknown>[]}
				rowKey={(row) => (row as PriceListRegisterRow).id}
				actions={actions as unknown as DataTableAction<unknown>[]}
				loading={isLoading}
				sortBy={sortByParam}
				sortOrder={sortOrderParam}
				onSort={handleSort}
				pagination={{
					page,
					pageSize,
					totalItems,
				}}
				onPageChange={handlePageChange}
				onPageSizeChange={handlePageSizeChange}
			/>
		</div>
	);
}

export function PriceListUpdatePanel() {
	const t = useTranslate();
	const [priceLists, setPriceLists] = useState<PriceListRegisterRow[]>([]);
	const [selectedPriceListId, setSelectedPriceListId] = useState("");
	const [detail, setDetail] = useState<PriceListDetail | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const [isEditOpen, setIsEditOpen] = useState(false);
	const [baseCalculation, setBaseCalculation] = useState("info");
	const [updatePriceList, setUpdatePriceList] = useState("prislista-a");
	const [calculation, setCalculation] = useState("procent");
	const [rounding, setRounding] = useState("2decimal");
	const [increaseDecrease, setIncreaseDecrease] = useState("oka");
	const [percentage, setPercentage] = useState("0");

	const selectedPriceListIdRef = useRef(selectedPriceListId);
	useEffect(() => {
		selectedPriceListIdRef.current = selectedPriceListId;
	}, [selectedPriceListId]);

	const tRef = useRef(t);
	useEffect(() => {
		tRef.current = t;
	}, [t]);

	useEffect(() => {
		let cancelled = false;
		const fetchAllPriceLists = async () => {
			try {
				const firstRes = await getPriceListRegisterListAPIAction({ page: 1, limit: 100 });
				if (cancelled) return;
				let allLists = [...firstRes.data];
				const maxPages = Math.min(firstRes.totalPages ?? 1, 10);
				if (maxPages > 1) {
					const remainingPromises = [];
					for (let p = 2; p <= maxPages; p++) {
						remainingPromises.push(getPriceListRegisterListAPIAction({ page: p, limit: 100 }));
					}
					const remainingResults = await Promise.all(remainingPromises);
					if (cancelled) return;
					for (const r of remainingResults) {
						allLists = allLists.concat(r.data);
					}
				}
				setPriceLists(allLists);
				if (allLists.length > 0) {
					setSelectedPriceListId((prev) =>
						prev && allLists.some((item) => item.id === prev) ? prev : allLists[0].id,
					);
				}
			} catch {
				if (cancelled) return;
				showToast("error", tRef.current(localizationConstants.priceListUpdateError));
			} finally {
				if (!cancelled) setIsLoading(false);
			}
		};

		void fetchAllPriceLists();

		return () => {
			cancelled = true;
		};
	}, []);

	useEffect(() => {
		setDetail(null);
		if (!selectedPriceListId) return;
		let cancelled = false;
		getPriceListDetailAPIAction(selectedPriceListId)
			.then((data) => {
				if (cancelled || !data) return;
				setDetail(data);
				setBaseCalculation(data.baseCalculation || "info");
				setUpdatePriceList(data.updatePriceList || "prislista-a");
				setCalculation(data.calculation || "procent");
				setRounding(data.rounding || "2decimal");
				setIncreaseDecrease(data.increaseDecrease || "oka");
				setPercentage(data.percentage || "0");
			})
			.catch(() => {
				if (cancelled) return;
				setDetail(null);
				showToast("error", tRef.current(localizationConstants.priceListUpdateError));
			});
		return () => {
			cancelled = true;
		};
	}, [selectedPriceListId]);

	const priceListVariantLabel = (value?: string) =>
		value === "prislista-b"
			? t(localizationConstants.priceListBOption)
			: value === "prislista-c"
				? t(localizationConstants.priceListCOption)
				: t(localizationConstants.priceListAOption);

	const baseCalculationLabel = (value?: string) =>
		!value || value === "info"
			? t(localizationConstants.priceListInfoPlaceholder)
			: value === "prislista-a" || value === "prislista-b" || value === "prislista-c"
				? priceListVariantLabel(value)
				: value;

	const calculationLabel = (value?: string) =>
		value === "index"
			? t(localizationConstants.priceListIndexOption)
			: value === "sek"
				? t(localizationConstants.priceListSekOption)
				: t(localizationConstants.priceListProcentOption);

	const roundingLabel = (value?: string) =>
		value === "helkrona"
			? t(localizationConstants.priceListHelKronaOption)
			: t(localizationConstants.priceList2DecimalOption);

	const directionLabel = (value?: string) =>
		value === "minska"
			? t(localizationConstants.priceListMinskaOption)
			: t(localizationConstants.priceListOkaOption);

	const handleSave = async () => {
		if (!detail || isSaving) return;
		const targetId = detail.id;
		if (targetId !== selectedPriceListId) return;
		setIsSaving(true);
		try {
			// Validate percentage: must be non-empty, numeric, and between 0 and 100 inclusive
			const percRaw = (percentage ?? "").toString().trim();
			if (percRaw === "") {
				showToast("error", t(localizationConstants.validationFailedError));
				setIsSaving(false);
				return;
			}
			const percNum = Number(percRaw);
			if (!Number.isFinite(percNum) || percNum < 0 || percNum > 100) {
				showToast("error", t(localizationConstants.validationFailedError));
				setIsSaving(false);
				return;
			}
			const success = await updatePriceListAPIAction({
				id: targetId,
				baseCalculation,
				updatePriceList,
				calculation,
				rounding,
				increaseDecrease,
				percentage: String(percNum),
			});
			if (success) {
				// Immediately show success and close the editor. Refresh detail in background.
				showToast("success", t(localizationConstants.priceListUpdateSuccess));
				setIsEditOpen(false);
				void (async () => {
					try {
						const updated = await getPriceListDetailAPIAction(targetId);
						if (updated && updated.id === selectedPriceListIdRef.current) {
							setDetail(updated);
						}
					} catch (err) {
						// Refresh failed - do not convert committed update into an error state.
						console.warn("Price list detail refresh failed:", err);
					}
				})();
			} else {
				showToast("error", t(localizationConstants.priceListUpdateError));
			}
		} catch {
			showToast("error", t(localizationConstants.priceListUpdateError));
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-2 w-full lg:w-1/3 xl:w-1/4">
				<label className="font-['Inter'] text-sm font-medium leading-5 text-slate-700">
					<Translate text={localizationConstants.priceListTab} />
				</label>
				<Select
					value={selectedPriceListId}
					onValueChange={(val) => {
						if (!isSaving) setSelectedPriceListId(val);
					}}
				>
					<SelectTrigger className="h-10 w-full border-slate-200 bg-white text-sm text-slate-900 shadow-2xs">
						<SelectValue placeholder={t(localizationConstants.priceListAOption)} />
					</SelectTrigger>
					<SelectContent className="bg-white border-slate-200 shadow-md">
						{priceLists.map((row) => (
							<SelectItem
								key={row.id}
								value={row.id}
								className="focus:bg-slate-100 focus:text-slate-900 data-[state=checked]:bg-slate-100 data-[state=checked]:text-slate-900 cursor-pointer"
							>
								{row.kod ? `${row.kod} - ` : ""}
								{row.prislista}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<Card className="w-full gap-0 p-0">
				<div className="flex h-14 flex-row items-center justify-between border-b border-slate-200 px-4 py-4 sm:px-6">
					<CardTitle className="flex items-center gap-2 min-w-0 text-sm font-medium sm:text-base leading-6 tracking-normal text-zinc-950">
						<span className="inline-flex shrink-0">
							<Tag className="h-5 w-5 text-slate-700" />
						</span>
						<Translate text={localizationConstants.priceListUpdateTitle} />
					</CardTitle>
					<Button
						variant="ghost"
						size="sm"
						onClick={() => setIsEditOpen(true)}
						disabled={!detail}
						className="inline-flex h-9 gap-2 rounded bg-zinc-100 px-4 py-2 text-sm font-medium leading-5 tracking-normal text-zinc-950 hover:opacity-80"
					>
						<PenLine className="h-4 w-4" />
						<Translate text={localizationConstants.priceListEditButton} />
					</Button>
				</div>
				<CardContent className="px-4 py-4 sm:px-6">
					{isLoading ? (
						<div className="py-8 text-center text-sm text-slate-500">
							<Translate text={localizationConstants.genericLoading} />
						</div>
					) : priceLists.length === 0 ? (
						<div className="py-8 text-center text-sm text-slate-500">
							<Translate text={localizationConstants.priceListInfoPlaceholder} />
						</div>
					) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
						<div className="flex flex-col gap-1 min-w-0">
							<span className="text-sm font-medium leading-5 tracking-normal text-zinc-950">
								<Translate text={localizationConstants.priceListBaseCalculationLabel} />
							</span>
							<span className="text-sm leading-5 tracking-normal text-slate-500">
								{detail ? baseCalculationLabel(detail.baseCalculation) : "-"}
							</span>
						</div>
						<div className="flex flex-col gap-1 min-w-0">
							<span className="text-sm font-medium leading-5 tracking-normal text-zinc-950">
								<Translate text={localizationConstants.priceListUpdatePriceListLabel} />
							</span>
							<span className="text-sm leading-5 tracking-normal text-slate-500">
								{detail ? priceListVariantLabel(detail.updatePriceList) : "-"}
							</span>
						</div>
						<div className="flex flex-col gap-1 min-w-0">
							<span className="text-sm font-medium leading-5 tracking-normal text-zinc-950">
								<Translate text={localizationConstants.priceListCalculationLabel} />
							</span>
							<span className="text-sm leading-5 tracking-normal text-slate-500">
								{detail ? calculationLabel(detail.calculation) : "-"}
							</span>
						</div>
						<div className="flex flex-col gap-1 min-w-0">
							<span className="text-sm font-medium leading-5 tracking-normal text-zinc-950">
								<Translate text={localizationConstants.priceListRoundingLabel} />
							</span>
							<span className="text-sm leading-5 tracking-normal text-slate-500">
								{detail ? roundingLabel(detail.rounding) : "-"}
							</span>
						</div>
						<div className="flex flex-col gap-1 min-w-0">
							<span className="text-sm font-medium leading-5 tracking-normal text-zinc-950">
								<Translate text={localizationConstants.priceListIncreaseDecreaseLabel} />
							</span>
							<span className="text-sm leading-5 tracking-normal text-slate-500">
								{detail ? directionLabel(detail.increaseDecrease) : "-"}
							</span>
						</div>
						<div className="flex flex-col gap-1 min-w-0">
							<span className="text-sm font-medium leading-5 tracking-normal text-zinc-950">
								<Translate text={localizationConstants.priceListPercentageLabel} />
							</span>
							<span className="text-sm leading-5 tracking-normal text-slate-500">
								{detail?.percentage || "-"}
							</span>
						</div>
					</div>
					)}
				</CardContent>
			</Card>

			{/* Edit Dialog */}
			<Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
				<DialogContent
					className={cn(
						"flex flex-col left-[55%]! right-auto! sm:left-1/2! sm:right-auto! top-1/2! -translate-x-1/2! -translate-y-1/2!",
						"w-[85vw] max-w-85 sm:w-full sm:max-w-120 md:max-w-120 lg:max-w-120 xl:max-w-120 bg-white h-[calc(100vh-2rem)] lg:h-auto xl:h-auto max-h-[calc(100vh-2rem)] lg:max-h-[90vh] xl:max-h-[85vh] p-0 gap-0 border-0 rounded-lg shadow-xl",
					)}
				>
					<DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4 shrink-0 border-b border-slate-100">
						<DialogTitle className="flex items-center gap-2 text-base font-semibold text-zinc-950">
							<Tag className="h-5 w-5 text-slate-700" />
							<Translate text={localizationConstants.priceListUpdateTitle} />
						</DialogTitle>
					</DialogHeader>
					<div className="flex flex-col gap-3 sm:gap-4 px-4 sm:px-6 py-4 overflow-y-auto flex-1 min-h-0">
						{/* 1. Basera omräkning på */}
						<div className="flex flex-col gap-1.5">
							<Label className="font-['Inter'] text-sm font-medium leading-5 tracking-normal text-zinc-950">
								<Translate text={localizationConstants.priceListBaseCalculationLabel} />
							</Label>
							<Select value={baseCalculation} onValueChange={setBaseCalculation}>
								<SelectTrigger className="h-10 w-full text-sm text-slate-500">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="info">
										<Translate text={localizationConstants.priceListInfoPlaceholder} />
									</SelectItem>
									{baseCalculation && baseCalculation !== "info" ? (
										<SelectItem value={baseCalculation}>{baseCalculationLabel(baseCalculation)}</SelectItem>
									) : null}
								</SelectContent>
							</Select>
						</div>

						{/* 2. Uppdatera prislista */}
						<div className="flex flex-col gap-1.5">
							<Label className="font-['Inter'] text-sm font-medium leading-5 tracking-normal text-zinc-950">
								<Translate text={localizationConstants.priceListUpdatePriceListLabel} />
							</Label>
							<Select value={updatePriceList} onValueChange={setUpdatePriceList}>
								<SelectTrigger className="h-10 w-full text-sm text-slate-900">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="prislista-a">
										<Translate text={localizationConstants.priceListAOption} />
									</SelectItem>
									<SelectItem value="prislista-b">
										<Translate text={localizationConstants.priceListBOption} />
									</SelectItem>
									<SelectItem value="prislista-c">
										<Translate text={localizationConstants.priceListCOption} />
									</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{/* 3. Beräkning */}
						<div className="flex flex-col gap-1.5">
							<Label className="font-['Inter'] text-sm font-medium leading-5 tracking-normal text-zinc-950">
								<Translate text={localizationConstants.priceListCalculationLabel} />
							</Label>
							<div className="flex gap-2">
								<Button
									variant="outline"
									onClick={() => setCalculation("procent")}
									className={`h-10 flex-1 text-sm font-medium border-slate-200 ${
										calculation === "procent"
											? "bg-[#7373730D] text-slate-900 border-slate-200"
											: "bg-white text-slate-900"
									}`}
								>
									<Translate text={localizationConstants.priceListProcentOption} />
								</Button>
								<Button
									variant="outline"
									onClick={() => setCalculation("index")}
									className={`h-10 flex-1 text-sm font-medium border-slate-200 ${
										calculation === "index"
											? "bg-[#7373730D] text-slate-900 border-slate-200"
											: "bg-white text-slate-900"
									}`}
								>
									<Translate text={localizationConstants.priceListIndexOption} />
								</Button>
								<Button
									variant="outline"
									onClick={() => setCalculation("sek")}
									className={`h-10 flex-1 text-sm font-medium border-slate-200 ${
										calculation === "sek"
											? "bg-[#7373730D] text-slate-900 border-slate-200"
											: "bg-white text-slate-900"
									}`}
								>
									<Translate text={localizationConstants.priceListSekOption} />
								</Button>
							</div>
						</div>

						{/* 4. Avrundning */}
						<div className="flex flex-col gap-1.5">
							<Label className="font-['Inter'] text-sm font-medium leading-5 tracking-normal text-zinc-950">
								<Translate text={localizationConstants.priceListRoundingLabel} />
							</Label>
							<div className="flex gap-2">
								<Button
									variant="outline"
									onClick={() => setRounding("2decimal")}
									className={`h-10 flex-1 text-sm font-medium border-slate-200 ${
										rounding === "2decimal"
											? "bg-[#7373730D] text-slate-900 border-slate-200"
											: "bg-white text-slate-900"
									}`}
								>
									<Translate text={localizationConstants.priceList2DecimalOption} />
								</Button>
								<Button
									variant="outline"
									onClick={() => setRounding("helkrona")}
									className={`h-10 flex-1 text-sm font-medium border-slate-200 ${
										rounding === "helkrona"
											? "bg-[#7373730D] text-slate-900 border-slate-200"
											: "bg-white text-slate-900"
									}`}
								>
									<Translate text={localizationConstants.priceListHelKronaOption} />
								</Button>
							</div>
						</div>

						{/* 5. Öka/Minska */}
						<div className="flex flex-col gap-1.5">
							<Label className="font-['Inter'] text-sm font-medium leading-5 tracking-normal text-zinc-950">
								<Translate text={localizationConstants.priceListIncreaseDecreaseLabel} />
							</Label>
							<Select value={increaseDecrease} onValueChange={setIncreaseDecrease}>
								<SelectTrigger className="h-10 w-full text-sm text-slate-900">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="oka">
										<Translate text={localizationConstants.priceListOkaOption} />
									</SelectItem>
									<SelectItem value="minska">
										<Translate text={localizationConstants.priceListMinskaOption} />
									</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{/* 6. Procentsats (%) */}
						<div className="flex flex-col gap-1.5">
							<Label className="font-['Inter'] text-sm font-medium leading-5 tracking-normal text-zinc-950">
								<Translate text={localizationConstants.priceListPercentageLabel} />
							</Label>
							<Input
								type="number"
								min="0"
								max="100"
								step="any"
								className="h-10 text-sm"
								value={percentage}
								onChange={(e) => {
									const val = e.target.value.replace(/[^0-9.]/g, "");
									setPercentage(val);
								}}
								placeholder="0"
							/>
						</div>
					</div>
					<DialogFooter className="px-4 sm:px-6 py-3 sm:py-4 shrink-0 border-t border-slate-200 flex flex-col-reverse sm:flex-row gap-2 sm:justify-end">
						<Button
							variant="outline"
							onClick={() => setIsEditOpen(false)}
							className="h-10 w-full sm:w-auto px-8 min-w-30 text-sm font-medium border-slate-200 bg-transparent hover:bg-slate-100 text-slate-900 shadow-none"
						>
							<Translate text={localizationConstants.priceListCloseButton} />
						</Button>
						<Button
							onClick={() => handleSave()}
							disabled={!detail || isSaving}
							className="h-10 w-full sm:w-auto px-8 min-w-30 text-sm font-medium gap-2 bg-[#111721] hover:bg-slate-800"
						>
							<Save className="h-4 w-4" />
							<Translate text={localizationConstants.priceListSaveButton} />
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
