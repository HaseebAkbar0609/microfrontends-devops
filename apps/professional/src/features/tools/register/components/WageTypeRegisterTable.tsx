"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import { Plus, ChevronDown, Eye, Trash2, Edit } from "lucide-react";
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
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { WageTypeRow } from "../types";
import {
	useWageTypeListQuery,
	useToggleWageTypeStatusMutation,
} from "../hooks/useWageTypeRegister";
import { showToast } from "@/lib/toast";

function HighlightMatch({ text, query }: { text: string; query: string }) {
	if (!query) return <span>{text}</span>;
	const parts = text.split(new RegExp(`(${query.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")})`, "gi"));
	return (
		<span>
			{parts.map((part, index) =>
				part.toLowerCase() === query.toLowerCase() ? (
					<strong key={index} className="bg-yellow-100 text-slate-900 font-semibold">{part}</strong>
				) : (
					part
				),
			)}
		</span>
	);
}

export function WageTypeRegisterTable() {
	const t = useTranslate();
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const [selectedIds, setSelectedIds] = useState<string[]>([]);
	const [statusFilter, setStatusFilter] = useState<string>("all");

	const page = Number(searchParams.get("page") ?? "1");
	const pageSize = Number(searchParams.get("limit") ?? "50");
	const searchQuery = searchParams.get("search") ?? "";
	const sortByParam = searchParams.get("sortBy") ?? undefined;
	const sortOrderParam = (searchParams.get("sortOrder") as "asc" | "desc") ?? undefined;

	const { data, isLoading, isError, error } = useWageTypeListQuery({
		page,
		limit: pageSize,
		search: searchQuery,
		status: statusFilter,
		sortBy: sortByParam,
		sortOrder: sortOrderParam,
	});

	useEffect(() => {
		if (isError && error) {
			showToast("error", t(localizationConstants.wageTypeFetchError));
		}
	}, [isError, error, t]);

	const toggleStatusMutation = useToggleWageTypeStatusMutation();

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

	const handleSearchChange = useCallback(
		(value: string) => {
			updateQueryParams({ search: value || undefined, page: "1" });
		},
		[updateQueryParams],
	);

	const handleSort = useCallback(
		(field: string) => {
			const isSameField = sortByParam === field;
			const nextOrder = isSameField && sortOrderParam === "asc" ? "desc" : "asc";
			updateQueryParams({ sortBy: field, sortOrder: nextOrder });
		},
		[sortByParam, sortOrderParam, updateQueryParams],
	);

	const wageRows = useMemo(() => data?.data ?? [], [data?.data]);
	const totalItems = data?.total ?? 0;

	const handleSelectAll = useCallback(
		(checked: boolean) => {
			if (checked) {
				setSelectedIds(wageRows.map((item) => item.id));
			} else {
				setSelectedIds([]);
			}
		},
		[wageRows],
	);

	const handleSelectRow = useCallback((id: string, checked: boolean) => {
		if (checked) {
			setSelectedIds((prev) => [...prev, id]);
		} else {
			setSelectedIds((prev) => prev.filter((item) => item !== id));
		}
	}, []);

	const handleBatchToggleStatus = async (targetStatus: "active" | "inactive") => {
		if (selectedIds.length === 0) return;
		await toggleStatusMutation.mutateAsync({ ids: selectedIds, status: targetStatus });
		setSelectedIds([]);
	};

	const isAllSelected = wageRows.length > 0 && selectedIds.length === wageRows.length;

	const columns: DataTableColumn<WageTypeRow>[] = useMemo(
		() => [
			{
				key: "selection",
				label: "",
				headerRender: () => (
					<Checkbox
						checked={isAllSelected}
						onCheckedChange={(checked) => handleSelectAll(Boolean(checked))}
						className="data-[state=checked]:bg-[#111721] data-[state=checked]:border-[#111721] data-[state=checked]:text-white"
						aria-label={t(localizationConstants.selectAllLabel)}
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
						aria-label={`${t(localizationConstants.ariaSelectRow)} ${row.code}`}
					/>
				),
			},
			{
				key: "code",
				label: localizationConstants.wageTypeIdHeader,
				sortable: true,
				render: (row) => (
					<span className="font-medium text-slate-900">
						<HighlightMatch text={row.code} query={searchQuery} />
					</span>
				),
			},
			{
				key: "name",
				label: localizationConstants.wageTypeNameHeader,
				sortable: true,
				render: (row) => (
					<span className="text-slate-700">
						<HighlightMatch text={row.name} query={searchQuery} />
					</span>
				),
			},
			{
				key: "unit",
				label: localizationConstants.wageTypeUnitHeader,
				render: (row) => <span className="text-slate-600">{row.unit}</span>,
			},
			{
				key: "factor",
				label: localizationConstants.wageTypeFactorLabel,
				render: (row) => <span className="text-slate-600">{row.factor || "1.0"}</span>,
			},
			{
				key: "status",
				label: localizationConstants.priceListStatusHeader,
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
				key: "actions_view",
				label: "",
				headerClassName: "w-10 text-center",
				cellClassName: "text-center",
				render: (row) => (
					<button
						type="button"
						aria-label={t(localizationConstants.ariaViewWageTypeDetails)}
						onClick={(e) => {
							e.stopPropagation();
							router.push(`/tools/register/wage-type/${row.id}`);
						}}
						className="inline-flex items-center justify-center p-1.5 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
					>
						<Eye className="h-4 w-4" />
					</button>
				),
			},
		],
		[isAllSelected, handleSelectAll, handleSelectRow, selectedIds, router, t, searchQuery],
	);

	const actions: DataTableAction<WageTypeRow>[] = useMemo(
		() => [
			{
				label: localizationConstants.viewActionLabel,
				icon: <Eye className="h-4 w-4" />,
				onClick: (row) => router.push(`/tools/register/wage-type/${row.id}`),
			},
			{
				label: localizationConstants.editLabel,
				icon: <Edit className="h-4 w-4" />,
				onClick: (row) => router.push(`/tools/register/wage-type/edit/${row.id}`),
			},
			{
				label: localizationConstants.deleteLabel,
				icon: <Trash2 className="h-4 w-4" />,
				destructive: true,
				onClick: () => {},
			},
		],
		[router],
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

				<Link href="/tools/register/wage-type/create" passHref>
					<Button className="h-10 w-full sm:w-auto gap-2 rounded-lg bg-[#111721] px-5 text-sm font-medium text-white shadow-2xs hover:bg-slate-800 justify-center self-end">
						<Plus className="h-4 w-4" aria-hidden />
						<Translate text={localizationConstants.createWageTypeButton} />
					</Button>
				</Link>
			</div>

			{/* Data Table */}
			<DataTable
				data={wageRows}
				columns={columns as unknown as DataTableColumn<unknown>[]}
				rowKey={(row) => (row as WageTypeRow).id}
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
				onPageSizeChange={(size) => updateQueryParams({ limit: String(size), page: "1" })}
				emptyMessageKey={localizationConstants.noDataFound}
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
