import {
	CalendarDays,
	ChevronLeft,
	ChevronRight,
	ClipboardList,
	Layers,
	Newspaper,
	Search,
	TrendingUp,
	Zap,
} from "lucide-react";
import React from "react";
import localizationConstants from "@/utils/translation/constants";
import {
	PlacedWidgetEntry,
	WidgetProps,
} from "@/features/widgetdashboard/types/dashboard";
import { Translate } from "@/utils/translation/translate";

const MiniBarChart = ({ title }: { title: string }) => {
	const bars = [22, 34, 18, 30];
	const months = ["Januari", "Februari", "Mars", "April"];
	return (
		<div className="flex flex-col gap-2 rounded-md border border-slate-200 bg-white p-3">
			<p className="text-center text-[11px] font-medium text-slate-700">
				<Translate text={title} />
			</p>
			<div className="flex h-20 items-end justify-around gap-2">
				{bars.map((value, i) => (
					<div
						key={i}
						className="flex w-6 flex-col items-center gap-1"
					>
						<div
							className="w-3 rounded-sm bg-blue-600"
							style={{ height: `${value * 2}px` }}
						/>
						<span className="text-[8px] text-slate-400">
							{months[i]}
						</span>
					</div>
				))}
			</div>
			<div className="flex items-center justify-center gap-1">
				<span className="h-2 w-2 rounded-[2px] bg-blue-600" />
				<span className="text-[9px] text-slate-500">
					<Translate text={localizationConstants.b2bChartRequests} />
				</span>
			</div>
		</div>
	);
};

const MiniLineChart = ({ title }: { title: string }) => {
	const months = ["Januari", "Februari", "Mars", "April"];
	return (
		<div className="flex flex-col gap-2 rounded-md border border-slate-200 bg-white p-3">
			<p className="text-center text-[11px] font-medium text-slate-700">
				<Translate text={title} />
			</p>
			<svg viewBox="0 0 120 60" className="h-20 w-full">
				<polyline
					points="8,42 44,34 80,40 112,14"
					fill="none"
					stroke="#f97316"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				{[
					[8, 42],
					[44, 34],
					[80, 40],
					[112, 14],
				].map(([x, y], i) => (
					<circle key={i} cx={x} cy={y} r="2.5" fill="#f97316" />
				))}
			</svg>
			<div className="flex justify-around">
				{months.map((m) => (
					<span key={m} className="text-[8px] text-slate-400">
						{m}
					</span>
				))}
			</div>
		</div>
	);
};

const WEEK_DAYS = ["Mån", "Tis", "Ons", "Tor", "Fre", "Lör", "Sön"];
const WEEK_DATES = [
	{ label: "30", muted: true },
	{ label: "1", muted: true },
	{ label: "2" },
	{ label: "3" },
	{ label: "4", active: true },
	{ label: "5" },
	{ label: "6" },
];

const MiniCalendar = () => (
	<div className="rounded-md border border-slate-200 bg-white p-3">
		<div className="mb-2 flex items-center justify-center gap-3">
			<ChevronLeft size={14} className="text-slate-500" />
			<span className="text-sm font-semibold text-slate-900">
				<Translate text={localizationConstants.b2bCalendar} />
			</span>
			<ChevronRight size={14} className="text-slate-500" />
		</div>
		<div className="grid grid-cols-7 gap-1 text-center">
			{WEEK_DAYS.map((day) => (
				<span
					key={day}
					className="text-[11px] font-semibold text-slate-700"
				>
					{day}
				</span>
			))}
			{WEEK_DATES.map((date) => (
				<div
					key={date.label}
					className="flex flex-col items-center gap-0.5"
				>
					<span
						className={
							date.muted
								? "flex h-7 w-7 items-center justify-center rounded-md text-xs text-slate-300"
								: "flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-xs font-medium text-slate-900"
						}
					>
						{date.label}
					</span>
					{date.active && (
						<span className="h-1 w-6 rounded-full bg-red-500" />
					)}
				</div>
			))}
		</div>
	</div>
);

