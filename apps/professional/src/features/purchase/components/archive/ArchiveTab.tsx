"use client";

import { useState, type ReactNode } from "react";
import { RotateCcw, Trash2 } from "lucide-react";
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
	useArchivedRows,
	type ArchivableRow,
} from "../../hooks/useArchivedRows";
import { ConfirmActionDialog } from "./ConfirmActionDialog";

export interface ArchiveFilterOption {
	value: string;
	label: TranslationKeys;
}

export interface ArchiveTabProps<T extends ArchivableRow> {
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
	 * Right-aligned "see details" cell. A render prop because the three tabs
	 * differ: purchases and complaints link to a route, goods reception opens a
	 * drawer (TFS-925 replaced its record route with one).
	 */
	renderPrimaryAction: (row: T) => ReactNode;
	restoredToast: TranslationKeys;
	deletedToast: TranslationKeys;
	filterOptions?: ArchiveFilterOption[];
	matchesFilter?: (row: T, value: string) => boolean;
}

/**
 * One Arkiv sub-tab. All three differ only in their columns, search fields and
 * copy, so the table, toolbar, row menu and confirm step are written once here.
 *
 * Uses the shared `DataTable`, which already brings the sticky action column,
 * sort icons, empty state and pagination the purchase lists hand-roll.
 */
export function ArchiveTab<T extends ArchivableRow>({
	rows,
	columns,
	searchFields,
	sortValue,
	defaultSortBy,
	emptyMessageKey,
	rowLabel,
	renderPrimaryAction,
	restoredToast,
	deletedToast,
	filterOptions,
	matchesFilter,
}: ArchiveTabProps<T>) {
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
		deleteRow,
	} = useArchivedRows({
		rows,
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
		actions.push({
			label: localizationConstants.purchaseArchiveUnarchive,
			icon: <RotateCcw className="h-4 w-4 text-slate-500" />,
			onClick: (row) => {
				restoreRow(row.id);
				showToast("success", `${rowLabel(row)} — ${t(restoredToast)}`);
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

export default ArchiveTab;
