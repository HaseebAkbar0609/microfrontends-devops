"use client";

import { useMemo } from "react";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { useSalesCompanies } from "../../hooks/useSalesCompanies";
import { useMeetingBookerNames } from "../../hooks/useSalesTeam";
import { useTodayKey } from "../../hooks/useTodayKey";
import { getSalesDashboardStats } from "../../utils/salesDashboard";
import { getMeetingBookerStats } from "../../utils/meetingBooker";
import { formatCurrency, formatDate } from "../../utils/salesFormatters";
import { SalesKpiCards } from "./SalesKpiCards";
import { SalesMeetingBookersTable } from "./SalesMeetingBookersTable";
import { SalesSellersTable } from "./SalesSellersTable";
import { SalesWeekList } from "./SalesWeekList";

/** Landing page of the sales system: this week's figures at a glance. */
export default function SalesDashboardPage() {
	const { companies } = useSalesCompanies();
	const bookerNames = useMeetingBookerNames();
	const todayKey = useTodayKey();
	// Both derive their week from the same day, so every figure on the page
	// describes the same Monday-to-Sunday week.
	const stats = useMemo(
		() => getSalesDashboardStats(companies, todayKey),
		[companies, todayKey],
	);
	const bookers = useMemo(
		() => getMeetingBookerStats(companies, todayKey, bookerNames).perBooker,
		[companies, todayKey, bookerNames],
	);

	const meetingRows = useMemo(
		() =>
			stats.meetings.map((meeting) => ({
				id: meeting.id,
				primary: meeting.companyName,
				secondary: meeting.text,
				trailing: formatDate(meeting.date),
			})),
		[stats.meetings],
	);

	const dealRows = useMemo(
		() =>
			stats.deals.map((deal) => ({
				id: deal.id,
				primary: deal.companyName,
				secondary: deal.orderNumber,
				trailing: formatCurrency(deal.amount),
			})),
		[stats.deals],
	);

	return (
		<div className="@container flex min-h-0 flex-1 flex-col overflow-y-auto bg-slate-50">
			<header className="border-b border-slate-200 bg-white px-6 py-4">
				<h1 className="text-2xl font-semibold text-slate-900">
					<Translate text={localizationConstants.salesNavDashboard} />
				</h1>
				<p className="text-sm text-slate-500">
					<Translate text={localizationConstants.salesDashboardSubtitle} />
				</p>
			</header>

			<div className="flex flex-col gap-6 p-6">
				<SalesKpiCards stats={stats} />

				<div className="grid grid-cols-1 gap-6 @5xl:grid-cols-2">
					<SalesSellersTable sellers={stats.sellers} />
					<SalesMeetingBookersTable bookers={bookers} />
					<SalesWeekList
						titleKey={localizationConstants.salesDashboardMeetingsWeekTitle}
						emptyKey={localizationConstants.salesDashboardMeetingsWeekEmpty}
						rows={meetingRows}
					/>
					<SalesWeekList
						titleKey={localizationConstants.salesKpiDealsThisWeek}
						emptyKey={localizationConstants.salesDashboardDealsWeekEmpty}
						rows={dealRows}
					/>
				</div>
			</div>
		</div>
	);
}
