"use client";

import { useMemo } from "react";

import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { useTableSort } from "@/hooks/useTableSort";
import { formatCurrency } from "@/utils/formatCurrency";
import { sortItems } from "@/utils/tableSort";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { SortableHead } from "../../../components/SortableHead";
import { lineFigures } from "../../ataMath";
import {
	ATA_LINE_COLUMNS,
	ATA_LINE_COLUMN_LABELS,
	ATA_PARTY_LABELS,
	ATA_SECTION_CONFIG,
	type AtaLineColumn,
} from "../../projectAta.config";
import type { AtaLineItem, AtaSection } from "../../types";

type SortKey = "date" | "party";

const CELL = "px-4 py-3 text-sm whitespace-nowrap text-slate-900";
const NUMBER = `${CELL} tabular-nums`;

function cellValue(column: AtaLineColumn, item: AtaLineItem): string {
	const figures = lineFigures(item);
	switch (column) {
		case "amount": return formatCurrency(figures.amount);
		case "netSum": return formatCurrency(figures.netSum);
		case "unitPrice": return formatCurrency(figures.unitPrice);
		case "netPrice": return formatCurrency(item.netPrice);
		case "quantity": return String(item.quantity);
		case "markup": return String(item.markupPercent);
		case "secondary": return item.secondaryPercent === null ? "" : String(item.secondaryPercent);
		default: return item[column];
	}
}

const NUMERIC: ReadonlySet<AtaLineColumn> = new Set(["amount", "netSum", "unitPrice", "netPrice", "quantity", "markup", "secondary"]);

/**
 * One section's rows with the frame's fourteen columns. Datum and
 * Person/Leverantör sort, as drawn. Wide by nature, so it scrolls inside its
 * container rather than widening the page.
 */
export function AtaLineItemsTable({ section, items }: { section: AtaSection; items: AtaLineItem[] }) {
	const t = useTranslate();
	const { kind, titleKey } = ATA_SECTION_CONFIG[section];
	const { sortField, sortDir, toggleSort } = useTableSort<SortKey>();
	const rows = useMemo(
		() => sortItems(items, sortField, sortDir, (item, field) => item[field as SortKey]),
		[items, sortField, sortDir],
	);

	return (
		/* The table's own container scrolls; a focusable table lets arrow keys scroll it. */
		<Table tabIndex={0} aria-label={t(titleKey)} className="min-w-[72rem] focus-visible:outline-2 focus-visible:outline-slate-900">
			<TableHeader>
				<TableRow className="hover:bg-transparent">
					{ATA_LINE_COLUMNS[kind].map((column) => {
						const labelKey = column === "party" ? ATA_PARTY_LABELS[kind] : ATA_LINE_COLUMN_LABELS[column];
						const sortable = column === "date" || column === "party";
						return (
							<SortableHead
								key={column}
								labelKey={labelKey}
								onSort={sortable ? () => toggleSort(column) : undefined}
								active={sortField === column}
								dir={sortDir}
							/>
						);
					})}
				</TableRow>
			</TableHeader>
			<TableBody>
				{rows.length === 0 ? (
					<TableRow className="hover:bg-transparent">
						<TableCell colSpan={ATA_LINE_COLUMNS[kind].length} className="py-8 text-center text-sm text-slate-500">
							<Translate text={localizationConstants.viewAtaNoLineItems} />
						</TableCell>
					</TableRow>
				) : (
					rows.map((item) => (
						<TableRow key={item.id}>
							{ATA_LINE_COLUMNS[kind].map((column) => {
								const value = cellValue(column, item);
								return (
									<TableCell key={column} className={NUMERIC.has(column) ? NUMBER : CELL}>
										{value || <span aria-hidden className="text-slate-400">—</span>}
									</TableCell>
								);
							})}
						</TableRow>
					))
				)}
			</TableBody>
		</Table>
	);
}

export default AtaLineItemsTable;
