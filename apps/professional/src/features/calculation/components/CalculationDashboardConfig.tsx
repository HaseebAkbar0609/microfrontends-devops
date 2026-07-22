import {
	BarChart3,
	Battery,
	CalendarDays,
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	ChevronUp,
	CircleDollarSign,
	Construction,
	Layers,
	Newspaper,
	Trophy,
} from "lucide-react";
import React from "react";
import localizationConstants from "@/utils/translation/constants";
import {
	PlacedWidgetEntry,
	WidgetProps,
} from "@/features/widgetdashboard/types/dashboard";
import { Translate } from "@/utils/translation/translate";

const MONTHS = ["Januari", "Februari", "Mars", "April"];

const MiniPieChart = ({
	title,
	legend,
}: {
	title: string;
	legend: { label: string; color: string }[];
}) => (
	<div className="flex flex-col gap-2 rounded-md border border-slate-200 bg-white p-3">
		<p className="text-center text-[11px] font-medium text-slate-700">
			<Translate text={title} />
		</p>
		<svg viewBox="0 0 32 32" className="mx-auto h-20 w-20 -rotate-90">
			<circle
				cx="16"
				cy="16"
				r="8"
				fill="none"
				strokeWidth="16"
				stroke={legend[0]?.color}
				strokeDasharray="20.1 50.27"
			/>
			<circle
				cx="16"
				cy="16"
				r="8"
				fill="none"
				strokeWidth="16"
				stroke={legend[1]?.color}
				strokeDasharray="15.1 50.27"
				strokeDashoffset="-20.1"
			/>
			<circle
				cx="16"
				cy="16"
				r="8"
				fill="none"
				strokeWidth="16"
				stroke={legend[2]?.color}
				strokeDasharray="10.05 50.27"
				strokeDashoffset="-35.2"
			/>
			<circle
				cx="16"
				cy="16"
				r="8"
				fill="none"
				strokeWidth="16"
				stroke={legend[3]?.color}
				strokeDasharray="5.02 50.27"
				strokeDashoffset="-45.25"
			/>
		</svg>
		<div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5">
			{legend.map((entry) => (
				<span key={entry.label} className="flex items-center gap-1">
					<span
						className="h-2 w-2 rounded-[2px]"
						style={{ backgroundColor: entry.color }}
					/>
					<span className="text-[9px] text-slate-500">
						<Translate text={entry.label} />
					</span>
				</span>
			))}
		</div>
	</div>
);

const MiniGroupedBarChart = ({
	title,
	legend,
	values,
}: {
	title: string;
	legend: { label: string; color: string }[];
	values: number[][];
}) => (
	<div className="flex flex-col gap-2 rounded-md border border-slate-200 bg-white p-3">
		<p className="text-center text-[11px] font-medium text-slate-700">
			<Translate text={title} />
		</p>
		<div className="flex h-20 items-end justify-around gap-2">
			{values.map((group, monthIndex) => (
				<div
					key={monthIndex}
					className="flex flex-col items-center gap-1"
				>
					<div className="flex items-end gap-0.5">
						{group.map((value, seriesIndex) => (
							<div
								key={seriesIndex}
								className="w-2 rounded-sm"
								style={{
									height: `${value * 5}px`,
									backgroundColor: legend[seriesIndex]?.color,
								}}
							/>
						))}
					</div>
					<span className="text-[8px] text-slate-400">
						{MONTHS[monthIndex]}
					</span>
				</div>
			))}
		</div>
		<div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5">
			{legend.map((entry) => (
				<span key={entry.label} className="flex items-center gap-1">
					<span
						className="h-2 w-2 rounded-[2px]"
						style={{ backgroundColor: entry.color }}
					/>
					<span className="text-[9px] text-slate-500">
						<Translate text={entry.label} />
					</span>
				</span>
			))}
		</div>
	</div>
);

const WEEK_DAYS = ["Mån", "Tis", "Ons", "Tor", "Fre", "Lör", "Sön"];
const CALENDAR_DATES = [
	{ label: "30", muted: true },
	{ label: "1", muted: true },
	{ label: "2" },
	{ label: "3" },
	{ label: "4" },
	{ label: "5" },
	{ label: "6" },
	{ label: "7" },
	{ label: "8" },
	{ label: "9" },
	{ label: "10" },
	{ label: "11", active: true },
	{ label: "12" },
	{ label: "13" },
];

