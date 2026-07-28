import {
	BarChart3,
	Bell,
	Bot,
	Image as ImageIcon,
	Newspaper,
	Zap,
} from "lucide-react";
import localizationConstants from "@/utils/translation/constants";
import { WidgetProps } from "@/features/widgetdashboard/types/dashboard";
import {
	WidgetBarRow,
	WidgetContent as Content,
	WidgetImagePlaceholder,
	WidgetListItem,
	WidgetMockTag as MockTag,
	WidgetRow as Row,
} from "@/features/widgetdashboard/components/WidgetContent";
import {
	mockDate,
} from "@/features/project/constants/mockData";
import { Translate } from "@/utils/translation/translate";

const PromptChip = ({ label }: { label: string }) => (
	<button
		type="button"
		className="cursor-pointer rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-medium text-slate-600"
	>
		<Translate text={label} />
	</button>
);

export const PROJECT_INSIGHT_WIDGETS: Record<string, WidgetProps> = {
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
					meta={mockDate(0)}
				/>
				<WidgetListItem
					title={localizationConstants.projWidgetNews2}
					meta={mockDate(-2)}
				/>
				<WidgetListItem
					title={localizationConstants.projWidgetNews3}
					meta={mockDate(-5)}
				/>
				<Row
					label={localizationConstants.projWidgetNewsUpdated}
					value={mockDate(0)}
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
