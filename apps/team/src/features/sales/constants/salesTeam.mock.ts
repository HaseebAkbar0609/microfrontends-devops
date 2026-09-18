import type { SalesTeamMember } from "../types";

/**
 * The sales organisation until the API exposes users and roles.
 *
 * Names match the sellers and account managers on the seed companies, so the
 * results columns line up with the CRM.
 */
export const SALES_TEAM_SEED: SalesTeamMember[] = [
	{
		id: "tm-1",
		name: "Carla Cabrer",
		role: "seller",
		region: "stockholm",
		email: "carla@timeflow.se",
		phone: "070-111 22 33",
	},
	{
		id: "tm-2",
		name: "Joselyn Gauer",
		role: "seller",
		region: "goteborg",
		email: "joselyn@timeflow.se",
		phone: "070-222 33 44",
	},
	{
		id: "tm-3",
		name: "Wilson Dakota",
		role: "account-manager",
		region: "malmo",
		email: "wilson@timeflow.se",
		phone: "070-333 44 55",
	},
	{
		id: "tm-4",
		name: "Nina Ek",
		role: "meeting-booker",
		region: "stockholm",
		email: "nina@timeflow.se",
		phone: "070-444 55 66",
	},
	{
		id: "tm-5",
		name: "Omar Haddad",
		role: "meeting-booker",
		region: "jarfalla",
		email: "omar@timeflow.se",
		phone: "070-555 66 77",
	},
];
