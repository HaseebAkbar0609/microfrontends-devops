"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

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

export function OfferModuleHeader({
	activeTab = "available",
	className,
}: OfferModuleHeaderProps) {
	const pathname = usePathname();

	const tabs = [
		{
			id: "dashboard" as OfferTabId,
			label: localizationConstants.offerTabDashboard,
			href: "/module/business/offer/dashboard",
			isActive: activeTab === "dashboard" || pathname.includes("/offer/dashboard"),
		},
		{
			id: "available" as OfferTabId,
			label: localizationConstants.offerTabAvailable,
			href: "/module/business/offer/list",
			isActive:
				activeTab === "available" ||
				pathname === "/module/business/offer/list" ||
				pathname === "/module/business/offer",
		},
		{
			id: "request" as OfferTabId,
			label: localizationConstants.offerTabRequest,
			href: "/module/business/offer/1001/request",
			isActive: activeTab === "request" || pathname.includes("/request"),
		},
		{
			id: "quoted" as OfferTabId,
			label: localizationConstants.offerTabQuoted,
			href: "/module/business/offer/1001/quoted",
			isActive: activeTab === "quoted" || pathname.includes("/quoted"),
		},
		{
			id: "accepted" as OfferTabId,
			label: localizationConstants.offerTabAccepted,
			href: "/module/business/offer/1001/accepted",
			isActive: activeTab === "accepted" || pathname.includes("/accepted"),
		},
		{
			id: "agreed" as OfferTabId,
			label: localizationConstants.offerTabAgreed,
			href: "/module/business/offer/1001/agreed",
			isActive: activeTab === "agreed" || pathname.includes("/agreed"),
		},
		{
			id: "archived" as OfferTabId,
			label: localizationConstants.offerTabArchived,
			href: "/module/business/offer/1001/archived",
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
