"use client";

import { useEffect, useState } from "react";
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
import {
	listAvailableOffersAPIAction,
	listOffersAPIAction,
	OFFER_API_STATUS,
} from "@/api-actions/offers";
import { useAuthStatus } from "@/context/AuthContext";
import localizationConstants from "@/utils/translation/constants";
import type { WidgetProps } from "@/features/widgetdashboard/types/dashboard";
import {
	WidgetContent as Content,
	WidgetRow as Row,
} from "@/features/widgetdashboard/components/WidgetContent";

type OfferDashboardCounts = {
	available: number;
	requested: number;
	offered: number;
	accepted: number;
	agreed: number;
	archived: number;
};

const EMPTY_COUNTS: OfferDashboardCounts = {
	available: 0,
	requested: 0,
	offered: 0,
	accepted: 0,
	agreed: 0,
	archived: 0,
};

let cachedCompanyId = "";
let cachedCounts: OfferDashboardCounts | null = null;
let pendingCounts: Promise<OfferDashboardCounts> | null = null;

const loadCounts = (companyId: string): Promise<OfferDashboardCounts> => {
	if (cachedCompanyId === companyId && cachedCounts) {
		return Promise.resolve(cachedCounts);
	}
	if (cachedCompanyId === companyId && pendingCounts) return pendingCounts;
	cachedCompanyId = companyId;
	pendingCounts = Promise.all([
		listAvailableOffersAPIAction({ companyId, page: 1, pageSize: 1 }),
		listOffersAPIAction({ status: OFFER_API_STATUS.REQUESTED, companyId, page: 1, pageSize: 1 }),
		listOffersAPIAction({ status: OFFER_API_STATUS.OFFERED, companyId, page: 1, pageSize: 1 }),
		listOffersAPIAction({ status: OFFER_API_STATUS.ACCEPTED, companyId, page: 1, pageSize: 1 }),
		listOffersAPIAction({ status: OFFER_API_STATUS.AGREED, companyId, page: 1, pageSize: 1 }),
		listOffersAPIAction({ status: OFFER_API_STATUS.ARCHIVED, companyId, page: 1, pageSize: 1 }),
	]).then(([available, requested, offered, accepted, agreed, archived]) => {
		cachedCounts = {
			available: available.totalItems,
			requested: requested.totalItems,
			offered: offered.totalItems,
			accepted: accepted.totalItems,
			agreed: agreed.totalItems,
			archived: archived.totalItems,
		};
		pendingCounts = null;
		return cachedCounts;
	});
	return pendingCounts;
};

const LiveOfferWidget = ({ focus }: { focus: keyof OfferDashboardCounts | "summary" | "empty" }) => {
	const { company } = useAuthStatus();
	const [counts, setCounts] = useState<OfferDashboardCounts>(EMPTY_COUNTS);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);

	useEffect(() => {
		let cancelled = false;
		if (!company?.id || focus === "empty") {
			setLoading(false);
			return;
		}
		setLoading(true);
		setError(false);
		loadCounts(company.id)
			.then((data) => !cancelled && setCounts(data))
			.catch(() => !cancelled && setError(true))
			.finally(() => !cancelled && setLoading(false));
		return () => {
			cancelled = true;
		};
	}, [company?.id, focus]);

	if (focus === "empty") {
		return <p className="py-6 text-sm text-slate-500">No live data is available for this widget yet.</p>;
	}
	if (loading) return <div className="my-4 h-20 animate-pulse rounded-lg bg-white/70" />;
	if (error) return <p className="py-6 text-sm text-red-600">Live offer data could not be loaded.</p>;

	const total = counts.requested + counts.offered + counts.accepted + counts.agreed;
	const conversion = counts.offered > 0
		? Math.round(((counts.accepted + counts.agreed) / counts.offered) * 100)
		: 0;

	return (
		<Content>
			{focus === "summary" ? (
				<>
					<Row label={localizationConstants.offerWidgetOverviewTotal} value={String(total)} />
					<Row label={localizationConstants.offerWidgetOverviewSent} value={String(counts.offered)} />
					<Row label={localizationConstants.offerWidgetOverviewAccepted} value={String(counts.accepted + counts.agreed)} />
					<Row label={localizationConstants.offerWidgetOverviewConversion} value={conversion + " %"} />
				</>
			) : (
				<Row label={localizationConstants.offerWidgetOverviewTotal} value={String(counts[focus])} />
			)}
		</Content>
	);
};

export const OFFER_SIDEBAR_WIDGET_MAP: Record<string, WidgetProps> = {
	emptyPage: { title: localizationConstants.emptyPageLabel, icon: Layers },
	offerOverview: { title: localizationConstants.offerWidgetOverviewTitle, icon: ClipboardList, content: <LiveOfferWidget focus="summary" /> },
	offerRequests: { title: localizationConstants.offerWidgetRequestsTitle, icon: Inbox, content: <LiveOfferWidget focus="requested" /> },
	offerAvailableProjects: { title: localizationConstants.offerWidgetProjectsTitle, icon: Globe, content: <LiveOfferWidget focus="available" /> },
	offerSent: { title: localizationConstants.offerWidgetSentTitle, icon: Send, content: <LiveOfferWidget focus="offered" /> },
	offerAccepted: { title: localizationConstants.offerWidgetAcceptedTitle, icon: CheckCircle2, content: <LiveOfferWidget focus="accepted" /> },
	offerCalendar: { title: localizationConstants.offerWidgetCalendarTitle, icon: CalendarDays, content: <LiveOfferWidget focus="empty" /> },
	offerActivity: { title: localizationConstants.offerWidgetActivityTitle, icon: Zap, content: <LiveOfferWidget focus="summary" /> },
	offerAiCalc: { title: localizationConstants.offerWidgetAiCalcTitle, icon: Bot, content: <LiveOfferWidget focus="empty" /> },
	offerValue: { title: localizationConstants.offerWidgetValueTitle, icon: CircleDollarSign, content: <LiveOfferWidget focus="summary" /> },
	offerStatistics: { title: localizationConstants.offerWidgetStatsTitle, icon: BarChart3, content: <LiveOfferWidget focus="summary" /> },
	offerHistory: { title: localizationConstants.offerWidgetHistoryTitle, icon: History, content: <LiveOfferWidget focus="archived" /> },
	offerNews: { title: localizationConstants.offerWidgetNewsTitle, icon: Newspaper, content: <LiveOfferWidget focus="empty" /> },
	image: { title: localizationConstants.offerWidgetImageTitle, icon: ImageIcon, content: <LiveOfferWidget focus="empty" /> },
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
