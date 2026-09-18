import type { SalesCompany, SalesTeamMember } from "../types";
import { getInvoicedAmount } from "./salesFormatters";

export type TeamMemberStats = {
	customers: number;
	quotes: number;
	deals: number;
	meetings: number;
	calls: number;
	invoiced: number;
};

const EMPTY_STATS: TeamMemberStats = {
	customers: 0,
	quotes: 0,
	deals: 0,
	meetings: 0,
	calls: 0,
	invoiced: 0,
};

/**
 * Results per team member, keyed by member id.
 *
 * Customers, quotes, deals and invoiced come from the companies they sell to.
 * Meetings and calls come from the activities they booked, which is what the
 * meeting booker page records.
 *
 * Matching is by name, because the CRM stores a seller as a name rather than
 * an id. Names must therefore be unique; AddTeamMemberForm rejects duplicates.
 */
export function getTeamStats(
	companies: SalesCompany[],
	members: SalesTeamMember[],
): Record<string, TeamMemberStats> {
	const byName = new Map<string, TeamMemberStats>(
		members.map((member) => [member.name, { ...EMPTY_STATS }]),
	);

	for (const company of companies) {
		const seller = byName.get(company.seller);
		if (seller) {
			seller.customers += 1;
			seller.quotes += company.quote ? 1 : 0;
			seller.deals += company.order ? 1 : 0;
			seller.invoiced += getInvoicedAmount(company);
		}

		for (const activity of company.activities) {
			if (!activity.booker) continue;
			const booker = byName.get(activity.booker);
			if (!booker) continue;
			if (activity.type === "call") booker.calls += 1;
			if (activity.type === "meeting") booker.meetings += 1;
		}
	}

	return Object.fromEntries(
		members.map((member) => [
			member.id,
			byName.get(member.name) ?? { ...EMPTY_STATS },
		]),
	);
}

/** How many members hold each role. */
export function countByRole(members: SalesTeamMember[]) {
	return {
		total: members.length,
		seller: members.filter((member) => member.role === "seller").length,
		booker: members.filter((member) => member.role === "meeting-booker").length,
		accountManager: members.filter((member) => member.role === "account-manager")
			.length,
	};
}
