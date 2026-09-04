"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

import { PermissionGate } from "@/components/common/PermissionGate";
import type { DataTableAction } from "@/components/table/DataTable";
import { Button } from "@/components/ui/button";
import { ROLES } from "@/constants/roles";
import { hasPermission } from "@/lib/hasPermission";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { MOCK_PURCHASE_COMPLAINTS } from "../../data/purchaseComplaints.mock";
import { PURCHASE_MODULE_BASE_URL } from "../../data/purchaseNav.config";
import type { PurchaseComplaintRow } from "../../types/purchase.types";
import { ArchivableRowsTable } from "../shared/ArchivableRowsTable";
import { RECORD_COMPLAINT_COLUMNS } from "../shared/complaintColumns";
import { SeeDetailsLink } from "../shared/SeeDetailsLink";

export interface PurchaseComplaintsTabProps {
	/** The record's purchase number, which is also the complaint join key. */
	purchaseNo: string;
}

const STATUS_FILTERS = [
	{ value: "all", label: localizationConstants.purchaseFilterAllStatuses },
	{
		value: "not_sent",
		label: localizationConstants.purchaseComplaintStatusNotSent,
	},
	{ value: "sent", label: localizationConstants.purchaseComplaintStatusSent },
	{
		value: "approved",
		label: localizationConstants.purchaseComplaintStatusApproved,
	},
];

/**
 * A record's Reklamation section — the module's complaints list narrowed to the
 * one purchase.
 *
 * Configuration over new UI: the shared `ArchivableRowsTable` already brings
 * search, the status filter, tri-state sort, pagination, the sticky row menu
 * and a confirmed delete, and the columns are the same ones the Arkiv tab uses.
 */
export function PurchaseComplaintsTab({
	purchaseNo,
}: PurchaseComplaintsTabProps) {
	const { t } = useTranslation();

	const rows = useMemo(
		() =>
			MOCK_PURCHASE_COMPLAINTS.filter(
				(complaint) => complaint.purchaseNo === purchaseNo,
			),
		[purchaseNo],
	);

	/**
	 * The frame's row menu carries a third item above Arkiv and Ta bort. There
	 * is no complaint edit screen, so it says so — the same honest "coming
	 * soon" the merged module list already gives this action. Gated here rather
	 * than with `PermissionGate` because `DataTable` takes a flat action array,
	 * which is the call `ArchivableRowsTable` makes for its own two items.
	 */
	const extraActions: DataTableAction<PurchaseComplaintRow>[] =
		hasPermission(ROLES.MANAGER, "EDIT_PURCHASE")
			? [
					{
						label: localizationConstants.actionEdit,
						icon: <Pencil className="h-4 w-4 text-slate-500" />,
						onClick: () =>
							showToast(
								"info",
								t(
									localizationConstants.purchaseComplaintEditToast,
								),
							),
					},
				]
			: [];

	return (
		<ArchivableRowsTable<PurchaseComplaintRow>
			rows={rows}
			mode="archive"
			columns={RECORD_COMPLAINT_COLUMNS}
			searchFields={(row) => [
				row.complaintNo,
				row.lineNo ?? row.purchaseNo,
				row.name,
				row.supplier,
			]}
			sortValue={(row, field) =>
				field === "purchaseNo"
					? (row.lineNo ?? row.purchaseNo)
					: String(row[field as keyof PurchaseComplaintRow] ?? "")
			}
			defaultSortBy="complaintNo"
			emptyMessageKey={localizationConstants.purchaseComplaintNoneFound}
			rowLabel={(row) => row.complaintNo}
			filterOptions={STATUS_FILTERS}
			matchesFilter={(row, value) => row.status === value}
			movedToast={localizationConstants.purchaseComplaintArchivedToast}
			deletedToast={localizationConstants.purchaseComplaintDeletedToast}
			extraActions={extraActions}
			renderPrimaryAction={(row) => (
				<SeeDetailsLink
					href={`${PURCHASE_MODULE_BASE_URL}/complaints/${encodeURIComponent(row.id)}`}
					label={localizationConstants.purchaseSupplierSeeDetails}
				/>
			)}
			toolbarAction={
				<PermissionGate permission="CREATE_PURCHASE">
					<Link
						href={`${PURCHASE_MODULE_BASE_URL}/complaints/create?purchaseNo=${encodeURIComponent(purchaseNo)}`}
					>
						<Button className="h-10 cursor-pointer gap-2 rounded-lg bg-[#111721] px-5 text-sm font-medium text-white shadow-2xs hover:bg-slate-800">
							<Plus className="h-4 w-4" aria-hidden />
							<Translate
								text={
									localizationConstants.purchaseComplaintCreate
								}
							/>
						</Button>
					</Link>
				</PermissionGate>
			}
		/>
	);
}

export default PurchaseComplaintsTab;
