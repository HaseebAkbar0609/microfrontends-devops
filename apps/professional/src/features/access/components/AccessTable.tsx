"use client";

import { useMemo } from "react";
import { Archive, Eye, FolderOpen, Trash2 } from "lucide-react";
import { DataTable, type DataTableAction } from "@/components/table/DataTable";
import { Button } from "@/components/ui/button";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import { isAccessSortField } from "../constants/access.constants";
import type { AccessListPage, AccessListParams, AccessPoint, AccessSortField, SortOrder } from "../types/access.types";
import { useAccessColumns } from "./useAccessColumns";

export type AccessRowAction = "open" | "archive" | "delete";

interface AccessTableProps {
	page: AccessListPage;
	params: AccessListParams;
	onSort: (field: AccessSortField, order: SortOrder | null) => void;
	onPageChange: (page: number) => void;
	onPageSizeChange: (pageSize: number) => void;
	onRowAction: (action: AccessRowAction, row: AccessPoint) => void;
}

export function AccessTable({ page, params, onSort, onPageChange, onPageSizeChange, onRowAction }: AccessTableProps) {
	const t = useTranslate();
	const columns = useAccessColumns();

	// The ⋮ menu from the Figma frame: Öppna, Arkiv, Ta bort (red).
	const actions = useMemo<DataTableAction<AccessPoint>[]>(
		() => [
			{
				label: localizationConstants.accessActionOpen,
				icon: <FolderOpen className="h-4 w-4" aria-hidden />,
				onClick: (row) => onRowAction("open", row),
			},
			{
				label: localizationConstants.accessActionArchive,
				icon: <Archive className="h-4 w-4" aria-hidden />,
				onClick: (row) => onRowAction("archive", row),
			},
			{
				label: localizationConstants.accessActionDelete,
				icon: <Trash2 className="h-4 w-4" aria-hidden />,
				destructive: true,
				onClick: (row) => onRowAction("delete", row),
			},
		],
		[onRowAction],
	);

	return (
		<DataTable
			data={page.rows}
			columns={columns}
			rowKey={(row) => row.id}
			actions={actions}
			actionsLabel={(row) => t(localizationConstants.accessRowActionsLabel, { name: row.name })}
			primaryAction={(row) => (
				<Button
					type="button"
					variant="ghost"
					size="icon"
					className="cursor-pointer"
					aria-label={t(localizationConstants.accessViewLabel, { name: row.name })}
					onClick={() => onRowAction("open", row)}
				>
					<Eye className="h-4 w-4" aria-hidden />
				</Button>
			)}
			emptyMessageKey={localizationConstants.accessEmpty}
			sortBy={params.sortBy ?? undefined}
			sortOrder={params.sortOrder}
			onSort={(field, order) => isAccessSortField(field) && onSort(field, order)}
			pagination={{ page: page.page, pageSize: params.pageSize, totalItems: page.totalItems }}
			onPageChange={onPageChange}
			onPageSizeChange={onPageSizeChange}
		/>
	);
}
