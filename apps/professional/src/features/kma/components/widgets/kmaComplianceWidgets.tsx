import {
	AlertTriangle,
	HardHat,
	Shield,
	Siren,
	Zap,
	Layers,
} from "lucide-react";
import localizationConstants from "@/utils/translation/constants";
import { KMA_PRIORITY_COLORS } from "@/features/kma/constants/widgetStyles";
import { WidgetProps } from "@/features/widgetdashboard/types/dashboard";
import {
	WidgetAction,
	WidgetActions,
	WidgetBarRow,
	WidgetContent as Content,
	WidgetListItem,
	WidgetMockTag as MockTag,
	WidgetRow as Row,
	WidgetTag,
} from "@/features/widgetdashboard/components/WidgetContent";
import {
	mockDate,
} from "@/features/widgetdashboard/utils/mockDates";
import { Translate } from "@/utils/translation/translate";



export const KMA_COMPLIANCE_WIDGETS: Record<string, WidgetProps> = {
	emptyPage: { title: localizationConstants.emptyPageLabel, icon: Layers },

	kmaScore: {
		title: localizationConstants.kmaWidgetScoreTitle,
		icon: Shield,
		content: (
			<Content>
				<WidgetBarRow
					label={localizationConstants.kmaWidgetScoreValue}
					percent={82}
					value="82/100"
					color="bg-green-500"
				/>
				<Row
					label={localizationConstants.kmaWidgetScoreOpenDeviations}
					value="3"
				/>
				<Row
					label={localizationConstants.kmaWidgetScoreIncidents}
					value="1"
				/>
				<Row
					label={localizationConstants.kmaWidgetScoreRounds}
					value="2/3"
				/>
				<WidgetActions>
					<WidgetAction label={localizationConstants.kmaCtaSeeMore} />
				</WidgetActions>
				<MockTag />
			</Content>
		),
	},

	kmaOverview: {
		title: localizationConstants.kmaWidgetOverviewTitle,
		icon: HardHat,
		content: (
			<Content>
				<p className="text-slate-700">
					<Translate
						text={localizationConstants.kmaWidgetOverviewStatus}
					/>
				</p>
				<Row
					label={localizationConstants.kmaWidgetOverviewActions}
					value="2"
				/>
				<Row
					label={localizationConstants.kmaWidgetOverviewRisks}
					value="1"
				/>
				<Row
					label={localizationConstants.kmaWidgetOverviewNextRound}
					value={mockDate(11)}
				/>
				<Row
					label={localizationConstants.kmaWidgetOverviewSecureCheck}
					value={
						<Translate
							text={
								localizationConstants.kmaWidgetOverviewApproved
							}
						/>
					}
				/>
				<WidgetActions>
					<WidgetAction label={localizationConstants.kmaCtaSeeMore} />
				</WidgetActions>
				<MockTag />
			</Content>
		),
	},

	kmaDeviations: {
		title: localizationConstants.kmaWidgetDeviationsTitle,
		icon: Siren,
		content: (
			<Content>
				<WidgetListItem
					title={localizationConstants.kmaWidgetDeviation1}
					meta={
						<span className="flex flex-wrap items-center gap-1">
							<WidgetTag
								label={localizationConstants.kmaPriorityHigh}
								color={KMA_PRIORITY_COLORS.high}
							/>
							<Translate
								text={localizationConstants.kmaStatusOpen}
							/>
							· {mockDate(-2)}
						</span>
					}
				/>
				<WidgetListItem
					title={localizationConstants.kmaWidgetDeviation2}
					meta={
						<span className="flex flex-wrap items-center gap-1">
							<WidgetTag
								label={localizationConstants.kmaPriorityMedium}
								color={KMA_PRIORITY_COLORS.medium}
							/>
							<Translate
								text={localizationConstants.kmaStatusInProgress}
							/>
							· {mockDate(-4)}
						</span>
					}
				/>
				<WidgetListItem
					title={localizationConstants.kmaWidgetDeviation3}
					meta={
						<span className="flex flex-wrap items-center gap-1">
							<WidgetTag
								label={localizationConstants.kmaPriorityLow}
								color={KMA_PRIORITY_COLORS.low}
							/>
							<Translate
								text={localizationConstants.kmaStatusOpen}
							/>
							· {mockDate(-6)}
						</span>
					}
				/>
				<WidgetActions>
					<WidgetAction label={localizationConstants.kmaCtaViewAll} />
				</WidgetActions>
				<MockTag />
			</Content>
		),
	},

	kmaIncidents: {
		title: localizationConstants.kmaWidgetIncidentsTitle,
		icon: Zap,
		content: (
			<Content>
				<Row
					label={localizationConstants.kmaWidgetIncidentsCount}
					value="1"
				/>
				<WidgetListItem
					title={localizationConstants.kmaWidgetIncident1}
					meta={
						<>
							{mockDate(-14)} ·{" "}
							<Translate
								text={
									localizationConstants.kmaWidgetIncidentActionInProgress
								}
							/>
						</>
					}
				/>
				<Row
					label={localizationConstants.kmaWidgetAccidentsCount}
					value="0"
				/>
				<WidgetActions>
					<WidgetAction label={localizationConstants.kmaCtaReport} />
					<WidgetAction
						label={localizationConstants.kmaCtaViewHistory}
						variant="secondary"
					/>
				</WidgetActions>
				<MockTag />
			</Content>
		),
	},

	kmaRiskAssessments: {
		title: localizationConstants.kmaWidgetRisksTitle,
		icon: AlertTriangle,
		content: (
			<Content>
				<WidgetListItem
					title={localizationConstants.kmaWidgetRisk1}
					meta={
						<span className="flex flex-wrap items-center gap-1">
							<WidgetTag
								label={localizationConstants.kmaPriorityHigh}
								color={KMA_PRIORITY_COLORS.high}
							/>
							<Translate
								text={
									localizationConstants.kmaWidgetRiskResponsibleSupervisor
								}
							/>
							·{" "}
							<Translate
								text={
									localizationConstants.kmaWidgetRiskNextActionPlan
								}
							/>
						</span>
					}
				/>
				<WidgetListItem
					title={localizationConstants.kmaWidgetRisk2}
					meta={
						<span className="flex flex-wrap items-center gap-1">
							<WidgetTag
								label={localizationConstants.kmaPriorityMedium}
								color={KMA_PRIORITY_COLORS.medium}
							/>
							<Translate
								text={
									localizationConstants.kmaWidgetRiskResponsibleSiteManager
								}
							/>
							·{" "}
							<Translate
								text={
									localizationConstants.kmaWidgetRiskNextReview
								}
							/>
						</span>
					}
				/>
				<WidgetListItem
					title={localizationConstants.kmaWidgetRisk3}
					meta={
						<span className="flex flex-wrap items-center gap-1">
							<WidgetTag
								label={localizationConstants.kmaPriorityLow}
								color={KMA_PRIORITY_COLORS.low}
							/>
							KMA ·{" "}
							<Translate
								text={
									localizationConstants.kmaWidgetRiskNextDone
								}
							/>
						</span>
					}
				/>
				<WidgetActions>
					<WidgetAction
						label={localizationConstants.kmaCtaCreateNew}
					/>
					<WidgetAction
						label={localizationConstants.kmaCtaViewAll}
						variant="secondary"
					/>
				</WidgetActions>
				<MockTag />
			</Content>
		),
	},
};
