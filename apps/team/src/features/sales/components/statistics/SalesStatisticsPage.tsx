"use client";

import { useEffect, useMemo, useState } from "react";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { SALES_REFERENCE_DATE } from "../../constants/sales.constants";
import { useSalesCompanies } from "../../hooks/useSalesCompanies";
import { useMeetingBookerNames } from "../../hooks/useSalesTeam";
import { getSalesStatistics } from "../../utils/salesStatistics";
import { BookerResultsTable } from "./BookerResultsTable";
import { StatBarList } from "./StatBarList";
import { StatKpis } from "./StatKpis";

/** Pipeline, activity and results across the whole sales system. */
export default function SalesStatisticsPage() {
	const { companies } = useSalesCompanies();
	const bookerNames = useMeetingBookerNames();

	// The seed's fixed date renders first so server and client markup match,
	// then the real day takes over once mounted.
	const [todayKey, setTodayKey] = useState(() => SALES_REFERENCE_DATE.slice(0, 10));
	useEffect(() => {
		setTodayKey(new Date().toISOString().slice(0, 10));
	}, []);

	const statistics = useMemo(
		() => getSalesStatistics(companies, todayKey, bookerNames),
		[companies, todayKey, bookerNames],
	);

	return (
		<div className="@container flex min-h-0 flex-1 flex-col overflow-y-auto bg-slate-50">
			<header className="border-b border-slate-200 bg-white px-6 py-4">
				<h1 className="text-2xl font-semibold text-slate-900">
					<Translate text={localizationConstants.salesNavStatistics} />
				</h1>
				<p className="text-sm text-slate-500">
					<Translate text={localizationConstants.salesStatsSubtitle} />
				</p>
			</header>

			<div className="flex flex-col gap-5 p-6">
				<StatKpis statistics={statistics} />

				<div className="grid grid-cols-1 gap-5 @5xl:grid-cols-2">
					<StatBarList
						titleKey={localizationConstants.salesStatsPipelineTitle}
						rows={statistics.pipeline}
					/>
					<StatBarList
						titleKey={localizationConstants.salesStatsMeetingsPerDay}
						rows={statistics.meetingsPerDay}
					/>
					<StatBarList
						titleKey={localizationConstants.salesStatsCallsPerDay}
						rows={statistics.callsPerDay}
					/>
					<StatBarList
						titleKey={localizationConstants.salesStatsMeetingsPerWeek}
						rows={statistics.meetingsPerWeek}
						rowLabelPrefixKey={localizationConstants.salesStatsWeekColumn}
					/>
					<StatBarList
						titleKey={localizationConstants.salesStatsCustomersByCategory}
						rows={statistics.byCategory}
					/>
					<StatBarList
						titleKey={localizationConstants.salesStatsCustomersByRegion}
						rows={statistics.byRegion}
					/>
				</div>

				<BookerResultsTable results={statistics.bookerResults} />
			</div>
		</div>
	);
}
