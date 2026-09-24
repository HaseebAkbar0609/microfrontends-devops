"use client";

import type { DataTableColumn } from "@/components/table/DataTable";
import { Badge } from "@/components/ui/badge";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { formatLedgerDate } from "./ledgerDate";
import type { StaffLedgerEntry } from "./types";

/**
 * The columns the frame draws sort arrows on — and only those.
 *
 * Datum, Person nr, Namn and Roll carry the arrows; Egen personal, UE,
 * Inloggad, Utloggad and Verktyg do not. Honouring that rather than making all
 * nine sortable: it also sidesteps the frame's own inconsistency in the time
 * columns, which print check-in with a dot ("07.00") and check-out with a colon
 * ("16:36"). Times are stored zero-padded as `HH:mm`, so they would sort
 * correctly as text if a later ticket wants them sortable.
 *
 * `date` is stored as `yyyy-MM-dd`, which sorts chronologically as text.
 */
export const STAFF_LEDGER_SORT_FIELDS = [
	"date",
	"personalNo",
	"name",
	"role",
] as const satisfies readonly (keyof StaffLedgerEntry)[];

export type StaffLedgerSortField = (typeof STAFF_LEDGER_SORT_FIELDS)[number];

/**
 * The date in the frame's long form.
 *
 * Its own component so the column list below can stay a module constant:
 * `useTranslate()` hands back a freshly allocated function on every render, so
 * a `useMemo` keyed on it never hits and the table would receive a new column
 * array each time (rule 7).
 */
function LedgerDate({ iso }: { iso: string }) {
	const t = useTranslate();
	return <>{formatLedgerDate(iso, t)}</>;
}

/**
 * An absent value, said in the words that fit the column.
 *
 * `InfoField`'s treatment — an `aria-hidden` em-dash beside an `sr-only`
 * word — but the word is the caller's: an empty Utloggad does not mean the
 * time is *missing*, it means the person has not left yet, which is the whole
 * point of the "Inloggade NU" filter.
 */
function Absent({ labelKey }: { labelKey: TranslationKeys }) {
	return (
		<>
			<span aria-hidden>—</span>
			<span className="sr-only">
				<Translate text={labelKey} />
			</span>
		</>
	);
}

/** The nine columns, in the frame's order. */
export const STAFF_LEDGER_COLUMNS: DataTableColumn<StaffLedgerEntry>[] = [
	{
		key: "date",
		label: localizationConstants.dateHeaderLabel,
		sortable: true,
		render: (row) => <LedgerDate iso={row.date} />,
	},
	{
		/* "Person nr" — the frame's wording. The personnel module labels the
		   same data `colIdNumber` ("Id-nr"); flagged on the ticket. */
		key: "personalNo",
		label: localizationConstants.fieldPersonalId,
		sortable: true,
		cellClassName: "font-mono",
	},
	{
		key: "name",
		label: localizationConstants.namnHeader,
		sortable: true,
		cellClassName: "whitespace-normal",
	},
	{ key: "role", label: localizationConstants.orgColRoll, sortable: true },
	{
		key: "ownStaff",
		label: localizationConstants.projectStaffLedgerColOwnStaff,
		render: (row) => (
			<Badge variant={row.ownStaff ? "success" : "category"}>
				<Translate
					text={
						row.ownStaff
							? localizationConstants.commonYes
							: localizationConstants.commonNo
					}
				/>
			</Badge>
		),
	},
	{
		key: "supplier",
		label: localizationConstants.projectStaffLedgerColSupplier,
		/* Empty for our own people — `ownStaff` and `supplier` are two halves
		   of one fact. */
		cellClassName: "whitespace-normal",
		render: (row) =>
			row.supplier || (
				<Absent
					labelKey={localizationConstants.purchaseInfoValueMissing}
				/>
			),
	},
	{
		key: "loggedIn",
		label: localizationConstants.projectStaffLedgerColLoggedIn,
	},
	{
		key: "loggedOut",
		label: localizationConstants.projectStaffLedgerColLoggedOut,
		render: (row) =>
			row.loggedOut || (
				<Absent
					labelKey={
						localizationConstants.projectStaffLedgerStillOnSite
					}
				/>
			),
	},
	{
		/* Not `tools` ("Verktyg", sv.ts:206): that key is the top-nav label for
		   the Tools module, and reusing it would make a navigation rename move a
		   table header. */
		key: "tool",
		label: localizationConstants.projectStaffLedgerColTool,
		render: (row) => <Badge variant="typeLight">{row.tool}</Badge>,
	},
];
