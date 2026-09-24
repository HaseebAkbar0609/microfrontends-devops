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

const cachedCounts = new Map<string, { value: OfferDashboardCounts; expiresAt: number }>();
const pendingCounts = new Map<string, Promise<OfferDashboardCounts>>();

const loadCounts = (companyId: string): Promise<OfferDashboardCounts> => {
	const cached = cachedCounts.get(companyId);
	if (cached && cached.expiresAt > Date.now()) return Promise.resolve(cached.value);
	const pending = pendingCounts.get(companyId);
	if (pending) return pending;
	const request = Promise.all([
		listAvailableOffersAPIAction({ companyId, page: 1, pageSize: 1 }),
		listOffersAPIAction({ status: OFFER_API_STATUS.REQUESTED, companyId, page: 1, pageSize: 1 }),
		listOffersAPIAction({ status: OFFER_API_STATUS.OFFERED, companyId, page: 1, pageSize: 1 }),
		listOffersAPIAction({ status: OFFER_API_STATUS.ACCEPTED, companyId, page: 1, pageSize: 1 }),
		listOffersAPIAction({ status: OFFER_API_STATUS.AGREED, companyId, page: 1, pageSize: 1 }),
		listOffersAPIAction({ status: OFFER_API_STATUS.ARCHIVED, companyId, page: 1, pageSize: 1 }),
	]).then(([available, requested, offered, accepted, agreed, archived]) => {
		const counts = {
			available: available.totalItems,
			requested: requested.totalItems,
			offered: offered.totalItems,
			accepted: accepted.totalItems,
			agreed: agreed.totalItems,
			archived: archived.totalItems,
		};
		cachedCounts.set(companyId, { value: counts, expiresAt: Date.now() + 60_000 });
		return counts;
	}).finally(() => pendingCounts.delete(companyId));
	pendingCounts.set(companyId, request);
	return request;
};

const LiveOfferWidget = ({ focus }: { focus: keyof OfferDashboardCounts }) => {
	const { company } = useAuthStatus();
	const [counts, setCounts] = useState<OfferDashboardCounts | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);

	useEffect(() => {
		let cancelled = false;
		if (!company?.id) return;
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

	if (loading) return <div className="my-4 h-20 animate-pulse rounded-lg bg-white/70" />;
	if (error) return <p className="py-6 text-sm text-red-600">Live offer data could not be loaded.</p>;
	if (!counts) return null;

	return (
		<Content>
			<Row label={localizationConstants.offerWidgetOverviewTotal} value={String(counts[focus])} />
		</Content>
	);
};

export const OFFER_SIDEBAR_WIDGET_MAP: Record<string, WidgetProps> = {
	emptyPage: { title: localizationConstants.emptyPageLabel, icon: Layers },
	offerOverview: { title: localizationConstants.offerWidgetOverviewTitle, icon: ClipboardList },
	offerRequests: { title: localizationConstants.offerWidgetRequestsTitle, icon: Inbox, content: <LiveOfferWidget focus="requested" /> },
	offerAvailableProjects: { title: localizationConstants.offerWidgetProjectsTitle, icon: Globe, content: <LiveOfferWidget focus="available" /> },
	offerSent: { title: localizationConstants.offerWidgetSentTitle, icon: Send, content: <LiveOfferWidget focus="offered" /> },
	offerAccepted: { title: localizationConstants.offerWidgetAcceptedTitle, icon: CheckCircle2, content: <LiveOfferWidget focus="accepted" /> },
	offerCalendar: { title: localizationConstants.offerWidgetCalendarTitle, icon: CalendarDays },
	offerActivity: { title: localizationConstants.offerWidgetActivityTitle, icon: Zap },
	offerAiCalc: { title: localizationConstants.offerWidgetAiCalcTitle, icon: Bot },
	offerValue: { title: localizationConstants.offerWidgetValueTitle, icon: CircleDollarSign },
	offerStatistics: { title: localizationConstants.offerWidgetStatsTitle, icon: BarChart3 },
	offerHistory: { title: localizationConstants.offerWidgetHistoryTitle, icon: History, content: <LiveOfferWidget focus="archived" /> },
	offerNews: { title: localizationConstants.offerWidgetNewsTitle, icon: Newspaper },
	image: { title: localizationConstants.offerWidgetImageTitle, icon: ImageIcon },
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
