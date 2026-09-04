"use client";

import { useCallback, useMemo, useState } from "react";
import { Eye, Pencil, Trash2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { DataTable, type DataTableColumn, type DataTableAction } from "@/components/table/DataTable";
import localizationConstants from "@/utils/translation/constants";
import { useQueryParams } from "@/hooks/useQueryParams";
import type { RotEntry } from "@/api-actions/rotRut";
import { deleteRotRutAPIAction } from "@/api-actions/rotRut/deleteRotRutAPIAction";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface RotTableProps {
	readonly data: RotEntry[];
	readonly totalItems: number;
	readonly loading?: boolean;
	readonly projectId: string;
	readonly onDeleteSuccess?: () => void;
}

export function RotTable({
	data,
	totalItems,
	loading = false,
	projectId,
	onDeleteSuccess,
}: RotTableProps) {
	const { t } = useTranslation();
	const { query, changeQueries } = useQueryParams();
	const router = useRouter();

	const [deleteTarget, setDeleteTarget] = useState<RotEntry | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);

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

	const handleDeleteConfirm = useCallback(async () => {
		if (!deleteTarget) return;
		setIsDeleting(true);
		try {
			const result = await deleteRotRutAPIAction({ projectId, id: deleteTarget.id });
			if (result.success) {
				setDeleteTarget(null);
				toast.success(t(localizationConstants.rotDeletedSuccess));
				onDeleteSuccess?.();
			} else {
				toast.error(result.error || t(localizationConstants.rotDeletedError));
			}
		} catch {
			toast.error(t(localizationConstants.rotDeletedError));
		} finally {
			setIsDeleting(false);
		}
	}, [deleteTarget, projectId, onDeleteSuccess, t]);

	const actions = useMemo<DataTableAction<RotEntry>[]>(
		() => [
			{
				label: t(localizationConstants.viewLabel),
				icon: <Eye className="h-4 w-4" />,
				onClick: (row) => router.push(`/rotRut/${row.id}/edit?tab=rot&projectId=${encodeURIComponent(projectId)}`),
			},
			{
				label: t(localizationConstants.open),
				icon: <Pencil className="h-4 w-4" />,
				onClick: (row) => router.push(`/rotRut/${row.id}/edit?tab=rot&projectId=${encodeURIComponent(projectId)}`),
			},
			{
				label: t(localizationConstants.delete),
				icon: <Trash2 className="h-4 w-4" />,
				destructive: true,
				onClick: (row) => setDeleteTarget(row),
			},
		],
		[router, t, projectId],
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
		<>
			<DataTable
				data={data}
				columns={columns}
				rowKey={(row) => row.id}
				actions={actions}
				loading={loading}
				bordered
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
			<AlertDialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>{t(localizationConstants.deleteRotConfirmTitle)}</AlertDialogTitle>
						<AlertDialogDescription>
							{t(localizationConstants.deleteRotConfirmDescription)}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={isDeleting}>{t(localizationConstants.cancel)}</AlertDialogCancel>
						<AlertDialogAction
							onClick={(e) => { e.preventDefault(); handleDeleteConfirm(); }}
							disabled={isDeleting}
							className="bg-red-600 text-white hover:bg-red-700"
						>
							{isDeleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
							{t(localizationConstants.delete)}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
