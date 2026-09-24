"use client";

import { useEffect, useState } from "react";

import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { WarrantyDetailView } from "./components/WarrantyDetailView";
import { WarrantyOverviewTable } from "./components/WarrantyOverviewTable";
import { VisitDateDialog } from "./components/visit-date/VisitDateDialog";
import { useWarranty } from "./hooks/useWarranty";
import type {
	InspectionDateItem,
	WarrantyRow,
	WarrantyScope,
} from "./types/warranty.types";

export interface WarrantyFeatureProps {
	/**
	 * Scopes the data. When `initialView` is `"detail"` this is also the record
	 * whose detail opens straight away, which is how the `[id]` routes enter.
	 */
	recordId?: string;
	/** `"detail"` skips the list; anything else starts on it. */
	initialView?: "table" | "detail";
	/** The opened-order tab hides its own nav row while a detail is showing. */
	onDetailModeChange?: (isDetail: boolean) => void;
	/**
	 * Which module's wording the list's record columns take. Defaults to
	 * `"order"`, so a caller that forgets cannot silently reword the two Order
	 * screens this feature was merged out of.
	 */
	scope?: WarrantyScope;
}

/**
 * Garantiåtaganden — the list, the record detail, and the visit-date dialog.
 *
 * One implementation for all three places this appears: the Order warranty
 * route, the tab inside an opened order, and the Project module page. It used
 * to exist twice under `features/orders/` — as `warranty/` and
 * `guarantee-commitments/` — with two copies of the modal, two near-identical
 * row types and two hooks that were ~90% the same code.
 */
export function WarrantyFeature({
	recordId,
	initialView = "table",
	onDetailModeChange,
	scope = "order",
}: WarrantyFeatureProps) {
	const t = useTranslate();
	const {
		rows,
		inspectionDates,
		searchQuery,
		handleSearchChange,
		statusFilter,
		handleStatusFilterChange,
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
	} = useWarranty(recordId);

	const [viewMode, setViewMode] = useState<"table" | "detail">(initialView);
	const [selectedRow, setSelectedRow] = useState<WarrantyRow | null>(null);
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);

	/**
	 * Entering on `/warranty/[id]`, the row arrives with the fetch rather than
	 * with a click, so the detail resolves once the rows land.
	 */
	const routedRow =
		initialView === "detail" && recordId
			? rows.find(
					(row) =>
						row.id === recordId ||
						row.recordNo.replace("#", "").trim() ===
							recordId.replace("#", "").trim(),
				)
			: undefined;

	useEffect(() => {
		onDetailModeChange?.(viewMode === "detail");
	}, [onDetailModeChange, viewMode]);

	const handleOpenDetail = (row: WarrantyRow) => {
		setSelectedRow(row);
		setViewMode("detail");
	};

	const handleBackToTable = () => {
		setViewMode("table");
		setSelectedRow(null);
	};

	const handleSaveNewItem = async (item: Omit<InspectionDateItem, "id">) => {
		await addInspectionDate(item);
		showToast("success", t(localizationConstants.toastVisitDateAdded));
		setIsAddModalOpen(false);
	};

	if (viewMode === "detail") {
		const warranty = selectedRow ?? routedRow;

		/** A routed id that matches no record says so rather than showing a shell. */
		if (!warranty) {
			return (
				<div className="flex flex-1 flex-col items-center justify-center bg-white p-12 text-slate-500">
					<p className="text-sm font-medium">
						<Translate
							text={localizationConstants.noRecordsFound}
						/>
					</p>
				</div>
			);
		}

		return (
			<div className="w-full">
				<WarrantyDetailView
					warranty={warranty}
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
			<WarrantyOverviewTable
				scope={scope}
				rows={paginatedRows}
				selectedIds={selectedIds}
				onToggleSelectAll={toggleSelectAll}
				onToggleSelectRow={toggleSelectRow}
				sortField={sortField}
				sortOrder={sortOrder}
				onSort={handleSort}
				searchQuery={searchQuery}
				onSearchChange={handleSearchChange}
				statusFilter={statusFilter}
				onStatusFilterChange={handleStatusFilterChange}
				currentPage={currentPage}
				setCurrentPage={setCurrentPage}
				pageSize={pageSize}
				setPageSize={setPageSize}
				totalPages={totalPages}
				onOpenDetail={handleOpenDetail}
				onOpenAdd={() => setIsAddModalOpen(true)}
			/>

			<VisitDateDialog
				isOpen={isAddModalOpen}
				initialData={null}
				onClose={() => setIsAddModalOpen(false)}
				onSave={handleSaveNewItem}
			/>
		</div>
	);
}

export default WarrantyFeature;
