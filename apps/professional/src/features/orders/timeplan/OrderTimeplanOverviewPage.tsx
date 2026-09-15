"use client";

import React from "react";
import { Plus, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TablePagination } from "@/components/table/TablePagination";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { TIMEPLAN_CONSTANTS } from "./constants/timeplan.constants";
import { useOrderTimeplans } from "./hooks/useOrderTimeplans";
import { TimeplanListTable } from "./components/TimeplanListTable";

export interface OrderTimeplanOverviewPageProps {
	orderId?: string;
}

export function OrderTimeplanOverviewPage({
	orderId = TIMEPLAN_CONSTANTS.DEFAULT_ORDER_ID,
}: OrderTimeplanOverviewPageProps) {
	const t = useTranslate();
	const {
		isLoading,
		plans,
		totalCount,
		currentPage,
		totalPages,
		pageSize,
		setCurrentPage,
		setPageSize,
		sortField,
		sortOrder,
		handleSort,
		handleDeletePlan,
	} = useOrderTimeplans({ orderId });

	return (
		<div className="w-full flex flex-col font-sans bg-white">
			{/* Top Action Bar matching Figma: Print + Skapa ny tidsplan */}
			<div className="flex items-center justify-end gap-3 pb-4">
				<Button
					type="button"
					variant="outline"
					size="icon"
					onClick={() => window.print()}
					aria-label={t(localizationConstants.orderTimeplanPrintBtn)}
					title={t(localizationConstants.orderTimeplanPrintBtn)}
					className="h-10 w-10 cursor-pointer rounded-lg border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-none"
				>
					<Printer className="h-4 w-4" />
				</Button>

				<Button
					type="button"
					className="h-10 px-4 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-sans text-sm font-medium gap-1.5 shadow-none cursor-pointer flex items-center"
				>
					<Plus className="h-4 w-4" />
					<Translate text={localizationConstants.orderTimeplanCreateBtn} />
				</Button>
			</div>

			{/* Table matching Figma */}
			<div className="pt-2">
				<TimeplanListTable
					plans={plans}
					isLoading={isLoading}
					sortField={sortField}
					sortOrder={sortOrder}
					onSort={handleSort}
					onView={() => {}}
					onDelete={handleDeletePlan}
				/>
			</div>

			{/* Pagination component reused across the project */}
			{!isLoading && totalCount > 0 && (
				<TablePagination
					currentPage={currentPage}
					totalPages={totalPages}
					pageSize={pageSize}
					onPageChange={setCurrentPage}
					onPageSizeChange={setPageSize}
				/>
			)}
		</div>
	);
}

export default OrderTimeplanOverviewPage;


