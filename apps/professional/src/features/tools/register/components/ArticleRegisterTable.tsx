"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
	Plus,
	Check,
	ChevronDown,
	Eye,
	Pencil,
	Trash2,
	Star,
	Download,
} from "lucide-react";
import { Search } from "@/components/search/Search";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	DataTable,
	type DataTableColumn,
	type DataTableAction,
} from "@/components/table/DataTable";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { ArticleRow } from "../types";
import {
	getArticleListAPIAction,
	toggleArticleFavoriteAPIAction,
} from "../api/articleRegister";

export function ArticleRegisterTable() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	// Namespaced search params to prevent collisions
	const pageParam = searchParams.get("article_page");
	const limitParam = searchParams.get("article_limit");
	const searchParam = searchParams.get("article_search") ?? "";
	const statusParam = searchParams.get("article_status") ?? "all";
	const sortByParam = searchParams.get("article_sortBy") ?? undefined;
	const sortOrderParam = (searchParams.get("article_sortOrder") as "asc" | "desc") ?? undefined;

	const page = pageParam ? Math.max(1, Number.parseInt(pageParam, 10)) : 1;
	const pageSize = limitParam ? Number.parseInt(limitParam, 10) : 10;

	const [data, setData] = useState<ArticleRow[]>([]);
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
			const res = await getArticleListAPIAction({
				page,
				limit: pageSize,
				search: searchParam,
				status: statusParam as "all" | "active" | "inactive",
				sortBy: sortByParam,
				sortOrder: sortOrderParam,
			});
			setData(res.data);
			setTotalItems(res.total);
		} finally {
			setIsLoading(false);
		}
	}, [page, pageSize, searchParam, statusParam, sortByParam, sortOrderParam]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	useEffect(() => {
		setSearchQuery(searchParam);
	}, [searchParam]);

	const handleSearchChange = (value: string) => {
		setSearchQuery(value);
		updateQueryParams({
			article_search: value || null,
			article_page: "1",
		});
	};

	const handleStatusFilterChange = (newStatus: "all" | "active" | "inactive") => {
		updateQueryParams({
			article_status: newStatus === "all" ? null : newStatus,
			article_page: "1",
		});
	};

	const handleSort = (key: string, order: "asc" | "desc" | null) => {
		updateQueryParams({
			article_sortBy: order ? key : null,
			article_sortOrder: order ?? null,
			article_page: "1",
		});
	};

	const handlePageChange = (newPage: number) => {
		updateQueryParams({ article_page: String(newPage) });
	};

	const handlePageSizeChange = (newSize: number) => {
		updateQueryParams({
			article_limit: String(newSize),
			article_page: "1",
		});
	};

	const handleToggleFavorite = useCallback(async (id: string) => {
		setData((prev) =>
			prev.map((item) => (item.id === id ? { ...item, isFavorite: !item.isFavorite } : item)),
		);
		await toggleArticleFavoriteAPIAction(id);
	}, []);

	const columns: DataTableColumn<ArticleRow>[] = useMemo(
		() => [
			{
				key: "isFavorite",
				label: "",
				headerClassName: "w-10 text-center",
				cellClassName: "text-center",
				render: (row) => (
					<button
						type="button"
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
									: "text-slate-400 hover:text-[#111721]"
							}`}
						/>
					</button>
				),
			},
			{
				key: "articleNo",
				label: localizationConstants.articleNoHeader,
				sortable: true,
			},
			{
				key: "description",
				label: localizationConstants.descriptionHeader,
				sortable: true,
			},
			{
				key: "outPriceListA",
				label: localizationConstants.outPriceListAHeader,
				sortable: true,
			},
			{
				key: "calculatedCost",
				label: localizationConstants.calculatedCostHeader,
				sortable: true,
			},
			{
				key: "stock",
				label: localizationConstants.stockHeader,
				sortable: true,
			},
			{
				key: "reserved",
				label: localizationConstants.reservedHeader,
				sortable: true,
			},
			{
				key: "available",
				label: localizationConstants.availableHeader,
				sortable: true,
			},
			{
				key: "stockValue",
				label: localizationConstants.stockValueHeader,
				sortable: true,
			},
			{
				key: "status",
				label: localizationConstants.countryHeader,
				sortable: true,
				render: (row) => (
					<span
						className={`inline-flex items-center justify-center rounded-md px-3 py-1 text-xs font-semibold text-white ${
							row.status === "active" ? "bg-[#16A34A]" : "bg-slate-400"
						}`}
					>
						{row.status === "active" ? (
							<Translate text={localizationConstants.activeStatus} />
						) : (
							<Translate text={localizationConstants.inactiveStatus} />
						)}
					</span>
				),
			},
			{
				key: "view",
				label: "",
				headerClassName: "w-10 text-center",
				cellClassName: "text-center",
				render: (row) => (
					<button
						type="button"
						onClick={(e) => {
							e.stopPropagation();
							router.push(`/tools/register/articles/${row.id}`);
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

	const actions: DataTableAction<ArticleRow>[] = useMemo(
		() => [
			{
				label: localizationConstants.viewLabel,
				icon: <Eye className="h-4 w-4" />,
				onClick: (row) => router.push(`/tools/register/articles/${row.id}`),
			},
			{
				label: localizationConstants.editLabel,
				icon: <Pencil className="h-4 w-4" />,
				onClick: (row) => void row,
			},
			{
				label: localizationConstants.deleteLabel,
				icon: <Trash2 className="h-4 w-4" />,
				destructive: true,
				onClick: (row) => void row,
			},
		],
		[router],
	);

	return (
		<div className="flex flex-col gap-6">
			{/* Top Action & Search Bar */}
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
								<ChevronDown className="h-3.5 w-3.5 opacity-50" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="start" className="w-48 bg-white border-slate-200 shadow-md">
							<DropdownMenuItem
								onClick={() => handleStatusFilterChange("all")}
								className="flex items-center justify-between text-xs cursor-pointer focus:bg-slate-100"
							>
								<Translate text={localizationConstants.allStatus} />
								{statusParam === "all" && <Check className="h-4 w-4 text-slate-700" />}
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => handleStatusFilterChange("active")}
								className="flex items-center justify-between text-xs cursor-pointer focus:bg-slate-100"
							>
								<Translate text={localizationConstants.activeStatus} />
								{statusParam === "active" && <Check className="h-4 w-4 text-slate-700" />}
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => handleStatusFilterChange("inactive")}
								className="flex items-center justify-between text-xs cursor-pointer focus:bg-slate-100"
							>
								<Translate text={localizationConstants.inactiveStatus} />
								{statusParam === "inactive" && <Check className="h-4 w-4 text-slate-700" />}
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full xl:w-auto justify-end">
					<Button
						variant="outline"
						onClick={() => router.push("/tools/register/import-article")}
						className="h-10 w-full sm:w-auto gap-2 border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 hover:bg-slate-50 shadow-2xs justify-center"
					>
						<Download className="h-4 w-4 text-slate-700" aria-hidden />
						<Translate text={localizationConstants.importArticles} />
					</Button>

					<Button
						onClick={() => router.push("/tools/register/create-article")}
						className="h-10 w-full sm:w-auto gap-2 rounded-lg bg-[#111721] px-5 text-sm font-medium text-white shadow-2xs hover:bg-slate-800 justify-center"
					>
						<Plus className="h-4 w-4" aria-hidden />
						<Translate text={localizationConstants.registerNew} />
					</Button>
				</div>
			</div>

			{/* Reusable DataTable Component */}
			<DataTable
				data={data}
				columns={columns}
				rowKey={(row) => row.id}
				actions={actions}
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
