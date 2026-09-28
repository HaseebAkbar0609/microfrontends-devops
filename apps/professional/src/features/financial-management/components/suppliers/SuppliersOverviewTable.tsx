"use client";

import React, { useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Eye, Trash2 } from "lucide-react";
import { DataTable, type DataTableColumn, type DataTableAction } from "@/components/table/DataTable";
import localizationConstants from "@/utils/translation/constants";
import { useSupplierOverview } from "../../hooks/useSupplierOverview";
import type { SupplierOverviewRow } from "../../types/supplierOverview.types";
import {
	SUPPLIER_CREATE_ROUTE,
	SUPPLIER_DETAIL_BASE_ROUTE,
} from "../../constants/supplierOverview.constants";
import { SuppliersOverviewToolbar } from "./SuppliersOverviewToolbar";
import { SupplierDeleteDialog } from "./SupplierDeleteDialog";
import { EconomyStatusBadge } from "../common/EconomyStatusBadge";

export function SuppliersOverviewTable() {
	const router = useRouter();
	const {
		suppliers,
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
		deleteSupplier,
	} = useSupplierOverview();

	const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

	const handleDeleteConfirm = useCallback(() => {
		if (deleteTargetId) {
			deleteSupplier(deleteTargetId);
			setDeleteTargetId(null);
		}
	}, [deleteSupplier, deleteTargetId]);

	const columns: DataTableColumn<SupplierOverviewRow>[] = useMemo(
		() => [
			{
				key: "levNr",
				label: localizationConstants.supplierColLevNr,
				sortable: true,
				render: (row) => (
					<button
						type="button"
						onClick={() => router.push(`${SUPPLIER_DETAIL_BASE_ROUTE}/${encodeURIComponent(row.id)}`)}
						className="font-medium text-slate-900 transition-colors hover:text-blue-600"
					>
						{row.levNr}
					</button>
				),
			},
			{
				key: "name",
				label: localizationConstants.supplierColName,
				sortable: true,
				render: (row) => (
					<button
						type="button"
						onClick={() => router.push(`${SUPPLIER_DETAIL_BASE_ROUTE}/${encodeURIComponent(row.id)}`)}
						className="text-left font-medium text-slate-700 transition-colors hover:text-blue-600"
					>
						{row.name}
					</button>
				),
			},
			{
				key: "orgNo",
				label: localizationConstants.supplierColOrgNo,
				sortable: true,
				render: (row) => <span className="text-slate-700">{row.orgNo}</span>,
			},
			{
				key: "address",
				label: localizationConstants.supplierColAddress,
				sortable: true,
			},
			{
				key: "postNr",
				label: localizationConstants.supplierColPostalCode,
				sortable: true,
			},
			{
				key: "city",
				label: localizationConstants.supplierColCity,
				sortable: true,
			},
			{
				key: "country",
				label: localizationConstants.supplierColCountry,
				sortable: true,
			},
			{
				key: "phone",
				label: localizationConstants.supplierColPhone,
				sortable: true,
			},
			{
				key: "email",
				label: localizationConstants.supplierColEmail,
				sortable: true,
			},
			{
				key: "status",
				label: localizationConstants.supplierColStatus,
				sortable: true,
				render: (row) => (
					<EconomyStatusBadge
						status={row.status}
						label={
							row.status === "active"
								? localizationConstants.supplierStatusActive
								: row.status === "prospect"
									? localizationConstants.supplierStatusProspect
									: localizationConstants.supplierStatusInactive
						}
					/>
				),
			},
		],
		[router],
	);

	const actions: DataTableAction<SupplierOverviewRow>[] = useMemo(
		() => [
			{
				label: localizationConstants.viewLabel,
				icon: <Eye className="h-4 w-4" />,
				onClick: (row) => router.push(`${SUPPLIER_DETAIL_BASE_ROUTE}/${encodeURIComponent(row.id)}`),
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
			<SuppliersOverviewToolbar
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
				onRegisterNew={() => router.push(SUPPLIER_CREATE_ROUTE)}
			/>

			{/* Reusable DataTable Component */}
			<DataTable
				data={suppliers}
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
			<SupplierDeleteDialog
				isOpen={deleteTargetId !== null}
				onClose={() => setDeleteTargetId(null)}
				onConfirm={handleDeleteConfirm}
			/>
		</div>
	);
}
