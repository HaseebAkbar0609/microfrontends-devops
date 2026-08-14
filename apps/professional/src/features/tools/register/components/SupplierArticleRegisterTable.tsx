"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
	Plus,
	Eye,
	Pencil,
	Trash2,
} from "lucide-react";
import { Search } from "@/components/search/Search";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	DataTable,
	type DataTableColumn,
	type DataTableAction,
} from "@/components/table/DataTable";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { showToast } from "@/lib/toast";
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
import type { SupplierArticleRow } from "../types";
import {
	getSupplierArticleListAPIAction,
	getSupplierNameOptionsAPIAction,
	deleteSupplierArticleAPIAction,
} from "../api/articleRegister";

export function SupplierArticleRegisterTable() {
	const t = useTranslate();
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	// Namespaced search params to prevent collisions
	const pageParam = searchParams.get("supplier_article_page");
	const limitParam = searchParams.get("supplier_article_limit");
	const searchParam = searchParams.get("supplier_article_search") ?? "";
	const supplierParam = searchParams.get("supplier_article_supplier") ?? "all";
	const sortByParam = searchParams.get("supplier_article_sortBy") ?? undefined;
	const sortOrderParam = (searchParams.get("supplier_article_sortOrder") as "asc" | "desc") ?? undefined;

	const page = pageParam ? Math.max(1, Number.parseInt(pageParam, 10)) : 1;
	const pageSize = limitParam ? Number.parseInt(limitParam, 10) : 10;

	const [data, setData] = useState<SupplierArticleRow[]>([]);
	const [totalItems, setTotalItems] = useState(0);
	const [isLoading, setIsLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState(searchParam);
	const [deletingId, setDeletingId] = useState<string | null>(null);
	const [supplierOptions, setSupplierOptions] = useState<{ value: string; label: string }[]>(
		[],
	);

	useEffect(() => {
		let cancelled = false;
		getSupplierNameOptionsAPIAction()
			.then((options) => {
				if (!cancelled) setSupplierOptions(options);
			})
			.catch(() => {
				if (!cancelled) {
					setSupplierOptions([]);
					showToast("error", t(localizationConstants.genericError));
				}
			});
		return () => {
			cancelled = true;
		};
	}, [t]);

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
			const res = await getSupplierArticleListAPIAction({
				page,
				limit: pageSize,
				search: searchParam,
				supplier: supplierParam,
				sortBy: sortByParam,
				sortOrder: sortOrderParam,
			});
			setData(res.data);
			setTotalItems(res.total);
		} catch {
			showToast("error", t(localizationConstants.genericError));
		} finally {
			setIsLoading(false);
		}
	}, [page, pageSize, searchParam, supplierParam, sortByParam, sortOrderParam, t]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	useEffect(() => {
		setSearchQuery(searchParam);
	}, [searchParam]);

	const handleSearchChange = (value: string) => {
		setSearchQuery(value);
		updateQueryParams({
			supplier_article_search: value || null,
			supplier_article_page: "1",
		});
	};

	const handleSupplierFilterChange = (val: string) => {
		updateQueryParams({
			supplier_article_supplier: val === "all" ? null : val,
			supplier_article_page: "1",
		});
	};

	const handleSort = (key: string, order: "asc" | "desc" | null) => {
		updateQueryParams({
			supplier_article_sortBy: order ? key : null,
			supplier_article_sortOrder: order ?? null,
			supplier_article_page: "1",
		});
	};

	const handlePageChange = (newPage: number) => {
		updateQueryParams({ supplier_article_page: String(newPage) });
	};

	const handlePageSizeChange = (newSize: number) => {
		updateQueryParams({
			supplier_article_limit: String(newSize),
			supplier_article_page: "1",
		});
	};

	const handleDelete = useCallback(
		async (id: string) => {
			try {
				await deleteSupplierArticleAPIAction(id);
				setData((prev) => prev.filter((item) => item.id !== id));
				setTotalItems((prev) => Math.max(0, prev - 1));
				showToast("success", t(localizationConstants.supplierArticleDeletedSuccess));
			} catch {
				showToast("error", t(localizationConstants.genericError));
			} finally {
				setDeletingId((currentId) => (currentId === id ? null : currentId));
			}
		},
		[t],
	);

	const selectOptions = useMemo(() => {
		if (supplierParam === "all") return supplierOptions;
		if (supplierOptions.some((option) => option.value === supplierParam)) {
			return supplierOptions;
		}
		return [{ value: supplierParam, label: supplierParam }, ...supplierOptions];
	}, [supplierOptions, supplierParam]);

	const columns: DataTableColumn<SupplierArticleRow>[] = useMemo(
		() => [
			{
				key: "supplierArticleNo",
				label: localizationConstants.supplierArticleNoHeader,
				sortable: true,
			},
			{
				key: "supplierName",
				label: localizationConstants.supplierHeader,
				sortable: true,
			},
			{
				key: "supplierDescription",
				label: localizationConstants.supplierDescriptionHeader,
				sortable: true,
			},
			{
				key: "purchasePrice",
				label: localizationConstants.purchasePriceHeader,
				sortable: true,
			},
			{
				key: "linkedToArticle",
				label: localizationConstants.linkedToArticleHeader,
				sortable: true,
			},
			{
				key: "status",
				label: localizationConstants.statusLabel,
				sortable: true,
				render: (row) => (
					<span
						className={`inline-flex items-center justify-center rounded-md px-3 py-1 text-xs font-semibold text-white ${
							row.status === "mapped" ? "bg-[#16A34A]" : "bg-slate-400"
						}`}
					>
						<Translate
							text={
								row.status === "mapped"
									? localizationConstants.mappedStatus
									: localizationConstants.unmappedStatus
							}
						/>
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
							router.push(`/tools/register/supplier-articles/${row.id}`);
						}}
						className="inline-flex items-center justify-center p-1.5 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
					>
						<Eye className="h-4 w-4" />
					</button>
				),
			},
		],
		[router],
	);

	const actions: DataTableAction<SupplierArticleRow>[] = useMemo(
		() => [
			{
				label: localizationConstants.viewLabel,
				icon: <Eye className="h-4 w-4" />,
				onClick: (row) => router.push(`/tools/register/supplier-articles/${row.id}`),
			},
			{
				label: localizationConstants.editLabel,
				icon: <Pencil className="h-4 w-4" />,
				onClick: (row) => router.push(`/tools/register/supplier-articles/${row.id}/edit`),
			},
			{
				label: localizationConstants.deleteLabel,
				icon: <Trash2 className="h-4 w-4" />,
				destructive: true,
				onClick: (row) => setDeletingId(row.id),
			},
		],
		[router],
	);

	return (
		<div className="flex flex-col gap-6">
			{/* Top Action & Search Bar */}
			<div className="flex flex-col gap-4">
				<div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
					<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full xl:w-auto">
						<Search
							value={searchQuery}
							onChange={handleSearchChange}
							placeholder={localizationConstants.search}
							className="h-10 w-full"
							wrapperClassName="w-full sm:w-[240px] md:w-[260px] lg:w-[300px]"
						/>
					</div>
				</div>

				<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
					<div className="flex flex-col gap-1 w-full sm:w-64">
						<label className="text-xs font-semibold text-slate-900">
							<Translate text={localizationConstants.supplierHeader} />
						</label>
						<Select value={supplierParam} onValueChange={handleSupplierFilterChange}>
							<SelectTrigger className="h-10 w-full border-slate-200 bg-white text-sm text-slate-900 shadow-2xs">
								<SelectValue placeholder={t(localizationConstants.selectSupplier)} />
							</SelectTrigger>
							<SelectContent className="bg-white border-slate-200 shadow-md">
								<SelectItem
									value="all"
									className="focus:bg-slate-100 focus:text-slate-900 data-[state=checked]:bg-slate-100 data-[state=checked]:text-slate-900 hover:bg-slate-100 cursor-pointer"
								>
									<Translate text={localizationConstants.allSuppliers} />
								</SelectItem>
								{selectOptions.map((option) => (
									<SelectItem
										key={option.value}
										value={option.value}
										className="focus:bg-slate-100 focus:text-slate-900 data-[state=checked]:bg-slate-100 data-[state=checked]:text-slate-900 hover:bg-slate-100 cursor-pointer"
									>
										{option.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<Button
						className="h-10 w-full sm:w-auto gap-2 rounded-lg bg-[#111721] px-5 text-sm font-medium text-white shadow-2xs hover:bg-slate-800 justify-center self-end"
					>
						<Plus className="h-4 w-4" aria-hidden />
						<Translate text={localizationConstants.updateArticles} />
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

			<AlertDialog open={deletingId !== null} onOpenChange={(open) => !open && setDeletingId(null)}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							<Translate text={localizationConstants.supplierArticleDeleteConfirmTitle} />
						</AlertDialogTitle>
						<AlertDialogDescription>
							<Translate text={localizationConstants.supplierArticleDeleteConfirmDesc} />
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>
							<Translate text={localizationConstants.cancel} />
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={() => {
								if (deletingId) {
									handleDelete(deletingId);
								}
							}}
						>
							<Translate text={localizationConstants.deleteLabel} />
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
