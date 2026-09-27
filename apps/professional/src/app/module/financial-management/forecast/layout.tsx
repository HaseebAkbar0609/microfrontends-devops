"use client";

import { usePathname } from "next/navigation";

import { RouteTabs } from "@/components/layout/RouteTabs";
import { FORECAST_NAV_ITEMS } from "@/features/financial-management/constants/economyNav.config";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";

/** Every Prognos page sits under the tab's own row of pages. */
export default function ForecastLayout({ children }: { children: React.ReactNode }) {
	const t = useTranslate();
	const pathname = usePathname();
	/* A page's own screens — a budget's detail and form — carry their own header
	   and back arrow, so the row of pages steps aside for them. */
	const isSubRoute = /\/forecast\/[^/]+\/.+/.test(pathname);

	return (
		<>
			{!isSubRoute && (
				<div className="border-b border-slate-200 bg-white px-6">
					<RouteTabs items={FORECAST_NAV_ITEMS} ariaLabel={t(localizationConstants.forecastPagesLabel)} />
				</div>
			)}
			{children}
		</>
	);
}
