"use client";

import React, { useMemo } from "react";
import { Eye, Trash2, Edit } from "lucide-react";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
	DataTable,
	type DataTableColumn,
	type DataTableAction,
} from "@/components/table/DataTable";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { CostCenterItem, CostCenterStatus } from "../../types/costCenters.types";
import { COST_CENTERS_BASE_ROUTE } from "../../constants/costCenters.constants";

interface CostCentersOverviewTableProps {
	readonly data: CostCenterItem[];
	readonly isLoading: boolean;
	readonly totalItems: number;
	readonly page: number;
	readonly pageSize: number;
	readonly sortByParam?: string;
	readonly sortOrderParam?: "asc" | "desc";
	readonly selectedIds: string[];
	readonly isAllSelected: boolean;
	readonly onSort: (field: string) => void;
	readonly onPageChange: (page: number) => void;
	readonly onSelectAll: (checked: boolean) => void;
	readonly onSelectRow: (id: string, checked: boolean) => void;
	readonly onOpenDeleteDialog: (item: CostCenterItem) => void;
	readonly onBatchToggleStatus: (status: CostCenterStatus) => void;
}

export function CostCentersOverviewTable({
	data,
	isLoading,
	totalItems,
	page,
	pageSize,
	sortByParam,
	sortOrderParam,
	selectedIds,
	isAllSelected,
	onSort,
	onPageChange,
	onSelectAll,
	onSelectRow,
	onOpenDeleteDialog,
	onBatchToggleStatus,
}: CostCentersOverviewTableProps) {
	const router = useRouter();

	const columns: DataTableColumn<CostCenterItem>[] = useMemo(
		() => [
			{
				key: "selection",
				label: "",
				headerRender: () => (
					<Checkbox
						checked={isAllSelected}
						onCheckedChange={(checked) => onSelectAll(Boolean(checked))}
						className="data-[state=checked]:bg-[#111721] data-[state=checked]:border-[#111721] data-[state=checked]:text-white"
						aria-label="Select all"
					/>
				),
				headerClassName: "w-12 text-center",
				cellClassName: "w-12 text-center",
				render: (row) => (
					<Checkbox
						checked={selectedIds.includes(row.id)}
						onCheckedChange={(checked) => onSelectRow(row.id, Boolean(checked))}
						onClick={(e) => e.stopPropagation()}
						className="data-[state=checked]:bg-[#111721] data-[state=checked]:border-[#111721] data-[state=checked]:text-white"
						aria-label={`Select row ${row.kod}`}
					/>
				),
			},
			{
				key: "kod",
				label: localizationConstants.costCenterCodeHeader,
				sortable: true,
				render: (row) => (
					<span className="font-semibold text-slate-900">{row.kod}</span>
				),
			},
			{
				key: "benamning",
				label: localizationConstants.costCenterNameHeader,
				sortable: true,
				render: (row) => (
					<span className="font-normal text-slate-800">{row.benamning}</span>
				),
			},
			{
				key: "anteckningar",
				label: localizationConstants.costCenterNotesHeader,
				sortable: true,
				render: (row) => (
					<span className="font-normal text-slate-600">{row.anteckningar || "info"}</span>
				),
			},
			{
				key: "view",
				label: "",
				headerClassName: "w-12 text-center",
				cellClassName: "w-12 text-center",
				render: (row) => (
					<button
						type="button"
						aria-label="View cost center details"
						onClick={(e) => {
							e.stopPropagation();
							router.push(`${COST_CENTERS_BASE_ROUTE}/${row.id}`);
						}}
						className="inline-flex items-center justify-center p-1.5 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
					>
						<Eye className="h-4 w-4" />
					</button>
				),
			},
		],
		[isAllSelected, onSelectAll, onSelectRow, selectedIds, router],
	);

	const actions: DataTableAction<CostCenterItem>[] = useMemo(
		() => [
			{
				label: localizationConstants.viewActionLabel,
				icon: <Eye className="h-4 w-4" />,
				onClick: (row) => router.push(`${COST_CENTERS_BASE_ROUTE}/${row.id}`),
			},
			{
				label: localizationConstants.editLabel,
				icon: <Edit className="h-4 w-4" />,
				onClick: (row) => router.push(`${COST_CENTERS_BASE_ROUTE}/${row.id}`),
			},
			{
				label: localizationConstants.deleteLabel,
				icon: <Trash2 className="h-4 w-4" />,
				destructive: true,
				onClick: (row) => onOpenDeleteDialog(row),
			},
		],
		[onOpenDeleteDialog, router],
	);

	return (
		<div className="space-y-4">
			{/* Data Table */}
			<DataTable
				data={data}
				columns={columns as unknown as DataTableColumn<unknown>[]}
				rowKey={(row) => (row as CostCenterItem).id}
				actions={actions as unknown as DataTableAction<unknown>[]}
				loading={isLoading}
				sortBy={sortByParam}
				sortOrder={sortOrderParam}
				onSort={onSort}
				pagination={{
					page,
					pageSize,
					totalItems,
				}}
				onPageChange={onPageChange}
				emptyMessageKey={localizationConstants.noCostCentersMessage}
			/>

			{/* Selection Action Footer matching Figma Image 1 */}
			<div className="flex flex-wrap items-center gap-3 pt-2">
				<span className="text-sm font-medium text-slate-600">
					{selectedIds.length}{" "}
					<Translate text={localizationConstants.markedCountText} />
				</span>
				<Button
					type="button"
					variant="outline"
					disabled={selectedIds.length === 0}
					onClick={() => onBatchToggleStatus("inactive")}
					className="h-9 rounded-md border-slate-300 px-4 text-xs font-medium text-slate-900 hover:bg-slate-100 disabled:opacity-50 cursor-pointer"
				>
					<Translate text={localizationConstants.inactivateButton} />
				</Button>
				<Button
					type="button"
					disabled={selectedIds.length === 0}
					onClick={() => onBatchToggleStatus("active")}
					className="h-9 rounded-md bg-[#111721] px-4 text-xs font-medium text-white hover:bg-slate-800 disabled:opacity-50 cursor-pointer"
				>
					<Translate text={localizationConstants.activateButton} />
				</Button>
			</div>
		</div>
	);
}
