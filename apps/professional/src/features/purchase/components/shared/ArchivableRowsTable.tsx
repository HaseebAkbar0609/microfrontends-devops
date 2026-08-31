"use client";

import { useState, type ReactNode } from "react";
import { Archive, RotateCcw, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Search } from "@/components/search/Search";
import {
	DataTable,
	type DataTableAction,
	type DataTableColumn,
} from "@/components/table/DataTable";
import { Card } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { ROLES } from "@/constants/roles";
import { hasPermission } from "@/lib/hasPermission";
import { showToast } from "@/lib/toast";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import {
	useArchivableRows,
	type ArchivableRow,
} from "../../hooks/useArchivableRows";
import { ConfirmActionDialog } from "./ConfirmActionDialog";

export interface ArchivableFilterOption {
	value: string;
	label: TranslationKeys;
}

export interface ArchivableRowsTableProps<T extends ArchivableRow> {
	/** Full collection; the hook lists only the archived rows. */
	rows: T[];
	columns: DataTableColumn<T>[];
	searchFields: (row: T) => string[];
	sortValue: (row: T, field: string) => string | number;
	defaultSortBy: string;
	emptyMessageKey: TranslationKeys;
	/** Human-readable identifier, used in toasts and the confirm dialog. */
	rowLabel: (row: T) => string;
	/**
	 * Right-aligned "see details" cell. A render prop because callers differ:
	 * purchases and complaints link to a route, goods reception opens a drawer.
	 * Omit it where the design draws a button with no destination.
	 */
	renderPrimaryAction?: (row: T) => ReactNode;
	/**
	 * `"restore"` lists archived rows and offers Avarkivera (the Arkiv tab);
	 * `"archive"` lists live rows and offers Arkiv (a record's line list).
	 */
	mode?: "restore" | "archive";
	/** Toast for the restore/archive action, whichever `mode` selects. */
	movedToast: TranslationKeys;
	deletedToast: TranslationKeys;
	/** Right-hand slot in the toolbar, e.g. a create CTA. */
	toolbarAction?: ReactNode;
	filterOptions?: ArchivableFilterOption[];
	matchesFilter?: (row: T, value: string) => boolean;
}

/**
 * A searchable, sortable, paginated table over rows carrying an `archived`
 * flag, with a row menu and a confirmed delete.
 *
 * Backs the three Arkiv sub-tabs (`mode="restore"`) and a purchase record's
 * line list (`mode="archive"`), which differ only in columns, copy and which
 * direction the archive action moves a row.
 *
 * Uses the shared `DataTable`, which already brings the sticky action column,
 * sort icons, empty state and pagination the purchase lists hand-roll.
 */