export const B2B_SIDEBAR_WIDGET_MAP: Record<string, WidgetProps> = {
	emptyPage: { title: localizationConstants.emptyPageLabel, icon: Layers },

	availableAssignments: {
		title: localizationConstants.b2bAvailableAssignments,
		icon: Search,
		content: (
			<div className="space-y-1 text-sm text-slate-500">
				<div>
					<Translate text={localizationConstants.b2bRegion} /> :
					Stockholm
				</div>
				<div>
					<Translate text={localizationConstants.category} /> : Bygg,
					Mål, Städ
				</div>
				<div className="pt-2">
					<Translate text={localizationConstants.b2bAntal} /> : 25{" "}
					<Translate text={localizationConstants.b2bPieces} />
				</div>
			</div>
		),
	},

	myB2BAds: {
		title: localizationConstants.b2bMyAds,
		icon: ClipboardList,
		content: (
			<div className="space-y-1 text-sm text-slate-500">
				<div>
					<Translate text={localizationConstants.b2bActiveAds} />: 14{" "}
					<Translate text={localizationConstants.b2bPieces} />
				</div>
				<div>
					<Translate text={localizationConstants.b2bCompletedAds} />:
					20 <Translate text={localizationConstants.b2bPieces} />
				</div>
				<div>
					<Translate text={localizationConstants.b2bPausedAds} />: 4{" "}
					<Translate text={localizationConstants.b2bPieces} />
				</div>
			</div>
		),
	},

	latestActivity: {
		title: localizationConstants.b2bLatestActivity,
		icon: Zap,
		content: (
			<div className="space-y-1 text-sm text-slate-500">
				<div>2026-06-02 Offert Pelles bygg</div>
				<div>2026-07-03 Ny fråga / svar</div>
				<div>2026-07-15 Fråga</div>
				<div>2026-07-15 Offert El-Anders</div>
			</div>
		),
	},

	b2bCalendar: {
		title: localizationConstants.b2bCalendar,
		icon: CalendarDays,
		content: <MiniCalendar />,
	},

	statistics: {
		title: localizationConstants.b2bStatistics,
		icon: TrendingUp,
		content: (
			<div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
				<MiniBarChart
					title={localizationConstants.b2bChartRequestsPerMonth}
				/>
				<MiniBarChart
					title={localizationConstants.b2bChartRequestsPerMonth}
				/>
				<MiniLineChart
					title={localizationConstants.b2bChartDaysToAccept}
				/>
			</div>
		),
	},

	news: {
		title: localizationConstants.newsLabel,
		icon: Newspaper,
	},
};

export const B2B_INITIAL_WIDGETS: PlacedWidgetEntry[] = [
	{
		uid: "b2b-available-assignments",
		sidebarId: "availableAssignments",
		colSpanClass: "col-span-12 md:col-span-5",
		widgetProps: B2B_SIDEBAR_WIDGET_MAP.availableAssignments,
	},
	{
		uid: "b2b-my-ads",
		sidebarId: "myB2BAds",
		colSpanClass: "col-span-12 md:col-span-7",
		widgetProps: B2B_SIDEBAR_WIDGET_MAP.myB2BAds,
	},
	{
		uid: "b2b-latest-activity",
		sidebarId: "latestActivity",
		colSpanClass: "col-span-12 md:col-span-6",
		widgetProps: B2B_SIDEBAR_WIDGET_MAP.latestActivity,
	},
	{
		uid: "b2b-calendar",
		sidebarId: "b2bCalendar",
		colSpanClass: "col-span-12 md:col-span-6",
		widgetProps: B2B_SIDEBAR_WIDGET_MAP.b2bCalendar,
	},
	{
		uid: "b2b-statistics",
		sidebarId: "statistics",
		colSpanClass: "col-span-12",
		widgetProps: B2B_SIDEBAR_WIDGET_MAP.statistics,
	},
];
