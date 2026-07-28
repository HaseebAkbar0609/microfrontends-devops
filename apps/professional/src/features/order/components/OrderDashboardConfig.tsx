import {
	BarChart3,
	Bell,
	Bot,
	CalendarDays,
	CalendarClock,
	CircleDollarSign,
	ClipboardList,
	HardHat,
	Image as ImageIcon,
	Layers,
	Newspaper,
	PieChart,
	Plus,
	Search,
	ShieldCheck,
	Timer,
	TrafficCone,
	Zap,
} from "lucide-react";
import localizationConstants from "@/utils/translation/constants";
import {
	PlacedWidgetEntry,
	WidgetProps,
} from "@/features/widgetdashboard/types/dashboard";
import {
	WidgetBarRow,
	WidgetContent as Content,
	WidgetImagePlaceholder,
	WidgetListItem,
	WidgetMockTag as MockTag,
	WidgetRow as Row,
} from "@/features/widgetdashboard/components/WidgetContent";
import { Translate } from "@/utils/translation/translate";

const QuickAction = ({
	icon: Icon,
	label,
}: {
	icon: typeof Plus;
	label: string;
}) => (
	<button
		type="button"
		className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700"
	>
		<Icon size={12} />
		<Translate text={label} />
	</button>
);

export const ORDER_SIDEBAR_WIDGET_MAP: Record<string, WidgetProps> = {
	emptyPage: { title: localizationConstants.emptyPageLabel, icon: Layers },

	orderOverview: {
		title: localizationConstants.orderWidgetOverviewTitle,
		icon: PieChart,
		content: (
			<Content>
				<Row
					label={localizationConstants.orderWidgetOverviewTotal}
					value="24"
				/>
				<Row
					label={localizationConstants.orderWidgetOverviewActive}
					value="18"
				/>
				<Row
					label={localizationConstants.orderWidgetOverviewCompleted}
					value="5"
				/>
				<Row
					label={localizationConstants.orderWidgetOverviewCancelled}
					value="1"
				/>
				<Row
					label={localizationConstants.orderWidgetOverviewUpdated}
					value={
						<Translate
							text={
								localizationConstants.orderWidgetOverviewUpdatedValue
							}
						/>
					}
				/>
				<MockTag />
			</Content>
		),
	},

	orderStatus: {
		title: localizationConstants.orderWidgetStatusTitle,
		icon: TrafficCone,
		content: (
			<Content>
				<WidgetBarRow
					label={localizationConstants.orderWidgetStatusOngoing}
					percent={42}
					value="10"
					color="bg-green-500"
				/>
				<WidgetBarRow
					label={
						localizationConstants.orderWidgetStatusWaitingMaterial
					}
					percent={17}
					value="4"
					color="bg-amber-400"
				/>
				<WidgetBarRow
					label={localizationConstants.orderWidgetStatusDelayed}
					percent={8}
					value="2"
					color="bg-red-500"
				/>
				<WidgetBarRow
					label={localizationConstants.orderWidgetStatusNotStarted}
					percent={33}
					value="8"
					color="bg-slate-400"
				/>
				<Row
					label={localizationConstants.orderWidgetStatusUpdated}
					value="2026-07-24"
				/>
				<MockTag />
			</Content>
		),
	},

	orderDirect: {
		title: localizationConstants.orderWidgetDirectTitle,
		icon: Bell,
		content: (
			<Content>
				<div className="flex flex-wrap gap-1.5">
					<QuickAction
						icon={Plus}
						label={localizationConstants.orderWidgetDirectNew}
					/>
					<QuickAction
						icon={Search}
						label={localizationConstants.orderWidgetDirectSearch}
					/>
					<QuickAction
						icon={ClipboardList}
						label={localizationConstants.orderWidgetDirectLatest}
					/>
				</div>
				<p className="pt-1 text-amber-600">
					3{" "}
					<Translate
						text={localizationConstants.orderWidgetDirectNotice}
					/>
				</p>
				<MockTag />
			</Content>
		),
	},

	orderToday: {
		title: localizationConstants.orderWidgetTodayTitle,
		icon: CalendarDays,
		content: (
			<Content>
				<WidgetListItem
					title={localizationConstants.orderWidgetTodayOrder1}
					meta={
						<>
							Byggfirma AB ·{" "}
							<Translate
								text={
									localizationConstants.orderWidgetStatusOngoing
								}
							/>
						</>
					}
				/>
				<WidgetListItem
					title={localizationConstants.orderWidgetTodayOrder2}
					meta={
						<>
							Fastighets AB ·{" "}
							<Translate
								text={
									localizationConstants.orderWidgetTodayStatusWaiting
								}
							/>
						</>
					}
				/>
				<WidgetListItem
					title={localizationConstants.orderWidgetTodayOrder3}
					meta={
						<>
							Bostadsrättsförening X ·{" "}
							<Translate
								text={
									localizationConstants.orderWidgetStatusNotStarted
								}
							/>
						</>
					}
				/>
				<Row
					label={localizationConstants.orderWidgetTodayTotal}
					value="3"
				/>
				<MockTag />
			</Content>
		),
	},

	orderCalendar: {
		title: localizationConstants.orderWidgetCalendarTitle,
		icon: CalendarClock,
		content: (
			<Content>
				<p className="font-medium text-slate-700">
					<Translate
						text={localizationConstants.orderWidgetCalendarWeek}
					/>
				</p>
				<Row
					label={localizationConstants.orderWidgetCalendarMonday}
					value="2"
				/>
				<Row
					label={localizationConstants.orderWidgetCalendarTuesday}
					value="3"
				/>
				<Row
					label={localizationConstants.orderWidgetCalendarWednesday}
					value="1"
				/>
				<Row
					label={localizationConstants.orderWidgetCalendarThursday}
					value="4"
				/>
				<Row
					label={localizationConstants.orderWidgetCalendarFriday}
					value="2"
				/>
				<Row
					label={localizationConstants.orderWidgetCalendarUpcoming}
					value="5"
				/>
				<MockTag />
			</Content>
		),
	},

	orderValue: {
		title: localizationConstants.orderWidgetValueTitle,
		icon: CircleDollarSign,
		content: (
			<Content>
				<Row
					label={localizationConstants.orderWidgetValueTotal}
					value="1 250 000 kr"
				/>
				<Row
					label={localizationConstants.orderWidgetValueInvoiced}
					value="780 000 kr"
				/>
				<Row
					label={localizationConstants.orderWidgetValueNotInvoiced}
					value="470 000 kr"
				/>
				<Row
					label={localizationConstants.orderWidgetValueAverage}
					value="52 083 kr"
				/>
				<Row
					label={localizationConstants.orderWidgetValueHighest}
					value="320 000 kr"
				/>
				<MockTag />
			</Content>
		),
	},

	orderResources: {
		title: localizationConstants.orderWidgetResourcesTitle,
		icon: HardHat,
		content: (
			<Content>
				<Row
					label={localizationConstants.orderWidgetResourcesTotal}
					value="12"
				/>
				<WidgetBarRow
					label={localizationConstants.orderWidgetResourcesBooked}
					percent={75}
					value="9 (75 %)"
					color="bg-blue-600"
				/>
				<Row
					label={localizationConstants.orderWidgetResourcesAvailable}
					value="3"
				/>
				<Row
					label={localizationConstants.orderWidgetResourcesOvertime}
					value="2"
				/>
				<Row
					label={localizationConstants.orderWidgetResourcesNext}
					value={
						<Translate
							text={
								localizationConstants.orderWidgetResourcesNextValue
							}
						/>
					}
				/>
				<MockTag />
			</Content>
		),
	},

	orderTimeReporting: {
		title: localizationConstants.orderWidgetTimeTitle,
		icon: Timer,
		content: (
			<Content>
				<Row
					label={localizationConstants.orderWidgetTimeToday}
					value="42 h"
				/>
				<Row
					label={localizationConstants.orderWidgetTimeApproved}
					value="38 h"
				/>
				<Row
					label={localizationConstants.orderWidgetTimeNotApproved}
					value="4 h"
				/>
				<Row
					label={localizationConstants.orderWidgetTimeMostActive}
					value="Johan A. – 9 h"
				/>
				<Row
					label={localizationConstants.orderWidgetTimeWeek}
					value="187 / 200 h"
				/>
				<MockTag />
			</Content>
		),
	},

	orderAta: {
		title: localizationConstants.orderWidgetAtaTitle,
		icon: Plus,
		content: (
			<Content>
				<Row
					label={localizationConstants.orderWidgetAtaActive}
					value="6"
				/>
				<Row
					label={localizationConstants.orderWidgetAtaAwaiting}
					value="3"
				/>
				<Row
					label={localizationConstants.orderWidgetAtaApproved}
					value="2"
				/>
				<Row
					label={localizationConstants.orderWidgetAtaRejected}
					value="1"
				/>
				<Row
					label={localizationConstants.orderWidgetAtaValue}
					value="145 000 kr"
				/>
				<MockTag />
			</Content>
		),
	},

	orderKma: {
		title: localizationConstants.orderWidgetKmaTitle,
		icon: ShieldCheck,
		content: (
			<Content>
				<Row
					label={localizationConstants.orderWidgetKmaLatest}
					value="2026-07-22"
				/>
				<Row
					label={localizationConstants.orderWidgetKmaApproved}
					value="8/10"
				/>
				<Row
					label={localizationConstants.orderWidgetKmaDeviations}
					value={
						<Translate
							text={
								localizationConstants.orderWidgetKmaDeviationsValue
							}
						/>
					}
				/>
				<Row
					label={localizationConstants.orderWidgetKmaSecureCheck}
					value={
						<Translate
							text={
								localizationConstants.orderWidgetKmaSecureCheckValue
							}
						/>
					}
				/>
				<Row
					label={localizationConstants.orderWidgetKmaNext}
					value="2026-07-28"
				/>
				<MockTag />
			</Content>
		),
	},

	orderRequiresAction: {
		title: localizationConstants.orderWidgetActionTitle,
		icon: Bell,
		content: (
			<Content>
				<WidgetListItem
					title={localizationConstants.orderWidgetAction1}
				/>
				<WidgetListItem
					title={localizationConstants.orderWidgetAction2}
				/>
				<WidgetListItem
					title={localizationConstants.orderWidgetAction3}
				/>
				<Row
					label={localizationConstants.orderWidgetActionTotal}
					value="3"
				/>
				<Row
					label={localizationConstants.orderWidgetActionPriority}
					value={
						<Translate
							text={
								localizationConstants.orderWidgetActionPriorityValue
							}
						/>
					}
				/>
				<MockTag />
			</Content>
		),
	},

	orderAiAssistant: {
		title: localizationConstants.orderWidgetAiTitle,
		icon: Bot,
		content: (
			<Content>
				<p>
					💡{" "}
					<Translate
						text={localizationConstants.orderWidgetAiSuggestion}
					/>
				</p>
				<p>
					📊{" "}
					<Translate
						text={localizationConstants.orderWidgetAiForecast}
					/>
				</p>
				<p>
					⚠️{" "}
					<Translate
						text={localizationConstants.orderWidgetAiWarning}
					/>
				</p>
				<Row
					label={localizationConstants.orderWidgetAiStatus}
					value={
						<Translate
							text={
								localizationConstants.orderWidgetAiStatusValue
							}
						/>
					}
				/>
				<MockTag />
			</Content>
		),
	},

	orderActivity: {
		title: localizationConstants.orderWidgetActivityTitle,
		icon: Zap,
		content: (
			<Content>
				<WidgetListItem
					title={localizationConstants.orderWidgetActivity1}
					meta="08:45"
				/>
				<WidgetListItem
					title={localizationConstants.orderWidgetActivity2}
					meta="08:30"
				/>
				<WidgetListItem
					title={localizationConstants.orderWidgetActivity3}
					meta="08:15"
				/>
				<WidgetListItem
					title={localizationConstants.orderWidgetActivity4}
					meta="08:00"
				/>
				<WidgetListItem
					title={localizationConstants.orderWidgetActivity5}
					meta="07:50"
				/>
				<MockTag />
			</Content>
		),
	},

	orderStatistics: {
		title: localizationConstants.orderWidgetStatsTitle,
		icon: BarChart3,
		content: (
			<Content>
				<Row
					label={localizationConstants.orderWidgetStatsPerMonth}
					value="18 · 21 · 19 · 23 · 20 · 24"
				/>
				<Row
					label={localizationConstants.orderWidgetStatsLeadTime}
					value={
						<Translate
							text={
								localizationConstants.orderWidgetStatsLeadTimeValue
							}
						/>
					}
				/>
				<Row
					label={localizationConstants.orderWidgetStatsCompletion}
					value="87 %"
				/>
				<Row
					label={localizationConstants.orderWidgetStatsCategory}
					value={
						<Translate
							text={
								localizationConstants.orderWidgetStatsCategoryValue
							}
						/>
					}
				/>
				<Row
					label={localizationConstants.orderWidgetStatsGrowth}
					value="+8 %"
				/>
				<MockTag />
			</Content>
		),
	},

	orderNews: {
		title: localizationConstants.orderWidgetNewsTitle,
		icon: Newspaper,
		content: (
			<Content>
				<WidgetListItem
					title={localizationConstants.orderWidgetNews1}
					meta="2026-07-24"
				/>
				<WidgetListItem
					title={localizationConstants.orderWidgetNews2}
					meta="2026-07-21"
				/>
				<WidgetListItem
					title={localizationConstants.orderWidgetNews3}
					meta="2026-07-18"
				/>
				<WidgetListItem
					title={localizationConstants.orderWidgetNews4}
					meta="2026-07-15"
				/>
				<MockTag />
			</Content>
		),
	},

	image: {
		title: localizationConstants.orderWidgetImageTitle,
		icon: ImageIcon,
		content: (
			<Content>
				<WidgetImagePlaceholder
					description={
						localizationConstants.orderWidgetImageDescription
					}
				/>
				<MockTag />
			</Content>
		),
	},
};

export const ORDER_WIDGET_ORDER = [
	"orderOverview",
	"orderStatus",
	"orderDirect",
	"orderToday",
	"orderCalendar",
	"orderValue",
	"orderResources",
	"orderTimeReporting",
	"orderAta",
	"orderKma",
	"orderRequiresAction",
	"orderAiAssistant",
	"orderActivity",
	"orderStatistics",
	"orderNews",
	"image",
] as const;

export const ORDER_INITIAL_WIDGETS: PlacedWidgetEntry[] =
	ORDER_WIDGET_ORDER.map((id) => ({
		uid: `order-${id}`,
		sidebarId: id,
		colSpanClass: "col-span-12 md:col-span-6 xl:col-span-4",
		widgetProps: ORDER_SIDEBAR_WIDGET_MAP[id],
	}));
