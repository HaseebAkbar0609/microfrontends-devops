"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

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
	offerId?: string;
	className?: string;
}

export function OfferModuleHeader({
	activeTab = "available",
	offerId = "1001",
	className,
}: OfferModuleHeaderProps) {
	const pathname = usePathname();

	const tabs = [
		{
			id: "dashboard" as OfferTabId,
			label: localizationConstants.offerTabDashboard,
			href: `${OFFER_MODULE_BASE_URL}/dashboard`,
			isActive: activeTab === "dashboard" || pathname.includes("/offer/dashboard"),
		},
		{
			id: "available" as OfferTabId,
			label: localizationConstants.offerTabAvailable,
			href: `${OFFER_MODULE_BASE_URL}/list`,
			isActive:
				activeTab === "available" ||
				pathname === `${OFFER_MODULE_BASE_URL}/list` ||
				pathname === OFFER_MODULE_BASE_URL ||
				pathname.startsWith(`${OFFER_MODULE_BASE_URL}/list`) ||
				pathname.includes("/available"),
		},
		{
			id: "request" as OfferTabId,
			label: localizationConstants.offerTabRequest,
			href: `${OFFER_MODULE_BASE_URL}/${offerId}/request`,
			isActive: activeTab === "request" || pathname.includes("/request"),
		},
		{
			id: "quoted" as OfferTabId,
			label: localizationConstants.offerTabQuoted,
			href: `${OFFER_MODULE_BASE_URL}/${offerId}/quoted`,
			isActive: activeTab === "quoted" || pathname.includes("/quoted"),
		},
		{
			id: "accepted" as OfferTabId,
			label: localizationConstants.offerTabAccepted,
			href: `${OFFER_MODULE_BASE_URL}/${offerId}/accepted`,
			isActive: activeTab === "accepted" || pathname.includes("/accepted"),
		},
		{
			id: "agreed" as OfferTabId,
			label: localizationConstants.offerTabAgreed,
			href: `${OFFER_MODULE_BASE_URL}/${offerId}/agreed`,
			isActive: activeTab === "agreed" || pathname.includes("/agreed"),
		},
		{
			id: "archived" as OfferTabId,
			label: localizationConstants.offerTabArchived,
			href: `${OFFER_MODULE_BASE_URL}/${offerId}/archived`,
			isActive: activeTab === "archived" || pathname.includes("/archived"),
		},
	];

	return (
		<div className={cn("flex flex-col bg-white border-b border-slate-200 px-6 pt-5", className)}>
			{/* Main Module Title */}
			<h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-4">
				<Translate text={localizationConstants.offerList} />
			</h1>

			{/* Top Navigation Tabs */}
			<div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
				{tabs.map((tab) => (
					<Link
						key={tab.id}
						href={tab.href}
						className={cn(
							"pb-3 text-sm font-medium transition-all relative whitespace-nowrap cursor-pointer",
							tab.isActive
								? "text-slate-900 font-semibold border-b-2 border-slate-900 -mb-px"
								: "text-slate-500 hover:text-slate-800"
						)}
					>
						<Translate text={tab.label} />
					</Link>
				))}
			</div>
		</div>
	);
}

export default OfferModuleHeader;
