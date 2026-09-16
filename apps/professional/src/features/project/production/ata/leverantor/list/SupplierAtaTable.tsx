"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { SortDir } from "@/utils/tableSort";
import { Translate } from "@/utils/translation/translate";
import { SortableHead } from "../../../components/SortableHead";
import { padAtaNumber } from "../../ataMath";
import type { AtaEmptyState } from "../../list/useProjectAtaList";
import { SUPPLIER_ATA_COLUMNS, type SupplierAtaSortField } from "../supplierAta.config";
import type { SupplierAta, SupplierAtaRow } from "../types";
import { SupplierAtaTableRow } from "./SupplierAtaTableRow";

export interface SupplierAtaTableProps {
	supplierName: string;
	rows: SupplierAtaRow[];
	sortField: SupplierAtaSortField | null;
	sortDir: SortDir;
	onSort: (field: SupplierAtaSortField) => void;
	emptyState: AtaEmptyState & { values?: Record<string, string> };
	onApprove: (ata: SupplierAta) => void;
}

/** A selected supplier's ÄTAs, as the frame draws them. Wide, so it scrolls inside its frame. */
export function SupplierAtaTable({ supplierName, rows, sortField, sortDir, onSort, emptyState, onApprove }: SupplierAtaTableProps) {
	return (
		<div className="w-full overflow-x-auto rounded-lg border border-slate-200 bg-white">
			<Table className="min-w-[64rem]">
				<TableHeader>
					<TableRow className="hover:bg-transparent">
						{SUPPLIER_ATA_COLUMNS.map((column) => (
							<SortableHead key={column.key} labelKey={column.labelKey} onSort={() => onSort(column.key)} active={sortField === column.key} dir={sortDir} />
						))}
						<TableHead className="w-36" />
						<TableHead className="w-12 border-l border-slate-200" />
					</TableRow>
				</TableHeader>
				<TableBody>
					{rows.length === 0 ? (
						<TableRow className="hover:bg-transparent">
							<TableCell colSpan={SUPPLIER_ATA_COLUMNS.length + 2} className="py-10 text-center text-sm font-medium text-slate-900">
								<Translate text={emptyState.titleKey} values={emptyState.values} />
							</TableCell>
						</TableRow>
					) : (
						rows.map((row) => (
							<SupplierAtaTableRow
								key={row.ata.id}
								row={row}
								label={`${supplierName} ${padAtaNumber(row.ata.number)}`}
								onApprove={() => onApprove(row.ata)}
							/>
						))
					)}
				</TableBody>
			</Table>
		</div>
	);
}

export default SupplierAtaTable;
