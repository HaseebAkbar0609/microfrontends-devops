"use client";

import Link from "next/link";
import { Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { SortDir } from "@/utils/tableSort";
import { formatCurrency } from "@/utils/formatCurrency";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { SortableHead } from "../../../components/SortableHead";
import { ataUrls } from "../../ataNav";
import type { AtaEmptyState } from "../../list/useProjectAtaList";
import { RowActionMenu, RowMenuAction } from "../../../components/RowActionMenu";
import { SUPPLIER_GROUP_COLUMNS, type SupplierGroupSortField } from "../supplierAta.config";
import type { SupplierGroupRow } from "../types";

const CELL = "px-3 py-3 text-sm text-slate-900 tabular-nums xl:px-4";

export interface SupplierGroupTableProps {
	projectId: string;
	rows: SupplierGroupRow[];
	sortField: SupplierGroupSortField | null;
	sortDir: SortDir;
	onSort: (field: SupplierGroupSortField) => void;
	emptyState: AtaEmptyState;
	onSelect: (supplierId: string) => void;
}

/** "Alla": each supplier's total and how its ÄTAs stand. Visa detaljer opens that supplier's ÄTAs. */
export function SupplierGroupTable({ projectId, rows, sortField, sortDir, onSort, emptyState, onSelect }: SupplierGroupTableProps) {
	const t = useTranslate();

	return (
		<div className="w-full overflow-x-auto rounded-lg border border-slate-200 bg-white">
			<Table className="min-w-[48rem]">
				<TableHeader>
					<TableRow className="hover:bg-transparent">
						{SUPPLIER_GROUP_COLUMNS.map((column) => (
							<SortableHead
								key={column.key}
								labelKey={column.labelKey}
								onSort={() => onSort(column.key)}
								active={sortField === column.key}
								dir={sortDir}
								className="px-3 xl:px-4"
							/>
						))}
						<TableHead className="w-36" />
						<TableHead className="w-12 border-l border-slate-200" />
					</TableRow>
				</TableHeader>
				<TableBody>
					{rows.length === 0 ? (
						<TableRow className="hover:bg-transparent">
							<TableCell colSpan={SUPPLIER_GROUP_COLUMNS.length + 2} className="py-10 text-center">
								<p className="text-sm font-medium text-slate-900"><Translate text={emptyState.titleKey} /></p>
								{emptyState.descriptionKey && (
									<p className="mt-1 text-sm text-slate-500"><Translate text={emptyState.descriptionKey} /></p>
								)}
							</TableCell>
						</TableRow>
					) : (
						rows.map((row) => (
							<TableRow key={row.supplier.id}>
								<TableCell className="px-3 py-3 text-sm font-semibold text-slate-900 xl:px-4">{row.supplier.name}</TableCell>
								<TableCell className={CELL}>{formatCurrency(row.total)}</TableCell>
								<TableCell className={CELL}>{row.count}</TableCell>
								<TableCell className={CELL}>{row.approved}</TableCell>
								<TableCell className={CELL}>{row.inReview}</TableCell>
								<TableCell className={CELL}>{row.notApproved}</TableCell>
								<TableCell className="px-3 py-3 xl:px-4">
									<Button asChild variant="secondary" className="h-9 cursor-pointer bg-slate-100 px-3 text-sm font-medium text-slate-900 hover:bg-slate-200">
										<Link href={ataUrls.supplierList(projectId, row.supplier.id)} scroll={false}>
											<Translate text={localizationConstants.ataViewDetails} />
										</Link>
									</Button>
								</TableCell>
								<TableCell className="w-12 border-l border-slate-200 px-2 py-3 text-right">
									<RowActionMenu ariaLabel={t(localizationConstants.projectAtaRowActions, { label: row.supplier.name })}>
										<RowMenuAction icon={Eye} labelKey={localizationConstants.ataViewDetails} reasonKey={null} onSelect={() => onSelect(row.supplier.id)} />
									</RowActionMenu>
								</TableCell>
							</TableRow>
						))
					)}
				</TableBody>
			</Table>
		</div>
	);
}

export default SupplierGroupTable;
