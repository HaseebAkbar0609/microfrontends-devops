/**
 * Taxonomies the create form offers.
 *
 * Configuration rather than mock data: these are the values the business uses,
 * not stand-ins for a record that does not exist yet. They live apart from
 * `projectCreateOptions.mock.ts`, which holds the company and project rows a
 * register will eventually supply.
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