const MiniCalendar = () => (
	<div className="rounded-md border border-slate-200 bg-white p-3">
		<div className="mb-2 flex items-center justify-center gap-3">
			<ChevronLeft size={14} className="text-slate-500" />
			<span className="text-sm font-semibold text-slate-900">
				<Translate text={localizationConstants.calcCalendar} />
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
			{CALENDAR_DATES.map((date, index) => (
				<span
					key={`${date.label}-${index}`}
					className={
						date.active
							? "flex h-7 w-7 items-center justify-center rounded-md bg-red-600 text-xs font-semibold text-white"
							: date.muted
								? "flex h-7 w-7 items-center justify-center rounded-md text-xs text-slate-300"
								: "flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-xs font-medium text-slate-900"
					}
				>
					{date.label}
				</span>
			))}
		</div>
	</div>
);

export const CALCULATION_SIDEBAR_WIDGET_MAP: Record<string, WidgetProps> = {
	emptyPage: { title: localizationConstants.emptyPageLabel, icon: Layers },

	calcStatus: {
		title: localizationConstants.calcStatus,
		icon: Battery,
		content: (
			<div className="space-y-1 text-sm text-slate-500">
				<div>
					<Translate text={localizationConstants.calcActive} />: 5{" "}
					<Translate text={localizationConstants.b2bPieces} />
				</div>
				<div>
					<Translate text={localizationConstants.calcUpcoming} />: 4{" "}
					<Translate text={localizationConstants.b2bPieces} />
				</div>
				<div>
					<Translate text={localizationConstants.calcCompleted} />: 15{" "}
					<Translate text={localizationConstants.b2bPieces} />
				</div>
			</div>
		),
	},

	calcCalendarWidget: {
		title: localizationConstants.calcCalendarWidget,
		icon: CalendarDays,
		content: (
			<div className="flex items-start gap-2 text-sm text-slate-500">
				<div className="flex flex-col items-center gap-6 pt-1">
					<ChevronUp size={14} className="text-slate-400" />
					<ChevronDown size={14} className="text-slate-400" />
				</div>
				<div className="space-y-1">
					<div>
						<Translate text={localizationConstants.calcNo} />:
						2026-004 - Ombyggnad badrum :
					</div>
					<div>
						<Translate
							text={localizationConstants.calcInternalReviewDate}
						/>{" "}
						: 2026-08-15
					</div>
					<div>
						<Translate
							text={localizationConstants.calcApprovalDate}
						/>
						: 2026-09-01
					</div>
					<div>
						<Translate
							text={localizationConstants.calcLastOfferDate}
						/>
						: 2026-09-10
					</div>
				</div>
			</div>
		),
	},

	wonLost: {
		title: localizationConstants.calcWonLost,
		icon: Trophy,
		content: (
			<div className="space-y-1 text-sm text-slate-500">
				<div>
					<Translate text={localizationConstants.calcWon} />: 8{" "}
					<Translate text={localizationConstants.b2bPieces} />
				</div>
				<div>
					<Translate text={localizationConstants.calcLost} />. 28{" "}
					<Translate text={localizationConstants.b2bPieces} />
				</div>
			</div>
		),
	},

	calcCalendar: {
		title: localizationConstants.calcCalendar,
		icon: CalendarDays,
		content: <MiniCalendar />,
	},

	totalValue: {
		title: localizationConstants.calcTotalValue,
		icon: CircleDollarSign,
		content: (
			<div className="space-y-1 text-sm text-slate-500">
				<div>
					<Translate
						text={localizationConstants.calcTotalSalesValue}
					/>
				</div>
				<div>
					<Translate text={localizationConstants.calcTotalCost} />
				</div>
				<div>
					<Translate text={localizationConstants.calcTotalProfit} />
				</div>
				<div>
					<Translate
						text={localizationConstants.calcValueThisMonth}
					/>
				</div>
				<div>
					<Translate text={localizationConstants.calcValueThisYear} />
				</div>
			</div>
		),
	},

	costDistribution: {
		title: localizationConstants.calcCostDistribution,
		icon: Construction,
		content: (
			<div className="space-y-1 text-sm text-slate-500">
				<div>
					<Translate text={localizationConstants.calcMaterialCost} />
				</div>
				<div>
					<Translate text={localizationConstants.calcLaborCost} />
				</div>
				<div>
					<Translate
						text={localizationConstants.calcSubcontractors}
					/>
				</div>
				<div>
					<Translate text={localizationConstants.calcMachines} />
				</div>
			</div>
		),
	},

	statistics: {
		title: localizationConstants.calcStatistics,
		icon: BarChart3,
		content: (
			<div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
				<MiniPieChart
					title={localizationConstants.calcChartCostDistribution}
					legend={[
						{
							label: localizationConstants.calcMaterialCost,
							color: "#2563eb",
						},
						{
							label: localizationConstants.calcLaborCost,
							color: "#f97316",
						},
						{
							label: localizationConstants.calcSubcontractors,
							color: "#16a34a",
						},
						{
							label: localizationConstants.calcMachines,
							color: "#64748b",
						},
					]}
				/>
				<MiniGroupedBarChart
					title={localizationConstants.calcChartObjects}
					legend={[
						{
							label: localizationConstants.calcKalkyl,
							color: "#2563eb",
						},
						{
							label: localizationConstants.calcCompleted,
							color: "#f97316",
						},
						{
							label: localizationConstants.calcLost,
							color: "#16a34a",
						},
					]}
					values={[
						[4, 3, 1],
						[6, 4, 2],
						[5, 6, 3],
						[10, 7, 5],
					]}
				/>
				<MiniGroupedBarChart
					title={localizationConstants.calcChartPerCategory}
					legend={[
						{ label: "B2B", color: "#2563eb" },
						{ label: "B2C", color: "#f97316" },
						{ label: "Express", color: "#16a34a" },
					]}
					values={[
						[3, 4, 2],
						[6, 5, 3],
						[5, 6, 4],
						[10, 8, 5],
					]}
				/>
			</div>
		),
	},

	news: {
		title: localizationConstants.newsLabel,
		icon: Newspaper,
	},
};

