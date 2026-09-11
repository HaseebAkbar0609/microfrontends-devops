import type { DataTableColumn } from "@/components/table/DataTable";
import localizationConstants from "@/utils/translation/constants";
import type { OrganisationMember } from "./types";

/** Every field the table shows, and therefore everything search looks at. */
export const ORGANISATION_SEARCH_FIELDS = [
	"foretag",
	"roll",
	"kategori",
	"address",
	"postNr",
	"ort",
	"kontakt",
	"mail",
] as const satisfies readonly (keyof OrganisationMember)[];

export type OrganisationSortField = (typeof ORGANISATION_SEARCH_FIELDS)[number];

/**
 * The eight columns, in the frame's order.
 *
 * A module constant rather than a value built in the page, so the same array
 * reaches every group's table on every render (rule 7).
 *
 * `orgColAddress` is "Address" — the English spelling, in the Swedish file. It
 * is what the frame draws and what the order module's Organisation screen
 * already renders from the same key, so correcting it here would move a shipped
 * screen too. Flagged on the ticket rather than changed. `addressLabel` is not
 * the alternative: it is one of the three keys in `sv.ts` whose later spread
 * wins with a different value ("Address" at 3586 loses to "Adress" at 4505).
 */
export const ORGANISATION_COLUMNS: DataTableColumn<OrganisationMember>[] = [
	{
		key: "foretag",
		label: localizationConstants.orgColForetag,
		sortable: true,
	},
	{ key: "roll", label: localizationConstants.orgColRoll, sortable: true },
	{
		key: "kategori",
		label: localizationConstants.orgColKategori,
		sortable: true,
	},
	{
		key: "address",
		label: localizationConstants.orgColAddress,
		sortable: true,
	},
	{
		key: "postNr",
		label: localizationConstants.orgColPostNr,
		sortable: true,
	},
	{ key: "ort", label: localizationConstants.orgColOrt, sortable: true },
	{
		key: "kontakt",
		label: localizationConstants.orgColKontakt,
		sortable: true,
	},
	{ key: "mail", label: localizationConstants.orgColMail, sortable: true },
];
