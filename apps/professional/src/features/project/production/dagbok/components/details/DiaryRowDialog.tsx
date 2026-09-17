"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Control, type Resolver } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { generateTempId } from "@/lib/tempId";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import {
	DIARY_ROW_SCHEMAS,
	EMPTY_ROW_DRAFTS,
	fromRowDraft,
	toRowDraft,
	type DiaryRowDraftByKind,
} from "../../form/diaryRowSchemas";
import { DIARY_ROW_KIND_META } from "../../projectDiary.config";
import type { DiaryRowByKind, DiaryRowKind } from "../../types";
import { DeviationsFields, MachinesFields, WorksFields, WorkforceFields } from "./rowFieldsets";

export interface DiaryRowDialogProps<K extends DiaryRowKind> {
	kind: K;
	/** The row being edited; absent when adding. */
	row?: DiaryRowByKind[K];
	/** A new deviation's number. */
	nextNumber: number;
	onApply: (row: DiaryRowByKind[K]) => void;
	onClose: () => void;
}

/**
 * "Fler rader" and ⋮ Redigera: one row of one table. The fields depend on the
 * table. Applying changes the diary's form, which Spara utkast then stores.
 *
 * Its submit stops at its own form — a portal still bubbles React's submit
 * event to whatever form renders it. Mounted only while open, so each opening
 * starts from the row or an empty draft.
 */
export function DiaryRowDialog<K extends DiaryRowKind>({ kind, row, nextNumber, onApply, onClose }: DiaryRowDialogProps<K>) {
	const t = useTranslate();
	const translateError = (message: string) => t(message as TranslationKeys);
	const meta = DIARY_ROW_KIND_META[kind];

	const form = useForm<DiaryRowDraftByKind[K]>({
		resolver: zodResolver(DIARY_ROW_SCHEMAS[kind] as never) as unknown as Resolver<DiaryRowDraftByKind[K]>,
		defaultValues: (row ? toRowDraft(kind, row) : EMPTY_ROW_DRAFTS[kind]) as never,
		mode: "onTouched",
	});

	const submit = form.handleSubmit((draft) => {
		const base = { id: row?.id ?? generateTempId(), number: (row as { number?: number } | undefined)?.number ?? nextNumber };
		onApply(fromRowDraft(kind, draft as DiaryRowDraftByKind[K], base));
		onClose();
	});

	/* The kind picks both the schema and the fieldset, so the control matches the fields it is handed to. */
	const control = form.control as unknown;
	const controlFor = <P extends DiaryRowKind>() => control as Control<DiaryRowDraftByKind[P]>;
	const fields = {
		workforce: <WorkforceFields control={controlFor<"workforce">()} translateError={translateError} />,
		works: <WorksFields control={controlFor<"works">()} translateError={translateError} />,
		machines: <MachinesFields control={controlFor<"machines">()} translateError={translateError} />,
		deviations: <DeviationsFields control={controlFor<"deviations">()} translateError={translateError} />,
	}[kind];

	return (
		<Dialog open onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="w-[calc(100vw-2rem)] rounded-lg border border-slate-200 bg-white p-6 sm:max-w-lg">
				<DialogHeader>
					<DialogTitle className="text-lg font-semibold text-slate-900">
						<Translate text={row ? meta.editTitleKey : meta.addTitleKey} />
					</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form
						noValidate
						className="flex flex-col gap-4"
						onSubmit={(event) => {
							event.stopPropagation();
							void submit(event);
						}}
					>
						{fields}
						<DialogFooter className="gap-2 sm:gap-3">
							<Button type="button" variant="outline" onClick={onClose} className="cursor-pointer border-slate-200">
								<Translate text={localizationConstants.cancel} />
							</Button>
							<Button type="submit" className="cursor-pointer bg-[#111721] text-white hover:bg-slate-800">
								<Translate text={localizationConstants.buttonSave} />
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}

export default DiaryRowDialog;
