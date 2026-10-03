/**
 * Choices for the selects of the new-access wizard (TFS-1105). Mock data until a
 * backend exists; people, companies and project numbers are made up.
 */

/** Projects and orders an access can be tied to. */
export const ACCESS_OBJECT_OPTIONS: string[] = ["PROJ-0021", "PROJ-0022", "PROJ-0030", "PROJ-0034", "PROJ-0041", "OR501", "OR612"];

export const ACCESS_COMPANY_OPTIONS: string[] = [
	"Nordisk El & VVS AB",
	"Bygg & Tak i Väst",
	"Malmö Måleri & Fasad AB",
	"Uppsala Markteknik AB",
	"Järfälla Städservice",
	"Örebro Transport & Logistik AB",
];

export interface AccessPersonOption {
	name: string;
	email: string;
	mobile: string;
}

/** People who can be a contact person or hold a key. Choosing one fills in their email and mobile number. */
export const ACCESS_PERSON_OPTIONS: AccessPersonOption[] = [
	{ name: "Kalle Andersson", email: "kalle.andersson@example.com", mobile: "070-456 50 60" },
	{ name: "Anna Lindqvist", email: "anna.lindqvist@example.com", mobile: "070-234 56 78" },
	{ name: "Erik Berg", email: "erik.berg@example.com", mobile: "073-345 67 89" },
	{ name: "Sara Nyström", email: "sara.nystrom@example.com", mobile: "072-901 23 45" },
	{ name: "Omar Haddad", email: "omar.haddad@example.com", mobile: "076-456 78 90" },
	{ name: "Maja Holm", email: "maja.holm@example.com", mobile: "070-789 01 23" },
	{ name: "Lars Ekström", email: "lars.ekstrom@example.com", mobile: "073-890 12 34" },
];
