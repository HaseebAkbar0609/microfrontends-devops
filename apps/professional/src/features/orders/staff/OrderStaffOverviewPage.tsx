"use client";

import React from "react";
import { STAFF_CONSTANTS } from "./constants/staff.constants";
import { useStaffRegistration } from "./hooks/useStaffRegistration";
import { StaffFilterBar } from "./components/StaffFilterBar";
import { StaffLedgerTable } from "./components/StaffLedgerTable";
import { TablePagination } from "@/components/table/TablePagination";

export interface OrderStaffOverviewPageProps {
	orderId?: string;
}

export function OrderStaffOverviewPage({
	orderId = STAFF_CONSTANTS.DEFAULT_ORDER_ID,
}: OrderStaffOverviewPageProps) {
	const {
		isLoading,
		items,
		totalCount,
		page,
		pageSize,
		totalPages,
		filters,
		sortField,
		sortOrder,
		uniqueSuppliers,
		handleSort,
		handleFilterSupplier,
		handleFilterDates,
		handleToggleLoggedInNow,
		handlePageChange,
		handlePageSizeChange,
	} = useStaffRegistration({ orderId });

	return (
		<div className="w-full flex flex-col font-sans bg-white">
			{/* Filter Bar matching Figma: Vald leverantör/ UE, Välj datum, Inloggade NU */}
			<StaffFilterBar
				selectedSupplier={filters.supplier}
				suppliers={uniqueSuppliers}
				startDate={filters.startDate}
				endDate={filters.endDate}
				isLoggedInNow={filters.isLoggedInNow}
				onSupplierChange={handleFilterSupplier}
				onStartDateChange={(start) => handleFilterDates(start, filters.endDate)}
				onEndDateChange={(end) => handleFilterDates(filters.startDate, end)}
				onLoggedInNowChange={handleToggleLoggedInNow}
			/>

			{/* Table matching Figma */}
			<div className="pt-2">
				<StaffLedgerTable
					items={items}
					isLoading={isLoading}
					sortField={sortField}
					sortOrder={sortOrder}
					onSort={handleSort}
				/>
			</div>

			{/* Reused Shared TablePagination */}
			{totalCount > 0 && (
				<TablePagination
					currentPage={page}
					totalPages={totalPages}
					pageSize={pageSize}
					onPageChange={handlePageChange}
					onPageSizeChange={handlePageSizeChange}
					className="justify-end sm:justify-end mt-4"
				/>
			)}
		</div>
	);
}

export default OrderStaffOverviewPage;

