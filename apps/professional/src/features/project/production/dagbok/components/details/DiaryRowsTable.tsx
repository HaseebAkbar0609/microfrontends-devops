"use client";

import { PencilLine, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useTableSort } from "@/hooks/useTableSort";
import { cn } from "@/lib/utils";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { RowActionMenu, RowMenuAction } from "../../../components/RowActionMenu";
import { SortableHead } from "../../../components/SortableHead";
import { matchesQuery, sortRows } from "../../diaryView";
import type { DiaryRowByKind, DiaryRowKind } from "../../types";
import { DIARY_COLUMNS, type DiaryColumn } from "./diaryColumns";

const CELL = "px-3 py-3 text-sm text-slate-900";

export interface DiaryRowsTableProps<K extends DiaryRowKind> {
	kind: K;
	rows: DiaryRowByKind[K][];
	/** Sök, from the toolbar; blank on the wizard, which has none. */
	query?: string;
	/** ⋮ per row. A published diary shows the table only. */
	showActions: boolean;
	onEdit?: (row: DiaryRowByKind[K]) => void;
	onRemove?: (row: DiaryRowByKind[K]) => void;
}

/**
 * One table's rows with the frame's sortable headers and its ⋮ menu. Shared by
 * the day page's card and Ny dagbok, which put different things above it.
 */
export function DiaryRowsTable<K extends DiaryRowKind>({ kind, rows, query = "", showActions, onEdit, onRemove }: DiaryRowsTableProps<K>) {
	const t = useTranslate();
	const { i18n } = useTranslation();
	const columns = DIARY_COLUMNS[kind] as DiaryColumn<K>[];
	const { sortField, sortDir, toggleSort } = useTableSort<string>();
	const number = new Intl.NumberFormat(i18n.language === "en" ? "en-GB" : "sv-SE", { maximumFractionDigits: 2 });
	const n = (value: number) => number.format(value);

	const sortColumn = columns.find((column) => column.key === sortField)?.sortValue;
	const visible = sortRows(
		rows.filter((row) => matchesQuery(columns.map((column) => column.text(row, t, n)), query)),
		sortColumn ? (row) => sortColumn(row, t) : null,
		sortDir,
		i18n.language,
	);

	return (
		<div className="w-full overflow-x-auto">
			<Table className="min-w-[28rem]">
				<TableHeader>
					<TableRow className="hover:bg-transparent">
						{columns.map((column) => (
							<SortableHead
								key={column.key}
								labelKey={column.labelKey}
								onSort={column.sortValue ? () => toggleSort(column.key) : undefined}
								active={sortField === column.key}
								dir={sortDir}
								className="px-3"
							/>
						))}
						{showActions && <TableHead className="w-12" />}
					</TableRow>
				</TableHeader>
				<TableBody>
					{visible.length === 0 ? (
						<TableRow className="hover:bg-transparent">
							<TableCell colSpan={columns.length + 1} className="py-6 text-center text-sm text-slate-500">
								<Translate text={rows.length === 0 ? localizationConstants.projectDiaryRowEmpty : localizationConstants.projectDiaryRowNoMatches} />
							</TableCell>
						</TableRow>
					) : (
						visible.map((row) => (
							<TableRow key={row.id}>
								{columns.map((column) => {
									const text = column.text(row, t, n);
									return (
										<TableCell key={column.key} className={cn(CELL, column.numeric && "tabular-nums", column.key === "note" && "whitespace-normal")}>
											{column.badge ? <Badge variant={column.badge(row)}>{text}</Badge> : text}
										</TableCell>
									);
								})}
								{showActions && (
									<TableCell className="w-12 px-2 py-3 text-right">
										<RowActionMenu ariaLabel={t(localizationConstants.projectDiaryRowActions, { label: columns[0].text(row, t, n) })}>
											<RowMenuAction icon={PencilLine} labelKey={localizationConstants.projectDiaryRowEdit} reasonKey={null} onSelect={() => onEdit?.(row)} />
											<RowMenuAction icon={Trash2} labelKey={localizationConstants.projectDiaryRowDelete} reasonKey={null} destructive onSelect={() => onRemove?.(row)} />
										</RowActionMenu>
									</TableCell>
								)}
							</TableRow>
						))
					)}
				</TableBody>
			</Table>
		</div>
	);
}

export default DiaryRowsTable;
