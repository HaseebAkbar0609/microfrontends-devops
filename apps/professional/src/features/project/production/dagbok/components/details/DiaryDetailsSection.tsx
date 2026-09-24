"use client";

import { useState } from "react";
import { useWatch } from "react-hook-form";

import { FormTextarea } from "@/components/form";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { nextDeviationNumber } from "../../diaryView";
import type { DiaryEditorState } from "../../form/useDiaryEditor";
import { DIARY_LIMITS, DIARY_ROW_KINDS } from "../../projectDiary.config";
import type { DiaryRowByKind, DiaryRowKind } from "../../types";
import { DiaryRowDialog } from "./DiaryRowDialog";
import { DiaryTableCard } from "./DiaryTableCard";

/* Radix leaves `pointer-events: none` on <body> when a dialog opens in the tick
   a dropdown item closes; defer by a macrotask. */
const defer = (fn: () => void) => setTimeout(fn, 0);

type Editing = { [K in DiaryRowKind]: { kind: K; row?: DiaryRowByKind[K] } }[DiaryRowKind];

export interface DiaryDetailsSectionProps {
	editor: DiaryEditorState;
	query: string;
	/** Filter: one table, or `null` for all four. */
	section: DiaryRowKind | null;
}

/** Detaljerad information: the four tables, two by two on a wide screen, then the two notes. */
export function DiaryDetailsSection({ editor, query, section }: DiaryDetailsSectionProps) {
	const [editing, setEditing] = useState<Editing | null>(null);
	const control = editor.form.control;
	const [workforce, works, machines, deviations] = useWatch({ control, name: ["workforce", "works", "machines", "deviations"] });
	const rowsOf: { [K in DiaryRowKind]: DiaryRowByKind[K][] } = { workforce, works, machines, deviations };

	return (
		<section aria-labelledby="diary-details-heading" className="flex flex-col gap-4">
			<h2 id="diary-details-heading" className="text-xl font-semibold text-slate-900">
				<Translate text={localizationConstants.projectDiarySectionDetails} />
			</h2>

			<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
				{DIARY_ROW_KINDS.filter((kind) => section === null || section === kind).map((kind) => (
					<DiaryTableCard
						key={kind}
						kind={kind}
						rows={rowsOf[kind] as DiaryRowByKind[typeof kind][]}
						query={query}
						locked={editor.locked}
						onAdd={() => setEditing({ kind } as Editing)}
						onEdit={(row) => defer(() => setEditing({ kind, row } as Editing))}
						onRemove={(row) => editor.removeRow(kind, row.id)}
					/>
				))}
			</div>

			{section === null && (
				<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
					<FormTextarea
						control={control}
						name="generalNotes"
						label={localizationConstants.projectDiaryNotesGeneral}
						rows={4}
						disabled={editor.locked}
						textareaProps={{ maxLength: DIARY_LIMITS.notes }}
					/>
					<FormTextarea
						control={control}
						name="selfControlNote"
						label={localizationConstants.projectDiaryNotesSelfControl}
						rows={4}
						disabled={editor.locked}
						textareaProps={{ maxLength: DIARY_LIMITS.notes }}
					/>
				</div>
			)}

			{editing && (
				<DiaryRowDialog
					kind={editing.kind}
					row={editing.row as never}
					nextNumber={nextDeviationNumber(deviations)}
					onApply={(row) => editor.putRow(editing.kind, row as never)}
					onClose={() => setEditing(null)}
				/>
			)}
		</section>
	);
}

export default DiaryDetailsSection;
