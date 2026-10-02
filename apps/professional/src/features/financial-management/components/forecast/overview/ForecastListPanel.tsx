"use client";

import { TablePagination } from "@/components/table/TablePagination";
import localizationConstants from "@/utils/translation/constants";
import {
	FORECAST_CATEGORY_LABELS,
	FORECAST_CUSTOMER_TYPE_LABELS,
} from "../../../constants/forecastList.constants";
import { useForecastList } from "../../../hooks/useForecastList";
import { useForecastListDialogs } from "../../../hooks/useForecastListDialogs";
import { ForecastToolbar, forecastFilterGroup } from "../ForecastToolbar";
import { ForecastDeleteDialog } from "./ForecastDeleteDialog";
import { ForecastDetailsDialog } from "./ForecastDetailsDialog";
import { ForecastListTable } from "./ForecastListTable";

export interface ForecastListPanelProps {
	/** Arkiv's side of the register; Prognoslista's by default. */
	archived?: boolean;
}

/**
 * Sök and Filter, the table, and the frame's centred pagination.
 *
 * Prognoslista and Arkiv are the same panel over the two sides of one
 * register, which is what lets a row archived here turn up there unchanged.
 */
export function ForecastListPanel({ archived = false }: ForecastListPanelProps) {
	const list = useForecastList(archived);
	const dialogs = useForecastListDialogs();

	return (
		<div className="flex flex-col gap-5">
			<ForecastToolbar
				search={list.search}
				onSearchChange={list.setSearch}
				groups={[
					forecastFilterGroup(
						localizationConstants.forecastColCategory,
						FORECAST_CATEGORY_LABELS,
						list.filters.category,
						(value) => list.setFilter("category", value),
					),
					forecastFilterGroup(
						localizationConstants.forecastColType,
						FORECAST_CUSTOMER_TYPE_LABELS,
						list.filters.customerType,
						(value) => list.setFilter("customerType", value),
					),
				]}
			/>

			<ForecastListTable
				rows={list.pageRows}
				sortField={list.sortField}
				sortDir={list.sortDir}
				onSort={list.onSort}
				emptyKey={list.emptyKey}
				onView={(row) => dialogs.open("details", row)}
				onToggleArchive={list.toggleArchive}
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
