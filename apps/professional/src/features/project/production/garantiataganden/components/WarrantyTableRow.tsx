"use client";

import { PencilLine, Trash2 } from "lucide-react";

import { TableCell, TableRow } from "@/components/ui/table";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import { RowActionMenu, RowMenuAction } from "../../components/RowActionMenu";
import type { WarrantyCommitment } from "../types";

/* Narrower padding below lg keeps both columns upright on a tablet. */
const CELL = "px-3 py-3 text-sm text-slate-900 lg:px-4";

export interface WarrantyTableRowProps {
	commitment: WarrantyCommitment;
	onEdit: () => void;
	onDelete: () => void;
}

/** One commitment: its day, its name, and the ⋮ the frame draws. */
export function WarrantyTableRow({ commitment, onEdit, onDelete }: WarrantyTableRowProps) {
	const t = useTranslate();

	return (
		<TableRow>
			<TableCell className={`${CELL} whitespace-nowrap tabular-nums`}>{commitment.date}</TableCell>
			<TableCell className={`${CELL} whitespace-normal`}>{commitment.name}</TableCell>
			<TableCell className="w-12 px-1 py-3 text-right lg:px-2">
				<RowActionMenu ariaLabel={t(localizationConstants.projectWarrantyRowActions, { label: commitment.name })}>
					<RowMenuAction icon={PencilLine} labelKey={localizationConstants.projectWarrantyRowEdit} reasonKey={null} onSelect={onEdit} />
					<RowMenuAction icon={Trash2} labelKey={localizationConstants.projectWarrantyRowDelete} reasonKey={null} destructive onSelect={onDelete} />
				</RowActionMenu>
			</TableCell>
		</TableRow>
	);
}

export default WarrantyTableRow;
