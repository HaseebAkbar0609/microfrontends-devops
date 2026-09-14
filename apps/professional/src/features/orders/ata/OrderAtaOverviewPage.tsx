"use client";

import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { ATA_CONSTANTS, type AtaCategory } from "./constants/ata.constants";
import { useAta } from "./hooks/useAta";
import { AtaOverviewTable } from "./components/AtaOverviewTable";

export interface OrderAtaOverviewPageProps {
	orderId?: string;
	onDetailModeChange?: (isOpen: boolean) => void;
}

export function OrderAtaOverviewPage({
	orderId = ATA_CONSTANTS.DEFAULT_ORDER_ID,
	onDetailModeChange: _onDetailModeChange,
}: OrderAtaOverviewPageProps) {
	const {
		activeCategory,
		setActiveCategory,
		isLoading,
		searchQuery,
		setSearchQuery,
		statusFilter,
		setStatusFilter,
		sortField,
		sortOrder,
		handleSort,
		currentPage,
		setCurrentPage,
		pageSize,
		setPageSize,
		totalPages,
		paginatedRows,
		summary,
		removeAta,
		sendAta,
	} = useAta(orderId);

	return (
		<div className="w-full">
			{/* Sub-tabs: ÄTA - kund / ÄTA-Leverantör /UE matching screenshot */}
			<Tabs
				value={activeCategory}
				onValueChange={(val) => setActiveCategory(val as AtaCategory)}
				className="w-full flex flex-col"
			>
				<TabsList variant="line" className="mb-4">
					<TabsTrigger value={ATA_CONSTANTS.CATEGORIES.CUSTOMER} className="cursor-pointer">
						<Translate text={localizationConstants.ataCustomerTab} />
					</TabsTrigger>
					<TabsTrigger value={ATA_CONSTANTS.CATEGORIES.SUPPLIER} className="cursor-pointer">
						<Translate text={localizationConstants.ataSupplierTab} />
					</TabsTrigger>
				</TabsList>

				<TabsContent value={activeCategory} className="mt-0 focus-visible:outline-none">
					<AtaOverviewTable
						rows={paginatedRows}
						summary={summary}
						activeCategory={activeCategory}
						isLoading={isLoading}
						sortField={sortField}
						sortOrder={sortOrder}
						onSort={handleSort}
						searchQuery={searchQuery}
						onSearchChange={setSearchQuery}
						statusFilter={statusFilter}
						onStatusFilterChange={setStatusFilter}
						currentPage={currentPage}
						setCurrentPage={setCurrentPage}
						pageSize={pageSize}
						setPageSize={setPageSize}
						totalPages={totalPages}
						onDelete={removeAta}
						onSend={sendAta}
					/>
				</TabsContent>
			</Tabs>
		</div>
	);
}

export default OrderAtaOverviewPage;
