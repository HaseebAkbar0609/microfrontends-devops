"use client";

import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { DataTable, type DataTableColumn, type DataTableAction } from "@/components/table/DataTable";
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
import {
	type CustomerRegisterRow,
	getCustomerRegisterListAPIAction,
	deleteCustomerAPIAction,
} from "@/features/tools/register/api/customerRegister";
import { CustomerOverviewToolbar } from "./CustomerOverviewToolbar";

export function CustomerOverviewTable() {
	const t = useTranslate();
	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();

	const initialPage = Number(searchParams.get("customer_page")) || 1;
	const initialLimit = Number(searchParams.get("customer_limit")) || 10;
	const initialSearch = searchParams.get("customer_search") || "";
	const initialStatus = (searchParams.get("customer_status") as "all" | "active" | "inactive") || "all";
	const initialSortBy = searchParams.get("customer_sortBy") || undefined;
	const initialSortOrder = (searchParams.get("customer_sortOrder") as "asc" | "desc") || undefined;

	const [data, setData] = useState<CustomerRegisterRow[]>([]);
	const [totalItems, setTotalItems] = useState(0);
	const [isLoading, setIsLoading] = useState(true);
	const [deletingId, setDeletingId] = useState<string | null>(null);

	const [searchQuery, setSearchQuery] = useState(initialSearch);
	const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">(initialStatus);
	const [page, setPage] = useState(initialPage);
	const [pageSize, setPageSize] = useState(initialLimit);
	const [sortBy, setSortBy] = useState<string | undefined>(initialSortBy);
	const [sortOrder, setSortOrder] = useState<"asc" | "desc" | undefined>(initialSortOrder);

	const updateUrlParams = useCallback(
		(newParams: {
			page?: number;
			limit?: number;
			search?: string;
			status?: string;
			sortBy?: string;
			sortOrder?: string;
		}) => {
			const params = new URLSearchParams(searchParams.toString());

			if (newParams.page !== undefined) params.set("customer_page", String(newParams.page));
			if (newParams.limit !== undefined) params.set("customer_limit", String(newParams.limit));

			if (newParams.search !== undefined) {
				if (newParams.search) params.set("customer_search", newParams.search);
				else params.delete("customer_search");
			}

			if (newParams.status !== undefined) {
				if (newParams.status && newParams.status !== "all") params.set("customer_status", newParams.status);
				else params.delete("customer_status");
			}

			if (newParams.sortBy !== undefined) {
				if (newParams.sortBy) params.set("customer_sortBy", newParams.sortBy);
				else params.delete("customer_sortBy");
			}

			if (newParams.sortOrder !== undefined) {
				if (newParams.sortOrder) params.set("customer_sortOrder", newParams.sortOrder);
				else params.delete("customer_sortOrder");
			}

			router.replace(`${pathname}?${params.toString()}`, { scroll: false });
		},
		[pathname, router, searchParams],
	);

	const fetchCustomers = useCallback(async () => {
		setIsLoading(true);
		try {
			const res = await getCustomerRegisterListAPIAction({
				page,
				limit: pageSize,
				search: searchQuery,
				status: statusFilter,
				sortBy,
				sortOrder,
			});
			setData(res.data);
			setTotalItems(res.total);
		} catch {
			showToast("error", t(localizationConstants.genericError));
		} finally {
			setIsLoading(false);
		}
	}, [page, pageSize, searchQuery, statusFilter, sortBy, sortOrder, t]);

	const handleDelete = useCallback(
		async (id: string) => {
			try {
				await deleteCustomerAPIAction(id);
				fetchCustomers();
			} catch {
				showToast("error", t(localizationConstants.genericError));
			} finally {
				setDeletingId((currentId) => (currentId === id ? null : currentId));
			}
		},
		[fetchCustomers, t],
	);

	useEffect(() => {
		fetchCustomers();
	}, [fetchCustomers]);

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

	const handleStatusFilterChange = (filter: "all" | "active" | "inactive") => {
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

	const columns: DataTableColumn<CustomerRegisterRow>[] = useMemo(
		() => [
			{
				key: "customerNo",
				label: localizationConstants.customerNoHeader,
				sortable: true,
				render: (row) => <span className="text-slate-700">{row.customerNo}</span>,
			},
			{
				key: "name",
				label: localizationConstants.customerHeader,
				sortable: true,
				render: (row) => <span className="text-slate-700">{row.name}</span>,
			},
			{
				key: "orgNo",
				label: localizationConstants.orgNoHeader,
				sortable: true,
				render: (row) => <span className="text-slate-700">{row.orgNo}</span>,
			},
			{
				key: "address",
				label: localizationConstants.addressHeader,
				sortable: true,
			},
			{
				key: "postNr",
				label: localizationConstants.postNrHeader,
				sortable: true,
			},
			{
				key: "city",
				label: localizationConstants.ortHeader,
				sortable: true,
			},
			{
				key: "country",
				label: localizationConstants.landHeader,
				sortable: true,
			},
			{
				key: "phone",
				label: localizationConstants.phoneHeader,
				sortable: true,
			},
			{
				key: "email",
				label: localizationConstants.mailHeader,
				sortable: true,
			},
			{
				key: "status",
				label: localizationConstants.statusHeader,
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
		],
		[],
	);

	const actions: DataTableAction<CustomerRegisterRow>[] = useMemo(
		() => [
			{
				label: localizationConstants.viewLabel,
				icon: <Eye className="h-4 w-4" />,
				onClick: (row) => router.push(`/tools/register/customer/${row.id}`),
			},
			{
				label: localizationConstants.editLabel,
				icon: <Pencil className="h-4 w-4" />,
				onClick: (row) => router.push(`/tools/register/customer/${row.id}`),
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
		<div className="flex flex-col gap-4">
			{/* Top Action & Search Bar */}
			<CustomerOverviewToolbar
				searchQuery={searchQuery}
				onSearchChange={handleSearchChange}
				statusFilter={statusFilter}
				onStatusFilterChange={handleStatusFilterChange}
			/>

			{/* Reusable DataTable Component */}
			<DataTable
				data={data}
				columns={columns}
				rowKey={(row) => row.id}
				actions={actions}
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

			<AlertDialog open={deletingId !== null} onOpenChange={(open) => !open && setDeletingId(null)}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							<Translate text={localizationConstants.deleteLabel} />
						</AlertDialogTitle>
						<AlertDialogDescription>
							<Translate text={localizationConstants.protocolDeleteConfirmDesc} />
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
