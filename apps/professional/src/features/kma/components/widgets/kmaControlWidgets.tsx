import {
	CalendarDays,
	CheckCircle2,
	ClipboardList,
	ScrollText,
	ShieldAlert,
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
	mockDateTime,
} from "@/features/widgetdashboard/utils/mockDates";
import { Translate } from "@/utils/translation/translate";



export const KMA_CONTROL_WIDGETS: Record<string, WidgetProps> = {
	kmaSecureCheck: {
		title: localizationConstants.kmaWidgetSecureTitle,
		icon: CheckCircle2,
		content: (
			<Content>
				<Row
					label={localizationConstants.kmaWidgetSecureLatestRun}
					value={mockDate(1)}
				/>
				<Row
					label={localizationConstants.kmaWidgetSecureResult}
					value={
						<Translate
							text={
								localizationConstants.kmaWidgetOverviewApproved
							}
						/>
					}
				/>
				<Row
					label={localizationConstants.kmaWidgetSecureRemarks}
					value="1"
				/>
				<p className="text-xs text-slate-400">
					<Translate
						text={localizationConstants.kmaWidgetSecureRemarkValue}
					/>
				</p>
				<WidgetActions>
					<WidgetAction
						label={localizationConstants.kmaCtaStartSecureCheck}
					/>
				</WidgetActions>
				<MockTag />
			</Content>
		),
	},

	kmaSafetyRounds: {
		title: localizationConstants.kmaWidgetRoundsTitle,
		icon: ShieldAlert,
		content: (
			<Content>
				<Row
					label={localizationConstants.kmaWidgetRoundsUpcoming}
					value={mockDate(11)}
				/>
				<WidgetListItem
					title={localizationConstants.kmaWidgetRoundUpcomingValue}
					meta={
						<Translate
							text={localizationConstants.kmaStatusPlanned}
						/>
					}
				/>
				<Row
					label={localizationConstants.kmaWidgetRoundsLatest}
					value={mockDate(-12)}
				/>
				<WidgetListItem
					title={localizationConstants.kmaWidgetRoundLatestValue}
					meta={
						<Translate
							text={localizationConstants.kmaStatusCompleted}
						/>
					}
				/>
				<WidgetActions>
					<WidgetAction label={localizationConstants.kmaCtaPlan} />
					<WidgetAction
						label={localizationConstants.kmaCtaViewAll}
						variant="secondary"
					/>
				</WidgetActions>
				<MockTag />
			</Content>
		),
	},

	kmaControlPlan: {
		title: localizationConstants.kmaWidgetControlTitle,
		icon: ClipboardList,
		content: (
			<Content>
				<WidgetBarRow
					label={localizationConstants.kmaWidgetControlProgress}
					percent={80}
					value="8/10"
					color="bg-blue-600"
				/>
				<p className="text-xs text-slate-400">
					<Translate
						text={localizationConstants.kmaWidgetControlPeriod}
					/>
				</p>
				<WidgetListItem
					title={localizationConstants.kmaWidgetControl1}
					meta={
						<>
							<Translate
								text={localizationConstants.kmaResultOk}
							/>{" "}
							· {mockDate(0)}
						</>
					}
				/>
				<WidgetListItem
					title={localizationConstants.kmaWidgetControl2}
					meta={
						<>
							<Translate
								text={
									localizationConstants.kmaResultActionRequired
								}
							/>{" "}
							· {mockDate(-3)}
						</>
					}
				/>
				<WidgetListItem
					title={localizationConstants.kmaWidgetControl3}
					meta={
						<>
							<Translate
								text={localizationConstants.kmaResultOk}
							/>{" "}
							· {mockDate(-5)}
						</>
					}
				/>
				<WidgetActions>
					<WidgetAction
						label={localizationConstants.kmaCtaOpenControlPlan}
					/>
				</WidgetActions>
				<MockTag />
			</Content>
		),
	},

	kmaCalendar: {
		title: localizationConstants.kmaWidgetCalendarTitle,
		icon: CalendarDays,
		content: (
			<Content>
				<WidgetListItem
					title={localizationConstants.kmaWidgetCalendarEvent1}
					meta={mockDateTime(11, "09:00")}
				/>
				<WidgetListItem
					title={localizationConstants.kmaWidgetCalendarEvent2}
					meta={mockDateTime(13, "13:00")}
				/>
				<WidgetListItem
					title={localizationConstants.kmaWidgetCalendarEvent3}
					meta={mockDateTime(15, "10:00")}
				/>
				<WidgetActions>
					<WidgetAction
						label={localizationConstants.kmaCtaOpenCalendar}
					/>
				</WidgetActions>
				<MockTag />
			</Content>
		),
	},

	kmaCertificates: {
		title: localizationConstants.kmaWidgetCertificatesTitle,
		icon: ScrollText,
		content: (
			<Content>
				<Row
					label={localizationConstants.kmaWidgetCertificatesExpiring}
					value="2"
				/>
				<WidgetListItem
					title={localizationConstants.kmaWidgetCertificate1}
					meta={
						<span className="flex flex-wrap items-center gap-1">
							{mockDate(22)}
							<WidgetTag
								label={localizationConstants.kmaStatusRenew}
								color={KMA_PRIORITY_COLORS.medium}
							/>
						</span>
					}
				/>
				<WidgetListItem
					title={localizationConstants.kmaWidgetCertificate2}
					meta={
						<span className="flex flex-wrap items-center gap-1">
							{mockDate(27)}
							<WidgetTag
								label={localizationConstants.kmaStatusRenew}
								color={KMA_PRIORITY_COLORS.medium}
							/>
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
};
