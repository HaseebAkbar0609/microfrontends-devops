"use client";

import { useState } from "react";
import { CirclePlus, Save } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Control, type Resolver } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { generateTempId } from "@/lib/tempId";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { RecordCollapsibleCard } from "../../../components/RecordCollapsibleCard";
import { DIARY_CARD_ICONS } from "../../components/details/diaryColumns";
import { DiaryRowsTable } from "../../components/details/DiaryRowsTable";
import { DeviationsFields, MachinesFields, WorksFields, WorkforceFields } from "../../components/details/rowFieldsets";
import { nextDeviationNumber } from "../../diaryView";
import {
	DIARY_ROW_SCHEMAS,
	EMPTY_ROW_DRAFTS,
	fromRowDraft,
	toRowDraft,
	type DiaryRowDraftByKind,
} from "../../form/diaryRowSchemas";
import { DIARY_LIMITS, DIARY_ROW_KIND_META } from "../../projectDiary.config";
import type { DeviationRow, DiaryRowByKind, DiaryRowKind } from "../../types";

export interface WizardRowCardProps<K extends DiaryRowKind> {
	kind: K;
	rows: DiaryRowByKind[K][];
	onPut: (row: DiaryRowByKind[K]) => void;
	onRemove: (id: string) => void;
}

/**
 * Step 2's card: the frame's fields over the table, and "Fler rader" to put the
 * row in. ⋮ Redigera loads a row back into the fields — the button then saves it
 * — and ⋮ Radera drops it. Nothing is stored until the wizard's Spara.
 *
 * The fields are a form of their own, rendered as a provider rather than a
 * `<form>` element: the page's form surrounds them, and a nested form is
 * invalid HTML.
 */
export function WizardRowCard<K extends DiaryRowKind>({ kind, rows, onPut, onRemove }: WizardRowCardProps<K>) {
	const t = useTranslate();
	const [editingId, setEditingId] = useState<string | null>(null);

	const form = useForm<DiaryRowDraftByKind[K]>({
		resolver: zodResolver(DIARY_ROW_SCHEMAS[kind] as never) as unknown as Resolver<DiaryRowDraftByKind[K]>,
		defaultValues: EMPTY_ROW_DRAFTS[kind] as never,
		mode: "onTouched",
	});

	const apply = form.handleSubmit((draft) => {
		const existing = rows.find((row) => row.id === editingId);
		onPut(
			fromRowDraft(kind, draft as DiaryRowDraftByKind[K], {
				id: existing?.id ?? generateTempId(),
				number: (existing as DeviationRow | undefined)?.number ?? nextDeviationNumber(rows as DeviationRow[]),
			}),
		);
		form.reset(EMPTY_ROW_DRAFTS[kind] as never);
		setEditingId(null);
	});

	const edit = (row: DiaryRowByKind[K]) => {
		form.reset(toRowDraft(kind, row) as never);
		setEditingId(row.id);
	};

	const remove = (row: DiaryRowByKind[K]) => {
		if (row.id === editingId) {
			form.reset(EMPTY_ROW_DRAFTS[kind] as never);
			setEditingId(null);
		}
		onRemove(row.id);
	};

	const translateError = (message: string) => t(message as TranslationKeys);
	const control = form.control as unknown;
	const controlFor = <P extends DiaryRowKind>() => control as Control<DiaryRowDraftByKind[P]>;
	const fields = {
		workforce: <WorkforceFields control={controlFor<"workforce">()} translateError={translateError} suggestions autoFocus={false} />,
		works: <WorksFields control={controlFor<"works">()} translateError={translateError} autoFocus={false} />,
		machines: <MachinesFields control={controlFor<"machines">()} translateError={translateError} suggestions autoFocus={false} />,
		deviations: <DeviationsFields control={controlFor<"deviations">()} translateError={translateError} autoFocus={false} />,
	}[kind];

	return (
		<RecordCollapsibleCard titleKey={DIARY_ROW_KIND_META[kind].cardKey} icon={DIARY_CARD_ICONS[kind]} contentClassName="flex flex-col gap-4">
			<Form {...form}>
				{fields}
				<div className="flex flex-wrap gap-3">
					<Button
						type="button"
						onClick={() => void apply()}
						disabled={!editingId && rows.length >= DIARY_LIMITS.rows}
						className="h-10 cursor-pointer gap-2 rounded-md bg-[#111721] px-4 text-sm font-medium text-white hover:bg-slate-800"
					>
						{editingId ? <Save className="h-4 w-4" aria-hidden /> : <CirclePlus className="h-4 w-4" aria-hidden />}
						<Translate text={editingId ? localizationConstants.projectDiarySaveRow : localizationConstants.projectDiaryMoreRows} />
					</Button>
					{editingId && (
						<Button
							type="button"
							variant="outline"
							onClick={() => {
								form.reset(EMPTY_ROW_DRAFTS[kind] as never);
								setEditingId(null);
							}}
							className="h-10 cursor-pointer border-slate-200 px-4 text-sm font-medium"
						>
							<Translate text={localizationConstants.projectDiaryCancelRowEdit} />
						</Button>
					)}
				</div>
			</Form>
			<DiaryRowsTable kind={kind} rows={rows} showActions onEdit={edit} onRemove={remove} />
		</RecordCollapsibleCard>
	);
}

export default WizardRowCard;
