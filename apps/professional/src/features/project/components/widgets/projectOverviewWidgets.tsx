import {
	CalendarDays,
	CalendarRange,
	Layers,
	Map as MapIcon,
	PieChart,
	Target,
	TrafficCone,
} from "lucide-react";
import localizationConstants from "@/utils/translation/constants";
import { WidgetProps } from "@/features/widgetdashboard/types/dashboard";
import {
	WidgetBarRow,
	WidgetCalendarPreview,
	WidgetContent as Content,
	WidgetListItem,
	WidgetMapPreview,
	WidgetMockTag as MockTag,
	WidgetRow as Row,
} from "@/features/widgetdashboard/components/WidgetContent";
import {
	PROJECT_CALENDAR_DAYS,
	PROJECT_CALENDAR_HIGHLIGHTS,
	PROJECT_MAP_PINS,
	PROJECT_WEEK_DAYS,
	mockDate,
} from "@/features/project/constants/mockData";
import { Translate } from "@/utils/translation/translate";

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

export const PROJECT_OVERVIEW_WIDGETS: Record<string, WidgetProps> = {
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
					value={mockDate(38)}
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
					weekDays={PROJECT_WEEK_DAYS}
					days={PROJECT_CALENDAR_DAYS}
					highlights={PROJECT_CALENDAR_HIGHLIGHTS}
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
					date={mockDate(-23)}
					state={localizationConstants.projWidgetMilestoneDone}
				/>
				<Milestone
					title={localizationConstants.projWidgetMilestone2}
					date={mockDate(-4)}
					state={localizationConstants.projWidgetMilestoneInProgress}
				/>
				<Milestone
					title={localizationConstants.projWidgetMilestone3}
					date={mockDate(17)}
					state={localizationConstants.projWidgetMilestoneUpcoming}
				/>
				<Milestone
					title={localizationConstants.projWidgetMilestone4}
					date={mockDate(-9)}
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
				<WidgetMapPreview pins={PROJECT_MAP_PINS} />
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
};
