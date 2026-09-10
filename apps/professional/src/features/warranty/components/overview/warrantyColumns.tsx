import type { DataTableColumn } from "@/components/table/DataTable";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import type { WarrantyRow, WarrantyScope } from "../../types/warranty.types";

const CHECKBOX_CLASS =
	"border-slate-400 data-[state=checked]:bg-slate-900 data-[state=checked]:border-slate-900 data-[state=checked]:text-white focus-visible:ring-slate-900 cursor-pointer";

/**
 * The three headings that name the record, which each module words its own way.
 *
 * The rest are the same on both screens. Without this the consolidation would
 * have quietly relabelled two shipped Order screens from "Order nr" to
 * "Projekt Nr".
 */
const SCOPED_LABELS: Record<
	WarrantyScope,
	{ recordNo: TranslationKeys; recordName: TranslationKeys; period: TranslationKeys }
> = {
	order: {
		recordNo: localizationConstants.colOrderNo,
		recordName: localizationConstants.orderName,
		period: localizationConstants.colWarrantyPeriod,
	},
	project: {
		recordNo: localizationConstants.colProjectNo,
		recordName: localizationConstants.colProjectName,
		period: localizationConstants.warrantyCommitments,
	},
};

/**
 * The frame's seven data columns, in order.
 *
 * `key` is the field it reads and the sort key the hook receives, so a column
 * cannot drift from what sorts it.
 */
function dataColumns(
	scope: WarrantyScope,
): { key: keyof WarrantyRow; label: TranslationKeys }[] {
	const scoped = SCOPED_LABELS[scope];

	return [
		{ key: "recordNo", label: scoped.recordNo },
		{ key: "recordName", label: scoped.recordName },
		{ key: "startDate", label: localizationConstants.orderStart },
		{ key: "approvedDate", label: localizationConstants.colApproved },
		{ key: "warrantyPeriod", label: scoped.period },
		{ key: "projectManager", label: localizationConstants.colProjectManager },
		{ key: "customer", label: localizationConstants.orderCustomer },
	];
}

export interface WarrantyColumnOptions {
	/** Which module's wording the record columns take. */
	scope: WarrantyScope;
	selectedIds: string[];
	allSelected: boolean;
	onToggleSelectAll: () => void;
	onToggleSelectRow: (id: string) => void;
	onOpenDetail: (row: WarrantyRow) => void;
	/** Translated accessible names; the table itself holds no copy. */
	labels: { selectAll: string; selectRow: string };
}

/**
 * Columns for the Garantiåtaganden list.
 *
 * The selection and Öppna columns are marked `print:hidden` — the toolbar's
 * print button prints the list, and a checkbox is not a thing you can tick on
 * paper.
 */
export function buildWarrantyColumns({
	scope,
	selectedIds,
	allSelected,
	onToggleSelectAll,
	onToggleSelectRow,
	onOpenDetail,
	labels,
}: WarrantyColumnOptions): DataTableColumn<WarrantyRow>[] {
	return [
		{
			key: "selection",
			label: "",
			headerRender: () => (
				<Checkbox
					checked={allSelected}
					onCheckedChange={onToggleSelectAll}
					aria-label={labels.selectAll}
					className={CHECKBOX_CLASS}
				/>
			),
			headerClassName: "w-12 text-center print:hidden",
			cellClassName: "w-12 text-center print:hidden",
			render: (row) => (
				<Checkbox
					checked={selectedIds.includes(row.id)}
					onCheckedChange={() => onToggleSelectRow(row.id)}
					aria-label={`${labels.selectRow} ${row.recordNo}`}
					className={CHECKBOX_CLASS}
				/>
			),
		},

		...dataColumns(scope).map(({ key, label }) => ({
			key,
			label,
			sortable: true,
			cellClassName: "text-slate-900",
		})),

		{
			key: "open",
			label: "",
			headerClassName: "w-24 text-center print:hidden",
			cellClassName: "w-24 text-center print:hidden",
			render: (row) => (
				<Button
					type="button"
					variant="outline"
					size="sm"
					onClick={() => onOpenDetail(row)}
					className="h-8 border-slate-200 bg-white px-4 text-xs font-medium text-slate-800 hover:bg-slate-50 rounded-lg cursor-pointer shadow-none"
				>
					<Translate text={localizationConstants.openButton} />
				</Button>
			),
		},
	];
}
