"use client";

import { useState } from "react";

import { ConfirmActionDialog } from "@/components/dialog/ConfirmActionDialog";
import localizationConstants from "@/utils/translation/constants";
import { padAtaNumber } from "../../ataMath";
import type { AtaSupplier, SupplierAta } from "../types";
import { SupplierAtaShell } from "./SupplierAtaShell";
import { SupplierAtaTable } from "./SupplierAtaTable";
import { SupplierGroupTable } from "./SupplierGroupTable";
import { useSupplierAtaRows } from "./useSupplierAtaRows";
import { useSupplierGroups } from "./useSupplierGroups";

/* Radix leaves `pointer-events: none` on <body> when a dialog opens in the tick
   a menu item closes; defer by a macrotask. */
const defer = (fn: () => void) => setTimeout(fn, 0);

interface PanelProps {
	projectId: string;
	suppliers: AtaSupplier[];
	onSelect: (supplierId: string | null) => void;
}

/** "Vald leverantör/ UE: Alla" — the grouped table. */
export function SupplierGroupPanel({ projectId, suppliers, onSelect }: PanelProps) {
	const groups = useSupplierGroups(projectId);
	const { controls } = groups;

	return (
		<SupplierAtaShell controls={controls} filterOptions={groups.filterOptions} suppliers={suppliers} selectedId={null} onSelect={onSelect} summary={groups.summary} page={groups.page}>
			<SupplierGroupTable
				projectId={projectId}
				rows={groups.page.pageRows}
				sortField={controls.sortField}
				sortDir={controls.sortDir}
				onSort={controls.onSort}
				emptyState={groups.emptyState}
				onSelect={onSelect}
			/>
		</SupplierAtaShell>
	);
}

/** One supplier selected — its ÄTAs, with Godkänna behind a confirm. */
export function SupplierAtaPanel({ projectId, suppliers, onSelect, supplier }: PanelProps & { supplier: AtaSupplier }) {
	const list = useSupplierAtaRows(projectId, supplier);
	const { controls } = list;
	const [approving, setApproving] = useState<SupplierAta | null>(null);

	return (
		<SupplierAtaShell controls={controls} filterOptions={list.filterOptions} suppliers={suppliers} selectedId={supplier.id} onSelect={onSelect} summary={list.summary} page={list.page}>
			<SupplierAtaTable
				supplierName={supplier.name}
				rows={list.page.pageRows}
				sortField={controls.sortField}
				sortDir={controls.sortDir}
				onSort={controls.onSort}
				emptyState={list.emptyState}
				onApprove={(ata) => defer(() => setApproving(ata))}
			/>
			<ConfirmActionDialog
				open={Boolean(approving)}
				onOpenChange={(open) => !open && setApproving(null)}
				title={localizationConstants.viewAtaApproveConfirmTitle}
				description={localizationConstants.projectAtaSupplierApproveBody}
				confirmLabel={localizationConstants.viewAtaBtnApprove}
				subject={approving ? `${supplier.name} ${padAtaNumber(approving.number)}` : undefined}
				onConfirm={() => {
					if (approving) list.approve(approving);
					setApproving(null);
				}}
			/>
		</SupplierAtaShell>
	);
}
