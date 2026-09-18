"use client";

import React, { useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { DataTable, type DataTableColumn, type DataTableAction } from "@/components/table/DataTable";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { useCustomerOverview } from "../../hooks/useCustomerOverview";
import type { CustomerOverviewRow } from "../../types/customerOverview.types";
import { CUSTOMER_CREATE_ROUTE } from "../../constants/customerOverview.constants";
import { CustomerOverviewToolbar } from "./CustomerOverviewToolbar";
import { CustomerDeleteDialog } from "./CustomerDeleteDialog";

export function CustomerOverviewTable() {
	const router = useRouter();
	const {
		customers,
		totalItems,
		isLoading,
		searchQuery,
		setSearchQuery,
		statusFilter,
		setStatusFilter,
		page,
		setPage,
		pageSize,
		setPageSize,
		sortBy,
		sortOrder,
		handleSort,
		deleteCustomer,
	} = useCustomerOverview();

	const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

	const handleDeleteConfirm = useCallback(() => {
		if (deleteTargetId) {
			deleteCustomer(deleteTargetId);
			setDeleteTargetId(null);
		}
	}, [deleteCustomer, deleteTargetId]);

	const columns: DataTableColumn<CustomerOverviewRow>[] = useMemo(
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

	const actions: DataTableAction<CustomerOverviewRow>[] = useMemo(
		() => [
			{
				label: localizationConstants.viewLabel,
				icon: <Eye className="h-4 w-4" />,
				onClick: (row) => router.push(`${CUSTOMER_CREATE_ROUTE}?id=${row.id}`),
			},
			{
				label: localizationConstants.editLabel,
				icon: <Pencil className="h-4 w-4" />,
				onClick: (row) => router.push(`${CUSTOMER_CREATE_ROUTE}?id=${row.id}`),
			},
			{
				label: localizationConstants.deleteLabel,
				icon: <Trash2 className="h-4 w-4" />,
				destructive: true,
				onClick: (row) => setDeleteTargetId(row.id),
			},
		],
		[router],
	);

	return (
		<div className="flex flex-col gap-4">
			{/* Top Action & Search Bar */}
			<CustomerOverviewToolbar
				searchQuery={searchQuery}
				onSearchChange={(q) => {
					setSearchQuery(q);
					setPage(1);
				}}
				statusFilter={statusFilter}
				onStatusFilterChange={(s) => {
					setStatusFilter(s);
					setPage(1);
				}}
				onRegisterNew={() => router.push(CUSTOMER_CREATE_ROUTE)}
			/>

			{/* Reusable DataTable Component */}
			<DataTable
				data={customers}
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
				onPageChange={setPage}
				onPageSizeChange={(newSize) => {
					setPageSize(newSize);
					setPage(1);
				}}
			/>

			{/* Delete Confirmation Dialog */}
			<CustomerDeleteDialog
				isOpen={deleteTargetId !== null}
				onClose={() => setDeleteTargetId(null)}
				onConfirm={handleDeleteConfirm}
			/>
		</div>
	);
}
