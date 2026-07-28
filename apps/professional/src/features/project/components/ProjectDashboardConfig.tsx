import {
	Award,
	BarChart3,
	Bell,
	Bot,
	CalendarDays,
	CalendarRange,
	CircleDollarSign,
	HardHat,
	Image as ImageIcon,
	Layers,
	Map as MapIcon,
	Newspaper,
	PieChart,
	Plus,
	ShieldCheck,
	Target,
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
	WidgetCalendarPreview,
	WidgetContent as Content,
	WidgetImagePlaceholder,
	WidgetListItem,
	WidgetMapPreview,
	WidgetMockTag as MockTag,
	WidgetRow as Row,
} from "@/features/widgetdashboard/components/WidgetContent";
import { Translate } from "@/utils/translation/translate";

const WEEK_DAYS = ["M", "T", "O", "T", "F", "L", "S"];
const JULY_2026: (number | null)[] = [
	null,
	null,
	1,
	2,
	3,
	4,
	5,
	...Array.from({ length: 26 }, (_, i) => i + 6),
];
const CALENDAR_HIGHLIGHTS: Record<number, string> = {
	15: "bg-blue-600",
	22: "bg-amber-500",
	28: "bg-red-600",
};

const MAP_PINS = [
	{ id: "a", label: "Projekt A", color: "bg-green-500", x: 30, y: 25 },
	{ id: "b", label: "Projekt B", color: "bg-amber-400", x: 52, y: 38 },
	{ id: "c", label: "Projekt C", color: "bg-green-500", x: 41, y: 55 },
	{ id: "d", label: "Projekt D", color: "bg-red-500", x: 63, y: 62 },
	{ id: "e", label: "Projekt E", color: "bg-green-500", x: 24, y: 68 },
	{ id: "f", label: "Projekt F", color: "bg-green-500", x: 70, y: 30 },
	{ id: "g", label: "Projekt G", color: "bg-amber-400", x: 46, y: 78 },
	{ id: "h", label: "Projekt H", color: "bg-green-500", x: 57, y: 15 },
];

const Milestone = ({
	title,
	date,
	state,
}: {
	title: string;
	date: string;
	state: string;
}) => (
	<WidgetListItem
		title={title}
		meta={
			<>
				{date} · <Translate text={state} />
			</>
		}
	/>
);

const PromptChip = ({ label }: { label: string }) => (
	<button
		type="button"
		className="cursor-pointer rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-medium text-slate-600"
	>
		<Translate text={label} />
	</button>
);

