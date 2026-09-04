import {
	BarChart3,
	Bell,
	Bot,
	CalendarDays,
	CircleDollarSign,
	Clock,
	Image as ImageIcon,
	Layers,
	Newspaper,
	PieChart,
	Receipt,
	TrafficCone,
	Trophy,
} from "lucide-react";
import localizationConstants from "@/utils/translation/constants";
import {
	PlacedWidgetEntry,
	WidgetProps,
} from "@/features/widgetdashboard/types/dashboard";
import {
	WidgetAction,
	WidgetBarRow,
	WidgetContent as Content,
	WidgetImagePlaceholder,
	WidgetListItem,
	WidgetMockTag as MockTag,
	WidgetRow as Row,
} from "@/features/widgetdashboard/components/WidgetContent";
import { Translate } from "@/utils/translation/translate";

/**
 * Maps a sidebar item id → widget render props for the Calculation dashboard.
 * Mock content only — replace with API data when available.
 */
export const CALCULATION_SIDEBAR_WIDGET_MAP: Record<string, WidgetProps> = {
	emptyPage: { title: localizationConstants.emptyPageLabel, icon: Layers },

	// 1. Kalkylöversikt
	calcOverview: {
		title: localizationConstants.calcWidgetOverviewTitle,
		icon: PieChart,
		content: (
			<Content>
				<Row
					label={localizationConstants.calcWidgetOverviewTotal}
					value="128"
				/>
				<Row
					label={localizationConstants.calcWidgetOverviewOngoing}
					value="34"
				/>
				<Row
					label={localizationConstants.calcWidgetOverviewCompleted}
					value="82"
				/>
				<Row
					label={localizationConstants.calcWidgetOverviewCancelled}
					value="12"
				/>
				<MockTag />
			</Content>
		),
	},

	// 2. Kalkylstatus
	calcStatus: {
		title: localizationConstants.calcWidgetStatusTitle,
		icon: TrafficCone,
		content: (
			<Content>
				<WidgetBarRow
					label={localizationConstants.calcWidgetStatusGreen}
					percent={58}
					color="bg-green-500"
				/>
				<WidgetBarRow
					label={localizationConstants.calcWidgetStatusYellow}
					percent={27}
					color="bg-amber-400"
				/>
				<WidgetBarRow
					label={localizationConstants.calcWidgetStatusRed}
					percent={15}
					color="bg-red-500"
				/>
				<MockTag />
			</Content>
		),
	},

	// 3. Kalkylvärde
	calcValue: {
		title: localizationConstants.calcWidgetValueTitle,
		icon: CircleDollarSign,
		content: (
			<Content>
				<Row
					label={localizationConstants.calcWidgetValueTotal}
					value="12,4 MSEK"
				/>
				<Row
					label={localizationConstants.calcWidgetValueAverage}
					value="96 875 SEK"
				/>
				<MockTag />
			</Content>
		),
	},

	// 4. Kostnadsfördelning
	calcCostDistribution: {
		title: localizationConstants.calcWidgetCostTitle,
		icon: Receipt,
		content: (
			<Content>
				<WidgetBarRow
					label={localizationConstants.calcWidgetCostMaterial}
					percent={45}
					color="bg-blue-600"
				/>
				<WidgetBarRow
					label={localizationConstants.calcWidgetCostLabour}
					percent={35}
					color="bg-orange-500"
				/>
				<WidgetBarRow
					label={localizationConstants.calcWidgetCostSubcontractors}
					percent={15}
					color="bg-emerald-500"
				/>
				<WidgetBarRow
					label={localizationConstants.calcWidgetCostOther}
					percent={5}
					color="bg-slate-400"
				/>
				<MockTag />
			</Content>
		),
	},

	// 5. Kalkylkalender
	calcCalendar: {
		title: localizationConstants.calcWidgetCalendarTitle,
		icon: CalendarDays,
		content: (
			<Content>
				<Row
					label={localizationConstants.calcWidgetCalendarUpcoming}
					value="3"
				/>
				<Row
					label={localizationConstants.calcWidgetCalendarNext}
					value={
						<>
							<Translate
								text={localizationConstants.calcWidgetLatest1}
							/>
							, 2026-07-30
						</>
					}
				/>
				<MockTag />
			</Content>
		),
	},

	// 6. Senaste Kalkyler
	calcLatest: {
		title: localizationConstants.calcWidgetLatestTitle,
		icon: Clock,
		content: (
			<Content>
				<WidgetListItem
					title={localizationConstants.calcWidgetLatest1}
					meta="Teknik AB · 2026-07-24"
				/>
				<WidgetListItem
					title={localizationConstants.calcWidgetLatest2}
					meta="ByggFix · 2026-07-23"
				/>
				<WidgetListItem
					title={localizationConstants.calcWidgetLatest3}
					meta="FastighetCo · 2026-07-22"
				/>
				<WidgetListItem
					title={localizationConstants.calcWidgetLatest4}
					meta="EntreprenadPro · 2026-07-20"
				/>
				<WidgetListItem
					title={localizationConstants.calcWidgetLatest5}
					meta="IndustriPartner · 2026-07-18"
				/>
				<MockTag />
			</Content>
		),
	},

	// 7. Kalkyler som kräver åtgärd
	calcRequiresAction: {
		title: localizationConstants.calcWidgetActionTitle,
		icon: Bell,
		content: (
			<Content>
				<Row
					label={localizationConstants.calcWidgetActionTotal}
					value="7"
				/>
				<Row
					label={localizationConstants.calcWidgetActionMissingCost}
					value="2"
				/>
				<Row
					label={localizationConstants.calcWidgetActionAwaiting}
					value="5"
				/>
				<MockTag />
			</Content>
		),
	},

	// 8. Vunna & Förlorade Kalkyler
	calcWonLost: {
		title: localizationConstants.calcWidgetWonLostTitle,
		icon: Trophy,
		content: (
			<Content>
				<Row label={localizationConstants.calcWidgetWon} value="24" />
				<Row label={localizationConstants.calcWidgetLost} value="11" />
				<Row
					label={localizationConstants.calcWidgetWinRate}
					value="69 %"
				/>
				<MockTag />
			</Content>
		),
	},

	// 9. AI Quick Calc
	calcAiQuick: {
		title: localizationConstants.calcWidgetAiTitle,
		icon: Bot,
		content: (
			<Content>
				<div className="rounded-md border border-slate-200 bg-white px-2.5 py-2 text-xs text-slate-400">
					<Translate
						text={localizationConstants.calcWidgetAiPrompt}
					/>
				</div>
				<Row
					label={localizationConstants.calcWidgetAiEstimate}
					value="312 000 SEK"
				/>
				<Row
					label={localizationConstants.calcWidgetAiConfidence}
					value="82 %"
				/>
				<WidgetAction label={localizationConstants.calcWidgetAiRun} />
				<MockTag />
			</Content>
		),
	},

	// 10. Kalkylstatistik
	calcStatistics: {
		title: localizationConstants.calcWidgetStatsTitle,
		icon: BarChart3,
		content: (
			<Content>
				<Row
					label={localizationConstants.calcWidgetStatsCreated}
					value="+18 %"
				/>
				<Row
					label={localizationConstants.calcWidgetStatsAverage}
					value="+9 %"
				/>
				<MockTag />
			</Content>
		),
	},

	// 11. Nyheter
	calcNews: {
		title: localizationConstants.calcWidgetNewsTitle,
		icon: Newspaper,
		content: (
			<Content>
				<WidgetListItem
					title={localizationConstants.calcWidgetNews1}
					meta="2026-07-24"
				/>
				<WidgetListItem
					title={localizationConstants.calcWidgetNews2}
					meta="2026-07-19"
				/>
				<WidgetListItem
					title={localizationConstants.calcWidgetNews3}
					meta="2026-07-12"
				/>
				<MockTag />
			</Content>
		),
	},

	// 12. Bild
	image: {
		title: localizationConstants.calcWidgetImageTitle,
		icon: ImageIcon,
		content: (
			<Content>
				<WidgetImagePlaceholder
					description={
						localizationConstants.calcWidgetImageDescription
					}
				/>
				<MockTag />
			</Content>
		),
	},
};

/** Widget order defined by the calculation module widget structure ticket. */
export const CALCULATION_WIDGET_ORDER = [
	"calcOverview",
	"calcStatus",
	"calcValue",
	"calcCostDistribution",
	"calcCalendar",
	"calcLatest",
	"calcRequiresAction",
	"calcWonLost",
	"calcAiQuick",
	"calcStatistics",
	"calcNews",
	"image",
] as const;

/** The 12 widgets shown on first load, in ticket order. */
export const CALCULATION_INITIAL_WIDGETS: PlacedWidgetEntry[] =
	CALCULATION_WIDGET_ORDER.map((id) => ({
		uid: `calc-${id}`,
		sidebarId: id,
		colSpanClass: "col-span-12 md:col-span-6 xl:col-span-4",
		widgetProps: CALCULATION_SIDEBAR_WIDGET_MAP[id],
	}));
