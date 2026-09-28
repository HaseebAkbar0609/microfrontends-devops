"use client";

import localizationConstants from "@/utils/translation/constants";
import { EconomySubTabs } from "../common/EconomySubTabs";
import { useWageTypesOverview } from "../../hooks/useWageTypesOverview";
import { WageTypesOverviewToolbar } from "./WageTypesOverviewToolbar";
import { WageTypesOverviewTable } from "./WageTypesOverviewTable";
import { WageTypeDeleteDialog } from "./WageTypeDeleteDialog";

export function WageTypesOverviewPage() {
	const {
		data,
		isLoading,
		totalItems,
		page,
		pageSize,
		searchQuery,
		statusFilter,
		setStatusFilter,
		personalTypeFilter,
		setPersonalTypeFilter,
		wageFormFilter,
		setWageFormFilter,
		transactionTypeFilter,
		setTransactionTypeFilter,
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
		handleSingleToggleStatus,
		updateQueryParams,
	} = useWageTypesOverview();

	const subTabs = [
		{ value: "loneartlista", label: localizationConstants.wageTypeListTab },
	];

	return (
		<div className="p-6 w-full space-y-6">
			{/* Sub Tabs Bar */}
			<EconomySubTabs value="loneartlista" tabs={subTabs} />

			{/* Toolbar (Search, Filters, Create Button) */}
			<WageTypesOverviewToolbar
				searchQuery={searchQuery}
				statusFilter={statusFilter}
				personalTypeFilter={personalTypeFilter}
				wageFormFilter={wageFormFilter}
				transactionTypeFilter={transactionTypeFilter}
				onSearchChange={handleSearchChange}
				onStatusFilterChange={setStatusFilter}
				onPersonalTypeFilterChange={setPersonalTypeFilter}
				onWageFormFilterChange={setWageFormFilter}
				onTransactionTypeFilterChange={setTransactionTypeFilter}
			/>

			{/* Table with Data, Bulk Actions & Pagination */}
			<WageTypesOverviewTable
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
				onSingleToggleStatus={handleSingleToggleStatus}
			/>

			{/* Safe Delete Confirmation Dialog */}
			<WageTypeDeleteDialog
				target={deleteTarget}
				isOpen={Boolean(deleteTarget)}
				onClose={closeDeleteDialog}
				onConfirm={confirmDelete}
			/>
		</div>
	);
}

export default WageTypesOverviewPage;
