import type { AccessDetailsExtra } from "../types/accessDetails.types";

/**
 * Extra fields for the Smart Access details page (TFS-1102), keyed by the id of
 * the matching row in `ACCESS_POINTS_MOCK`. Mock data until a backend exists.
 *
 * Addresses, people and numbers are made up. "ap-009" has no contacts on purpose,
 * to show the empty table.
 */
export const ACCESS_DETAILS_MOCK: Record<string, AccessDetailsExtra> = {
	"ap-001": {
		address: "Storgatan 30",
		postalCode: "177 30",
		contacts: [{ id: "c-001-1", name: "Kalle Andersson", email: "kalle.andersson@example.com", mobile: "070-123 45 67" }],
	},
	"ap-002": {
		address: "Storgatan 30",
		postalCode: "113 45",
		contacts: [
			{ id: "c-002-1", name: "Anna Lindqvist", email: "anna.lindqvist@example.com", mobile: "070-234 56 78" },
			{ id: "c-002-2", name: "Erik Berg", email: "erik.berg@example.com", mobile: "073-345 67 89" },
		],
	},
	"ap-003": {
		address: "Skolgatan 12",
		postalCode: "411 18",
		contacts: [{ id: "c-003-1", name: "Omar Haddad", email: "omar.haddad@example.com", mobile: "076-456 78 90" }],
	},
	"ap-004": {
		address: "Hamngatan 4",
		postalCode: "211 21",
		contacts: [
			{ id: "c-004-1", name: "Karin Öberg", email: "karin.oberg@example.com", mobile: "070-567 89 01" },
			{ id: "c-004-2", name: "Johan Sandberg", email: "johan.sandberg@example.com", mobile: "072-678 90 12" },
		],
	},
	"ap-005": {
		address: "Verkstadsvägen 8",
		postalCode: "754 50",
		contacts: [{ id: "c-005-1", name: "Maja Holm", email: "maja.holm@example.com", mobile: "070-789 01 23" }],
	},
	"ap-006": {
		address: "Industrivägen 3",
		postalCode: "191 47",
		contacts: [
			{ id: "c-006-1", name: "Maja Holm", email: "maja.holm@example.com", mobile: "070-789 01 23" },
			{ id: "c-006-2", name: "Lars Ekström", email: "lars.ekstrom@example.com", mobile: "073-890 12 34" },
			{ id: "c-006-3", name: "Sara Nyström", email: "sara.nystrom@example.com", mobile: "" },
		],
	},
	"ap-007": {
		address: "Norra vägen 21",
		postalCode: "721 30",
		contacts: [{ id: "c-007-1", name: "Lars Ekström", email: "lars.ekstrom@example.com", mobile: "073-890 12 34" }],
	},
	"ap-008": {
		address: "Drottninggatan 55",
		postalCode: "111 21",
		contacts: [
			{ id: "c-008-1", name: "Anna Lindqvist", email: "anna.lindqvist@example.com", mobile: "070-234 56 78" },
			{ id: "c-008-2", name: "Omar Haddad", email: "omar.haddad@example.com", mobile: "076-456 78 90" },
		],
	},
	"ap-009": { address: "Byggvägen 2", postalCode: "702 27", contacts: [] },
	"ap-010": {
		address: "Hamnvägen 17",
		postalCode: "417 55",
		contacts: [{ id: "c-010-1", name: "Sara Nyström", email: "sara.nystrom@example.com", mobile: "072-901 23 45" }],
	},
	"ap-011": {
		address: "Datavägen 6",
		postalCode: "177 38",
		contacts: [{ id: "c-011-1", name: "Johan Sandberg", email: "johan.sandberg@example.com", mobile: "072-678 90 12" }],
	},
	"ap-012": {
		address: "Garagevägen 9",
		postalCode: "754 49",
		contacts: [{ id: "c-012-1", name: "Lars Ekström", email: "lars.ekstrom@example.com", mobile: "073-890 12 34" }],
	},
};
