"use client";

import { usePathname } from "next/navigation";
import { RouteTabs } from "@/components/layout/RouteTabs";
import { PageHeader } from "@/components/layout/PageHeader";
import localizationConstants from "@/utils/translation/constants";
import { ECONOMY_NAV_ITEMS, economyBreadcrumbs } from "@/features/financial-management/constants/economyNav.config";

export default function EconomyLayout({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	const isSubRoute =
		pathname.includes("/create") ||
		pathname.includes("/edit") ||
		/\/(claims|certificates|budget|bank|authorities|cases)\/.+$/.test(pathname);

	return (
		<div className="flex flex-1 flex-col overflow-hidden">
			<div className="flex flex-1 flex-col overflow-y-auto min-h-0">
				{!isSubRoute && (
					<>
						<PageHeader
							title={localizationConstants.economy}
							breadcrumbs={economyBreadcrumbs(localizationConstants.economy)}
							className="border-b-0 px-6 pt-5 pb-2"
						/>
						<div className="border-b border-slate-200 bg-white px-6">
							<RouteTabs items={ECONOMY_NAV_ITEMS} ariaLabel="Economy sections" />
						</div>
					</>
				)}
				{children}
			</div>
		</div>
	);
}
