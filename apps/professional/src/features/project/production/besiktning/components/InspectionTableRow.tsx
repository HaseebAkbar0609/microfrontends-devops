"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import type { ProjectInspection } from "../types";
import { InspectionDocumentCell } from "./InspectionDocumentCell";
import { InspectionRowMenu } from "./InspectionRowMenu";

/* Narrower padding below lg keeps the four columns on a tablet held upright. */
const CELL = "px-3 py-3 text-sm text-slate-900 lg:px-4";
const DATE_CELL = `${CELL} whitespace-nowrap tabular-nums`;

export interface InspectionTableRowProps {
	inspection: ProjectInspection;
	/** The row's name for a screen reader — its type and Datum. */
	label: string;
	typeLabel: string;
	onOpen: () => void;
	onToggleArchive: () => void;
	onDelete: () => void;
}

export function InspectionTableRow({
	inspection,
	label,
	typeLabel,
	onOpen,
	onToggleArchive,
	onDelete,
}: InspectionTableRowProps) {
	const t = useTranslate();

	return (
		<TableRow>
			<TableCell className={DATE_CELL}>{inspection.date}</TableCell>
			<TableCell className={`${CELL} min-w-28 whitespace-normal`}>{typeLabel}</TableCell>
			<TableCell className={DATE_CELL}>
				{inspection.inspectionDate || (
					<span aria-hidden className="text-slate-400">
						—
					</span>
				)}
			</TableCell>
			<TableCell className={CELL}>
				<InspectionDocumentCell documents={inspection.documents} />
			</TableCell>
			<TableCell className="w-12 px-1 py-3 text-right lg:px-2">
				<InspectionRowMenu
					ariaLabel={t(localizationConstants.projectInspectionRowActions, { label })}
					archived={inspection.archived}
					onOpen={onOpen}
					onToggleArchive={onToggleArchive}
					onDelete={onDelete}
				/>
			</TableCell>
		</TableRow>
	);
}

export default InspectionTableRow;
