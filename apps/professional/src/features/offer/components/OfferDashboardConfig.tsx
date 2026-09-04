import {
	BarChart3,
	Bot,
	CalendarDays,
	CheckCircle2,
	ClipboardList,
	CircleDollarSign,
	Globe,
	History,
	Image as ImageIcon,
	Inbox,
	Layers,
	Newspaper,
	Send,
	Zap,
} from "lucide-react";
import localizationConstants from "@/utils/translation/constants";
import {
	PlacedWidgetEntry,
	WidgetProps,
} from "@/features/widgetdashboard/types/dashboard";
import {
	WidgetContent as Content,
	WidgetImagePlaceholder,
	WidgetListItem,
	WidgetMockTag as MockTag,
	WidgetRow as Row,
} from "@/features/widgetdashboard/components/WidgetContent";
import { Translate } from "@/utils/translation/translate";

export const OFFER_SIDEBAR_WIDGET_MAP: Record<string, WidgetProps> = {
	emptyPage: { title: localizationConstants.emptyPageLabel, icon: Layers },

	offerOverview: {
		title: localizationConstants.offerWidgetOverviewTitle,
		icon: ClipboardList,
		content: (
			<Content>
				<Row
					label={localizationConstants.offerWidgetOverviewTotal}
					value="42"
				/>
				<Row
					label={localizationConstants.offerWidgetOverviewDrafts}
					value="4"
				/>
				<Row
					label={localizationConstants.offerWidgetOverviewSent}
					value="9"
				/>
				<Row
					label={localizationConstants.offerWidgetOverviewAccepted}
					value="3"
				/>
				<Row
					label={localizationConstants.offerWidgetOverviewConversion}
					value="34 %"
				/>
				<MockTag />
			</Content>
		),
	},

	offerRequests: {
		title: localizationConstants.offerWidgetRequestsTitle,
		icon: Inbox,
		content: (
			<Content>
				<WidgetListItem
					title={localizationConstants.offerWidgetRequest1}
					meta={
						<>
							2026-03-02 ·{" "}
							<Translate
								text={
									localizationConstants.offerWidgetRequestStatusNew
								}
							/>
						</>
					}
				/>
				<WidgetListItem
					title={localizationConstants.offerWidgetRequest2}
					meta={
						<>
							2026-02-28 ·{" "}
							<Translate
								text={
									localizationConstants.offerWidgetRequestStatusReviewed
								}
							/>
						</>
					}
				/>
				<WidgetListItem
					title={localizationConstants.offerWidgetRequest3}
					meta={
						<>
							2026-02-25 ·{" "}
							<Translate
								text={
									localizationConstants.offerWidgetRequestStatusNew
								}
							/>
						</>
					}
				/>
				<MockTag />
			</Content>
		),
	},

	offerAvailableProjects: {
		title: localizationConstants.offerWidgetProjectsTitle,
		icon: Globe,
		content: (
			<Content>
				<Row
					label={localizationConstants.offerWidgetProjectCustomer}
					value="Teknik AB"
				/>
				<Row
					label={localizationConstants.offerWidgetProjectLocation}
					value="Stockholm"
				/>
				<Row
					label={localizationConstants.offerWidgetProjectDeadline}
					value="2026-03-20"
				/>
				<Row
					label={localizationConstants.offerWidgetProjectValue}
					value="850 000 SEK"
				/>
				<MockTag />
			</Content>
		),
	},

	offerSent: {
		title: localizationConstants.offerWidgetSentTitle,
		icon: Send,
		content: (
			<Content>
				<WidgetListItem
					title={localizationConstants.offerWidgetActivitySent}
					meta={
						<>
							2026-03-01 · 420 000 SEK ·{" "}
							<Translate
								text={
									localizationConstants.offerWidgetSentStatusWaiting
								}
							/>
						</>
					}
				/>
				<WidgetListItem
					title={localizationConstants.offerWidgetRequest2}
					meta={
						<>
							2026-02-26 · 180 000 SEK ·{" "}
							<Translate
								text={
									localizationConstants.offerWidgetSentStatusOpened
								}
							/>
						</>
					}
				/>
				<MockTag />
			</Content>
		),
	},

	offerAccepted: {
		title: localizationConstants.offerWidgetAcceptedTitle,
		icon: CheckCircle2,
		content: (
			<Content>
				<Row
					label={localizationConstants.offerWidgetProjectCustomer}
					value="EntreprenadPro"
				/>
				<Row
					label={localizationConstants.offerWidgetRequest1}
					value="2026-02-20"
				/>
				<Row
					label={localizationConstants.offerWidgetValueAccepted}
					value="1 250 000 SEK"
				/>
				<Row
					label={localizationConstants.offerWidgetAcceptedNextAction}
					value={
						<Translate
							text={
								localizationConstants.offerWidgetAcceptedNextActionValue
							}
						/>
					}
				/>
				<MockTag />
			</Content>
		),
	},

	offerCalendar: {
		title: localizationConstants.offerWidgetCalendarTitle,
		icon: CalendarDays,
		content: (
			<Content>
				<Row
					label={localizationConstants.offerWidgetCalendarDeadline}
					value="2026-03-12"
				/>
				<Row
					label={localizationConstants.offerWidgetCalendarFollowUp}
					value="2026-03-14"
				/>
				<Row
					label={localizationConstants.offerWidgetCalendarMeeting}
					value="2026-03-18 10:00"
				/>
				<MockTag />
			</Content>
		),
	},

	offerActivity: {
		title: localizationConstants.offerWidgetActivityTitle,
		icon: Zap,
		content: (
			<Content>
				<WidgetListItem
					title={localizationConstants.offerWidgetActivityCreated}
					meta="2026-03-03"
				/>
				<WidgetListItem
					title={localizationConstants.offerWidgetActivitySent}
					meta="2026-03-01"
				/>
				<WidgetListItem
					title={localizationConstants.offerWidgetActivityAccepted}
					meta="2026-02-20"
				/>
				<WidgetListItem
					title={localizationConstants.offerWidgetActivityRejected}
					meta="2026-02-14"
				/>
				<MockTag />
			</Content>
		),
	},

	offerAiCalc: {
		title: localizationConstants.offerWidgetAiCalcTitle,
		icon: Bot,
		content: (
			<Content>
				<Row
					label={localizationConstants.offerWidgetAiCalcHours}
					value="120 h"
				/>
				<Row
					label={localizationConstants.offerWidgetAiCalcMaterial}
					value="145 000 SEK"
				/>
				<Row
					label={localizationConstants.offerWidgetAiCalcMargin}
					value="18 %"
				/>
				<Row
					label={localizationConstants.offerWidgetAiCalcDiscount}
					value="5 %"
				/>
				<Row
					label={localizationConstants.offerWidgetAiCalcTotal}
					value="312 000 SEK"
				/>
				<MockTag />
			</Content>
		),
	},

	offerValue: {
		title: localizationConstants.offerWidgetValueTitle,
		icon: CircleDollarSign,
		content: (
			<Content>
				<Row
					label={localizationConstants.offerWidgetValueTotal}
					value="15 800 000 SEK"
				/>
				<Row
					label={localizationConstants.offerWidgetValueAverage}
					value="376 000 SEK"
				/>
				<Row
					label={localizationConstants.offerWidgetValuePending}
					value="4 200 000 SEK"
				/>
				<Row
					label={localizationConstants.offerWidgetValueAccepted}
					value="9 400 000 SEK"
				/>
				<Row
					label={localizationConstants.offerWidgetValueRejected}
					value="2 200 000 SEK"
				/>
				<MockTag />
			</Content>
		),
	},

	offerStatistics: {
		title: localizationConstants.offerWidgetStatsTitle,
		icon: BarChart3,
		content: (
			<Content>
				<Row
					label={localizationConstants.offerWidgetStatsWinRate}
					value="34 %"
				/>
				<Row
					label={localizationConstants.offerWidgetStatsResponseTime}
					value="2,4 d"
				/>
				<Row
					label={localizationConstants.offerWidgetStatsVolume}
					value="42"
				/>
				<Row
					label={localizationConstants.offerWidgetStatsTrend}
					value="+12 %"
				/>
				<Row
					label={localizationConstants.offerWidgetStatsForecast}
					value="18 400 000 SEK"
				/>
				<MockTag />
			</Content>
		),
	},

	offerHistory: {
		title: localizationConstants.offerWidgetHistoryTitle,
		icon: History,
		content: (
			<Content>
				<WidgetListItem
					title={localizationConstants.offerWidgetHistoryVersion}
					meta="2026-03-02 14:12"
				/>
				<WidgetListItem
					title={localizationConstants.offerWidgetHistoryChange}
					meta="2026-03-01 09:45"
				/>
				<WidgetListItem
					title={localizationConstants.offerWidgetHistoryInteraction}
					meta="2026-02-28 16:30"
				/>
				<MockTag />
			</Content>
		),
	},

	offerNews: {
		title: localizationConstants.offerWidgetNewsTitle,
		icon: Newspaper,
		content: (
			<Content>
				<WidgetListItem
					title={localizationConstants.offerWidgetNews1}
					meta="2026-03-03"
				/>
				<WidgetListItem
					title={localizationConstants.offerWidgetNews2}
					meta="2026-02-27"
				/>
				<WidgetListItem
					title={localizationConstants.offerWidgetNews3}
					meta="2026-02-22"
				/>
				<MockTag />
			</Content>
		),
	},

	image: {
		title: localizationConstants.offerWidgetImageTitle,
		icon: ImageIcon,
		content: (
			<Content>
				<WidgetImagePlaceholder
					description={
						localizationConstants.offerWidgetImageDescription
					}
				/>
				<MockTag />
			</Content>
		),
	},
};

export const OFFER_WIDGET_ORDER = [
	"offerOverview",
	"offerRequests",
	"offerAvailableProjects",
	"offerSent",
	"offerAccepted",
	"offerCalendar",
	"offerActivity",
	"offerAiCalc",
	"offerValue",
	"offerStatistics",
	"offerHistory",
	"offerNews",
	"image",
] as const;

export const OFFER_INITIAL_WIDGETS: PlacedWidgetEntry[] =
	OFFER_WIDGET_ORDER.map((id) => ({
		uid: `offer-${id}`,
		sidebarId: id,
		colSpanClass: "col-span-12 md:col-span-6 xl:col-span-4",
		widgetProps: OFFER_SIDEBAR_WIDGET_MAP[id],
	}));
