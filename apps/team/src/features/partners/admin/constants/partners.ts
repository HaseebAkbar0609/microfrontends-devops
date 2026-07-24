export type PartnerRegisterStatus = "active" | "closed";
export type PartnerApprovalStatus = "approved" | "declined" | "pending" | "archived";

export interface PartnerRegisterRow {
	id: string;
	company: string;
	category: string;
	contact: string;
	mobile: string;
	type: string;
	status: PartnerRegisterStatus;
	date: string;
	approvalStatus: PartnerApprovalStatus;
}

export const DUMMY_PARTNER_REGISTER: PartnerRegisterRow[] = [
	{
		id: "partner-1",
		company: "Bygg-Max",
		category: "Bygghandel",
		contact: "Kalle Andersson",
		mobile: "070-426 50 50",
		type: "B2B - B2C",
		status: "active",
		date: "2026-01-01",
		approvalStatus: "approved",
	},
	{
		id: "partner-2",
		company: "Marbodal",
		category: "Kök",
		contact: "Stina Svensson",
		mobile: "010-552 55 50",
		type: "B2B",
		status: "closed",
		date: "2026-01-01",
		approvalStatus: "declined",
	},
	{
		id: "partner-3",
		company: "Golvbutiken",
		category: "Golv",
		contact: "Johan Larsson",
		mobile: "070-578 90 90",
		type: "B2B-B2C",
		status: "active",
		date: "2026-01-01",
		approvalStatus: "pending",
	},
	{
		id: "partner-4",
		company: "Försäkring",
		category: "Försäkring",
		contact: "Mats Karlsson",
		mobile: "072-562 78 96",
		type: "B2B",
		status: "active",
		date: "2026-01-01",
		approvalStatus: "pending",
	},
	{
		id: "partner-5",
		company: "Alviks måleri",
		category: "Målning",
		contact: "Josefin Larsson",
		mobile: "073-499 88 00",
		type: "B2C",
		status: "active",
		date: "2026-01-01",
		approvalStatus: "archived",
	},
	{
		id: "partner-6",
		company: "Uran Lindqvis",
		category: "Elektriker",
		contact: "Lotta Andersson",
		mobile: "072-145 85 90",
		type: "B2B",
		status: "active",
		date: "2026-01-01",
		approvalStatus: "approved",
	},
];