export function ArchivableRowsTable<T extends ArchivableRow>({
	rows,
	columns,
	searchFields,
	sortValue,
	defaultSortBy,
	emptyMessageKey,
	rowLabel,
	renderPrimaryAction,
	mode = "restore",
	movedToast,
	deletedToast,
	filterOptions,
	matchesFilter,
	toolbarAction,
}: ArchivableRowsTableProps<T>) {
	const { t } = useTranslation();
	const {
		paginatedRows,
		totalCount,
		currentPage,
		setCurrentPage,
		pageSize,
		changePageSize,
		searchQuery,
		changeSearch,
		filterValue,
		changeFilter,
		sortBy,
		sortOrder,
		handleSort,
		restoreRow,
		archiveRow,
		deleteRow,
	} = useArchivableRows({
		rows,
		archivedOnly: mode === "restore",
		searchFields,
		sortValue,
		defaultSortBy,
		matchesFilter,
	});

	const [pendingDelete, setPendingDelete] = useState<T | null>(null);

	/**
	 * `DataTable` takes a flat action array, so the gate is applied when the
	 * array is built rather than by wrapping in `PermissionGate`. Same call that
	 * component makes, so the behaviour matches the rest of the module.
	 */
	const canRestore = hasPermission(ROLES.MANAGER, "EDIT_PURCHASE");
	const canDelete = hasPermission(ROLES.MANAGER, "DELETE_PURCHASE");

	const actions: DataTableAction<T>[] = [];

	if (canRestore) {
		const restoring = mode === "restore";
		actions.push({
			label: restoring
				? localizationConstants.purchaseArchiveUnarchive
				: localizationConstants.archive,
			icon: restoring ? (
				<RotateCcw className="h-4 w-4 text-slate-500" />
			) : (
				<Archive className="h-4 w-4 text-slate-500" />
			),
			onClick: (row) => {
				if (restoring) restoreRow(row.id);
				else archiveRow(row.id);
				showToast("success", `${rowLabel(row)} — ${t(movedToast)}`);
			},
		});
	}

	if (canDelete) {
		actions.push({
			label: localizationConstants.actionDelete,
			icon: <Trash2 className="h-4 w-4 text-red-500" />,
			destructive: true,
			/**
			 * Deferred a frame so the dropdown finishes closing first. Opening
			 * the dialog in the same tick leaves two Radix modal layers
			 * unwinding together, and `pointer-events: none` stays on `body`
			 * after the dialog closes — the page becomes unclickable.
			 */
			onClick: (row) =>
				requestAnimationFrame(() => setPendingDelete(row)),
		});
	}

	const handleConfirmDelete = () => {
		if (!pendingDelete) return;
		deleteRow(pendingDelete.id);
		showToast(
			"info",
			`${rowLabel(pendingDelete)} — ${t(deletedToast)}`,
		);
		setPendingDelete(null);
	};

	return (
		<>
			<Card className="gap-0 rounded-lg border border-slate-200 bg-white p-5 shadow-none">
				<div className="flex w-full flex-col items-stretch gap-3 sm:flex-row sm:items-center">
					<Search
						value={searchQuery}
						onChange={changeSearch}
						placeholder={localizationConstants.search}
						className="h-10 w-full"
						wrapperClassName="w-full sm:w-[240px] md:w-[280px]"
					/>

					{filterOptions && filterOptions.length > 0 && (
						<Select value={filterValue} onValueChange={changeFilter}>
							<SelectTrigger className="h-10 w-full cursor-pointer border-slate-200 bg-white text-xs font-normal text-slate-700 shadow-2xs sm:w-[170px]">
								<SelectValue
									placeholder={t(
										localizationConstants.purchaseFilterLabel,
									)}
								/>
							</SelectTrigger>
							<SelectContent className="bg-white">
								{filterOptions.map((option) => (
									<SelectItem
										key={option.value}
										value={option.value}
										className="cursor-pointer"
									>
										<Translate text={option.label} />
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					)}

					{toolbarAction && (
						<div className="flex w-full justify-start sm:ml-auto sm:w-auto sm:justify-end">
							{toolbarAction}
						</div>
					)}
				</div>

				<div className="mt-5">
					<DataTable<T>
						data={paginatedRows}
						columns={columns}
						rowKey={(row) => row.id}
						actions={actions}
						actionsLabel={(row) =>
							`${t(localizationConstants.actionsHeader)} ${rowLabel(row)}`
						}
						emptyMessageKey={emptyMessageKey}
						sortBy={sortBy}
						sortOrder={sortOrder}
						onSort={handleSort}
						pagination={{
							page: currentPage,
							pageSize,
							totalItems: totalCount,
						}}
						onPageChange={setCurrentPage}
						onPageSizeChange={changePageSize}
						primaryAction={renderPrimaryAction}
					/>
				</div>
			</Card>

			<ConfirmActionDialog
				open={pendingDelete !== null}
				onOpenChange={(next) => {
					if (!next) setPendingDelete(null);
				}}
				title={localizationConstants.purchaseArchiveDeleteTitle}
				description={localizationConstants.purchaseArchiveDeleteBody}
				confirmLabel={localizationConstants.actionDelete}
				subject={pendingDelete ? rowLabel(pendingDelete) : undefined}
				destructive
				onConfirm={handleConfirmDelete}
			/>
		</>
	);
}

export default ArchivableRowsTable;
