"use client";

import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { useCostCentersOverview } from "../../hooks/useCostCentersOverview";
import { CostCentersOverviewToolbar } from "./CostCentersOverviewToolbar";
import { CostCentersOverviewTable } from "./CostCentersOverviewTable";
import { CostCenterDeleteDialog } from "./CostCenterDeleteDialog";

export function CostCentersOverviewPage() {
	const {
		data,
		isLoading,
		totalItems,
		page,
		pageSize,
		searchQuery,
		statusFilter,
		setStatusFilter,
		sortByParam,
		sortOrderParam,
		selectedIds,
		isAllSelected,
		deleteTarget,
		handleSearchChange,
		handleSort,
		handleSelectAll,
		handleSelectRow,
		openDeleteDialog,
		closeDeleteDialog,
		confirmDelete,
		handleBatchToggleStatus,
		updateQueryParams,
	} = useCostCentersOverview();

	return (
		<div className="p-6 w-full space-y-6">

			{/* Sub Tabs Bar */}
			<div className="border-b border-slate-200">
				<Tabs defaultValue="kostnadsstalle">
					<TabsList variant="line" className="gap-8 bg-transparent p-0 -mb-px">
						<TabsTrigger
							value="kostnadsstalle"
							className="pb-3 pt-1 text-sm font-semibold cursor-pointer"
						>
							<Translate text={localizationConstants.costCenterSubTitle} />
						</TabsTrigger>
					</TabsList>
				</Tabs>
			</div>

			{/* Toolbar */}
			<CostCentersOverviewToolbar
				searchQuery={searchQuery}
				onSearchChange={handleSearchChange}
				statusFilter={statusFilter}
				onStatusFilterChange={setStatusFilter}
			/>

			{/* Table */}
			<CostCentersOverviewTable
				data={data}
				isLoading={isLoading}
				totalItems={totalItems}
				page={page}
				pageSize={pageSize}
				sortByParam={sortByParam}
				sortOrderParam={sortOrderParam}
				selectedIds={selectedIds}
				isAllSelected={isAllSelected}
				onSort={handleSort}
				onPageChange={(p) => updateQueryParams({ page: String(p) })}
				onSelectAll={handleSelectAll}
				onSelectRow={handleSelectRow}
				onOpenDeleteDialog={openDeleteDialog}
				onBatchToggleStatus={handleBatchToggleStatus}
			/>

			{/* Delete Confirmation Modal */}
			<CostCenterDeleteDialog
				target={deleteTarget}
				isOpen={Boolean(deleteTarget)}
				onClose={closeDeleteDialog}
				onConfirm={confirmDelete}
			/>
		</div>
	);
}

export default CostCentersOverviewPage;
