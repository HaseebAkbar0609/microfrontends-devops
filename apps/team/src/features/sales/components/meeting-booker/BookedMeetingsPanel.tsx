"use client";

import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import type { ActivityRow } from "../../utils/meetingBooker";
import { formatDateTime } from "../../utils/salesFormatters";

/** Upcoming and past bookings, earliest first. */
export function BookedMeetingsPanel({ meetings }: { meetings: ActivityRow[] }) {
	return (
		<section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs">
			<h2 className="border-b border-slate-200 px-5 py-4 text-base font-semibold text-slate-900">
				<Translate text={localizationConstants.salesBookerMeetingsTitle} />
			</h2>

			{meetings.length === 0 ? (
				<p className="px-5 py-8 text-center text-sm text-slate-500">
					<Translate text={localizationConstants.salesBookerMeetingsEmpty} />
				</p>
			) : (
				<ul className="divide-y divide-slate-100">
					{meetings.map((row) => (
						<li
							key={row.id}
							className="flex items-center justify-between gap-4 px-5 py-3"
						>
							<div className="min-w-0">
								<p className="truncate text-sm font-medium text-slate-900">
									{row.companyName}
								</p>
								<p className="truncate text-xs text-slate-500">
									{row.activity.booker || row.activity.text}
								</p>
							</div>
							<span className="shrink-0 text-sm tabular-nums text-slate-700">
								{formatDateTime(row.activity.meetingAt)}
							</span>
						</li>
					))}
				</ul>
			)}
		</section>
	);
}