export const PROJECT_SIDEBAR_WIDGET_MAP: Record<string, WidgetProps> = {
	emptyPage: { title: localizationConstants.emptyPageLabel, icon: Layers },

	projectOverview: {
		title: localizationConstants.projWidgetOverviewTitle,
		icon: PieChart,
		content: (
			<Content>
				<Row
					label={localizationConstants.projWidgetOverviewTotal}
					value="12"
				/>
				<Row
					label={localizationConstants.projWidgetOverviewActive}
					value="8"
				/>
				<Row
					label={localizationConstants.projWidgetOverviewCompleted}
					value="3"
				/>
				<Row
					label={localizationConstants.projWidgetOverviewOnHold}
					value="1"
				/>
				<WidgetBarRow
					label={localizationConstants.projWidgetOverviewProgress}
					percent={67}
					color="bg-blue-600"
				/>
				<Row
					label={localizationConstants.projWidgetOverviewTopProjects}
					value="Storgatan 14 · Projekt B · Projekt C"
				/>
				<MockTag />
			</Content>
		),
	},

	projectStatus: {
		title: localizationConstants.projWidgetStatusTitle,
		icon: TrafficCone,
		content: (
			<Content>
				<WidgetBarRow
					label={localizationConstants.projWidgetStatusOnTrack}
					percent={63}
					value="5"
					color="bg-green-500"
				/>
				<WidgetBarRow
					label={localizationConstants.projWidgetStatusAtRisk}
					percent={25}
					value="2"
					color="bg-amber-400"
				/>
				<WidgetBarRow
					label={localizationConstants.projWidgetStatusDelayed}
					percent={12}
					value="1"
					color="bg-red-500"
				/>
				<Row
					label={localizationConstants.projWidgetStatusUpdated}
					value={
						<Translate
							text={
								localizationConstants.projWidgetStatusUpdatedValue
							}
						/>
					}
				/>
				<MockTag />
			</Content>
		),
	},

	projectOfMonth: {
		title: localizationConstants.projWidgetMonthTitle,
		icon: CalendarDays,
		content: (
			<Content>
				<p className="font-medium text-slate-700">
					<Translate
						text={localizationConstants.projWidgetMonthProject}
					/>
				</p>
				<Row
					label={localizationConstants.projWidgetMonthClient}
					value="Byggbolaget AB"
				/>
				<WidgetBarRow
					label={localizationConstants.projWidgetMonthProgress}
					percent={74}
					color="bg-blue-600"
				/>
				<Row
					label={localizationConstants.projWidgetMonthDeadline}
					value="2026-08-31"
				/>
				<Row
					label={localizationConstants.projWidgetMonthTeam}
					value={
						<Translate
							text={
								localizationConstants.projWidgetMonthTeamValue
							}
						/>
					}
				/>
				<MockTag />
			</Content>
		),
	},

	projectCalendar: {
		title: localizationConstants.projWidgetCalendarTitle,
		icon: CalendarRange,
		content: (
			<Content>
				<WidgetCalendarPreview
					title={localizationConstants.projWidgetCalendarMonth}
					weekDays={WEEK_DAYS}
					days={JULY_2026}
					highlights={CALENDAR_HIGHLIGHTS}
				/>
				<div className="flex flex-wrap gap-x-3 gap-y-0.5 pt-1 text-[11px]">
					<span className="flex items-center gap-1">
						<span className="h-2 w-2 rounded-[2px] bg-blue-600" />
						<Translate
							text={
								localizationConstants.projWidgetCalendarMilestone
							}
						/>
					</span>
					<span className="flex items-center gap-1">
						<span className="h-2 w-2 rounded-[2px] bg-amber-500" />
						<Translate
							text={
								localizationConstants.projWidgetCalendarInspection
							}
						/>
					</span>
					<span className="flex items-center gap-1">
						<span className="h-2 w-2 rounded-[2px] bg-red-600" />
						<Translate
							text={
								localizationConstants.projWidgetCalendarDeadline
							}
						/>
					</span>
				</div>
				<MockTag />
			</Content>
		),
	},

	projectMilestones: {
		title: localizationConstants.projWidgetMilestonesTitle,
		icon: Target,
		content: (
			<Content>
				<Milestone
					title={localizationConstants.projWidgetMilestone1}
					date="2026-07-01"
					state={localizationConstants.projWidgetMilestoneDone}
				/>
				<Milestone
					title={localizationConstants.projWidgetMilestone2}
					date="2026-07-20"
					state={localizationConstants.projWidgetMilestoneInProgress}
				/>
				<Milestone
					title={localizationConstants.projWidgetMilestone3}
					date="2026-08-10"
					state={localizationConstants.projWidgetMilestoneUpcoming}
				/>
				<Milestone
					title={localizationConstants.projWidgetMilestone4}
					date="2026-07-15"
					state={localizationConstants.projWidgetMilestoneDelayed}
				/>
				<MockTag />
			</Content>
		),
	},

	projectMap: {
		title: localizationConstants.projWidgetMapTitle,
		icon: MapIcon,
		content: (
			<Content>
				<WidgetMapPreview pins={MAP_PINS} />
				<Row
					label={localizationConstants.projWidgetMapPins}
					value="8"
				/>
				<p className="text-[11px]">
					<Translate
						text={localizationConstants.projWidgetMapLegend}
					/>
				</p>
				<MockTag />
			</Content>
		),
	},

	projectResources: {
		title: localizationConstants.projWidgetResourcesTitle,
		icon: HardHat,
		content: (
			<Content>
				<Row
					label={localizationConstants.projWidgetResourcesTotal}
					value="24"
				/>
				<WidgetBarRow
					label={localizationConstants.projWidgetResourcesBooked}
					percent={75}
					value="18"
					color="bg-blue-600"
				/>
				<Row
					label={localizationConstants.projWidgetResourcesAvailable}
					value="4"
				/>
				<Row
					label={localizationConstants.projWidgetResourcesLeave}
					value="2"
				/>
				<Row
					label={localizationConstants.projWidgetResourcesTop}
					value="Storgatan 14 (95 %)"
				/>
				<MockTag />
			</Content>
		),
	},

	projectTimeReporting: {
		title: localizationConstants.projWidgetTimeTitle,
		icon: Timer,
		content: (
			<Content>
				<Row
					label={localizationConstants.projWidgetTimeTotal}
					value="342 h"
				/>
				<Row
					label={localizationConstants.projWidgetTimeReported}
					value="298 h"
				/>
				<Row
					label={localizationConstants.projWidgetTimeMissing}
					value="44 h"
				/>
				<Row
					label={localizationConstants.projWidgetTimeTop}
					value="Johan A. – 48 h"
				/>
				<Row
					label={localizationConstants.projWidgetTimePending}
					value="7"
				/>
				<MockTag />
			</Content>
		),
	},

	projectValue: {
		title: localizationConstants.projWidgetValueTitle,
		icon: CircleDollarSign,
		content: (
			<Content>
				<Row
					label={localizationConstants.projWidgetValueTotal}
					value="14 250 000 kr"
				/>
				<Row
					label={localizationConstants.projWidgetValueInvoiced}
					value="8 900 000 kr"
				/>
				<Row
					label={localizationConstants.projWidgetValueRemaining}
					value="5 350 000 kr"
				/>
				<Row
					label={localizationConstants.projWidgetValueMargin}
					value="18 %"
				/>
				<MockTag />
			</Content>
		),
	},

	projectAta: {
		title: localizationConstants.projWidgetAtaTitle,
		icon: Plus,
		content: (
			<Content>
				<Row
					label={localizationConstants.projWidgetAtaOpen}
					value="6"
				/>
				<Row
					label={localizationConstants.projWidgetAtaValue}
					value="320 000 kr"
				/>
				<Row
					label={localizationConstants.projWidgetAtaApproved}
					value="4 (240 000 kr)"
				/>
				<Row
					label={localizationConstants.projWidgetAtaPending}
					value="2 (80 000 kr)"
				/>
				<Row
					label={localizationConstants.projWidgetAtaLatest}
					value={
						<Translate
							text={
								localizationConstants.projWidgetAtaLatestValue
							}
						/>
					}
				/>
				<MockTag />
			</Content>
		),
	},

	projectKma: {
		title: localizationConstants.projWidgetKmaTitle,
		icon: HardHat,
		content: (
			<Content>
				<Row
					label={localizationConstants.projWidgetKmaOpen}
					value="3"
				/>
				<Row
					label={localizationConstants.projWidgetKmaRisks}
					value="5"
				/>
				<Row
					label={localizationConstants.projWidgetKmaRounds}
					value="8/10"
				/>
				<Row
					label={localizationConstants.projWidgetKmaLast}
					value="2026-07-18"
				/>
				<MockTag />
			</Content>
		),
	},

	projectSecureCheck: {
		title: localizationConstants.projWidgetSecureTitle,
		icon: ShieldCheck,
		content: (
			<Content>
				<Row
					label={localizationConstants.projWidgetSecureCompleted}
					value="6/8"
				/>
				<Row
					label={localizationConstants.projWidgetSecurePending}
					value="4"
				/>
				<Row
					label={localizationConstants.projWidgetSecureOverdue}
					value={
						<Translate
							text={
								localizationConstants.projWidgetSecureOverdueValue
							}
						/>
					}
				/>
				<Row
					label={localizationConstants.projWidgetSecureNext}
					value="2026-07-30"
				/>
				<MockTag />
			</Content>
		),
	},

	projectInspection: {
		title: localizationConstants.projWidgetInspectionTitle,
		icon: Award,
		content: (
			<Content>
				<Row
					label={localizationConstants.projWidgetInspectionUpcoming}
					value="2"
				/>
				<WidgetListItem
					title={localizationConstants.projWidgetInspection1}
					meta="2026-07-28"
				/>
				<WidgetListItem
					title={localizationConstants.projWidgetInspection2}
					meta="2026-08-05"
				/>
				<Row
					label={localizationConstants.projWidgetInspectionCompleted}
					value="3"
				/>
				<Row
					label={localizationConstants.projWidgetInspectionApproved}
					value="2"
				/>
				<Row
					label={localizationConstants.projWidgetInspectionRemarks}
					value="1"
				/>
				<MockTag />
			</Content>
		),
	},

	projectRequiresAction: {
		title: localizationConstants.projWidgetActionTitle,
		icon: Bell,
		content: (
			<Content>
				<WidgetListItem
					title={localizationConstants.projWidgetAction1}
				/>
				<WidgetListItem
					title={localizationConstants.projWidgetAction2}
				/>
				<WidgetListItem
					title={localizationConstants.projWidgetAction3}
				/>
				<WidgetListItem
					title={localizationConstants.projWidgetAction4}
				/>
				<MockTag />
			</Content>
		),
	},

	projectAiAssistant: {
		title: localizationConstants.projWidgetAiTitle,
		icon: Bot,
		content: (
			<Content>
				<div className="flex flex-wrap gap-1.5">
					<PromptChip
						label={localizationConstants.projWidgetAiPrompt1}
					/>
					<PromptChip
						label={localizationConstants.projWidgetAiPrompt2}
					/>
					<PromptChip
						label={localizationConstants.projWidgetAiPrompt3}
					/>
				</div>
				<Row
					label={localizationConstants.projWidgetAiInsight}
					value={
						<Translate
							text={
								localizationConstants.projWidgetAiInsightValue
							}
						/>
					}
				/>
				<MockTag />
			</Content>
		),
	},

	projectActivity: {
		title: localizationConstants.projWidgetActivityTitle,
		icon: Zap,
		content: (
			<Content>
				<WidgetListItem
					title={localizationConstants.projWidgetActivity1}
					meta={
						<Translate
							text={localizationConstants.projWidgetActivityTime1}
						/>
					}
				/>
				<WidgetListItem
					title={localizationConstants.projWidgetActivity2}
					meta={
						<Translate
							text={localizationConstants.projWidgetActivityTime2}
						/>
					}
				/>
				<WidgetListItem
					title={localizationConstants.projWidgetActivity3}
					meta={
						<Translate
							text={localizationConstants.projWidgetActivityTime3}
						/>
					}
				/>
				<WidgetListItem
					title={localizationConstants.projWidgetActivity4}
					meta={
						<Translate
							text={localizationConstants.projWidgetActivityTime4}
						/>
					}
				/>
				<WidgetListItem
					title={localizationConstants.projWidgetActivity5}
					meta={
						<Translate
							text={localizationConstants.projWidgetActivityTime4}
						/>
					}
				/>
				<MockTag />
			</Content>
		),
	},

	projectStatistics: {
		title: localizationConstants.projWidgetStatsTitle,
		icon: BarChart3,
		content: (
			<Content>
				<Row
					label={localizationConstants.projWidgetStatsCompleted}
					value="2 · 3 · 1 · 4 · 2 · 3 · 3"
				/>
				<Row
					label={localizationConstants.projWidgetStatsBudget}
					value={
						<Translate
							text={
								localizationConstants.projWidgetStatsBudgetValue
							}
						/>
					}
				/>
				<p className="pt-1 font-medium text-slate-700">
					<Translate
						text={localizationConstants.projWidgetStatsDistribution}
					/>
				</p>
				<WidgetBarRow
					label={localizationConstants.projWidgetStatusOnTrack}
					percent={63}
					color="bg-green-500"
				/>
				<WidgetBarRow
					label={localizationConstants.projWidgetStatusAtRisk}
					percent={25}
					color="bg-amber-400"
				/>
				<WidgetBarRow
					label={localizationConstants.projWidgetStatusDelayed}
					percent={12}
					color="bg-red-500"
				/>
				<Row
					label={localizationConstants.projWidgetStatsDuration}
					value={
						<Translate
							text={
								localizationConstants.projWidgetStatsDurationValue
							}
						/>
					}
				/>
				<MockTag />
			</Content>
		),
	},

	projectNews: {
		title: localizationConstants.projWidgetNewsTitle,
		icon: Newspaper,
		content: (
			<Content>
				<WidgetListItem
					title={localizationConstants.projWidgetNews1}
					meta="2026-07-24"
				/>
				<WidgetListItem
					title={localizationConstants.projWidgetNews2}
					meta="2026-07-22"
				/>
				<WidgetListItem
					title={localizationConstants.projWidgetNews3}
					meta="2026-07-19"
				/>
				<Row
					label={localizationConstants.projWidgetNewsUpdated}
					value="2026-07-24"
				/>
				<MockTag />
			</Content>
		),
	},

	image: {
		title: localizationConstants.projWidgetImageTitle,
		icon: ImageIcon,
		content: (
			<Content>
				<WidgetImagePlaceholder
					description={
						localizationConstants.projWidgetImageDescription
					}
				/>
				<p className="text-[11px] text-slate-400">
					<Translate
						text={localizationConstants.projWidgetImageCaption}
					/>
				</p>
				<MockTag />
			</Content>
		),
	},
};

export const PROJECT_WIDGET_ORDER = [
	"projectOverview",
	"projectStatus",
	"projectOfMonth",
	"projectCalendar",
	"projectMilestones",
	"projectMap",
	"projectResources",
	"projectTimeReporting",
	"projectValue",
	"projectAta",
	"projectKma",
	"projectSecureCheck",
	"projectInspection",
	"projectRequiresAction",
	"projectAiAssistant",
	"projectActivity",
	"projectStatistics",
	"projectNews",
	"image",
] as const;

export const PROJECT_INITIAL_WIDGETS: PlacedWidgetEntry[] =
	PROJECT_WIDGET_ORDER.map((id) => ({
		uid: `project-${id}`,
		sidebarId: id,
		colSpanClass: "col-span-12 md:col-span-6 xl:col-span-4",
		widgetProps: PROJECT_SIDEBAR_WIDGET_MAP[id],
	}));
