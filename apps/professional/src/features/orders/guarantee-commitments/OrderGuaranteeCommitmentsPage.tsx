"use client";

import React, { useState } from "react";
import { useGuaranteeCommitments } from "./hooks/useGuaranteeCommitments";
import { GuaranteeOverviewTable } from "./components/GuaranteeOverviewTable";
import { GuaranteeDetailView } from "./components/GuaranteeDetailView";
import { CreateVisitDateModal } from "./components/CreateVisitDateModal";
import type { GuaranteeRow, InspectionDateItem } from "./types/guaranteeCommitments.types";
import { showToast } from "@/lib/toast";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

export interface OrderGuaranteeCommitmentsPageProps {
	orderId?: string;
	hideNavRow?: boolean;
	onDetailModeChange?: (isDetail: boolean) => void;
}

export function OrderGuaranteeCommitmentsPage({
	orderId,
	onDetailModeChange,
}: OrderGuaranteeCommitmentsPageProps) {
	const t = useTranslate();
	const {
		inspectionDates,
		searchQuery,
		setSearchQuery,
		statusFilter,
		setStatusFilter,
		selectedIds,
		toggleSelectAll,
		toggleSelectRow,
		sortField,
		sortOrder,
		handleSort,
		paginatedRows,
		currentPage,
		setCurrentPage,
		pageSize,
		setPageSize,
		totalPages,
		addInspectionDate,
		updateInspectionDate,
		deleteInspectionDate,
	} = useGuaranteeCommitments(orderId);

	const [viewMode, setViewMode] = useState<"table" | "detail">("table");
	const [selectedRow, setSelectedRow] = useState<GuaranteeRow | null>(null);
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);

	const handleOpenDetail = (row: GuaranteeRow) => {
		setSelectedRow(row);
		setViewMode("detail");
		onDetailModeChange?.(true);
	};

	const handleBackToTable = () => {
		setViewMode("table");
		setSelectedRow(null);
		onDetailModeChange?.(false);
	};

	const handleSaveNewItem = async (item: Omit<InspectionDateItem, "id">) => {
		await addInspectionDate(item);
		showToast("success", t(localizationConstants.toastVisitDateAdded));
		setIsAddModalOpen(false);
	};

	if (viewMode === "detail" && selectedRow) {
		return (
			<div className="w-full">
				<GuaranteeDetailView
					warranty={selectedRow}
					inspectionDates={inspectionDates}
					onBack={handleBackToTable}
					onAddInspectionDate={addInspectionDate}
					onUpdateInspectionDate={updateInspectionDate}
					onDeleteInspectionDate={deleteInspectionDate}
				/>
			</div>
		);
	}

	return (
		<div className="w-full">
			<GuaranteeOverviewTable
				rows={paginatedRows}
				selectedIds={selectedIds}
				onToggleSelectAll={toggleSelectAll}
				onToggleSelectRow={toggleSelectRow}
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
				onOpenDetail={handleOpenDetail}
				onOpenAdd={() => setIsAddModalOpen(true)}
			/>

			<CreateVisitDateModal
				isOpen={isAddModalOpen}
				initialData={null}
				onClose={() => setIsAddModalOpen(false)}
				onSave={handleSaveNewItem}
			/>
		</div>
	);
}

export default OrderGuaranteeCommitmentsPage;