export const CALCULATION_INITIAL_WIDGETS: PlacedWidgetEntry[] = [
	{
		uid: "calc-status",
		sidebarId: "calcStatus",
		colSpanClass: "col-span-12 md:col-span-5",
		widgetProps: CALCULATION_SIDEBAR_WIDGET_MAP.calcStatus,
	},
	{
		uid: "calc-calendar-widget",
		sidebarId: "calcCalendarWidget",
		colSpanClass: "col-span-12 md:col-span-7",
		widgetProps: CALCULATION_SIDEBAR_WIDGET_MAP.calcCalendarWidget,
	},
	{
		uid: "calc-won-lost",
		sidebarId: "wonLost",
		colSpanClass: "col-span-12 md:col-span-5",
		widgetProps: CALCULATION_SIDEBAR_WIDGET_MAP.wonLost,
	},
	{
		uid: "calc-calendar",
		sidebarId: "calcCalendar",
		colSpanClass: "col-span-12 md:col-span-7",
		widgetProps: CALCULATION_SIDEBAR_WIDGET_MAP.calcCalendar,
	},
	{
		uid: "calc-total-value",
		sidebarId: "totalValue",
		colSpanClass: "col-span-12 md:col-span-6",
		widgetProps: CALCULATION_SIDEBAR_WIDGET_MAP.totalValue,
	},
	{
		uid: "calc-cost-distribution",
		sidebarId: "costDistribution",
		colSpanClass: "col-span-12 md:col-span-6",
		widgetProps: CALCULATION_SIDEBAR_WIDGET_MAP.costDistribution,
	},
	{
		uid: "calc-statistics",
		sidebarId: "statistics",
		colSpanClass: "col-span-12",
		widgetProps: CALCULATION_SIDEBAR_WIDGET_MAP.statistics,
	},
];
