"use client";

import React from "react";
import { useDataItOverview } from "../../hooks/useDataItOverview";
import { DataItOverviewToolbar } from "./DataItOverviewToolbar";
import { DataItOverviewTable } from "./DataItOverviewTable";
import { TablePagination } from "@/components/table/TablePagination";
import { ConfirmActionDialog } from "@/components/dialog/ConfirmActionDialog";
import localizationConstants from "@/utils/translation/constants";

export function DataItOverviewView() {
	const {
		isLoading,
		searchQuery,
		setSearchQuery,
		statusFilter,
		setStatusFilter,
		sortState,
		handleSort,
		currentPage,
		setCurrentPage,
		pageSize,
		setPageSize,
		totalPages,
		paginatedEmployees,
		deleteTarget,
		requestDelete,
		confirmDelete,
		cancelDelete,
		statusTarget,
		requestStatusChange,
		confirmStatusChange,
		cancelStatusChange,
	} = useDataItOverview();

	return (
		<div className="flex flex-1 flex-col gap-4 px-6 pt-4 pb-8">
			{/* Toolbar (Search, Filter, CTA) */}
			<DataItOverviewToolbar
				searchQuery={searchQuery}
				onSearchChange={setSearchQuery}
				statusFilter={statusFilter}
				onStatusFilterChange={setStatusFilter}
			/>

			{/* Main Card Container with Table & Shared TablePagination */}
			<div className="rounded-lg border border-slate-200 bg-white shadow-sm">
				<DataItOverviewTable
					isLoading={isLoading}
					employees={paginatedEmployees}
					sortState={sortState}
					onSort={handleSort}
					onRequestDelete={requestDelete}
					onRequestStatusChange={requestStatusChange}
				/>

				<div className="px-4">
					<TablePagination
						currentPage={currentPage}
						totalPages={totalPages}
						pageSize={pageSize}
						onPageChange={setCurrentPage}
						onPageSizeChange={setPageSize}
					/>
				</div>
			</div>

			{/* Standard Radix-based Accessible Confirmation Dialogs */}
			<ConfirmActionDialog
				open={Boolean(deleteTarget)}
				onOpenChange={(open) => !open && cancelDelete()}
				title={localizationConstants.dataItDeleteConfirmTitle}
				description={localizationConstants.dataItDeleteConfirmDesc}
				confirmLabel={localizationConstants.dataItActionDelete}
				subject={deleteTarget ? `${deleteTarget.name} (#${deleteTarget.id})` : undefined}
				destructive
				onConfirm={confirmDelete}
			/>

			<ConfirmActionDialog
				open={Boolean(statusTarget)}
				onOpenChange={(open) => !open && cancelStatusChange()}
				title={
					statusTarget?.nextStatus === "ACTIVE"
						? localizationConstants.dataItActivateConfirmTitle
						: localizationConstants.dataItArchiveConfirmTitle
				}
				description={
					statusTarget?.nextStatus === "ACTIVE"
						? localizationConstants.dataItActivateConfirmDesc
						: localizationConstants.dataItArchiveConfirmDesc
				}
				confirmLabel={
					statusTarget?.nextStatus === "ACTIVE"
						? localizationConstants.dataItActionActivate
						: localizationConstants.dataItActionArchive
				}
				subject={
					statusTarget
						? `${statusTarget.employee.name} (#${statusTarget.employee.id})`
						: undefined
				}
				onConfirm={confirmStatusChange}
			/>
		</div>
	);
}
