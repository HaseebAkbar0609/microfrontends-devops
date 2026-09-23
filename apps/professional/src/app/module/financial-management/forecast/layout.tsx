"use client";

import { RouteTabs } from "@/components/layout/RouteTabs";
import { FORECAST_NAV_ITEMS } from "@/features/financial-management/constants/economyNav.config";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";

/** Every Prognos page sits under the tab's own row of pages. */
export default function ForecastLayout({ children }: { children: React.ReactNode }) {
	const t = useTranslate();

	return (
		<>
			<div className="border-b border-slate-200 bg-white px-6">
				<RouteTabs items={FORECAST_NAV_ITEMS} ariaLabel={t(localizationConstants.forecastPagesLabel)} />
			</div>
			{children}
		</>
	);
}
