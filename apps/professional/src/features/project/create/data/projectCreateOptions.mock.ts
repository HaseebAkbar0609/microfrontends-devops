import { PROJECT_LIST_ROWS } from "../../data/projectsOverview.mock";

/**
 * Option lists for the wizard's pickers.
 *
 * These were literals inside the order wizard's step 4; they are collected
 * here so the two flows can be pointed at one register once an endpoint
 * exists, rather than drifting apart in two component bodies.
 */

export const CONTRACTOR_TYPE_OPTIONS = [
	"Elektriker",
	"Rörmokare",
	"Snickare",
	"Målare",
	"Plattsättare",
	"Ventilation",
	"Mark & Anläggning",
];

export const ORGANISATION_OPTIONS = [
	"Elbolaget AB",
	"Rörbolaget AB",
	"ByggTeam Stockholm AB",
	"Målerifirman Svensson AB",
	"Nordic VVS & El AB",
];

export const ROLE_OPTIONS = [
	"Beställare",
	"Arbetsledare",
	"Montör",
	"Projektledare",
	"Platschef",
];

export const PROJECT_TYPE_OPTIONS = [
	"Totalentreprenad",
	"Utförandeentreprenad",
	"Löpande räkning",
	"Fastpris",
];

export const PROJECT_CATEGORY_OPTIONS = [
	"Nyproduktion",
	"Renovering",
	"Ombyggnad",
	"Service",
];

export const DEPARTMENT_OPTIONS = [
	"Nyproduktion",
	"Service",
	"Projektering",
	"Anläggning",
];

/** "Koppla projekt" offers the projects that already exist. */
export const LINKABLE_PROJECT_OPTIONS = PROJECT_LIST_ROWS.map((row) => ({
	value: row.projectNr,
	label: `${row.projectNr} — ${row.name}`,
}));
