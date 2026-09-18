"use client";

import { CirclePlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { RecordCollapsibleCard } from "../../../components/RecordCollapsibleCard";
import { DIARY_LIMITS, DIARY_ROW_KIND_META } from "../../projectDiary.config";
import type { DiaryRowByKind, DiaryRowKind } from "../../types";
import { DIARY_CARD_ICONS } from "./diaryColumns";
import { DiaryRowsTable } from "./DiaryRowsTable";

export interface DiaryTableCardProps<K extends DiaryRowKind> {
	kind: K;
	rows: DiaryRowByKind[K][];
	/** Sök, from the toolbar. */
	query: string;
	locked: boolean;
	onAdd: () => void;
	onEdit: (row: DiaryRowByKind[K]) => void;
	onRemove: (row: DiaryRowByKind[K]) => void;
}

/**
 * One of Detaljerad information's four cards on the day page: the rows, and
 * "Fler rader" to add one through the dialog. A published diary shows the table
 * only. Removing a row only changes the form — nothing is lost until Spara
 * utkast.
 */
export function DiaryTableCard<K extends DiaryRowKind>({ kind, rows, query, locked, onAdd, onEdit, onRemove }: DiaryTableCardProps<K>) {
	return (
		<RecordCollapsibleCard titleKey={DIARY_ROW_KIND_META[kind].cardKey} icon={DIARY_CARD_ICONS[kind]} contentClassName="flex flex-col gap-4">
			<DiaryRowsTable kind={kind} rows={rows} query={query} showActions={!locked} onEdit={onEdit} onRemove={onRemove} />
			{!locked && (
				<div>
					<Button
						type="button"
						onClick={onAdd}
						disabled={rows.length >= DIARY_LIMITS.rows}
						className="h-10 cursor-pointer gap-2 rounded-md bg-[#111721] px-4 text-sm font-medium text-white hover:bg-slate-800"
					>
						<CirclePlus className="h-4 w-4" aria-hidden />
						<Translate text={localizationConstants.projectDiaryMoreRows} />
					</Button>
				</div>
			)}
		</RecordCollapsibleCard>
	);
}

export default DiaryTableCard;
