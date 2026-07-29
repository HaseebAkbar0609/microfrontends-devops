"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
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
} from "lucide-react";
import Link from "next/link";
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
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { PriceListRegisterRow } from "../types";
import {
	getPriceListRegisterListAPIAction,
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
	}, [page, pageSize, searchParam, sortByParam, sortOrderParam]);

	useEffect(() => {
		void fetchData();
	}, [fetchData]);

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
		await togglePriceListFavoriteAPIAction(id);
	}, []);

	const handleDelete = useCallback(async (id: string) => {
		const success = await deletePriceListAPIAction(id);
		if (success) {
			setData((prev) => prev.filter((item) => item.id !== id));
			setTotalItems((prev) => prev - 1);
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
									? "fill-yellow-400 text-yellow-400"
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
							<DropdownMenuItem className="cursor-pointer text-xs text-slate-700 focus:bg-slate-100 focus:text-slate-900">
								<Translate text={localizationConstants.priceListCategoryFilterAll} />
							</DropdownMenuItem>
							<DropdownMenuItem className="cursor-pointer text-xs text-slate-700 focus:bg-slate-100 focus:text-slate-900">
								<Translate text={localizationConstants.priceListCategoryFilterService} />
							</DropdownMenuItem>
							<DropdownMenuItem className="cursor-pointer text-xs text-slate-700 focus:bg-slate-100 focus:text-slate-900">
								<Translate text={localizationConstants.priceListCategoryFilterPrivate} />
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				<Link href="/tools/register/price-list/create-price-list" passHref>
					<Button className="h-10 w-full sm:w-auto gap-2 rounded-lg bg-[#111721] px-5 text-sm font-medium text-white shadow-2xs hover:bg-slate-800 justify-center self-end">
						<Plus className="h-4 w-4" aria-hidden />
						<Translate text={localizationConstants.registerNew} />
					</Button>
				</Link>
			</div>

			<DataTable
				data={data}
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
	const [selectedPriceList, setSelectedPriceList] = useState("prislista-a");
	const [isEditOpen, setIsEditOpen] = useState(false);
	const [calculation, setCalculation] = useState("procent");
	const [rounding, setRounding] = useState("2decimal");
	const [percentage, setPercentage] = useState("0");

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-2 w-full lg:w-1/3 xl:w-1/4">
				<label className="font-['Inter'] text-sm font-medium leading-5 text-slate-700">
					<Translate text={localizationConstants.priceListTab} />
				</label>
				<Select value={selectedPriceList} onValueChange={setSelectedPriceList}>
					<SelectTrigger className="h-10 w-full border-slate-200 bg-white text-sm text-slate-900 shadow-2xs">
						<SelectValue placeholder={localizationConstants.priceListAOption} />
					</SelectTrigger>
					<SelectContent className="bg-white border-slate-200 shadow-md">
						<SelectItem value="prislista-a" className="focus:bg-slate-100 focus:text-slate-900 data-[state=checked]:bg-slate-100 data-[state=checked]:text-slate-900 cursor-pointer">
							<Translate text={localizationConstants.priceListAOption} />
						</SelectItem>
						<SelectItem value="prislista-b" className="focus:bg-slate-100 focus:text-slate-900 data-[state=checked]:bg-slate-100 data-[state=checked]:text-slate-900 cursor-pointer">
							<Translate text={localizationConstants.priceListBOption} />
						</SelectItem>
						<SelectItem value="prislista-c" className="focus:bg-slate-100 focus:text-slate-900 data-[state=checked]:bg-slate-100 data-[state=checked]:text-slate-900 cursor-pointer">
							<Translate text={localizationConstants.priceListCOption} />
						</SelectItem>
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
						className="inline-flex h-9 gap-2 rounded bg-zinc-100 px-4 py-2 text-sm font-medium leading-5 tracking-normal text-zinc-950 hover:opacity-80"
					>
						<PenLine className="h-4 w-4" />
						<Translate text={localizationConstants.priceListEditButton} />
					</Button>
				</div>
				<CardContent className="px-4 py-4 sm:px-6">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
						<div className="flex flex-col gap-1 min-w-0">
							<span className="text-sm font-medium leading-5 tracking-normal text-zinc-950">
								<Translate text={localizationConstants.priceListBaseCalculationLabel} />
							</span>
							<span className="text-sm leading-5 tracking-normal text-slate-500">
								<Translate text={localizationConstants.priceListInfoPlaceholder} />
							</span>
						</div>
						<div className="flex flex-col gap-1 min-w-0">
							<span className="text-sm font-medium leading-5 tracking-normal text-zinc-950">
								<Translate text={localizationConstants.priceListUpdatePriceListLabel} />
							</span>
							<span className="text-sm leading-5 tracking-normal text-slate-500">
								<Translate text={localizationConstants.priceListInfoPlaceholder} />
							</span>
						</div>
						<div className="flex flex-col gap-1 min-w-0">
							<span className="text-sm font-medium leading-5 tracking-normal text-zinc-950">
								<Translate text={localizationConstants.priceListCalculationLabel} />
							</span>
							<span className="text-sm leading-5 tracking-normal text-slate-500">
								<Translate text={localizationConstants.priceListInfoPlaceholder} />
							</span>
						</div>
						<div className="flex flex-col gap-1 min-w-0">
							<span className="text-sm font-medium leading-5 tracking-normal text-zinc-950">
								<Translate text={localizationConstants.priceListRoundingLabel} />
							</span>
							<span className="text-sm leading-5 tracking-normal text-slate-500">
								<Translate text={localizationConstants.priceListInfoPlaceholder} />
							</span>
						</div>
						<div className="flex flex-col gap-1 min-w-0">
							<span className="text-sm font-medium leading-5 tracking-normal text-zinc-950">
								<Translate text={localizationConstants.priceListIncreaseDecreaseLabel} />
							</span>
							<span className="text-sm leading-5 tracking-normal text-slate-500">
								<Translate text={localizationConstants.priceListInfoPlaceholder} />
							</span>
						</div>
						<div className="flex flex-col gap-1 min-w-0">
							<span className="text-sm font-medium leading-5 tracking-normal text-zinc-950">
								<Translate text={localizationConstants.priceListPercentageLabel} />
							</span>
							<span className="text-sm leading-5 tracking-normal text-slate-500">
								<Translate text={localizationConstants.priceListInfoPlaceholder} />
							</span>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Edit Dialog */}
			<Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
				<DialogContent
					className="flex flex-col !left-[55%] !right-auto sm:!left-1/2 sm:!right-auto !top-1/2 !-translate-x-1/2 !-translate-y-1/2 w-[85vw] max-w-[340px] sm:w-full sm:max-w-[480px] md:max-w-[480px] lg:max-w-[480px] xl:max-w-[480px] bg-white h-[calc(100vh-2rem)] lg:h-auto xl:h-auto max-h-[calc(100vh-2rem)] lg:max-h-[90vh] xl:max-h-[85vh] p-0 gap-0 border-0 rounded-lg shadow-xl"
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
							<Select defaultValue="info">
								<SelectTrigger className="h-10 w-full text-sm text-slate-500">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="info">
										<Translate text={localizationConstants.priceListInfoPlaceholder} />
									</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{/* 2. Uppdatera prislista */}
						<div className="flex flex-col gap-1.5">
							<Label className="font-['Inter'] text-sm font-medium leading-5 tracking-normal text-zinc-950">
								<Translate text={localizationConstants.priceListUpdatePriceListLabel} />
							</Label>
							<Select defaultValue="prislista-a">
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
							<Select defaultValue="oka">
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
							onClick={() => setIsEditOpen(false)}
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
