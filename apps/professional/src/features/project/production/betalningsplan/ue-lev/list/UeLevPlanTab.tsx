"use client";

import { useState } from "react";

import { ConfirmActionDialog } from "@/components/dialog/ConfirmActionDialog";
import { TablePagination } from "@/components/table/TablePagination";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import { ProjectRowsToolbar } from "../../../../components/ProjectRowsToolbar";
import { SUPPLIER_STATUS_FILTER_OPTIONS } from "../supplierPlan.config";
import type { SupplierPaymentPlan } from "../types";
import { UeLevPlanTable } from "./UeLevPlanTable";
import { useSupplierPlanList } from "./useSupplierPlanList";

/**
 * Betalningsplan UE / Lev — the plans subcontractors and suppliers send the
 * project. Sök, Filter and Skriv ut as the frame draws them, with no create
 * button: these plans come from the other side.
 */
export function UeLevPlanTab({ projectId }: { projectId: string }) {
	const t = useTranslate();
	const list = useSupplierPlanList(projectId);
	const [approving, setApproving] = useState<SupplierPaymentPlan | null>(null);

	return (
		<div className="flex flex-col gap-4">
			<ProjectRowsToolbar
				search={list.search}
				onSearchChange={list.setSearch}
				filter={list.status}
				onFilterChange={list.setStatus}
				filterOptions={SUPPLIER_STATUS_FILTER_OPTIONS.map((option) => ({
					value: option.value,
					label: t(option.labelKey),
				}))}
			/>

			<UeLevPlanTable
				list={list}
				/* Deferred so the row menu finishes closing before the dialog opens:
				   in the same tick Radix leaves `pointer-events: none` on <body>. */
				onApprove={(plan) => setTimeout(() => setApproving(plan), 0)}
			/>

			<TablePagination
				currentPage={list.page}
				totalPages={list.totalPages}
				pageSize={list.pageSize}
				onPageChange={list.setPage}
				onPageSizeChange={list.setPageSize}
				className="justify-center sm:justify-center"
			/>

			<ConfirmActionDialog
				open={Boolean(approving)}
				onOpenChange={(open) => !open && setApproving(null)}
				title={localizationConstants.projectSupplierPlanApproveTitle}
				description={localizationConstants.projectSupplierPlanApproveBody}
				confirmLabel={localizationConstants.projectSupplierPlanApprove}
				subject={approving?.companyName}
				onConfirm={() => {
					if (approving) list.approve(approving);
					setApproving(null);
				}}
			/>
		</div>
	);
}

export default UeLevPlanTab;
