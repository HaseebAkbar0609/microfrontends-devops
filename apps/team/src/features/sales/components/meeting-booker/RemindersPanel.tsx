"use client";

import { BellRing } from "lucide-react";
import { Button } from "@/components/ui/button";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import type { ReminderSummary } from "../../utils/meetingBooker";
import { formatDate } from "../../utils/salesFormatters";

type RemindersPanelProps = {
	reminders: ReminderSummary;
	todayKey: string;
	onComplete: (companyId: string, activityId: string) => void;
};

/** Open follow-ups, overdue and upcoming, earliest date first. */
export function RemindersPanel({ reminders, todayKey, onComplete }: RemindersPanelProps) {
	return (
		<section className="rounded-xl border border-slate-200 bg-white shadow-2xs">
			<div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-5 py-4">
				<h2 className="inline-flex items-center gap-2 text-base font-semibold text-slate-900">
					<BellRing className="h-4 w-4 text-slate-500" />
					<Translate text={localizationConstants.salesBookerRemindersTitle} />
				</h2>
				<p className="text-sm text-slate-500 tabular-nums">
					{reminders.overdue}{" "}
					<Translate text={localizationConstants.salesBookerRemindersOverdue} /> ·{" "}
					{reminders.today}{" "}
					<Translate text={localizationConstants.salesBookerRemindersToday} /> ·{" "}
					{reminders.total}{" "}
					<Translate text={localizationConstants.salesBookerRemindersTotal} />
				</p>
			</div>

			{reminders.rows.length === 0 ? (
				<p className="px-5 py-6 text-sm text-slate-500">
					<Translate text={localizationConstants.salesBookerRemindersEmpty} />
				</p>
			) : (
				<ul className="divide-y divide-slate-100">
					{reminders.rows.map((row) => {
						const isOverdue = row.activity.followUpAt < todayKey;

						return (
							<li
								key={row.rowKey}
								className="flex flex-wrap items-center justify-between gap-3 px-5 py-3"
							>
								<div className="min-w-0">
									<p className="truncate text-sm font-medium text-slate-900">
										{row.companyName}
									</p>
									<p className="truncate text-xs text-slate-500">
										{row.activity.text}
									</p>
								</div>
								<div className="flex items-center gap-3">
									<span
										className={`text-sm tabular-nums ${isOverdue ? "font-medium text-red-600" : "text-slate-600"}`}
									>
										{formatDate(row.activity.followUpAt)}
									</span>
									<Button
										type="button"
										variant="outline"
										className="h-9 active:scale-[0.98]"
										onClick={() => onComplete(row.companyId, row.id)}
									>
										<Translate
											text={localizationConstants.salesBookerReminderDoneButton}
										/>
									</Button>
								</div>
							</li>
						);
					})}
				</ul>
			)}
		</section>
	);
}
