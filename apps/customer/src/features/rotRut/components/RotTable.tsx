"use client";

import { useCallback, useMemo } from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { DataTable, type DataTableColumn, type DataTableAction } from "@/components/table/DataTable";
import localizationConstants from "@/utils/translation/constants";
import { useQueryParams } from "@/hooks/useQueryParams";
import type { RotEntry } from "@/api-actions/rotRut";
import { useTranslation } from "react-i18next";

interface RotTableProps {
	readonly data: RotEntry[];
	readonly totalItems: number;
	readonly loading?: boolean;
}

export function RotTable({
	data,
	totalItems,
	loading = false,
}: RotTableProps) {
	const { t } = useTranslation();
	const { query, changeQueries } = useQueryParams();
	const router = useRouter();

	const page = Number(query.get("page") || "1");
	const pageSize = Number(query.get("page_size") || "10");
	const sortBy = query.get("sort_by") || "";
	const sortOrder = query.get("sort_order") || "";

	const handleSort = useCallback(
		(field: string, nextOrder: "asc" | "desc" | null) => {
			changeQueries({
				sort_by: nextOrder ? field : null,
				sort_order: nextOrder,
			});
		},
		[changeQueries],
	);

	const actions = useMemo<DataTableAction<RotEntry>[]>(
		() => [
			{
				label: t(localizationConstants.viewLabel),
				icon: <Eye className="h-4 w-4" />,
				onClick: (row) => router.push(`/rotRut/${row.id}/edit?tab=rot`),
			},
			{
				label: t(localizationConstants.open),
				icon: <Pencil className="h-4 w-4" />,
				onClick: (row) => router.push(`/rotRut/${row.id}/edit?tab=rot`),
			},
			{
				label: t(localizationConstants.delete),
				icon: <Trash2 className="h-4 w-4" />,
				destructive: true,
				onClick: (_row) => {
					// TODO: delete action handler
				},
			},
		],
		[router, t],
	);

	const columns = useMemo<DataTableColumn<RotEntry>[]>(
		() => [
			{
				key: "propertyId",
				label: t(localizationConstants.propertyIdLabel),
				sortable: true,
				headerClassName: "min-w-[12rem] w-[25%] px-6",
				cellClassName: "whitespace-nowrap align-middle px-6 py-4",
				render: (row) => <span className="text-slate-950 font-medium">{row.propertyId}</span>,
			},
			{
				key: "address",
				label: t(localizationConstants.addressLabel),
				sortable: true,
				headerClassName: "min-w-[16rem] w-[45%] px-6",
				cellClassName: "whitespace-nowrap align-middle px-6 py-4",
				render: (row) => <span className="text-slate-600">{row.address || "-"}</span>,
			},
			{
				key: "createdAt",
				label: t(localizationConstants.createdLabel),
				sortable: true,
				headerClassName: "min-w-[10rem] w-[20%] px-6",
				cellClassName: "whitespace-nowrap align-middle px-6 py-4",
				render: (row) => <span className="text-slate-600">{row.createdAt}</span>,
			},
		],
		[t],
	);

	return (
		<DataTable
			data={data}
			columns={columns}
			rowKey={(row) => row.id}
			actions={actions}
			loading={loading}
			emptyMessageKey={localizationConstants.noRotEntriesFound}
			pagination={{ page, pageSize, totalItems }}
			onPageChange={(p) => changeQueries({ page: String(p) })}
			onPageSizeChange={(size) =>
				changeQueries({ page: "1", page_size: String(size) })
			}
			sortBy={sortBy}
			sortOrder={sortOrder}
			onSort={handleSort}
		/>
	);
}
