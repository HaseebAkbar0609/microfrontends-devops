"use client";

import { PencilLine, RefreshCw, Trash2 } from "lucide-react";

import { TableCell, TableRow } from "@/components/ui/table";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { RowActionMenu, RowMenuAction } from "../../components/RowActionMenu";
import type { MeetingKind, MeetingPoint, PointStatus } from "../types";
import { PointStatusToggles } from "./PointStatusToggles";

const CELL = "px-3 py-3 align-top text-sm text-slate-900 lg:px-4";

function Missing() {
	return (
		<>
			<span aria-hidden className="text-slate-400">
				—
			</span>
			<span className="sr-only">
				<Translate text={localizationConstants.purchaseInfoValueMissing} />
			</span>
		</>
	);
}

export interface MeetingPointRowProps {
	kind: MeetingKind;
	point: MeetingPoint;
	onEdit: () => void;
	onDelete: () => void;
	onSetStatus: (status: PointStatus) => void;
	onCycleStatus: () => void;
}

/**
 * One agenda item: Nr, Ämne — the Rubrik in bold over one muted line of its
 * Beskrivning — Beslut, Ansvarig, and the ⋮ with Redigera and Radera. An
 * Action point adds its status squares and ⋮ Ändra status.
 */
export function MeetingPointRow({ kind, point, onEdit, onDelete, onSetStatus, onCycleStatus }: MeetingPointRowProps) {
	const t = useTranslate();

	return (
		<TableRow>
			<TableCell className={`${CELL} w-20 whitespace-nowrap tabular-nums`}>{point.nr}</TableCell>
			<TableCell className={`${CELL} max-w-sm`}>
				<p className="font-medium break-words">{point.title}</p>
				{point.description && (
					<p className="truncate text-slate-500" title={point.description}>
						{point.description}
					</p>
				)}
			</TableCell>
			<TableCell className={`${CELL} max-w-xs`}>
				{point.decision ? (
					<span className="line-clamp-2 break-words" title={point.decision}>
						{point.decision}
					</span>
				) : (
					<Missing />
				)}
			</TableCell>
			<TableCell className={`${CELL} whitespace-nowrap`}>{point.responsible || <Missing />}</TableCell>
			{kind === "action" && (
				<TableCell className={CELL}>
					<PointStatusToggles label={point.title} status={point.status} onSelect={onSetStatus} />
				</TableCell>
			)}
			<TableCell className="w-12 px-1 py-2 text-right align-top lg:px-2">
				<RowActionMenu ariaLabel={t(localizationConstants.projectProtocolRowActions, { label: point.title })}>
					<RowMenuAction icon={PencilLine} labelKey={localizationConstants.btnRedigera} reasonKey={null} onSelect={onEdit} />
					{kind === "action" && (
						<RowMenuAction
							icon={RefreshCw}
							labelKey={localizationConstants.protocolChangeStatus}
							reasonKey={null}
							onSelect={onCycleStatus}
						/>
					)}
					<RowMenuAction
						icon={Trash2}
						labelKey={localizationConstants.btnRadera}
						reasonKey={null}
						destructive
						onSelect={onDelete}
					/>
				</RowActionMenu>
			</TableCell>
		</TableRow>
	);
}

export default MeetingPointRow;
