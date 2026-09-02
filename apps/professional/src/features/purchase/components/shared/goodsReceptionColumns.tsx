import type { DataTableColumn } from "@/components/table/DataTable";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import type { PurchaseGoodsReceptionSortField } from "../../hooks/usePurchaseGoodsReception";
import type { PurchaseGoodsReceptionRow } from "../../types/purchase.types";
import { PurchaseGoodsReceptionOrderTypeLabel } from "../PurchaseBadges";
import { ObjectPill } from "./ObjectPill";

/**
 * The Godsmottagning columns, in the frame's order.
 *
 * The frame prints "Benämning" twice — header and data both duplicated — so the
 * column appears once.
 *
 * Shared because the module list and the Arkiv tab drew the same six columns
 * from two separate declarations, which is exactly how a label drifts on one
 * screen and not the other.
 */
export const GOODS_RECEPTION_COLUMNS: DataTableColumn<PurchaseGoodsReceptionRow>[] =
	[
		{
			key: "object",
			label: localizationConstants.purchaseColObject,
			sortable: true,
			render: (row) => <ObjectPill value={row.object} />,
		},
		{
			key: "purchaseNo",
			label: localizationConstants.purchaseColNumber,
			sortable: true,
			cellClassName: "text-sm font-medium text-slate-900",
		},
		{
			key: "name",
			label: localizationConstants.purchaseColName,
			sortable: true,
		},
		{
			key: "supplier",
			label: localizationConstants.purchaseSupplierColName,
			sortable: true,
		},
		{
			key: "expectedDelivery",
			label: localizationConstants.purchaseGoodsReceptionColExpectedDelivery,
			sortable: true,
		},
		{
			key: "orderType",
			label: localizationConstants.purchaseGoodsReceptionColOrderType,
			sortable: true,
			render: (row) => (
				<PurchaseGoodsReceptionOrderTypeLabel
					orderType={row.orderType}
				/>
			),
		},
	];

/**
 * The same columns as `{ field, label }`, for the module list — which renders
 * its own `TableHead`s so it can keep its sticky action column and the cells
 * that open the detail drawer, but takes its labels and sort keys from here.
 */
export const GOODS_RECEPTION_HEADERS: {
	field: PurchaseGoodsReceptionSortField;
	label: TranslationKeys;
}[] = GOODS_RECEPTION_COLUMNS.map((column) => ({
	field: column.key as PurchaseGoodsReceptionSortField,
	label: column.label as TranslationKeys,
}));
