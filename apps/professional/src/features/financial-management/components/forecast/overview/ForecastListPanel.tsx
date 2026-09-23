"use client";

import { TablePagination } from "@/components/table/TablePagination";
import { useForecastList } from "../../../hooks/useForecastList";
import { useForecastListDialogs } from "../../../hooks/useForecastListDialogs";
import { ForecastDeleteDialog } from "./ForecastDeleteDialog";
import { ForecastDetailsDialog } from "./ForecastDetailsDialog";
import { ForecastListTable } from "./ForecastListTable";
import { ForecastListToolbar } from "./ForecastListToolbar";

/** Prognoslista: Sök and Filter, the table, and the frame's centred pagination. */
export function ForecastListPanel() {
	const list = useForecastList();
	const dialogs = useForecastListDialogs();

	return (
		<div className="flex flex-col gap-5">
			<ForecastListToolbar
				search={list.search}
				onSearchChange={list.setSearch}
				filters={list.filters}
				onFilterChange={list.setFilter}
				activeFilterCount={list.activeFilterCount}
			/>

			<ForecastListTable
				rows={list.pageRows}
				sortField={list.sortField}
				sortDir={list.sortDir}
				onSort={list.onSort}
				emptyKey={list.emptyKey}
				onView={(row) => dialogs.open("details", row)}
				onDelete={(row) => dialogs.open("delete", row)}
			/>

			<TablePagination
				currentPage={list.currentPage}
				totalPages={list.totalPages}
				pageSize={list.pageSize}
				onPageChange={list.setPage}
				onPageSizeChange={list.setPageSize}
				className="justify-center sm:justify-center"
			/>

			<ForecastDetailsDialog row={dialogs.row} open={dialogs.isOpen("details")} onClose={dialogs.close} />
			<ForecastDeleteDialog
				row={dialogs.row}
				open={dialogs.isOpen("delete")}
				onClose={dialogs.close}
				onConfirm={list.remove}
			/>
		</div>
	);
}

export default ForecastListPanel;
