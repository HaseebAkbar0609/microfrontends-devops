import { PROJECT_LIST_ROWS } from "../../data/projectsOverview.mock";

/**
 * Rows that stand in for a register the app does not have yet.
 *
 * The taxonomies the form offers are configuration and live in
 * `projectCreate.config.ts`; what is left here is data a query will replace.
 */

/** Contractor companies, until a supplier register backs the picker. */
export const ORGANISATION_OPTIONS = [
	"Elbolaget AB",
	"Rörbolaget AB",
	"ByggTeam Stockholm AB",
	"Målerifirman Svensson AB",
	"Nordic VVS & El AB",
];

/** "Koppla projekt" offers the projects that already exist. */
export const LINKABLE_PROJECT_OPTIONS = PROJECT_LIST_ROWS.map((row) => ({
	value: row.projectNr,
	label: `${row.projectNr} — ${row.name}`,
}));
