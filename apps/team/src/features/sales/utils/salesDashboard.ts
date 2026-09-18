import type { SalesActivityType, SalesCompany } from "../types";
import { getWeekDayKeys, toDateKey } from "./meetingBooker";
import { compareText, getInvoicedAmount } from "./salesFormatters";

export type SellerStats = {
	name: string;
	meetings: number;
	quotes: number;
	deals: number;
	invoiced: number;
};

export type WeekMeeting = {
	id: string;
	companyName: string;
	date: string;
	text: string;
};

export type WeekDeal = {
	id: string;
	companyName: string;
	orderNumber: string;
	amount: number;
};

export type SalesDashboardStats = {
	dealsThisWeek: number;
	dealsAmountThisWeek: number;
	callsThisWeek: number;
	meetingsThisWeek: number;
	quotesThisWeek: number;
	newCustomersThisWeek: number;
	pipelineTotal: number;
	invoicedTotal: number;
	sellers: SellerStats[];
	meetings: WeekMeeting[];
	deals: WeekDeal[];
};

/** True when `iso` falls on one of the week's local calendar days. */
function isInWeek(iso: string | undefined, week: Set<string>): boolean {
	return week.has(toDateKey(iso));
}

function countActivities(
	company: SalesCompany,
	type: SalesActivityType,
	week?: Set<string>,
): number {
	return company.activities.filter(
		(activity) =>
			activity.type === type && (!week || isInWeek(activity.date, week)),
	).length;
}

/**
 * Everything the sales dashboard shows, derived from the CRM companies. "This
 * week" is the Monday-to-Sunday week holding `todayKey`.
 */
export function getSalesDashboardStats(
	companies: SalesCompany[],
	todayKey: string,
): SalesDashboardStats {
	const week = new Set(getWeekDayKeys(todayKey));
	const sellers = new Map<string, SellerStats>();
	const meetings: WeekMeeting[] = [];
	const deals: WeekDeal[] = [];
	let callsThisWeek = 0;
	let quotesThisWeek = 0;
	let newCustomersThisWeek = 0;
	let pipelineTotal = 0;
	let invoicedTotal = 0;

	for (const company of companies) {
		const invoiced = getInvoicedAmount(company);
		invoicedTotal += invoiced;
		callsThisWeek += countActivities(company, "call", week);
		if (isInWeek(company.quote?.createdAt, week)) quotesThisWeek += 1;
		if (isInWeek(company.createdAt, week)) newCustomersThisWeek += 1;
		if (company.status !== "closed") pipelineTotal += 1;

		for (const activity of company.activities) {
			if (activity.type === "meeting" && isInWeek(activity.date, week)) {
				meetings.push({
					id: activity.id,
					companyName: company.name,
					date: activity.date,
					text: activity.text,
				});
			}
		}

		if (company.order && isInWeek(company.order.createdAt, week)) {
			deals.push({
				id: company.id,
				companyName: company.name,
				orderNumber: company.order.orderNumber,
				amount: invoiced || company.quote?.firstInvoice || 0,
			});
		}

		if (company.seller) {
			const stats = sellers.get(company.seller) ?? {
				name: company.seller,
				meetings: 0,
				quotes: 0,
				deals: 0,
				invoiced: 0,
			};
			stats.meetings += countActivities(company, "meeting");
			stats.quotes += company.quote ? 1 : 0;
			stats.deals += company.order ? 1 : 0;
			stats.invoiced += invoiced;
			sellers.set(company.seller, stats);
		}
	}

	return {
		dealsThisWeek: deals.length,
		dealsAmountThisWeek: deals.reduce((sum, deal) => sum + deal.amount, 0),
		callsThisWeek,
		meetingsThisWeek: meetings.length,
		quotesThisWeek,
		newCustomersThisWeek,
		pipelineTotal,
		invoicedTotal,
		sellers: [...sellers.values()].sort(
			(a, b) => b.invoiced - a.invoiced || compareText(a.name, b.name),
		),
		meetings: meetings.sort((a, b) => a.date.localeCompare(b.date)),
		deals,
	};
}
