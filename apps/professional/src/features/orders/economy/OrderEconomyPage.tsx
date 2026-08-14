"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import localizationConstants from "@/utils/translation/constants";
import { OrderEconomyTabs } from "./components/OrderEconomyTabs";
import { OrderEconomyTable } from "./components/OrderEconomyTable";
import { useOrderEconomy } from "./hooks/useOrderEconomy";

export function OrderEconomyPage() {
	const {
		activeTab,
		setActiveTab,
		selectedIds,
		toggleSelectAll,
		toggleSelectRow,
		sortField,
		sortOrder,
		handleSort,
		paginatedRows,
		totalRows,
		currentPage,
		setCurrentPage,
		pageSize,
		setPageSize,
		totalPages,
		totalTBBidrag,
	} = useOrderEconomy();

	return (
		<div className="flex flex-1 flex-col bg-slate-50/50">
			{/* Page Header with Breadcrumbs */}
			<PageHeader
				title={localizationConstants.economicOverview}
				breadcrumbs={[
					{ label: localizationConstants.home, href: "/dashboard" },
					{ label: localizationConstants.production },
					{ label: localizationConstants.orderModule, href: "/module/production/order" },
					{ label: localizationConstants.economicOverview },
				]}
			/>

			{/* Tabs & Table Content */}
			<div className="flex flex-col flex-1">
				<OrderEconomyTabs activeTab={activeTab} onTabChange={setActiveTab} />

				<OrderEconomyTable
					rows={paginatedRows}
					selectedIds={selectedIds}
					onToggleSelectAll={toggleSelectAll}
					onToggleSelectRow={toggleSelectRow}
					sortField={sortField}
					sortOrder={sortOrder}
					onSort={handleSort}
					totalTBBidrag={totalTBBidrag}
					currentPage={currentPage}
					setCurrentPage={setCurrentPage}
					pageSize={pageSize}
					setPageSize={setPageSize}
					totalPages={totalPages}
					totalRows={totalRows}
					activeTab={activeTab}
				/>
			</div>
		</div>
	);
}
