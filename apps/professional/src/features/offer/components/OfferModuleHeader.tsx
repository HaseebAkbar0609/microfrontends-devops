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
	activeTab,
	offerId = "1001",
	className,
}: OfferModuleHeaderProps) {
	const pathname = usePathname();

	const getIsActive = (tabId: OfferTabId) => {
		if (activeTab) {
			return activeTab === tabId;
		}

		if (tabId === "dashboard") {
			return pathname.includes("/offer/dashboard");
		}
		if (tabId === "available") {
			return (
				pathname === `${OFFER_MODULE_BASE_URL}/list` ||
				pathname === OFFER_MODULE_BASE_URL ||
				pathname.startsWith(`${OFFER_MODULE_BASE_URL}/list`) ||
				pathname.includes("/available")
			);
		}
		if (tabId === "request") {
			return pathname.includes("/request");
		}
		if (tabId === "quoted") {
			return pathname.includes("/quoted");
		}
		if (tabId === "accepted") {
			return pathname.includes("/accepted");
		}
		if (tabId === "agreed") {
			return pathname.includes("/agreed");
		}
		if (tabId === "archived") {
			return pathname.includes("/archived");
		}
		return false;
	};

	const tabs = [
		{
			id: "dashboard" as OfferTabId,
			label: localizationConstants.offerTabDashboard,
			href: `${OFFER_MODULE_BASE_URL}/dashboard`,
			isActive: getIsActive("dashboard"),
		},
		{
			id: "available" as OfferTabId,
			label: localizationConstants.offerTabAvailable,
			href: `${OFFER_MODULE_BASE_URL}/list`,
			isActive: getIsActive("available"),
		},
		{
			id: "request" as OfferTabId,
			label: localizationConstants.offerTabRequest,
			href: `${OFFER_MODULE_BASE_URL}/${offerId}/request`,
			isActive: getIsActive("request"),
		},
		{
			id: "quoted" as OfferTabId,
			label: localizationConstants.offerTabQuoted,
			href: `${OFFER_MODULE_BASE_URL}/quoted`,
			isActive: getIsActive("quoted"),
		},
		{
			id: "accepted" as OfferTabId,
			label: localizationConstants.offerTabAccepted,
			href: `${OFFER_MODULE_BASE_URL}/accepted`,
			isActive: getIsActive("accepted"),
		},
		{
			id: "agreed" as OfferTabId,
			label: localizationConstants.offerTabAgreed,
			href: `${OFFER_MODULE_BASE_URL}/${offerId}/agreed`,
			isActive: getIsActive("agreed"),
		},
		{
			id: "archived" as OfferTabId,
			label: localizationConstants.offerTabArchived,
			href: `${OFFER_MODULE_BASE_URL}/${offerId}/archived`,
			isActive: getIsActive("archived"),
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
