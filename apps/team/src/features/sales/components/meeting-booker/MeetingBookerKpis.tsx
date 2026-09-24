"use client";

import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import type { MeetingBookerStats } from "../../utils/meetingBooker";

type MeetingBookerKpisProps = {
	stats: MeetingBookerStats;
	callListCount: number;
};

/** The four counters across the top of the meeting booker workspace. */
export function MeetingBookerKpis({ stats, callListCount }: MeetingBookerKpisProps) {
	const cards = [
		{
			id: "calls-today",
			labelKey: localizationConstants.salesBookerKpiCallsToday,
			value: stats.callsToday,
			accentClassName: "bg-teal-50 text-teal-700",
			hint: (
				<>
					{stats.callsTotal}{" "}
					<Translate text={localizationConstants.salesBookerKpiCallsTotalSuffix} />
				</>
			),
		},
		{
			id: "meetings-today",
			labelKey: localizationConstants.salesBookerKpiMeetingsToday,
			value: stats.meetingsToday,
			accentClassName: "bg-emerald-50 text-emerald-700",
			hint: null,
		},
		{
			id: "meetings-week",
			labelKey: localizationConstants.salesBookerKpiMeetingsWeek,
			value: stats.meetingsThisWeek,
			accentClassName: "bg-slate-100 text-slate-700",
			hint: null,
		},
		{
			id: "call-list",
			labelKey: localizationConstants.salesBookerKpiPhoneList,
			value: callListCount,
			accentClassName: "bg-amber-50 text-amber-600",
			hint: null,
		},
	];

	return (
		<div className="grid grid-cols-1 gap-4 @xl:grid-cols-2 @5xl:grid-cols-4">
			{cards.map((card) => (
				<div
					key={card.id}
					className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs"
				>
					<span
						className={`inline-flex rounded-md px-2 py-0.5 text-sm font-medium ${card.accentClassName}`}
					>
						<Translate text={card.labelKey} />
					</span>
					<p className="mt-3 text-3xl font-semibold tabular-nums text-slate-900">
						{card.value}
					</p>
					<p className="text-sm text-slate-500">{card.hint}</p>
				</div>
			))}
		</div>
	);
}
