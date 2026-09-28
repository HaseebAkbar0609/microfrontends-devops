"use client";

import { SortableHead } from "@/components/table/SortableHead";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { SortDir } from "@/utils/tableSort";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { FORECAST_ACTION_COLUMN } from "../../../constants/forecastList.constants";
import { RISK_LIST_COLUMNS } from "../../../constants/forecastRisk.constants";
import type { RiskClient, RiskListSortField } from "../../../types/forecastRisk.types";
import { RiskListTableRow } from "./RiskListTableRow";

export interface RiskListTableProps {
	clients: RiskClient[];
	sortField: RiskListSortField | null;
	sortDir: SortDir;
	onSort: (field: RiskListSortField) => void;
	emptyKey: TranslationKeys;
	onView: (client: RiskClient) => void;
}

/**
 * Riskhanteringlista's table: seven sortable columns, then the eye in a column
 * pinned to the right. The table scrolls sideways inside itself, so the page
 * never does.
 */
export function RiskListTable({ clients, sortField, sortDir, onSort, emptyKey, onView }: RiskListTableProps) {
	return (
		<div className="w-full overflow-x-auto">
			<Table className="min-w-[64rem]">
				<TableHeader>
					<TableRow className="hover:bg-transparent">
						{RISK_LIST_COLUMNS.map((column) => (
							<SortableHead
								key={column.key}
								labelKey={column.labelKey}
								onSort={() => onSort(column.key)}
								active={sortField === column.key}
								dir={sortDir}
							/>
						))}
						<TableHead className={cn(FORECAST_ACTION_COLUMN, "z-20 w-16")}>
							<span className="sr-only">
								<Translate text={localizationConstants.actionsAriaLabel} />
							</span>
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{clients.length === 0 ? (
						<TableRow className="hover:bg-transparent">
							<TableCell
								colSpan={RISK_LIST_COLUMNS.length + 1}
								className="py-10 text-center text-sm text-slate-500"
							>
								<Translate text={emptyKey} />
							</TableCell>
						</TableRow>
					) : (
						clients.map((client) => (
							<RiskListTableRow key={client.id} client={client} onView={() => onView(client)} />
						))
					)}
				</TableBody>
			</Table>
		</div>
	);
}

export default RiskListTable;
