"use client";

import { DataTable } from "@/components/table/DataTable";
import { TablePagination } from "@/components/table/TablePagination";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import type { SortOrder, WarrantySortField } from "../hooks/useWarranty";
import type { WarrantyRow } from "../types/warranty.types";
import { buildWarrantyColumns } from "./overview/warrantyColumns";
import { WarrantyTableToolbar } from "./overview/WarrantyTableToolbar";

export interface WarrantyOverviewTableProps {
	rows: WarrantyRow[];
	selectedIds: string[];
	onToggleSelectAll: () => void;
	onToggleSelectRow: (id: string) => void;
	sortField: WarrantySortField;
	sortOrder: SortOrder;
	onSort: (field: WarrantySortField) => void;
	searchQuery: string;
	onSearchChange: (query: string) => void;
	statusFilter: string;
	onStatusFilterChange: (status: string) => void;
	currentPage: number;
	setCurrentPage: (page: number) => void;
	pageSize: number;
	setPageSize: (size: number) => void;
	totalPages: number;
	onOpenDetail: (row: WarrantyRow) => void;
	onOpenAdd?: () => void;
}

/**
 * The Garantiåtaganden list.
 *
 * On the shared `DataTable` rather than the nine hand-written header and cell
 * pairs the two Order copies each carried. Pagination stays on
 * `TablePagination` — `DataTable` has a footer of its own, but it is a second
 * near-copy of that component, and swapping it here would move the footer on
 * two already-merged Order screens for no gain.
 */
export function WarrantyOverviewTable({
	rows,
	selectedIds,
	onToggleSelectAll,
	onToggleSelectRow,
	sortField,
	sortOrder,
	onSort,
	searchQuery,
	onSearchChange,
	statusFilter,
	onStatusFilterChange,
	currentPage,
	setCurrentPage,
	pageSize,
	setPageSize,
	totalPages,
	onOpenDetail,
	onOpenAdd,
}: WarrantyOverviewTableProps) {
	const t = useTranslate();

	const columns = buildWarrantyColumns({
		selectedIds,
		allSelected:
			rows.length > 0 && rows.every((row) => selectedIds.includes(row.id)),
		onToggleSelectAll,
		onToggleSelectRow,
		onOpenDetail,
		labels: {
			selectAll: t(localizationConstants.selectAllLabel),
			selectRow: t(localizationConstants.selectRowLabel),
		},
	});

	return (
		<div className="flex flex-col gap-4">
			<WarrantyTableToolbar
				searchQuery={searchQuery}
				onSearchChange={onSearchChange}
				statusFilter={statusFilter}
				onStatusFilterChange={onStatusFilterChange}
				onOpenAdd={onOpenAdd}
			/>

			<DataTable
				data={rows}
				columns={columns}
				rowKey={(row) => row.id}
				sortBy={sortField}
				sortOrder={sortOrder}
				/* `DataTable` cycles asc → desc → none; the hook toggles between
				   two, which is what both Order screens shipped, so the third
				   step folds back into the toggle. */
				onSort={(field) => onSort(field as WarrantySortField)}
				emptyMessageKey={localizationConstants.noRecordsFound}
			/>

			<div className="print:hidden">
				<TablePagination
					currentPage={currentPage}
					totalPages={totalPages}
					pageSize={pageSize}
					onPageChange={setCurrentPage}
					onPageSizeChange={setPageSize}
				/>
			</div>
		</div>
	);
}

export default WarrantyOverviewTable;
