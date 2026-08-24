"use client";

import { ModulePageHeader } from "@/components/layout/navigation";
import {
	ORDER_MODULE_TABS,
	ORDER_MODULE_TITLE,
	orderBreadcrumbs,
} from "@/features/orders/data/orderNav.config";
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
			<ModulePageHeader
				title={ORDER_MODULE_TITLE}
				tabs={ORDER_MODULE_TABS}
				breadcrumbs={orderBreadcrumbs(localizationConstants.economicOverview)}
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
