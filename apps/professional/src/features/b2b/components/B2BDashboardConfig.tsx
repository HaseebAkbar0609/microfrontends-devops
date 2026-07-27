import {
	BarChart3,
	Bot,
	CalendarDays,
	ClipboardList,
	Handshake,
	Image as ImageIcon,
	Layers,
	Megaphone,
	Newspaper,
	PieChart,
	Search,
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

/**
 * Maps a sidebar item id → widget render props for the B2B dashboard.
 * Mock content only — replace with API data when available.
 */
export const B2B_SIDEBAR_WIDGET_MAP: Record<string, WidgetProps> = {
	emptyPage: { title: localizationConstants.emptyPageLabel, icon: Layers },

	// 1. B2B-Översikt
	b2bOverview: {
		title: localizationConstants.b2bWidgetOverviewTitle,
		icon: PieChart,
		content: (
			<Content>
				<Row
					label={localizationConstants.b2bWidgetOverviewActive}
					value="8"
				/>
				<Row
					label={localizationConstants.b2bWidgetOverviewPublished}
					value="5"
				/>
				<Row
					label={localizationConstants.b2bWidgetOverviewInterest}
					value="12"
				/>
				<Row
					label={localizationConstants.b2bWidgetOverviewAds}
					value="14"
				/>
				<MockTag />
			</Content>
		),
	},

	// 2. Tillgängliga Uppdrag
	b2bAvailableAssignments: {
		title: localizationConstants.b2bWidgetAvailableTitle,
		icon: Search,
		content: (
			<Content>
				<WidgetListItem
					title={localizationConstants.b2bWidgetAvailable1}
					meta={
						<>
							Teknik AB · Stockholm · 2026-03-20 ·{" "}
							<Translate
								text={localizationConstants.b2bWidgetStatusOpen}
							/>
						</>
					}
				/>
				<WidgetListItem
					title={localizationConstants.b2bWidgetAvailable2}
					meta={
						<>
							ByggFix · Solna · 2026-03-15 ·{" "}
							<Translate
								text={
									localizationConstants.b2bWidgetStatusClosingSoon
								}
							/>
						</>
					}
				/>
				<WidgetListItem
					title={localizationConstants.b2bWidgetAvailable3}
					meta={
						<>
							FastighetCo · Uppsala · 2026-04-02 ·{" "}
							<Translate
								text={localizationConstants.b2bWidgetStatusOpen}
							/>
						</>
					}
				/>
				<MockTag />
			</Content>
		),
	},

	// 3. Mina Publicerade Uppdrag
	b2bPublishedAssignments: {
		title: localizationConstants.b2bWidgetPublishedTitle,
		icon: Megaphone,
		content: (
			<Content>
				<WidgetListItem
					title={localizationConstants.b2bWidgetAvailable1}
					meta={
						<>
							124{" "}
							<Translate
								text={
									localizationConstants.b2bWidgetPublishedViews
								}
							/>{" "}
							· 6{" "}
							<Translate
								text={
									localizationConstants.b2bWidgetPublishedApplicants
								}
							/>{" "}
							·{" "}
							<Translate
								text={
									localizationConstants.b2bWidgetStatusPublished
								}
							/>
						</>
					}
				/>
				<WidgetListItem
					title={localizationConstants.b2bWidgetAvailable3}
					meta={
						<>
							38{" "}
							<Translate
								text={
									localizationConstants.b2bWidgetPublishedViews
								}
							/>{" "}
							· 2{" "}
							<Translate
								text={
									localizationConstants.b2bWidgetPublishedApplicants
								}
							/>{" "}
							·{" "}
							<Translate
								text={localizationConstants.b2bWidgetStatusDraft}
							/>
						</>
					}
				/>
				<MockTag />
			</Content>
		),
	},

	// 4. Mina Intresseanmälningar
	b2bInterestRegistrations: {
		title: localizationConstants.b2bWidgetInterestTitle,
		icon: Handshake,
		content: (
			<Content>
				<WidgetListItem
					title={localizationConstants.b2bWidgetAvailable2}
					meta={
						<>
							ByggFix · 2026-03-01 ·{" "}
							<Translate
								text={
									localizationConstants.b2bWidgetInterestStatusSubmitted
								}
							/>
						</>
					}
				/>
				<WidgetListItem
					title={localizationConstants.b2bWidgetAvailable1}
					meta={
						<>
							Teknik AB · 2026-02-24 ·{" "}
							<Translate
								text={
									localizationConstants.b2bWidgetInterestStatusAccepted
								}
							/>
						</>
					}
				/>
				<WidgetListItem
					title={localizationConstants.b2bWidgetAvailable3}
					meta={
						<>
							FastighetCo · 2026-02-19 ·{" "}
							<Translate
								text={
									localizationConstants.b2bWidgetInterestStatusReviewing
								}
							/>
						</>
					}
				/>
				<MockTag />
			</Content>
		),
	},

	// 5. Mina B2B-Annonser
	b2bAds: {
		title: localizationConstants.b2bWidgetAdsTitle,
		icon: ClipboardList,
		content: (
			<Content>
				<WidgetListItem
					title={localizationConstants.b2bWidgetAd1}
					meta="Bygg · 2026-02-01 – 2026-04-30 · 842 / 96"
				/>
				<WidgetListItem
					title={localizationConstants.b2bWidgetAd2}
					meta="Måleri · 2026-03-01 – 2026-05-31 · 318 / 24"
				/>
				<Row
					label={localizationConstants.b2bWidgetAdPerformance}
					value="1 160 / 120"
				/>
				<MockTag />
			</Content>
		),
	},

	// 6. B2B-Kalender
	b2bCalendar: {
		title: localizationConstants.b2bWidgetCalendarTitle,
		icon: CalendarDays,
		content: (
			<Content>
				<Row
					label={localizationConstants.b2bWidgetCalendarDeadline}
					value="2026-03-20"
				/>
				<Row
					label={localizationConstants.b2bWidgetCalendarMeeting}
					value="2026-03-18 10:00"
				/>
				<Row
					label={localizationConstants.b2bWidgetCalendarPublication}
					value="2026-03-25"
				/>
				<MockTag />
			</Content>
		),
	},

	// 7. Senaste Aktivitet
	b2bActivity: {
		title: localizationConstants.b2bWidgetActivityTitle,
		icon: Zap,
		content: (
			<Content>
				<WidgetListItem
					title={localizationConstants.b2bWidgetActivityView}
					meta="2026-03-03"
				/>
				<WidgetListItem
					title={localizationConstants.b2bWidgetActivityNew}
					meta="2026-03-02"
				/>
				<WidgetListItem
					title={localizationConstants.b2bWidgetActivityStatus}
					meta="2026-02-28"
				/>
				<WidgetListItem
					title={localizationConstants.b2bWidgetActivityReceived}
					meta="2026-02-26"
				/>
				<MockTag />
			</Content>
		),
	},

	// 8. AI Rekommendationer
	b2bAiRecommendations: {
		title: localizationConstants.b2bWidgetAiTitle,
		icon: Bot,
		content: (
			<Content>
				<p>
					•{" "}
					<Translate
						text={localizationConstants.b2bWidgetAiAssignment}
					/>
				</p>
				<p>
					• <Translate text={localizationConstants.b2bWidgetAiContact} />
				</p>
				<p>
					• <Translate text={localizationConstants.b2bWidgetAiAd} />
				</p>
				<p>
					•{" "}
					<Translate
						text={localizationConstants.b2bWidgetAiNextAction}
					/>
				</p>
				<MockTag />
			</Content>
		),
	},

	// 9. Statistik
	b2bStatistics: {
		title: localizationConstants.b2bWidgetStatsTitle,
		icon: BarChart3,
		content: (
			<Content>
				<Row
					label={localizationConstants.b2bWidgetStatsViews}
					value="1 160"
				/>
				<Row
					label={localizationConstants.b2bWidgetStatsConversion}
					value="10 %"
				/>
				<Row
					label={localizationConstants.b2bWidgetStatsEngagement}
					value="6,2 / uppdrag"
				/>
				<Row
					label={localizationConstants.b2bWidgetStatsAdPerformance}
					value="120 klick"
				/>
				<Row
					label={localizationConstants.b2bWidgetStatsTrend}
					value="+18 %"
				/>
				<MockTag />
			</Content>
		),
	},

	// 10. Nyheter
	b2bNews: {
		title: localizationConstants.b2bWidgetNewsTitle,
		icon: Newspaper,
		content: (
			<Content>
				<WidgetListItem
					title={localizationConstants.b2bWidgetNews1}
					meta="2026-03-03"
				/>
				<WidgetListItem
					title={localizationConstants.b2bWidgetNews2}
					meta="2026-02-27"
				/>
				<WidgetListItem
					title={localizationConstants.b2bWidgetNews3}
					meta="2026-02-21"
				/>
				<MockTag />
			</Content>
		),
	},

	// 11. Bild
	image: {
		title: localizationConstants.b2bWidgetImageTitle,
		icon: ImageIcon,
		content: (
			<Content>
				<WidgetImagePlaceholder
					description={
						localizationConstants.b2bWidgetImageDescription
					}
				/>
				<MockTag />
			</Content>
		),
	},
};

/** Widget order defined by the B2B module widget structure ticket. */
export const B2B_WIDGET_ORDER = [
	"b2bOverview",
	"b2bAvailableAssignments",
	"b2bPublishedAssignments",
	"b2bInterestRegistrations",
	"b2bAds",
	"b2bCalendar",
	"b2bActivity",
	"b2bAiRecommendations",
	"b2bStatistics",
	"b2bNews",
	"image",
] as const;

/** The 11 widgets shown on first load, in ticket order. */
export const B2B_INITIAL_WIDGETS: PlacedWidgetEntry[] = B2B_WIDGET_ORDER.map(
	(id) => ({
		uid: `b2b-${id}`,
		sidebarId: id,
		colSpanClass: "col-span-12 md:col-span-6 xl:col-span-4",
		widgetProps: B2B_SIDEBAR_WIDGET_MAP[id],
	}),
);
