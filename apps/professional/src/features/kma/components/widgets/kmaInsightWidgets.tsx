import {
	BarChart3,
	Bot,
	Leaf,
	Newspaper,
	Zap,
} from "lucide-react";
import localizationConstants from "@/utils/translation/constants";
import { WidgetProps } from "@/features/widgetdashboard/types/dashboard";
import {
	WidgetAction,
	WidgetActions,
	WidgetBarRow,
	WidgetChip,
	WidgetChips,
	WidgetContent as Content,
	WidgetListItem,
	WidgetMockTag as MockTag,
	WidgetRow as Row,
	WidgetSparkBars,
} from "@/features/widgetdashboard/components/WidgetContent";
import {
	mockDate,
	mockDateTime,
} from "@/features/widgetdashboard/utils/mockDates";
import { Translate } from "@/utils/translation/translate";

export const KMA_INSIGHT_WIDGETS: Record<string, WidgetProps> = {
	kmaEnvironment: {
		title: localizationConstants.kmaWidgetEnvironmentTitle,
		icon: Leaf,
		content: (
			<Content>
				<WidgetBarRow
					label={localizationConstants.kmaWidgetEnvWaste}
					percent={78}
					value="78 % ↑ +3 %"
					color="bg-green-500"
				/>
				<Row
					label={localizationConstants.kmaWidgetEnvEnergy}
					value="↓ -5 %"
				/>
				<Row
					label={localizationConstants.kmaWidgetEnvDeviations}
					value="1"
				/>
				<p className="text-xs text-slate-400">
					<Translate
						text={localizationConstants.kmaWidgetEnvDeviationValue}
					/>
				</p>
				<WidgetActions>
					<WidgetAction
						label={localizationConstants.kmaCtaViewEnvironment}
					/>
				</WidgetActions>
				<MockTag />
			</Content>
		),
	},

	kmaAiAssistant: {
		title: localizationConstants.kmaWidgetAiTitle,
		icon: Bot,
		content: (
			<Content>
				<WidgetChips>
					<WidgetChip
						label={localizationConstants.kmaWidgetAiPrompt1}
					/>
					<WidgetChip
						label={localizationConstants.kmaWidgetAiPrompt2}
					/>
					<WidgetChip
						label={localizationConstants.kmaWidgetAiPrompt3}
					/>
				</WidgetChips>
				<div className="mt-1 rounded-md rounded-tl-none bg-slate-100 px-2.5 py-2 text-xs text-slate-600">
					<Translate
						text={localizationConstants.kmaWidgetAiLatestValue}
					/>
				</div>
				<WidgetActions>
					<WidgetAction label={localizationConstants.kmaCtaAsk} />
				</WidgetActions>
				<MockTag />
			</Content>
		),
	},

	kmaActivity: {
		title: localizationConstants.kmaWidgetActivityTitle,
		icon: Zap,
		content: (
			<Content>
				<WidgetListItem
					title={localizationConstants.kmaWidgetActivity1}
					meta={mockDateTime(2, "15:12")}
				/>
				<WidgetListItem
					title={localizationConstants.kmaWidgetActivity2}
					meta={mockDateTime(1, "09:05")}
				/>
				<WidgetListItem
					title={localizationConstants.kmaWidgetActivity3}
					meta={mockDateTime(0, "11:30")}
				/>
				<WidgetListItem
					title={localizationConstants.kmaWidgetActivity4}
					meta={mockDateTime(-2, "08:10")}
				/>
				<WidgetListItem
					title={localizationConstants.kmaWidgetActivity5}
					meta={mockDateTime(-4, "14:40")}
				/>
				<WidgetActions>
					<WidgetAction
						label={localizationConstants.kmaCtaViewMore}
					/>
				</WidgetActions>
				<MockTag />
			</Content>
		),
	},

	kmaStatistics: {
		title: localizationConstants.kmaWidgetStatsTitle,
		icon: BarChart3,
		content: (
			<Content>
				<WidgetChips>
					<WidgetChip
						label={localizationConstants.kmaWidgetStatsPeriod7}
					/>
					<WidgetChip
						label={localizationConstants.kmaWidgetStatsPeriod30}
						active
					/>
					<WidgetChip
						label={localizationConstants.kmaWidgetStatsPeriod90}
					/>
				</WidgetChips>
				<p className="pt-1">
					<Translate
						text={
							localizationConstants.kmaWidgetStatsDeviationsPerWeek
						}
					/>
				</p>
				<WidgetSparkBars values={[1, 2, 0, 3]} />
				<p className="pt-1">
					<Translate
						text={
							localizationConstants.kmaWidgetStatsIncidentsPerMonth
						}
					/>
				</p>
				<WidgetSparkBars values={[0, 1, 0]} color="bg-amber-500" />
				<p className="pt-1">
					<Translate
						text={localizationConstants.kmaWidgetStatsRiskStatus}
					/>
				</p>
				<Row
					label={localizationConstants.kmaWidgetStatsRiskDone}
					value="5"
				/>
				<Row
					label={localizationConstants.kmaWidgetStatsRiskOngoing}
					value="1"
				/>
				<Row
					label={localizationConstants.kmaWidgetStatsRiskNotStarted}
					value="2"
				/>
				<WidgetActions>
					<WidgetAction
						label={localizationConstants.kmaCtaOpenStatistics}
					/>
				</WidgetActions>
				<MockTag />
			</Content>
		),
	},

	kmaNews: {
		title: localizationConstants.kmaWidgetNewsTitle,
		icon: Newspaper,
		content: (
			<Content>
				<WidgetListItem
					title={localizationConstants.kmaWidgetNews1}
					meta={
						<>
							{mockDate(2)} ·{" "}
							<Translate
								text={localizationConstants.kmaWidgetNews1Intro}
							/>
						</>
					}
				/>
				<WidgetListItem
					title={localizationConstants.kmaWidgetNews2}
					meta={
						<>
							{mockDate(-6)} ·{" "}
							<Translate
								text={localizationConstants.kmaWidgetNews2Intro}
							/>
						</>
					}
				/>
				<WidgetListItem
					title={localizationConstants.kmaWidgetNews3}
					meta={
						<>
							{mockDate(-14)} ·{" "}
							<Translate
								text={localizationConstants.kmaWidgetNews3Intro}
							/>
						</>
					}
				/>
				<WidgetActions>
					<WidgetAction label={localizationConstants.kmaCtaViewAll} />
				</WidgetActions>
				<MockTag />
			</Content>
		),
	},
};
