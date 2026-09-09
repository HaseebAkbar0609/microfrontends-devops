"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { ComingSoonPage } from "@/components/common/ComingSoonPage";
import { economyBreadcrumbs } from "@/features/financial-management/constants/economyNav.config";
import localizationConstants from "@/utils/translation/constants";

export default function ForecastPage() {
	return (
		<div className="flex flex-1 flex-col bg-slate-50/50 min-h-screen">
			<PageHeader
				title={localizationConstants.forecast}
				breadcrumbs={economyBreadcrumbs(localizationConstants.forecast)}
				className="border-b-0 px-6 pt-5 pb-2"
			/>
			<div className="flex flex-1 flex-col px-6 pt-2 pb-8 overflow-y-auto">
				<ComingSoonPage hideTitle />
			</div>
		</div>
	);
}
