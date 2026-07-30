"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { ChevronDown, Plus, Eye, Pencil, Import } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Search } from "@/components/search/Search";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable, type DataTableColumn, type DataTableAction } from "@/components/table/DataTable";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import {
	type AccountPlanRow,
	getAccountPlanListAPIAction,
	toggleAccountStatusAPIAction,
} from "../api/accountPlan";
import { showToast } from "@/lib/toast";

interface AccountPlanTableProps {
	activeTab?: string;
}

export function AccountPlanTable({ activeTab: _activeTab }: AccountPlanTableProps) {
	const t = useTranslate();
	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();

	const initialPage = Number(searchParams.get("ap_page")) || 1;
	const initialLimit = Number(searchParams.get("ap_limit")) || 10;
	const initialSearch = searchParams.get("ap_search") || "";
	const initialAccountType = searchParams.get("ap_accountType") || "all";
	const initialStatus = searchParams.get("ap_status") || "all";
	const initialSortBy = searchParams.get("ap_sortBy") || undefined;
	const initialSortOrder = (searchParams.get("ap_sortOrder") as "asc" | "desc") || undefined;

	const [data, setData] = useState<AccountPlanRow[]>([]);
	const [totalItems, setTotalItems] = useState(0);
	const [isLoading, setIsLoading] = useState(true);

	const [searchQuery, setSearchQuery] = useState(initialSearch);
	const [accountTypeFilter, setAccountTypeFilter] = useState(initialAccountType);
	const [statusFilter, setStatusFilter] = useState(initialStatus);
	const [page, setPage] = useState(initialPage);
	const [pageSize, setPageSize] = useState(initialLimit);
	const [sortBy, setSortBy] = useState<string | undefined>(initialSortBy);
	const [sortOrder, setSortOrder] = useState<"asc" | "desc" | undefined>(initialSortOrder);
	const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

	const updateUrlParams = useCallback(
		(newParams: {
			page?: number;
			limit?: number;
			search?: string;
			accountType?: string;
			status?: string;
			sortBy?: string;
			sortOrder?: string;
		}) => {
			const params = new URLSearchParams(searchParams.toString());

			if (newParams.page !== undefined) params.set("ap_page", String(newParams.page));
			if (newParams.limit !== undefined) params.set("ap_limit", String(newParams.limit));

			if (newParams.search !== undefined) {
				if (newParams.search) params.set("ap_search", newParams.search);
				else params.delete("ap_search");
			}

			if (newParams.accountType !== undefined) {
				if (newParams.accountType && newParams.accountType !== "all") params.set("ap_accountType", newParams.accountType);
				else params.delete("ap_accountType");
			}

			if (newParams.status !== undefined) {
				if (newParams.status && newParams.status !== "all") params.set("ap_status", newParams.status);
				else params.delete("ap_status");
			}

			if (newParams.sortBy !== undefined) {
				if (newParams.sortBy) params.set("ap_sortBy", newParams.sortBy);
				else params.delete("ap_sortBy");
			}

			if (newParams.sortOrder !== undefined) {
				if (newParams.sortOrder) params.set("ap_sortOrder", newParams.sortOrder);
				else params.delete("ap_sortOrder");
			}

			router.replace(`${pathname}?${params.toString()}`, { scroll: false });
		},
		[pathname, router, searchParams],
	);

	const fetchData = useCallback(async () => {
		setIsLoading(true);
		try {
			const res = await getAccountPlanListAPIAction({
				page,
				limit: pageSize,
				search: searchQuery,
				accountType: accountTypeFilter,
				status: statusFilter,
				sortBy,
				sortOrder,
			});
			setData(res.data);
			setTotalItems(res.total);
		} catch {
			showToast("error", t(localizationConstants.accountPlanImportError));
		} finally {
			setIsLoading(false);
		}
	}, [page, pageSize, searchQuery, accountTypeFilter, statusFilter, sortBy, sortOrder, t]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const handlePageChange = (newPage: number) => {
		setPage(newPage);
		updateUrlParams({ page: newPage });
	};

	const handlePageSizeChange = (newSize: number) => {
		setPageSize(newSize);
		setPage(1);
		updateUrlParams({ limit: newSize, page: 1 });
	};

	const handleSearchChange = (val: string) => {
		setSearchQuery(val);
		setPage(1);
		updateUrlParams({ search: val, page: 1 });
	};

	const handleAccountTypeFilterChange = (filter: string) => {
		setAccountTypeFilter(filter);
		setPage(1);
		updateUrlParams({ accountType: filter, page: 1 });
	};

	const _handleStatusFilterChange = (filter: string) => {
		setStatusFilter(filter);
		setPage(1);
		updateUrlParams({ status: filter, page: 1 });
	};

	const handleSort = (field: string, nextOrder: "asc" | "desc" | null) => {
		const order = nextOrder ?? undefined;
		setSortBy(order ? field : undefined);
		setSortOrder(order);
		updateUrlParams({ sortBy: order ? field : "", sortOrder: order || "" });
	};

	const handleToggleSelectAll = useCallback(() => {
		if (selectedRows.size === data.length) {
			setSelectedRows(new Set());
		} else {
			setSelectedRows(new Set(data.map((row) => row.id)));
		}
	}, [data, selectedRows.size]);

	const handleToggleRow = useCallback((id: string) => {
		setSelectedRows((prev) => {
			const next = new Set(prev);
			if (next.has(id)) {
				next.delete(id);
			} else {
				next.add(id);
			}
			return next;
		});
	}, []);

	const handleBulkStatusChange = useCallback(async (newStatus: "active" | "inactive") => {
		if (selectedRows.size === 0) return;
		for (const id of selectedRows) {
			await toggleAccountStatusAPIAction(id, newStatus);
		}
		setData((prev) =>
			prev.map((item) => (selectedRows.has(item.id) ? { ...item, status: newStatus } : item)),
		);
		setSelectedRows(new Set());
		showToast(
			"success",
			newStatus === "active"
				? t(localizationConstants.accountActivatedSuccess)
				: t(localizationConstants.accountDeactivatedSuccess),
		);
	}, [selectedRows, t]);

	const handleViewAccount = useCallback((row: AccountPlanRow) => {
		router.push(`/tools/register/account-plan/${row.id}`);
	}, [router]);

	const columns: DataTableColumn<AccountPlanRow>[] = useMemo(
		() => [
			{
				key: "_select",
				label: "",
				sortable: false,
				headerClassName: "!w-[48px] !min-w-[48px] !max-w-[48px] text-left",
				cellClassName: "!w-[48px] !min-w-[48px] !max-w-[48px] text-left",
				renderHeader: () => (
					<Checkbox
						checked={data.length > 0 && selectedRows.size === data.length}
						onCheckedChange={handleToggleSelectAll}
						className="data-[state=checked]:bg-[#111721] data-[state=checked]:border-[#111721]"
						aria-label={t(localizationConstants.selectAllLabel)}
					/>
				),
				render: (row) => (
					<Checkbox
						checked={selectedRows.has(row.id)}
						onCheckedChange={() => handleToggleRow(row.id)}
						className="data-[state=checked]:bg-[#111721] data-[state=checked]:border-[#111721]"
						aria-label={t(localizationConstants.selectRowLabel)}
					/>
				),
			},
			{
				key: "accountNumber",
				label: localizationConstants.accountNumberHeader,
				sortable: true,
				render: (row) => <span className="text-slate-700">{row.accountNumber}</span>,
			},
			{
				key: "accountName",
				label: localizationConstants.accountNameHeader,
				sortable: true,
				render: (row) => <span className="text-slate-700">{row.accountName}</span>,
			},
			{
				key: "vatCode",
				label: localizationConstants.vatCodeHeader,
				sortable: true,
				render: (row) => <span className="text-slate-700">{row.vatCode}</span>,
			},
			{
				key: "sru",
				label: localizationConstants.sruHeader,
				sortable: true,
				render: (row) => <span className="text-slate-700">{row.sru}</span>,
			},
			{
				key: "autoAccount",
				label: localizationConstants.autoAccountHeader,
				sortable: true,
				render: (row) => <span className="text-slate-700">{row.autoAccount}</span>,
			},
			{
				key: "openingBalance",
				label: localizationConstants.openingBalanceHeader,
				sortable: true,
				render: (row) => <span className="text-slate-700">{row.openingBalance}</span>,
			},
			{
				key: "budget",
				label: localizationConstants.budgetHeader,
				sortable: true,
				render: (row) => <span className="text-slate-700">{row.budget}</span>,
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
		],
		[selectedRows, handleToggleRow, handleToggleSelectAll, data.length, t],
	);

	const primaryAction = useCallback(
		(row: AccountPlanRow) => (
			<button
				type="button"
				onClick={() => handleViewAccount(row)}
				className="inline-flex items-center justify-center h-8 w-8 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
				aria-label={t(localizationConstants.viewAccountLabel)}
			>
				<Eye className="h-4 w-4" />
			</button>
		),
		[handleViewAccount, t],
	);

	const actions: DataTableAction<AccountPlanRow>[] = useMemo(
		() => [
			{
				label: localizationConstants.editLabel,
				icon: <Pencil className="h-4 w-4" />,
				onClick: (row) => router.push(`/tools/register/account-plan/${row.id}`),
			},
		],
		[router],
	);

	return (
		<div className="flex flex-col gap-6">
			{/* Page Title */}
			<h2 className="text-xl font-bold text-slate-900">
				<Translate text={localizationConstants.accountPlanTitle} />
			</h2>

			{/* Top Action & Search Bar */}
			<div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
				{/* Search & Filter Left Group */}
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
						<DropdownMenuContent align="start" className="w-40 border border-slate-200 bg-white shadow-md rounded-md p-1">
							<DropdownMenuItem
								onClick={() => handleAccountTypeFilterChange("all")}
								className="cursor-pointer text-xs text-slate-700 focus:bg-slate-100 focus:text-slate-900"
							>
								<Translate text={localizationConstants.allAccountTypes} />
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => handleAccountTypeFilterChange("Asset")}
								className="cursor-pointer text-xs text-slate-700 focus:bg-slate-100 focus:text-slate-900"
							>
								<Translate text={localizationConstants.assetType} />
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => handleAccountTypeFilterChange("Liability")}
								className="cursor-pointer text-xs text-slate-700 focus:bg-slate-100 focus:text-slate-900"
							>
								<Translate text={localizationConstants.liabilityType} />
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => handleAccountTypeFilterChange("Revenue")}
								className="cursor-pointer text-xs text-slate-700 focus:bg-slate-100 focus:text-slate-900"
							>
								<Translate text={localizationConstants.revenueType} />
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => handleAccountTypeFilterChange("Expense")}
								className="cursor-pointer text-xs text-slate-700 focus:bg-slate-100 focus:text-slate-900"
							>
								<Translate text={localizationConstants.expenseType} />
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				{/* Action Buttons Right Group */}
				<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full xl:w-auto justify-start xl:justify-end">
					<Button
						variant="outline"
						onClick={() => router.push("/tools/register/import-account-plan")}
						className="h-10 w-full sm:w-auto gap-2 border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 hover:bg-slate-50 shadow-2xs justify-center"
					>
						<Import className="h-4 w-4 text-slate-700" aria-hidden />
						<Translate text={localizationConstants.importAccountPlan} />
					</Button>

					<Button
						className="h-10 w-full sm:w-auto gap-2 rounded-lg bg-[#111721] px-5 text-sm font-medium text-white shadow-2xs hover:bg-slate-800 justify-center"
					>
						<Plus className="h-4 w-4" aria-hidden />
						<Translate text={localizationConstants.registerNewAccount} />
					</Button>
				</div>
			</div>

			{/* Reusable DataTable Component */}
			<DataTable
				data={data}
				columns={columns}
				rowKey={(row) => row.id}
				actions={actions}
				primaryAction={primaryAction}
				loading={isLoading}
				sortBy={sortBy}
				sortOrder={sortOrder}
				onSort={handleSort}
				pagination={{
					page,
					pageSize,
					totalItems,
				}}
				onPageChange={handlePageChange}
				onPageSizeChange={handlePageSizeChange}
			/>

			{/* Selection Action Footer matching Cost Center design */}
			<div className="flex flex-wrap items-center gap-3 pt-2">
				<span className="text-sm font-medium text-slate-600">
					({selectedRows.size} <Translate text={localizationConstants.markedCountText} />)
				</span>
				<Button
					type="button"
					variant="outline"
					disabled={selectedRows.size === 0}
					onClick={() => handleBulkStatusChange("inactive")}
					className="h-9 rounded-md border-slate-300 px-4 text-xs font-medium text-slate-900 hover:bg-slate-100 disabled:opacity-50"
				>
					<Translate text={localizationConstants.inactivateButton} />
				</Button>
				<Button
					type="button"
					disabled={selectedRows.size === 0}
					onClick={() => handleBulkStatusChange("active")}
					className="h-9 rounded-md bg-[#111721] px-4 text-xs font-medium text-white hover:bg-slate-800 disabled:opacity-50"
				>
					<Translate text={localizationConstants.activateButton} />
				</Button>
			</div>
		</div>
	);
}
