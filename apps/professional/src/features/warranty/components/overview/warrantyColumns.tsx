import type { DataTableColumn } from "@/components/table/DataTable";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import type { WarrantyRow } from "../../types/warranty.types";

const CHECKBOX_CLASS =
	"border-slate-400 data-[state=checked]:bg-slate-900 data-[state=checked]:border-slate-900 data-[state=checked]:text-white focus-visible:ring-slate-900 cursor-pointer";

/**
 * The frame's seven data columns, in order.
 *
 * `key` is the field it reads and the sort key the hook receives, so a column
 * cannot drift from what sorting it.
 */
const DATA_COLUMNS: { key: keyof WarrantyRow; label: TranslationKeys }[] = [
	{ key: "recordNo", label: localizationConstants.colProjectNo },
	{ key: "recordName", label: localizationConstants.colProjectName },
	{ key: "startDate", label: localizationConstants.orderStart },
	{ key: "approvedDate", label: localizationConstants.colApproved },
	{ key: "warrantyPeriod", label: localizationConstants.warrantyCommitments },
	{ key: "projectManager", label: localizationConstants.colProjectManager },
	{ key: "customer", label: localizationConstants.orderCustomer },
];

export interface WarrantyColumnOptions {
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

		...DATA_COLUMNS.map(({ key, label }) => ({
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
