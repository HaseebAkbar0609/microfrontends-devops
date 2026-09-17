import type { LucideIcon } from "lucide-react";
import { BriefcaseBusiness, Forklift, TriangleAlert, Users } from "lucide-react";

import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import {
	DEVIATION_STATUS_META,
	DEVIATION_TYPE_META,
	WORK_STATUS_META,
	type EnumMeta,
} from "../../projectDiary.config";
import type { DiaryRowByKind, DiaryRowKind } from "../../types";

type Translate = (key: TranslationKeys, params?: Record<string, string | number>) => string;

/** Formats a number in the app's language: 7,5 in Swedish, 7.5 in English. */
export type FormatNumber = (value: number) => string;

export interface DiaryColumn<K extends DiaryRowKind> {
	key: string;
	labelKey: TranslationKeys;
	/** What the cell says; also what search reads. */
	text: (row: DiaryRowByKind[K], t: Translate, n: FormatNumber) => string;
	/** Present when the frame draws a sort icon. Numbers and ranks sort as such, not as text. */
	sortValue?: (row: DiaryRowByKind[K], t: Translate) => string | number;
	/** Drawn as a badge in this variant. */
	badge?: (row: DiaryRowByKind[K]) => EnumMeta["badge"];
	numeric?: boolean;
}

const M = localizationConstants;
const dash = (value: number | null) => (value === null ? "–" : String(value));
const orDash = (value: string) => value || "–";

/**
 * Each table's columns, as the frame draws them — including which headers sort:
 * Benämning and Egen; Benämning and Status; Benämning; Nummer, Typ and Status.
 */
export const DIARY_COLUMNS: { [K in DiaryRowKind]: DiaryColumn<K>[] } = {
	workforce: [
		{ key: "role", labelKey: M.projectDiaryColName, text: (r) => r.role, sortValue: (r) => r.role },
		{ key: "own", labelKey: M.projectDiaryColOwn, text: (r) => dash(r.own), sortValue: (r) => r.own ?? -1, numeric: true },
		{ key: "ue", labelKey: M.projectDiaryColUe, text: (r) => dash(r.ue), numeric: true },
		{ key: "hours", labelKey: M.projectDiaryColHours, text: (r, _t, n) => n(r.hours), numeric: true },
		{ key: "note", labelKey: M.projectDiaryColNote, text: (r) => orDash(r.note) },
	],
	works: [
		{ key: "name", labelKey: M.projectDiaryColName, text: (r) => r.name, sortValue: (r) => r.name },
		{
			key: "status",
			labelKey: M.projectDiaryColStatus,
			text: (r, t) => t(WORK_STATUS_META[r.status].labelKey),
			sortValue: (r) => WORK_STATUS_META[r.status].rank,
			badge: (r) => WORK_STATUS_META[r.status].badge,
		},
		{ key: "note", labelKey: M.projectDiaryColNotes, text: (r) => orDash(r.note) },
	],
	machines: [
		{ key: "name", labelKey: M.projectDiaryColName, text: (r) => r.name, sortValue: (r) => r.name },
		{ key: "quantity", labelKey: M.projectDiaryColQuantity, text: (r, t) => t(M.projectDiaryQuantityValue, { count: r.quantity }) },
		{ key: "hours", labelKey: M.projectDiaryColHoursShort, text: (r, _t, n) => n(r.hours), numeric: true },
		{ key: "note", labelKey: M.projectDiaryColNote, text: (r) => orDash(r.note) },
	],
	deviations: [
		{ key: "number", labelKey: M.projectDiaryColNumber, text: (r) => String(r.number), sortValue: (r) => r.number, numeric: true },
		{
			key: "type",
			labelKey: M.projectDiaryColType,
			text: (r, t) => t(DEVIATION_TYPE_META[r.type].labelKey),
			sortValue: (r) => DEVIATION_TYPE_META[r.type].rank,
			badge: (r) => DEVIATION_TYPE_META[r.type].badge,
		},
		{
			key: "status",
			labelKey: M.projectDiaryColStatus,
			text: (r, t) => t(DEVIATION_STATUS_META[r.status].labelKey),
			sortValue: (r) => DEVIATION_STATUS_META[r.status].rank,
			badge: (r) => DEVIATION_STATUS_META[r.status].badge,
		},
		{ key: "note", labelKey: M.projectDiaryColNote, text: (r) => orDash(r.note) },
	],
};

export const DIARY_CARD_ICONS: Record<DiaryRowKind, LucideIcon> = {
	workforce: Users,
	works: BriefcaseBusiness,
	machines: Forklift,
	deviations: TriangleAlert,
};
