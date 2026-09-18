"use client";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { formatPercent } from "../../utils/salesFormatters";
import type { BookerResult } from "../../utils/salesStatistics";

const HEAD_CLASS = "h-11 px-5 text-xs font-medium uppercase tracking-wide text-slate-500";
const NUMBER_CLASS = "text-right tabular-nums";

/** Calls, booked meetings and the rate between them, per meeting booker. */
export function BookerResultsTable({ results }: { results: BookerResult[] }) {
	const active = results.filter(
		(booker) => booker.calls > 0 || booker.meetings > 0,
	);

	return (
		<section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs">
			<h2 className="border-b border-slate-200 px-5 py-4 text-base font-semibold text-slate-900">
				<Translate text={localizationConstants.salesStatsBookerResultsTitle} />
			</h2>

			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className={HEAD_CLASS}>
							<Translate text={localizationConstants.salesNavMeetingBooker} />
						</TableHead>
						{[
							localizationConstants.salesBookerColumnCalls,
							localizationConstants.salesKpiMeetingsBooked,
							localizationConstants.salesStatsBookingRate,
						].map((labelKey) => (
							<TableHead key={labelKey} className={`${HEAD_CLASS} ${NUMBER_CLASS}`}>
								<Translate text={labelKey} />
							</TableHead>
						))}
					</TableRow>
				</TableHeader>
				<TableBody>
					{active.length === 0 ? (
						<TableRow className="hover:bg-transparent">
							<TableCell colSpan={4} className="py-8 text-center text-sm text-slate-500">
								<Translate text={localizationConstants.salesStatsNoActivity} />
							</TableCell>
						</TableRow>
					) : (
						active.map((booker) => (
							<TableRow key={booker.name}>
								<TableCell className="px-5 py-3 font-medium text-slate-900">
									{booker.name}
								</TableCell>
								<TableCell className={NUMBER_CLASS}>{booker.calls}</TableCell>
								<TableCell className={NUMBER_CLASS}>{booker.meetings}</TableCell>
								<TableCell className={`${NUMBER_CLASS} px-5`}>
									{formatPercent(booker.bookingRate)}
								</TableCell>
							</TableRow>
						))
					)}
				</TableBody>
			</Table>
		</section>
	);
}
