import {
	Bot,
	Building2,
	CalendarDays,
	ClipboardList,
	CircleDollarSign,
	Globe,
	HardHat,
	Image as ImageIcon,
	Layers,
	Megaphone,
	Newspaper,
	Package,
	PanelsTopLeft,
	ShieldCheck,
	Star,
	Timer,
	TrendingUp,
	Truck,
} from "lucide-react";
import localizationConstants from "@/utils/translation/constants";
import { PlacedWidgetEntry, WidgetProps } from "../types/dashboard";
import React from "react";
import { Translate } from "@/utils/translation/translate";
import {
	WidgetContent as Content,
	WidgetMockTag as MockTag,
	WidgetRow as Row,
} from "./WidgetContent";

export const SIDEBAR_WIDGET_MAP: Record<string, WidgetProps> = {
	emptyPage: { title: localizationConstants.emptyPageLabel, icon: Layers },

	kpiDashboard: {
		title: localizationConstants.homeKpiTitle,
		icon: Star,
		content: (
			<Content>
				<Row
					label={localizationConstants.homeKpiActiveProjects}
					value="12"
				/>
				<Row
					label={localizationConstants.homeKpiOpenOrders}
					value="34"
				/>
				<Row
					label={localizationConstants.homeKpiMonthlyRevenue}
					value="1 536 000 SEK"
				/>
				<Row
					label={localizationConstants.homeKpiPendingOffers}
					value="7"
				/>
				<Row
					label={localizationConstants.homeKpiOverdueTasks}
					value="3"
				/>
				<MockTag />
			</Content>
		),
	},

	aiAssistant: {
		title: localizationConstants.homeAiTitle,
		icon: Bot,
		content: (
			<Content>
				<p className="text-slate-700">
					<Translate text={localizationConstants.homeAiGreeting} />
				</p>
				<p className="pt-1 font-medium text-slate-700">
					<Translate text={localizationConstants.homeAiSuggested} />
				</p>
				<p>
					•{" "}
					<Translate
						text={localizationConstants.homeAiRecommendation}
					/>
				</p>
				<p>
					•{" "}
					<Translate text={localizationConstants.homeAiActionQuote} />
				</p>
				<MockTag />
			</Content>
		),
	},

	messagesNews: {
		title: localizationConstants.homeMessagesTitle,
		icon: Megaphone,
		content: (
			<Content>
				<p className="font-medium text-slate-700">
					<Translate
						text={localizationConstants.homeMessagesAnnouncement}
					/>
				</p>
				<p>
					<Translate
						text={
							localizationConstants.homeMessagesAnnouncementText
						}
					/>
				</p>
				<p className="pt-1 font-medium text-slate-700">
					<Translate
						text={localizationConstants.homeMessagesUpdate}
					/>
				</p>
				<p>
					<Translate
						text={localizationConstants.homeMessagesUpdateText}
					/>
				</p>
				<Row
					label={localizationConstants.homeMessagesUnread}
					value="5"
				/>
				<MockTag />
			</Content>
		),
	},

	newsFeed: {
		title: localizationConstants.homeNewsFeedTitle,
		icon: Newspaper,
		content: (
			<Content>
				<div>
					<p className="text-slate-700">
						<Translate text={localizationConstants.homeNewsPost1} />
					</p>
					<p className="text-xs text-slate-400">
						<Translate text={localizationConstants.homeNewsTime1} />
					</p>
				</div>
				<div>
					<p className="text-slate-700">
						<Translate text={localizationConstants.homeNewsPost2} />
					</p>
					<p className="text-xs text-slate-400">
						<Translate text={localizationConstants.homeNewsTime2} />
					</p>
				</div>
				<div>
					<p className="text-slate-700">
						<Translate text={localizationConstants.homeNewsPost3} />
					</p>
					<p className="text-xs text-slate-400">
						<Translate text={localizationConstants.homeNewsTime3} />
					</p>
				</div>
				<MockTag />
			</Content>
		),
	},

	calendar: {
		title: localizationConstants.homeCalendarTitle,
		icon: CalendarDays,
		content: (
			<Content>
				<Row
					label={localizationConstants.homeCalendarSiteVisit}
					value="2026-03-04 09:00"
				/>
				<Row
					label={localizationConstants.homeCalendarDeadline}
					value="2026-03-12"
				/>
				<Row
					label={localizationConstants.homeCalendarMeeting}
					value="Fre 14:00"
				/>
				<MockTag />
			</Content>
		),
	},

	staff: {
		title: localizationConstants.homeStaffTitle,
		icon: HardHat,
		content: (
			<Content>
				<Row
					label={localizationConstants.homeStaffAvailable}
					value="6"
				/>
				<Row
					label={localizationConstants.homeStaffAssigned}
					value="18"
				/>
				<Row label={localizationConstants.homeStaffAbsence} value="2" />
				<Row
					label={localizationConstants.homeStaffRoles}
					value={
						<Translate
							text={localizationConstants.homeStaffRolesValue}
						/>
					}
				/>
				<MockTag />
			</Content>
		),
	},

	quotes: {
		title: localizationConstants.homeQuotesTitle,
		icon: CircleDollarSign,
		content: (
			<Content>
				<Row
					label={localizationConstants.homeQuotesPending}
					value="7"
				/>
				<Row
					label={localizationConstants.homeQuotesAccepted}
					value="3"
				/>
				<Row label={localizationConstants.homeQuotesDrafts} value="4" />
				<Row
					label={localizationConstants.homeQuotesTotalValue}
					value="15 800 000 SEK"
				/>
				<MockTag />
			</Content>
		),
	},

	orders: {
		title: localizationConstants.homeOrdersTitle,
		icon: ClipboardList,
		content: (
			<Content>
				<Row
					label={localizationConstants.homeOrdersActive}
					value="34"
				/>
				<Row
					label={localizationConstants.homeOrdersInProduction}
					value="21"
				/>
				<Row label={localizationConstants.homeOrdersRecent} value="5" />
				<Row
					label={localizationConstants.homeOrdersAttention}
					value="2"
				/>
				<MockTag />
			</Content>
		),
	},

	projects: {
		title: localizationConstants.homeProjectsTitle,
		icon: PanelsTopLeft,
		content: (
			<Content>
				<Row
					label={localizationConstants.homeKpiActiveProjects}
					value="12"
				/>
				<Row
					label={localizationConstants.homeProjectsProgress}
					value="64 %"
				/>
				<Row
					label={localizationConstants.homeProjectsRisks}
					value="2"
				/>
				<Row
					label={localizationConstants.homeProjectsDelayed}
					value="1"
				/>
				<Row
					label={localizationConstants.homeProjectsNextAction}
					value={
						<Translate
							text={
								localizationConstants.homeProjectsNextActionValue
							}
						/>
					}
				/>
				<MockTag />
			</Content>
		),
	},

	marketplace: {
		title: localizationConstants.homeMarketplaceTitle,
		icon: Globe,
		content: (
			<Content>
				<p className="text-slate-700">
					<Translate
						text={localizationConstants.homeMarketplaceProject}
					/>
				</p>
				<Row
					label={localizationConstants.homeMarketplaceValue}
					value="850 000 SEK"
				/>
				<Row
					label={localizationConstants.homeMarketplaceDeadline}
					value="2026-03-20"
				/>
				<button
					type="button"
					className="mt-1 cursor-pointer rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white"
				>
					<Translate
						text={localizationConstants.homeMarketplaceInterest}
					/>
				</button>
				<MockTag />
			</Content>
		),
	},

	timeReporting: {
		title: localizationConstants.homeTimeReportTitle,
		icon: Timer,
		content: (
			<Content>
				<Row
					label={localizationConstants.homeTimeReported}
					value="128 h"
				/>
				<Row label={localizationConstants.homeTimeMissing} value="3" />
				<Row label={localizationConstants.homeTimeApproval} value="6" />
				<button
					type="button"
					className="mt-1 cursor-pointer rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white"
				>
					<Translate
						text={localizationConstants.homeTimeReportAction}
					/>
				</button>
				<MockTag />
			</Content>
		),
	},

	kmaSecureCheck: {
		title: localizationConstants.homeKmaTitle,
		icon: ShieldCheck,
		content: (
			<Content>
				<Row
					label={localizationConstants.homeKmaSafetyChecks}
					value="45"
				/>
				<Row
					label={localizationConstants.homeKmaDeviations}
					value="2"
				/>
				<Row label={localizationConstants.homeKmaIncidents} value="0" />
				<Row label={localizationConstants.homeKmaOpenTasks} value="4" />
				<Row
					label={localizationConstants.homeKmaSecureCheck}
					value={
						<Translate
							text={localizationConstants.homeKmaSecureCheckValue}
						/>
					}
				/>
				<MockTag />
			</Content>
		),
	},

	purchasing: {
		title: localizationConstants.homePurchaseTitle,
		icon: Package,
		content: (
			<Content>
				<Row
					label={localizationConstants.homePurchaseRequests}
					value="8"
				/>
				<Row
					label={localizationConstants.homePurchaseApprovals}
					value="3"
				/>
				<Row
					label={localizationConstants.homePurchaseSupplierOrders}
					value="12"
				/>
				<Row
					label={localizationConstants.homePurchaseDelivery}
					value="2"
				/>
				<MockTag />
			</Content>
		),
	},

	vehicles: {
		title: localizationConstants.homeVehiclesTitle,
		icon: Truck,
		content: (
			<Content>
				<Row
					label={localizationConstants.homeVehiclesAvailable}
					value="4"
				/>
				<Row
					label={localizationConstants.homeVehiclesService}
					value="2"
				/>
				<Row
					label={localizationConstants.homeVehiclesAssigned}
					value="9"
				/>
				<Row
					label={localizationConstants.homeVehiclesInspection}
					value="1"
				/>
				<MockTag />
			</Content>
		),
	},

	economyForecast: {
		title: localizationConstants.homeEconomyTitle,
		icon: TrendingUp,
		content: (
			<Content>
				<Row
					label={localizationConstants.homeEconomyForecast}
					value="18 400 000 SEK"
				/>
				<Row
					label={localizationConstants.homeEconomyCosts}
					value="12 100 000 SEK"
				/>
				<Row
					label={localizationConstants.homeEconomyMargin}
					value="34 %"
				/>
				<Row
					label={localizationConstants.homeEconomyUnpaid}
					value="6"
				/>
				<Row
					label={localizationConstants.homeEconomyDeviation}
					value="-2 %"
				/>
				<MockTag />
			</Content>
		),
	},

	companyPresentation: {
		title: localizationConstants.homeCompanyTitle,
		icon: Building2,
		content: (
			<Content>
				<p className="font-medium text-slate-700">Karles Bygg AB</p>
				<Row
					label={localizationConstants.homeCompanyServices}
					value={
						<Translate
							text={
								localizationConstants.homeCompanyServicesValue
							}
						/>
					}
				/>
				<Row
					label={localizationConstants.homeCompanyCertifications}
					value="ID06, BF9K"
				/>
				<button
					type="button"
					className="mt-1 cursor-pointer rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700"
				>
					<Translate text={localizationConstants.homeCompanyEdit} />
				</button>
				<MockTag />
			</Content>
		),
	},

	image: {
		title: localizationConstants.homeImageTitle,
		icon: ImageIcon,
		content: (
			<Content>
				<div className="flex h-20 items-center justify-center rounded-md bg-slate-200/70 text-slate-400">
					<ImageIcon size={24} />
				</div>
				<p>
					<Translate
						text={localizationConstants.homeImageDescription}
					/>
				</p>
				<MockTag />
			</Content>
		),
	},
};

export const HOME_WIDGET_ORDER = [
	"kpiDashboard",
	"aiAssistant",
	"messagesNews",
	"newsFeed",
	"calendar",
	"staff",
	"quotes",
	"orders",
	"projects",
	"marketplace",
	"timeReporting",
	"kmaSecureCheck",
	"purchasing",
	"vehicles",
	"economyForecast",
	"companyPresentation",
	"image",
] as const;

export const INITIAL_WIDGETS: PlacedWidgetEntry[] = HOME_WIDGET_ORDER.map(
	(id) => ({
		uid: `home-${id}`,
		sidebarId: id,
		colSpanClass: "col-span-12 md:col-span-6 xl:col-span-4",
		widgetProps: SIDEBAR_WIDGET_MAP[id],
	}),
);
