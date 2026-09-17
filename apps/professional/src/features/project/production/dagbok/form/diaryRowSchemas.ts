import { z } from "zod";

import localizationConstants from "@/utils/translation/constants";
import { DEVIATION_STATUSES, DEVIATION_TYPES, DIARY_LIMITS, WORK_STATUSES } from "../projectDiary.config";
import type { DiaryRowByKind, DiaryRowKind } from "../types";

const M = localizationConstants;

/** A trimmed text field, optional unless `required` names its message. */
const text = (max: number, required?: string) => {
	const base = z.string().trim().max(max, M.projectDiaryTooLong);
	return required ? base.min(1, required) : base;
};

/** "8", "7,5" or "7.5" → a number with at most two decimals; `null` for blank; `NaN` for anything else. */
export function parseAmount(value: string): number | null {
	const trimmed = value.trim().replace(",", ".");
	if (!trimmed) return null;
	return /^\d+(\.\d{1,2})?$/.test(trimmed) ? Number(trimmed) : Number.NaN;
}

/** A number field typed as text: blank allowed unless `required`, within `0…max`, whole unless `decimals`. */
const amount = (max: number, { required = false, decimals = false } = {}) =>
	z.string().superRefine((value, ctx) => {
		const parsed = parseAmount(value);
		if (parsed === null) {
			if (required) ctx.addIssue({ code: z.ZodIssueCode.custom, message: M.projectDiaryNumberInvalid });
			return;
		}
		if (Number.isNaN(parsed) || parsed > max || (!decimals && !Number.isInteger(parsed))) {
			ctx.addIssue({ code: z.ZodIssueCode.custom, message: M.projectDiaryNumberInvalid });
		}
	});

const choice = <T extends readonly [string, ...string[]]>(values: T, message: string) =>
	z.union([z.enum(values), z.literal("")]).refine((value) => value !== "", message);

export const workforceDraftSchema = z
	.object({
		role: text(DIARY_LIMITS.text, M.projectDiaryNameRequired),
		own: amount(DIARY_LIMITS.people),
		ue: amount(DIARY_LIMITS.people),
		hours: amount(DIARY_LIMITS.hours, { required: true, decimals: true }),
		note: text(DIARY_LIMITS.note),
	})
	.refine((row) => (parseAmount(row.own) || 0) + (parseAmount(row.ue) || 0) > 0, {
		path: ["own"],
		message: M.projectDiaryCountRequired,
	});

export const worksDraftSchema = z.object({
	name: text(DIARY_LIMITS.text, M.projectDiaryNameRequired),
	status: choice(WORK_STATUSES, M.projectDiaryStatusRequired),
	note: text(DIARY_LIMITS.note),
});

export const machinesDraftSchema = z.object({
	name: text(DIARY_LIMITS.text, M.projectDiaryNameRequired),
	quantity: amount(DIARY_LIMITS.machines, { required: true }).refine((value) => parseAmount(value) !== 0, M.projectDiaryNumberInvalid),
	hours: amount(DIARY_LIMITS.machineHours, { required: true, decimals: true }),
	note: text(DIARY_LIMITS.note),
});

export const deviationsDraftSchema = z.object({
	type: choice(DEVIATION_TYPES, M.projectDiaryTypeRequired),
	status: choice(DEVIATION_STATUSES, M.projectDiaryStatusRequired),
	note: text(DIARY_LIMITS.note),
});

export const DIARY_ROW_SCHEMAS = {
	workforce: workforceDraftSchema,
	works: worksDraftSchema,
	machines: machinesDraftSchema,
	deviations: deviationsDraftSchema,
} as const;

export interface DiaryRowDraftByKind {
	workforce: z.infer<typeof workforceDraftSchema>;
	works: z.infer<typeof worksDraftSchema>;
	machines: z.infer<typeof machinesDraftSchema>;
	deviations: z.infer<typeof deviationsDraftSchema>;
}

export const EMPTY_ROW_DRAFTS: DiaryRowDraftByKind = {
	workforce: { role: "", own: "", ue: "", hours: "", note: "" },
	works: { name: "", status: "", note: "" },
	machines: { name: "", quantity: "1", hours: "", note: "" },
	deviations: { type: "", status: "", note: "" },
};

const numberText = (value: number | null) => (value === null ? "" : String(value));

const TO_DRAFT: { [P in DiaryRowKind]: (row: DiaryRowByKind[P]) => DiaryRowDraftByKind[P] } = {
	workforce: (r) => ({ role: r.role, own: numberText(r.own), ue: numberText(r.ue), hours: String(r.hours), note: r.note }),
	works: (r) => ({ name: r.name, status: r.status, note: r.note }),
	machines: (r) => ({ name: r.name, quantity: String(r.quantity), hours: String(r.hours), note: r.note }),
	deviations: (r) => ({ type: r.type, status: r.status, note: r.note }),
};

/** A stored row as the dialog edits it. */
export function toRowDraft<K extends DiaryRowKind>(kind: K, row: DiaryRowByKind[K]): DiaryRowDraftByKind[K] {
	return (TO_DRAFT[kind] as (value: DiaryRowByKind[K]) => DiaryRowDraftByKind[K])(row);
}

const amountOf = (value: string) => parseAmount(value) ?? 0;

/* Only called on a draft the schema accepted, so every required choice is set. */
const FROM_DRAFT: { [P in DiaryRowKind]: (draft: DiaryRowDraftByKind[P], base: RowBase) => DiaryRowByKind[P] } = {
	workforce: (d, { id }) => ({ id, role: d.role.trim(), own: parseAmount(d.own), ue: parseAmount(d.ue), hours: amountOf(d.hours), note: d.note.trim() }),
	works: (d, { id }) => ({ id, name: d.name.trim(), status: d.status as DiaryRowByKind["works"]["status"], note: d.note.trim() }),
	machines: (d, { id }) => ({ id, name: d.name.trim(), quantity: amountOf(d.quantity), hours: amountOf(d.hours), note: d.note.trim() }),
	deviations: (d, { id, number }) => ({
		id,
		number,
		type: d.type as DiaryRowByKind["deviations"]["type"],
		status: d.status as DiaryRowByKind["deviations"]["status"],
		note: d.note.trim(),
	}),
};

export interface RowBase {
	id: string;
	/** A deviation's number; ignored by the other kinds. */
	number: number;
}

/** A validated draft as a stored row. */
export function fromRowDraft<K extends DiaryRowKind>(kind: K, draft: DiaryRowDraftByKind[K], base: RowBase): DiaryRowByKind[K] {
	return (FROM_DRAFT[kind] as (value: DiaryRowDraftByKind[K], rowBase: RowBase) => DiaryRowByKind[K])(draft, base);
}
