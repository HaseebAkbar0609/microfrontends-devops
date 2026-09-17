"use client";

import type { Control } from "react-hook-form";

import { FormInput, FormSelect, FormTextarea } from "@/components/form";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import type { DiaryRowDraftByKind } from "../../form/diaryRowSchemas";
import {
	DEVIATION_STATUS_META,
	DEVIATION_STATUSES,
	DEVIATION_TYPE_META,
	DEVIATION_TYPES,
	DIARY_LIMITS,
	WORK_STATUS_META,
	WORK_STATUSES,
	type EnumMeta,
} from "../../projectDiary.config";
import type { DiaryRowKind } from "../../types";

const M = localizationConstants;

const options = <T extends string>(values: readonly T[], meta: Record<T, EnumMeta>) =>
	values.map((value) => ({ value, label: <Translate text={meta[value].labelKey} /> }));

const WORK_STATUS_OPTIONS = options(WORK_STATUSES, WORK_STATUS_META);
const DEVIATION_TYPE_OPTIONS = options(DEVIATION_TYPES, DEVIATION_TYPE_META);
const DEVIATION_STATUS_OPTIONS = options(DEVIATION_STATUSES, DEVIATION_STATUS_META);

interface FieldsetProps<K extends DiaryRowKind> {
	control: Control<DiaryRowDraftByKind[K]>;
	translateError: (message: string) => string;
}

const TEXT = { maxLength: DIARY_LIMITS.text };
const NUMBER = { inputMode: "decimal" as const, maxLength: 8 };

/** Every row kind has a note; the control is typed per kind, so it is narrowed here to the one field used. */
function NoteField({ control, labelKey }: { control: unknown; labelKey: string }) {
	return (
		<FormTextarea
			control={control as unknown as Control<{ note: string }>}
			name="note"
			label={labelKey}
			rows={3}
			className="sm:col-span-2"
			textareaProps={{ maxLength: DIARY_LIMITS.note }}
		/>
	);
}

export function WorkforceFields({ control, translateError }: FieldsetProps<"workforce">) {
	return (
		<div className="grid gap-4 sm:grid-cols-2">
			<FormInput control={control} name="role" label={M.projectDiaryColName} required inputProps={{ ...TEXT, autoFocus: true }} translateError={translateError} className="sm:col-span-2" />
			<FormInput control={control} name="own" label={M.projectDiaryColOwn} inputProps={NUMBER} translateError={translateError} />
			<FormInput control={control} name="ue" label={M.projectDiaryColUe} inputProps={NUMBER} translateError={translateError} />
			<FormInput control={control} name="hours" label={M.projectDiaryColHours} required inputProps={NUMBER} translateError={translateError} />
			<NoteField control={control} labelKey={M.projectDiaryColNote} />
		</div>
	);
}

export function WorksFields({ control, translateError }: FieldsetProps<"works">) {
	return (
		<div className="grid gap-4 sm:grid-cols-2">
			<FormInput control={control} name="name" label={M.projectDiaryColName} required inputProps={{ ...TEXT, autoFocus: true }} translateError={translateError} />
			<FormSelect control={control} name="status" label={M.projectDiaryColStatus} placeholder={M.projectDiarySelectPlaceholder} options={WORK_STATUS_OPTIONS} translateError={translateError} />
			<NoteField control={control} labelKey={M.projectDiaryColNotes} />
		</div>
	);
}

export function MachinesFields({ control, translateError }: FieldsetProps<"machines">) {
	return (
		<div className="grid gap-4 sm:grid-cols-2">
			<FormInput control={control} name="name" label={M.projectDiaryColName} required inputProps={{ ...TEXT, autoFocus: true }} translateError={translateError} className="sm:col-span-2" />
			<FormInput control={control} name="quantity" label={M.projectDiaryColQuantity} required inputProps={NUMBER} translateError={translateError} />
			<FormInput control={control} name="hours" label={M.projectDiaryColHoursShort} required inputProps={NUMBER} translateError={translateError} />
			<NoteField control={control} labelKey={M.projectDiaryColNote} />
		</div>
	);
}

export function DeviationsFields({ control, translateError }: FieldsetProps<"deviations">) {
	return (
		<div className="grid gap-4 sm:grid-cols-2">
			<FormSelect control={control} name="type" label={M.projectDiaryColType} placeholder={M.projectDiarySelectPlaceholder} options={DEVIATION_TYPE_OPTIONS} translateError={translateError} />
			<FormSelect control={control} name="status" label={M.projectDiaryColStatus} placeholder={M.projectDiarySelectPlaceholder} options={DEVIATION_STATUS_OPTIONS} translateError={translateError} />
			<NoteField control={control} labelKey={M.projectDiaryColNote} />
		</div>
	);
}
