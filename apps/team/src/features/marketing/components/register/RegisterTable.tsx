"use client";

import { useMemo } from "react";
import { ActionsToolbar, type FilterConfig } from "@/components/table/ActionsToolbar";
import { TablePagination } from "@/components/table/TablePagination";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import localizationConstants from "@/utils/translation/constants";
import { pickCountKey } from "@/utils/pluralLabel";
import { Translate, useTranslate } from "@/utils/translation/translate";
import type { useRegisterTable } from "../../hooks/useRegisterTable";
import type { MarketingRow, MarketingSection } from "../../types";
import { RegisterTableRow } from "./RegisterTableRow";

type RegisterTableProps = {
	section: MarketingSection;
	table: ReturnType<typeof useRegisterTable>;
	onCreate: () => void;
	onEdit: (row: MarketingRow) => void;
	onDelete: (row: MarketingRow) => void;
};

export function RegisterTable({
	section,
	table,
	onCreate,
	onEdit,
	onDelete,
}: RegisterTableProps) {
	const t = useTranslate();
	const columnCount = section.fields.length + 1;

	// Facets come from the register's own select fields, so adding a filter is a
	// config change. Labels are translation keys; ActionsToolbar renders them.
	const filters = useMemo<FilterConfig[]>(
		() =>
			table.filterFields.map((field) => ({
				label: field.labelKey,
				value: table.selected[field.name] ?? "",
				onFilterChange: (value: string) => table.changeFilter(field.name, value),
				options: (field.options ?? []).map((option) => ({
					label: option.labelKey,
					value: option.id,
				})),
			})),
		[table],
	);

	return (
		<section className="@container rounded-xl border border-slate-200 bg-white shadow-2xs">
			<div className="border-b border-slate-200 px-5 pt-5 pb-4">
				<h2 className="text-base font-semibold text-slate-900">
					<Translate text={section.titleKey} />
				</h2>
				<p className="mt-0.5 text-sm text-slate-500">
					<Translate text={section.descriptionKey} />
				</p>
			</div>

			<ActionsToolbar
				className="flex-wrap gap-y-3"
				searchValue={table.query}
				onSearchChange={table.changeQuery}
				searchPlaceholder={localizationConstants.marketingSearchPlaceholder}
				filters={filters}
				onCreateClick={onCreate}
				createButtonLabel={localizationConstants.marketingNewRowButton}
			/>

			<div className="overflow-x-auto">
				<Table>
					<TableHeader>
						<TableRow>
							{section.fields.map((field) => (
								<TableHead
									key={field.name}
									className={`text-xs font-medium tracking-wide text-slate-500 ${field.width ?? ""}`}
								>
									<Translate text={field.labelKey} />
								</TableHead>
							))}
							<TableHead className="text-right text-xs font-medium tracking-wide text-slate-500">
								<Translate text={localizationConstants.marketingActionsColumn} />
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{table.visibleRows.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={columnCount}
									className="h-32 text-center text-sm text-slate-500"
								>
									<Translate text={localizationConstants.marketingNoRows} />
								</TableCell>
							</TableRow>
						) : (
							table.visibleRows.map((row) => (
								<RegisterTableRow
									key={row.id}
									section={section}
									row={row}
									onEdit={() => onEdit(row)}
									onDelete={() => onDelete(row)}
								/>
							))
						)}
					</TableBody>
				</Table>
			</div>

			<div className="flex flex-col items-start gap-1 border-t border-slate-200 px-5 @2xl:flex-row @2xl:items-center @2xl:justify-between @2xl:gap-3">
				<p className="pt-4 text-sm text-slate-500 tabular-nums @2xl:py-4">
					{`${table.filteredCount} ${t(localizationConstants.marketingCountOf)} ${
						table.totalCount
					} ${t(
						pickCountKey(
							table.totalCount,
							localizationConstants.marketingEntrySingular,
							localizationConstants.marketingEntryPlural,
						),
					)}`}
				</p>
				{table.filteredCount > 0 ? (
					<TablePagination
						currentPage={table.currentPage}
						totalPages={table.totalPages}
						pageSize={table.pageSize}
						onPageChange={table.setPage}
						onPageSizeChange={table.changePageSize}
					/>
				) : null}
			</div>
		</section>
	);
}

export default RegisterTable;
