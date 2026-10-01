"use client";

import { ExternalLink, Trash2 } from "lucide-react";

import { RecordFileNameCell } from "@/components/table/RecordFileNameCell";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { RowActionMenu, RowMenuAction } from "@/features/project/production/components/RowActionMenu";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import {
	PROTOCOL_FILE_RULES,
	PROTOCOL_TYPE_LABELS,
} from "../../../constants/forecastProtocols.constants";
import type { ForecastProtocol } from "../../../types/forecastProtocols.types";

/* Both taken from the design module's protocol row, which is the frame. */
const CELL = "px-3 py-3 text-sm text-slate-900 lg:px-4";
const DETAILS_BUTTON =
	"h-9 cursor-pointer bg-slate-100 px-3 text-sm font-medium text-slate-900 hover:bg-slate-200";

export interface ProtocolsTableRowProps {
	protocol: ForecastProtocol;
	onView: () => void;
	onOpenFile: () => void;
	onDelete: () => void;
}

/** One filed protocol: the meeting's date, what it was, and the file itself. */
export function ProtocolsTableRow({ protocol, onView, onOpenFile, onDelete }: ProtocolsTableRowProps) {
	const t = useTranslate();

	return (
		<TableRow>
			<TableCell className={`${CELL} whitespace-nowrap tabular-nums`}>{protocol.date}</TableCell>

			<TableCell className={CELL}>
				<Translate text={PROTOCOL_TYPE_LABELS[protocol.type]} />
			</TableCell>

			<TableCell className={`${CELL} max-w-64`}>
				<RecordFileNameCell fileName={protocol.fileName} types={PROTOCOL_FILE_RULES.types} />
			</TableCell>

			<TableCell className={CELL}>
				{/* A labelled button rather than the eye the other Prognos registers
				    use — the frame draws it, and the Handling head names it. */}
				<Button type="button" variant="secondary" onClick={onView} className={DETAILS_BUTTON}>
					<Translate text={localizationConstants.viewDetailsButton} />
					<span className="sr-only"> {protocol.fileName}</span>
				</Button>
			</TableCell>

			<TableCell className="w-12 px-1 py-3 text-right lg:px-2">
				<RowActionMenu
					ariaLabel={t(localizationConstants.projectProtocolRowActions, { label: protocol.fileName })}
				>
					<RowMenuAction
						icon={ExternalLink}
						labelKey={localizationConstants.forecastProtocolsOpenFile}
						/* A seeded protocol, and a new one after a reload, holds no file. */
						reasonKey={protocol.url ? null : localizationConstants.projectProtocolNoFile}
						onSelect={onOpenFile}
					/>
					<RowMenuAction
						icon={Trash2}
						labelKey={localizationConstants.actionDelete}
						reasonKey={null}
						destructive
						onSelect={onDelete}
					/>
				</RowActionMenu>
			</TableCell>
		</TableRow>
	);
}

export default ProtocolsTableRow;
