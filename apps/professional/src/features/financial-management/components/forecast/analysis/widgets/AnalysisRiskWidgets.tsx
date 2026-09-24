import { Lightbulb, ShieldAlert } from "lucide-react";

import type { WidgetProps } from "@/features/widgetdashboard/types/dashboard";
import { cn } from "@/lib/utils";
import type { TranslationKeys } from "@/utils/translation/constants";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { FORECAST_ANALYSIS_CARD_TITLES } from "../../../../constants/forecastAnalysis.constants";
import type { AnalysisOpportunitySummary, AnalysisRiskItem } from "../../../../types/forecastAnalysis.types";
import { formatSek } from "../../../../utils/economyFormatters";

/**
 * The frame gives these two cards a coloured title bar. The shared card owns
 * its own header, so the colour reads as a band at the top of the content.
 */
function BandedBlock({
	headingKey,
	amount,
	className,
	children,
}: {
	headingKey: TranslationKeys;
	amount: number;
	className: string;
	children: React.ReactNode;
}) {
	return (
		<div className="flex flex-1 flex-col gap-3">
			<div className={cn("rounded-sm px-3 py-2 text-sm font-semibold text-white", className)}>
				<Translate text={headingKey} />
			</div>
			<p className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums">{formatSek(amount)}</p>
			{children}
		</div>
	);
}

function ItemList({ items, dotClassName }: { items: { id: string; labelKey: TranslationKeys }[]; dotClassName: string }) {
	return (
		<ul className="space-y-1.5 text-sm text-slate-600">
			{items.map((item) => (
				<li key={item.id} className="flex items-center gap-2">
					<span className={cn("size-2 shrink-0 rounded-full", dotClassName)} aria-hidden />
					<Translate text={item.labelKey} />
				</li>
			))}
		</ul>
	);
}

export interface AnalysisRiskWidgetsInput {
	/** What the selection has at stake, the same figure the KPI card totals. */
	riskExposure: number;
	opportunities: AnalysisOpportunitySummary;
	risks: AnalysisRiskItem[];
}

/** Risker & möjligheter, and Möjligheter — the frame's two banded cards. */
export function createAnalysisRiskWidgets({
	riskExposure,
	opportunities,
	risks,
}: AnalysisRiskWidgetsInput): Record<string, WidgetProps> {
	return {
		riskOpportunities: {
			title: FORECAST_ANALYSIS_CARD_TITLES.riskOpportunities,
			icon: ShieldAlert,
			content: (
				<BandedBlock
					headingKey={localizationConstants.forecastAnalysisPotentialRisks}
					amount={riskExposure}
					className="bg-slate-900"
				>
					<ItemList items={risks} dotClassName="bg-blue-500" />
				</BandedBlock>
			),
		},
		opportunities: {
			title: FORECAST_ANALYSIS_CARD_TITLES.opportunities,
			icon: Lightbulb,
			content: (
				<BandedBlock
					headingKey={localizationConstants.forecastAnalysisOpportunityUpside}
					amount={opportunities.upside}
					className="bg-red-500"
				>
					<ItemList items={opportunities.items} dotClassName="bg-blue-500" />
					<p className="mt-auto inline-flex self-start rounded-sm bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700 tabular-nums">
						<Translate text={localizationConstants.forecastAnalysisNetImpact} />: {formatSek(opportunities.netImpact)}
					</p>
				</BandedBlock>
			),
		},
	};
}
