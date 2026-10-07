"use client";

import React from "react";
import { useDataItOverview } from "../../hooks/useDataItOverview";
import { DataItOverviewToolbar } from "./DataItOverviewToolbar";
import { DataItOverviewTable } from "./DataItOverviewTable";
import { DataItOverviewPagination } from "./DataItOverviewPagination";
import { DataItOverviewDialogs } from "./DataItOverviewDialogs";

export function DataItOverviewView() {
	const {
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
		archiveTarget,
		requestArchive,
		confirmArchive,
		cancelArchive,
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

			{/* Main Card Container with Table & Pagination */}
			<div className="rounded-lg border border-slate-200 bg-white shadow-sm">
				<DataItOverviewTable
					employees={paginatedEmployees}
					sortState={sortState}
					onSort={handleSort}
					onRequestDelete={requestDelete}
					onRequestArchive={requestArchive}
				/>

				<DataItOverviewPagination
					currentPage={currentPage}
					totalPages={totalPages}
					pageSize={pageSize}
					onPageChange={setCurrentPage}
					onPageSizeChange={setPageSize}
				/>
			</div>

			{/* Safe Confirmation Modals */}
			<DataItOverviewDialogs
				deleteTarget={deleteTarget}
				onConfirmDelete={confirmDelete}
				onCancelDelete={cancelDelete}
				archiveTarget={archiveTarget}
				onConfirmArchive={confirmArchive}
				onCancelArchive={cancelArchive}
			/>
		</div>
	);
}
