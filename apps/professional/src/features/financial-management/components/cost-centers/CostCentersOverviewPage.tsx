"use client";

import localizationConstants from "@/utils/translation/constants";
import { EconomySubTabs } from "../common/EconomySubTabs";
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

	const subTabs = [
		{ value: "kostnadsstalle", label: localizationConstants.costCenterSubTitle },
	];

	return (
		<div className="p-6 w-full space-y-6">
			{/* Sub Tabs Bar */}
			<EconomySubTabs value="kostnadsstalle" tabs={subTabs} />

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
