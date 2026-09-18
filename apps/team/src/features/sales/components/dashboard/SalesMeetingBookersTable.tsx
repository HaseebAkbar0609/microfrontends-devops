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
import type { BookerStats } from "../../utils/meetingBooker";
import { SalesDashboardCard } from "./SalesDashboardCard";

const HEAD_CLASS = "h-11 px-5 text-xs font-medium uppercase tracking-wide text-slate-500";
const NUMBER_CLASS = "text-right tabular-nums";

const NUMBER_COLUMNS = [
	localizationConstants.salesDashboardColumnCallsWeek,
	localizationConstants.salesDashboardColumnCallsTotal,
	localizationConstants.salesDashboardColumnMeetingsWeek,
	localizationConstants.salesDashboardColumnMeetingsTotal,
];

/** Calls and bookings per meeting booker, busiest first. */
export function SalesMeetingBookersTable({ bookers }: { bookers: BookerStats[] }) {
	const active = bookers.filter(
		(booker) => booker.calls > 0 || booker.meetings > 0,
	);

	return (
		<SalesDashboardCard titleKey={localizationConstants.salesNavMeetingBooker}>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className={HEAD_CLASS}>
							<Translate text={localizationConstants.salesNavMeetingBooker} />
						</TableHead>
						{NUMBER_COLUMNS.map((labelKey) => (
							<TableHead key={labelKey} className={`${HEAD_CLASS} ${NUMBER_CLASS}`}>
								<Translate text={labelKey} />
							</TableHead>
						))}
					</TableRow>
				</TableHeader>
				<TableBody>
					{active.length === 0 ? (
						<TableRow className="hover:bg-transparent">
							<TableCell
								colSpan={NUMBER_COLUMNS.length + 1}
								className="py-8 text-center text-sm text-slate-500"
							>
								<Translate text={localizationConstants.salesDashboardBookersEmpty} />
							</TableCell>
						</TableRow>
					) : (
						active.map((booker) => (
							<TableRow key={booker.name}>
								<TableCell className="px-5 py-3 font-medium text-slate-900">
									{booker.name}
								</TableCell>
								<TableCell className={NUMBER_CLASS}>{booker.callsWeek}</TableCell>
								<TableCell className={NUMBER_CLASS}>{booker.calls}</TableCell>
								<TableCell className={NUMBER_CLASS}>{booker.meetingsWeek}</TableCell>
								<TableCell className={`${NUMBER_CLASS} px-5`}>
									{booker.meetings}
								</TableCell>
							</TableRow>
						))
					)}
				</TableBody>
			</Table>
		</SalesDashboardCard>
	);
}
