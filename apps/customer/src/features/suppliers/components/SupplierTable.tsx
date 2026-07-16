"use client";

import { useCallback, useMemo } from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { DataTable, type DataTableColumn, type DataTableAction } from "@/components/table/DataTable";
import localizationConstants from "@/utils/translation/constants";
import { useQueryParams } from "@/hooks/useQueryParams";
import type { Supplier } from "../types/types";

interface SupplierTableProps {
	readonly data: Supplier[];
	readonly totalItems: number;
	readonly loading?: boolean;
}

const COLUMNS: DataTableColumn<Supplier>[] = [
	{
		key: "companyName",
		label: localizationConstants.supplierHeaderCompanyName,
		sortable: true,
		headerClassName: "min-w-[10rem] w-[20%]",
		cellClassName: "whitespace-nowrap align-top",
		render: (row) => <span className="text-slate-950">{row.companyName}</span>,
	},
	{
		key: "orgNo",
		label: localizationConstants.supplierHeaderOrgNo,
		sortable: true,
		headerClassName: "w-[9rem] min-w-[8rem]",
		cellClassName: "whitespace-nowrap align-top",
		render: (row) => <span className="text-slate-600">{row.orgNo}</span>,
	},
	{
		key: "contactPersonName",
		label: localizationConstants.supplierHeaderContactPerson,
		sortable: true,
		headerClassName: "min-w-[10rem] w-[18%]",
		cellClassName: "whitespace-nowrap align-top",
		render: (row) => (
			<span className="text-slate-600">{row.contactPersonName}</span>
		),
	},
	{
		key: "email",
		label: localizationConstants.supplierHeaderMail,
		sortable: true,
		headerClassName: "min-w-[12rem] w-[22%]",
		cellClassName: "whitespace-nowrap align-top",
		render: (row) => <span className="text-slate-600">{row.email}</span>,
	},
	{
		key: "mobileNumber",
		label: localizationConstants.mobileNoLabel,
		sortable: true,
		headerClassName: "min-w-[10rem] w-[18%]",
		cellClassName: "whitespace-nowrap align-top",
		render: (row) => <span className="text-slate-600">{row.mobileNumber}</span>,
	},
];

export function SupplierTable({
	data,
	totalItems,
	loading = false,
}: SupplierTableProps) {
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

	const actions = useMemo<DataTableAction<Supplier>[]>(
		() => [
			{
				label: localizationConstants.viewLabel,
				icon: <Eye className="h-4 w-4" />,
				onClick: (row) => router.push(`/suppliers/${row.id}`),
			},
			{
				label: localizationConstants.edit,
				icon: <Pencil className="h-4 w-4" />,
				onClick: (row) => router.push(`/suppliers/${row.id}/edit`),
			},
			{
				label: localizationConstants.delete,
				icon: <Trash2 className="h-4 w-4" />,
				destructive: true,
				onClick: (_row) => {
					// TODO: trigger delete confirmation dialog
				},
			},
		],
		[router],
	);

	return (
		<DataTable
			data={data}
			columns={COLUMNS}
			rowKey={(row) => row.id}
			actions={actions}
			loading={loading}
			bordered
			emptyMessageKey={localizationConstants.noSuppliersFound}
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
