import {
	DAYS_PER_WEEK,
	MS_PER_DAY,
	SALES_REFERENCE_DATE,
} from "../constants/sales.constants";
import type { SalesActivityType, SalesCompany } from "../types";
import { compareText, getInvoicedAmount } from "./salesFormatters";

export type WeekRange = { start: number; end: number };

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

/**
 * Monday 00:00 UTC up to the next Monday, for the week holding `referenceIso`.
 * Defaults to the seed data's reference date, so server and client agree.
 */
export function getWeekRange(referenceIso = SALES_REFERENCE_DATE): WeekRange {
	const reference = new Date(referenceIso);
	const daysSinceMonday = (reference.getUTCDay() + DAYS_PER_WEEK - 1) % DAYS_PER_WEEK;
	const start = Date.UTC(
		reference.getUTCFullYear(),
		reference.getUTCMonth(),
		reference.getUTCDate() - daysSinceMonday,
	);
	return { start, end: start + DAYS_PER_WEEK * MS_PER_DAY };
}

export function isInWeek(iso: string | undefined, week: WeekRange): boolean {
	if (!iso) return false;
	const time = new Date(iso).getTime();
	return !Number.isNaN(time) && time >= week.start && time < week.end;
}

function countActivities(
	company: SalesCompany,
	type: SalesActivityType,
	week?: WeekRange,
): number {
	return company.activities.filter(
		(activity) =>
			activity.type === type && (!week || isInWeek(activity.date, week)),
	).length;
}

/** Everything the sales dashboard shows, derived from the CRM companies. */
export function getSalesDashboardStats(
	companies: SalesCompany[],
	week: WeekRange = getWeekRange(),
): SalesDashboardStats {
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
