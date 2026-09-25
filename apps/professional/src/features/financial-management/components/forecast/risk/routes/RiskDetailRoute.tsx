"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { FORECAST_RISK_BASE_ROUTE, riskRoutes } from "../../../../constants/forecastRisk.constants";
import { useForecastRiskDetail } from "../../../../hooks/useForecastRiskDetail";
import { RiskClientDetailPage } from "../detail/RiskClientDetailPage";

export interface RiskDetailRouteProps {
	id: string;
	/** Which module the screen is mounted in; every link is built from it. */
	basePath?: string;
}

/** The client screen as a route: the lookup, the way back, and the screen itself. */
export function RiskDetailRoute({ id, basePath = FORECAST_RISK_BASE_ROUTE }: RiskDetailRouteProps) {
	const router = useRouter();
	const routes = riskRoutes(basePath);
	const { client, totals, settings, setSetting, save } = useForecastRiskDetail(id);

	if (!client || !totals || !settings) {
		return (
			<div className="flex min-h-[400px] flex-col items-center justify-center p-12">
				<p className="mb-2 text-base font-semibold text-slate-800">
					<Translate text={localizationConstants.forecastRiskNotFound} /> (#{id})
				</p>
				<Button
					type="button"
					variant="outline"
					onClick={() => router.push(routes.list)}
					className="cursor-pointer gap-2 text-xs"
				>
					<ArrowLeft className="h-4 w-4" />
					<Translate text={localizationConstants.btnBackToList} />
				</Button>
			</div>
		);
	}

	return (
		<RiskClientDetailPage
			client={client}
			totals={totals}
			settings={settings}
			onSettingChange={setSetting}
			onSave={save}
			basePath={basePath}
		/>
	);
}

export default RiskDetailRoute;
