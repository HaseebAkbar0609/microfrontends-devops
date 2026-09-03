import type { DataTableColumn } from "@/components/table/DataTable";
import localizationConstants from "@/utils/translation/constants";
import type { PurchaseComplaintRow } from "../../types/purchase.types";
import {
	PurchaseComplaintStatusBadge,
	PurchaseComplaintTypeLabel,
} from "../PurchaseBadges";
import { ObjectPill } from "./ObjectPill";

/**
 * The Reklamation columns, shared by the Arkiv tab and a record's Reklamation
 * section so the two lists cannot drift apart.
 *
 * The module-level list is deliberately not on these — it is hand-rolled and
 * carries an extra Prioritet column; folding it in is its own change.
 */
export const COMPLAINT_COLUMNS: DataTableColumn<PurchaseComplaintRow>[] = [
	{
		key: "complaintNo",
		label: localizationConstants.purchaseComplaintColNumber,
		sortable: true,
		cellClassName: "text-sm font-medium text-slate-900",
	},
	{
		key: "purchaseNo",
		label: localizationConstants.purchaseColNumber,
		sortable: true,
	},
	{
		key: "object",
		label: localizationConstants.purchaseColObject,
		sortable: true,
		render: (row) => <ObjectPill value={row.object} />,
	},
	{ key: "name", label: localizationConstants.purchaseColName, sortable: true },
	{
		key: "supplier",
		label: localizationConstants.purchaseSupplierColName,
		sortable: true,
	},
	{
		key: "type",
		label: localizationConstants.purchaseComplaintColType,
		sortable: true,
		render: (row) => <PurchaseComplaintTypeLabel type={row.type} />,
	},
	{
		key: "date",
		label: localizationConstants.purchaseComplaintColDate,
		sortable: true,
	},
	{
		key: "status",
		label: localizationConstants.statusLabel,
		sortable: true,
		render: (row) => <PurchaseComplaintStatusBadge status={row.status} />,
	},
];

/**
 * The same columns for a list already scoped to one purchase, where every row
 * repeats the same Inköps nr. The frame prints the purchase *line* there
 * instead, which is the only value that varies, so the column shows the line
 * and falls back to the purchase number when a complaint has no line.
 */
export const RECORD_COMPLAINT_COLUMNS: DataTableColumn<PurchaseComplaintRow>[] =
	COMPLAINT_COLUMNS.map((column) =>
		column.key === "purchaseNo"
			? {
					...column,
					render: (row: PurchaseComplaintRow) =>
						row.lineNo ?? row.purchaseNo,
				}
			: column,
	);
