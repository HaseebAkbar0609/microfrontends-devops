import type { AccessTypeId } from "../types/access.types";
import type { AccessHoldersByRecord, AccessItem, AccessItemStatusId } from "../types/accessItems.types";

/**
 * People and their items for the Access tab (TFS-1103), keyed by the id of the
 * matching row in `ACCESS_POINTS_MOCK`. Mock data until a backend exists.
 *
 * "ap-001" repeats the Figma frame: five people, the first with the four items
 * shown there. The people of every record are the "assigned to" names of its list
 * row, in the same order. Names and numbers are made up. "ap-005" and "ap-009"
 * have nobody, to show the empty tab.
 */
function item(
	id: string,
	nycId: string,
	regNo: string,
	type: AccessTypeId,
	accessTo: string,
	status: AccessItemStatusId = "active",
	startDate = "2026-01-01",
	endDate = "2026-05-01",
): AccessItem {
	return { id, nycId, regNo, type, accessTo, startDate, endDate, status };
}

export const ACCESS_HOLDERS_MOCK: AccessHoldersByRecord = {
	"ap-001": [
		{
			id: "h-001-1",
			name: "Kalle Andersson",
			items: [
				item("i-001-1-1", "N001", "4563978", "accessCard", "Main Door"),
				item("i-001-1-2", "N005", "4569875", "accessCard", "N002"),
				item("i-001-1-3", "N009", "23658", "accessCard", "PROJ-002", "returned"),
				item("i-001-1-4", "N018", "478965", "accessCard", "OR501"),
			],
		},
		{
			id: "h-001-2",
			name: "Stefan Larsson",
			items: [
				item("i-001-2-1", "N021", "5521044", "keys", "Warehouse"),
				item("i-001-2-2", "N022", "5521045", "keys", "Side Door", "returned"),
			],
		},
		{ id: "h-001-3", name: "Stina Johansson", items: [item("i-001-3-1", "N034", "7810233", "passCard", "Reception")] },
		{
			id: "h-001-4",
			name: "Vera Isaksson",
			items: [
				item("i-001-4-1", "N041", "3309871", "tag", "Gate 1"),
				item("i-001-4-2", "N042", "3309872", "tag", "Gate 2"),
			],
		},
		{ id: "h-001-5", name: "Sture Svensson", items: [item("i-001-5-1", "N057", "9904512", "accessCard", "Main Door")] },
	],
	"ap-002": [
		{ id: "h-002-1", name: "Anna Lindqvist", items: [item("i-002-1-1", "N101", "6610001", "keys", "Head Office")] },
		{ id: "h-002-2", name: "Erik Berg", items: [item("i-002-2-1", "N102", "6610002", "keys", "Head Office", "returned")] },
		{ id: "h-002-3", name: "Sara Nyström", items: [item("i-002-3-1", "N103", "6610003", "keys", "Archive")] },
	],
	"ap-003": [
		{
			id: "h-003-1",
			name: "Omar Haddad",
			items: [item("i-003-1-1", "N201", "4400128", "passCard", "PROJ-0021", "active", "2026-02-01", "2026-08-01")],
		},
	],
	"ap-004": [
		{
			id: "h-004-1",
			name: "Karin Öberg",
			items: [
				item("i-004-1-1", "N301", "2210345", "tag", "OR501"),
				item("i-004-1-2", "N302", "2210346", "tag", "Kitchen", "returned"),
			],
		},
		{ id: "h-004-2", name: "Johan Sandberg", items: [item("i-004-2-1", "N303", "2210347", "tag", "OR501")] },
	],
	"ap-006": [{ id: "h-006-1", name: "Maja Holm", items: [item("i-006-1-1", "N401", "8802216", "accessCard", "Industrivägen 3")] }],
	"ap-007": [{ id: "h-007-1", name: "Lars Ekström", items: [item("i-007-1-1", "N501", "1190467", "keys", "Workshop")] }],
	"ap-008": [
		{ id: "h-008-1", name: "Anna Lindqvist", items: [item("i-008-1-1", "N601", "3340981", "passCard", "Main Entrance")] },
		{ id: "h-008-2", name: "Omar Haddad", items: [item("i-008-2-1", "N602", "3340982", "passCard", "Main Entrance")] },
		{ id: "h-008-3", name: "Maja Holm", items: [item("i-008-3-1", "N603", "3340983", "passCard", "Main Entrance", "returned")] },
		{ id: "h-008-4", name: "Erik Berg", items: [item("i-008-4-1", "N604", "3340984", "passCard", "Main Entrance")] },
	],
	"ap-010": [{ id: "h-010-1", name: "Sara Nyström", items: [item("i-010-1-1", "N701", "7712038", "keys", "Material Yard")] }],
	"ap-011": [
		{ id: "h-011-1", name: "Johan Sandberg", items: [item("i-011-1-1", "N801", "5503217", "accessCard", "Server Room")] },
		{ id: "h-011-2", name: "Karin Öberg", items: [item("i-011-2-1", "N802", "5503218", "accessCard", "Server Room")] },
	],
	"ap-012": [{ id: "h-012-1", name: "Lars Ekström", items: [item("i-012-1-1", "N901", "6620419", "tag", "Vehicle Garage")] }],
};
