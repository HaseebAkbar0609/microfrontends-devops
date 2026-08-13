"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Plus, ChevronDown, Eye, Trash2, Edit } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Search } from "@/components/search/Search";
import { Checkbox } from "@/components/ui/checkbox";
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
import type { CostCenterRegisterRow } from "../types";
import {
	getCostCenterListAPIAction,
	deleteCostCenterAPIAction,
	toggleCostCenterStatusAPIAction,
} from "../api/costCenterRegister";

export function CostCenterRegisterTable() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const [data, setData] = useState<CostCenterRegisterRow[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [selectedIds, setSelectedIds] = useState<string[]>([]);
	const [statusFilter, setStatusFilter] = useState<string>("all");

	const page = Number(searchParams.get("page") ?? "1");
	const pageSize = Number(searchParams.get("limit") ?? "50");
	const searchQuery = searchParams.get("search") ?? "";
	const sortByParam = searchParams.get("sortBy") ?? undefined;
	const sortOrderParam = (searchParams.get("sortOrder") as "asc" | "desc") ?? undefined;

	const [totalItems, setTotalItems] = useState(0);

	const updateQueryParams = useCallback(
		(updates: Record<string, string | undefined>) => {
			const params = new URLSearchParams(searchParams.toString());
			Object.entries(updates).forEach(([key, value]) => {
				if (value !== undefined && value !== "") {
					params.set(key, value);
				} else {
					params.delete(key);
				}
			});
			router.replace(`${pathname}?${params.toString()}`, { scroll: false });
		},
		[pathname, router, searchParams],
	);

	const fetchData = useCallback(async () => {
		setIsLoading(true);
		try {
			const res = await getCostCenterListAPIAction({
				page,
				limit: pageSize,
				search: searchQuery,
				status: statusFilter,
				sortBy: sortByParam,
				sortOrder: sortOrderParam,
			});
			setData(res.data);
			setTotalItems(res.total);
		} finally {
			setIsLoading(false);
		}
	}, [page, pageSize, searchQuery, statusFilter, sortByParam, sortOrderParam]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const handleSearchChange = (value: string) => {
		updateQueryParams({ search: value || undefined, page: "1" });
	};

	const handleSort = (field: string) => {
		const isSameField = sortByParam === field;
		const nextOrder = isSameField && sortOrderParam === "asc" ? "desc" : "asc";
		updateQueryParams({ sortBy: field, sortOrder: nextOrder });
	};

	const handleSelectAll = useCallback(
		(checked: boolean) => {
			if (checked) {
				setSelectedIds(data.map((item) => item.id));
			} else {
				setSelectedIds([]);
			}
		},
		[data],
	);

	const handleSelectRow = useCallback((id: string, checked: boolean) => {
		if (checked) {
			setSelectedIds((prev) => [...prev, id]);
		} else {
			setSelectedIds((prev) => prev.filter((item) => item !== id));
		}
	}, []);

	const handleDelete = useCallback(
		async (id: string) => {
			await deleteCostCenterAPIAction(id);
			setSelectedIds((prev) => prev.filter((itemId) => itemId !== id));
			fetchData();
		},
		[fetchData],
	);

	const handleBatchToggleStatus = async (targetStatus: "active" | "inactive") => {
		if (selectedIds.length === 0) return;
		await toggleCostCenterStatusAPIAction(selectedIds, targetStatus);
		setData((prev) =>
			prev.map((item) => (selectedIds.includes(item.id) ? { ...item, status: targetStatus } : item)),
		);
		setSelectedIds([]);
	};

	const isAllSelected = data.length > 0 && selectedIds.length === data.length;

	const columns: DataTableColumn<CostCenterRegisterRow>[] = useMemo(
		() => [
			{
				key: "selection",
				label: "",
				headerRender: () => (
					<Checkbox
						checked={isAllSelected}
						onCheckedChange={(checked) => handleSelectAll(Boolean(checked))}
						className="data-[state=checked]:bg-[#111721] data-[state=checked]:border-[#111721] data-[state=checked]:text-white"
						aria-label="Select all"
					/>
				),
				headerClassName: "w-12 text-center",
				cellClassName: "w-12 text-center",
				render: (row) => (
					<Checkbox
						checked={selectedIds.includes(row.id)}
						onCheckedChange={(checked) => handleSelectRow(row.id, Boolean(checked))}
						onClick={(e) => e.stopPropagation()}
						className="data-[state=checked]:bg-[#111721] data-[state=checked]:border-[#111721] data-[state=checked]:text-white"
						aria-label={`Select row ${row.kod}`}
					/>
				),
			},
			{
				key: "kod",
				label: localizationConstants.costCenterCodeHeader,
				sortable: true,
				render: (row) => <span className="font-medium text-slate-900">{row.kod}</span>,
			},
			{
				key: "benamning",
				label: localizationConstants.costCenterNameHeader,
				sortable: true,
			},
			{
				key: "anteckningar",
				label: localizationConstants.costCenterNotesHeader,
				sortable: true,
			},
			{
				key: "status",
				label: localizationConstants.priceListStatusHeader,
				sortable: true,
				render: (row) => (
					<span
						className={cn(
							"inline-flex items-center justify-center rounded-md px-2.5 py-0.5 text-xs font-semibold text-white",
							row.status === "active" ? "bg-[#16A34A]" : "bg-slate-400",
						)}
					>
						{row.status === "active" ? (
							<Translate text={localizationConstants.costCenterActiveStatus} />
						) : (
							<Translate text={localizationConstants.costCenterInactiveStatus} />
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
						aria-label="View cost center details"
						onClick={(e) => {
							e.stopPropagation();
							router.push(`/tools/register/cost-centre/${row.id}`);
						}}
						className="inline-flex items-center justify-center p-1.5 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
					>
						<Eye className="h-4 w-4" />
					</button>
				),
			},
		],
		[isAllSelected, handleSelectAll, handleSelectRow, selectedIds, router],
	);

	const actions: DataTableAction<CostCenterRegisterRow>[] = useMemo(
		() => [
			{
				label: localizationConstants.viewActionLabel,
				icon: <Eye className="h-4 w-4" />,
				onClick: (row) => router.push(`/tools/register/cost-centre/${row.id}`),
			},
			{
				label: localizationConstants.editLabel,
				icon: <Edit className="h-4 w-4" />,
				onClick: (row) => router.push(`/tools/register/cost-centre/edit/${row.id}`),
			},
			{
				label: localizationConstants.deleteLabel,
				icon: <Trash2 className="h-4 w-4" />,
				destructive: true,
				onClick: (row) => handleDelete(row.id),
			},
		],
		[handleDelete, router],
	);

	return (
		<div className="flex flex-col gap-6">
			{/* Controls Bar: Search + Filter + Create Button */}
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
								className="h-10 w-full sm:w-28 border-slate-200 text-slate-700 font-normal bg-transparent hover:bg-slate-50 gap-1.5 px-3 text-xs shadow-2xs justify-between"
							>
								<Translate text={localizationConstants.filter} />
								<ChevronDown className="h-3.5 w-3.5 text-slate-500 shrink-0" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="start" className="w-36 border border-slate-200 bg-white shadow-md rounded-md p-1">
							<DropdownMenuItem
								onClick={() => setStatusFilter("all")}
								className="cursor-pointer text-xs text-slate-700 focus:bg-slate-100 focus:text-slate-900"
							>
								<Translate text={localizationConstants.costCenterAllStatus} />
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => setStatusFilter("active")}
								className="cursor-pointer text-xs text-slate-700 focus:bg-slate-100 focus:text-slate-900"
							>
								<Translate text={localizationConstants.costCenterActiveStatus} />
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => setStatusFilter("inactive")}
								className="cursor-pointer text-xs text-slate-700 focus:bg-slate-100 focus:text-slate-900"
							>
								<Translate text={localizationConstants.costCenterInactiveStatus} />
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				<Link href="/tools/register/cost-centre/create">
					<Button className="h-10 w-full sm:w-auto gap-2 rounded-lg bg-[#111721] px-5 text-sm font-medium text-white shadow-2xs hover:bg-slate-800 justify-center self-end">
						<Plus className="h-4 w-4" aria-hidden />
						<Translate text={localizationConstants.createCostCenterButtonText} />
					</Button>
				</Link>
			</div>

			{/* Data Table */}
			<DataTable
				data={data}
				columns={columns as unknown as DataTableColumn<unknown>[]}
				rowKey={(row) => (row as CostCenterRegisterRow).id}
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
				onPageChange={(p: number) => updateQueryParams({ page: String(p) })}
				emptyMessageKey={localizationConstants.noCostCentersMessage}
			/>

			{/* Selection Action Footer matching Figma design */}
			<div className="flex flex-wrap items-center gap-3 pt-2">
				<span className="text-sm font-medium text-slate-600">
					({selectedIds.length} <Translate text={localizationConstants.markedCountText} />)
				</span>
				<Button
					type="button"
					variant="outline"
					disabled={selectedIds.length === 0}
					onClick={() => handleBatchToggleStatus("inactive")}
					className="h-9 rounded-md border-slate-300 px-4 text-xs font-medium text-slate-900 hover:bg-slate-100 disabled:opacity-50"
				>
					<Translate text={localizationConstants.inactivateButton} />
				</Button>
				<Button
					type="button"
					disabled={selectedIds.length === 0}
					onClick={() => handleBatchToggleStatus("active")}
					className="h-9 rounded-md bg-[#111721] px-4 text-xs font-medium text-white hover:bg-slate-800 disabled:opacity-50"
				>
					<Translate text={localizationConstants.activateButton} />
				</Button>
			</div>
		</div>
	);
}
