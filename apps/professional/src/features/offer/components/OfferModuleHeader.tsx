"use client";

import { RouteTabs } from "@/components/layout/RouteTabs";
import { RouteTabItem } from "@/types/navigation";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { cn } from "@/lib/utils";

export const OFFER_MODULE_BASE_URL = "/module/business/offer";

export type OfferTabId =
	| "dashboard"
	| "available"
	| "request"
	| "quoted"
	| "accepted"
	| "agreed"
	| "archived";

interface OfferModuleHeaderProps {
	activeTab?: OfferTabId;
	className?: string;
}

export const OFFER_TABS: RouteTabItem[] = [
	{
		id: "dashboard",
		labelKey: localizationConstants.offerTabDashboard,
		href: `${OFFER_MODULE_BASE_URL}/dashboard`,
		exact: true,
	},
	{
		id: "available",
		labelKey: localizationConstants.offerTabAvailable,
		href: `${OFFER_MODULE_BASE_URL}/list`,
		matchSubPaths: [`${OFFER_MODULE_BASE_URL}/available`],
	},
	{
		id: "request",
		labelKey: localizationConstants.offerTabRequest,
		href: `${OFFER_MODULE_BASE_URL}/request`,
	},
	{
		id: "quoted",
		labelKey: localizationConstants.offerTabQuoted,
		href: `${OFFER_MODULE_BASE_URL}/quoted`,
	},
	{
		id: "accepted",
		labelKey: localizationConstants.offerTabAccepted,
		href: `${OFFER_MODULE_BASE_URL}/accepted`,
	},
	{
		id: "agreed",
		labelKey: localizationConstants.offerTabAgreed,
		href: `${OFFER_MODULE_BASE_URL}/agreed`,
	},
	{
		id: "archived",
		labelKey: localizationConstants.offerTabArchived,
		href: `${OFFER_MODULE_BASE_URL}/archived`,
	},
];

export function OfferModuleHeader({
	className,
}: OfferModuleHeaderProps) {
	return (
		<div className={cn("flex flex-col bg-white border-b border-slate-200 px-6 pt-5", className)}>
			{/* Main Module Title */}
			<div className="pb-3.5">
				<h1 className="text-2xl font-bold text-slate-950 tracking-tight">
					<Translate text={localizationConstants.offerList} />
				</h1>
			</div>

			{/* Top Navigation Tabs */}
			<div className="-mb-[1px]">
				<RouteTabs items={OFFER_TABS} ariaLabel="Offer Tabs" />
			</div>
		</div>
	);
}

export default OfferModuleHeader;
