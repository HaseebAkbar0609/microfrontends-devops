"use client";

import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import type { MeetingBookerStats } from "../../utils/meetingBooker";

const SECTION_TITLE_CLASS =
	"text-xs font-medium uppercase tracking-wide text-slate-500";
const ROW_CLASS = "flex items-center justify-between py-1 text-sm";

/** Bookings per day, per week and per booker. */
export function BookingStatisticsPanel({ stats }: { stats: MeetingBookerStats }) {
	const hasBookerActivity = stats.perBooker.some(
		(booker) => booker.calls > 0 || booker.meetings > 0,
	);

	return (
		<section className="rounded-xl border border-slate-200 bg-white shadow-2xs">
			<h2 className="border-b border-slate-200 px-5 py-4 text-base font-semibold text-slate-900">
				<Translate text={localizationConstants.salesBookerStatsTitle} />
			</h2>

			<div className="grid gap-6 px-5 py-4 @2xl:grid-cols-2">
				<div>
					<h3 className={SECTION_TITLE_CLASS}>
						<Translate text={localizationConstants.salesBookerStatsPerDay} />
					</h3>
					<ul className="mt-2">
						{stats.perDay.map((day) => (
							<li key={day.dateKey} className={ROW_CLASS}>
								<span className="tabular-nums text-slate-700">{day.dateKey}</span>
								<span className="tabular-nums text-slate-900">{day.count}</span>
							</li>
						))}
					</ul>
				</div>

				<div>
					<h3 className={SECTION_TITLE_CLASS}>
						<Translate text={localizationConstants.salesBookerStatsPerWeek} />
					</h3>
					{stats.perWeek.length === 0 ? (
						<p className="mt-2 text-sm text-slate-500">
							<Translate text={localizationConstants.salesBookerStatsNoData} />
						</p>
					) : (
						<ul className="mt-2">
							{stats.perWeek.map((week) => (
								<li key={week.week} className={ROW_CLASS}>
									<span className="tabular-nums text-slate-700">
										<Translate text={localizationConstants.salesBookerWeekPrefix} />{" "}
										{week.week}
									</span>
									<span className="tabular-nums text-slate-900">{week.count}</span>
								</li>
							))}
						</ul>
					)}
				</div>
			</div>

			<div className="border-t border-slate-200 px-5 py-4">
				<h3 className={SECTION_TITLE_CLASS}>
					<Translate text={localizationConstants.salesBookerStatsPerBooker} />
				</h3>

				{!hasBookerActivity ? (
					<p className="mt-2 text-sm text-slate-500">
						<Translate text={localizationConstants.salesBookerStatsNoActivity} />
					</p>
				) : (
					<ul className="mt-2">
						<li className="flex items-center justify-between py-1 text-xs uppercase tracking-wide text-slate-500">
							<span>
								<Translate text={localizationConstants.salesBookerColumnName} />
							</span>
							<span className="flex gap-6">
								<span className="w-16 text-right">
									<Translate text={localizationConstants.salesBookerColumnCalls} />
								</span>
								<span className="w-16 text-right">
									<Translate text={localizationConstants.salesDashboardColumnMeetings} />
								</span>
							</span>
						</li>
						{stats.perBooker.map((booker) => (
							<li key={booker.name} className={ROW_CLASS}>
								<span className="text-slate-700">{booker.name}</span>
								<span className="flex gap-6 tabular-nums text-slate-900">
									<span className="w-16 text-right">{booker.calls}</span>
									<span className="w-16 text-right">{booker.meetings}</span>
								</span>
							</li>
						))}
					</ul>
				)}
			</div>
		</section>
	);
}
