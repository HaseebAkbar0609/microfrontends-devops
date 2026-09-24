import { Gauge, ShieldAlert } from "lucide-react";

import type { WidgetProps } from "@/features/widgetdashboard/types/dashboard";
import { cn } from "@/lib/utils";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import {
	FORECAST_ANALYSIS_ACCURACY_THRESHOLDS,
	FORECAST_KEY_FIGURES_CARD_TITLES,
} from "../../../../../constants/forecastAnalysis.constants";
import type {
	AnalysisForecastQuality,
	AnalysisOpportunitySummary,
	AnalysisRiskItem,
} from "../../../../../types/forecastAnalysis.types";
import { formatPercent, formatSek } from "../../../../../utils/economyFormatters";
import { StatBlock, TONE_CLASS, changeTone } from "../../widgets/AnalysisCardParts";

/** Accuracy reads well above the good threshold, poorly below the fair one. */
function accuracyTone(accuracy: number) {
	if (accuracy >= FORECAST_ANALYSIS_ACCURACY_THRESHOLDS.good) return "positive" as const;
	if (accuracy >= FORECAST_ANALYSIS_ACCURACY_THRESHOLDS.fair) return "neutral" as const;
	return "negative" as const;
}

/** Prognoskvalitet: how close the forecast ran, and how often it was rewritten. */
function QualityBody({ quality }: { quality: AnalysisForecastQuality }) {
	/* Fewer revisions is the good news, so a rise reads badly. */
	const revisionTone = changeTone(quality.revisionChangePercent, false);

	return (
		<div className="flex flex-1 flex-wrap gap-6">
			<StatBlock
				labelKey={localizationConstants.forecastAnalysisKpiAccuracy}
				value={formatPercent(quality.accuracyPercent)}
				meta={
					<span className={cn("font-medium", TONE_CLASS[accuracyTone(quality.accuracyPercent)])}>
						<Translate
							text={localizationConstants.forecastKeyFiguresMape}
						/>
						: {formatPercent(quality.mapePercent)}
					</span>
				}
			/>
			<StatBlock
				labelKey={localizationConstants.forecastKeyFiguresRevisions}
				value={quality.revisions}
				meta={
					<>
						<p>
							<Translate text={localizationConstants.forecastKeyFiguresRevisionsThisPeriod} />
						</p>
						<p className={cn("font-medium", TONE_CLASS[revisionTone])}>
							<Translate
								text={localizationConstants.forecastKeyFiguresRevisionsChange}
								values={{ percent: formatPercent(quality.revisionChangePercent, 0) }}
							/>
						</p>
					</>
				}
			/>
		</div>
	);
}

/** The named items behind a figure: the risks it carries, or the upside it counts. */
function ItemList({ items, dotClass }: { items: { id: string; labelKey: TranslationKeys }[]; dotClass: string }) {
	return (
		<ul className="space-y-1">
			{items.map((item) => (
				<li key={item.id} className="flex items-center gap-2">
					<span className={cn("size-1.5 shrink-0 rounded-full", dotClass)} aria-hidden />
					<Translate text={item.labelKey} />
				</li>
			))}
		</ul>
	);
}

/** Risker & möjligheter, as Nyckeltal draws it: what is exposed beside what is
    to be gained. Both figures are the ones Analys already reports, so the two
    tabs agree, and each keeps its own list rather than borrowing the other's. */
function RiskBody({
	riskExposure,
	opportunities,
	risks,
}: {
	riskExposure: number;
	opportunities: AnalysisOpportunitySummary;
	risks: AnalysisRiskItem[];
}) {
	return (
		<div className="flex flex-1 flex-wrap gap-6">
			<StatBlock
				labelKey={localizationConstants.forecastKeyFiguresForecastRisk}
				value={formatSek(riskExposure)}
				meta={<ItemList items={risks} dotClass="bg-red-500" />}
			/>
			<StatBlock
				labelKey={localizationConstants.forecastAnalysisNetImpact}
				value={formatSek(opportunities.netImpact)}
				meta={<ItemList items={opportunities.items} dotClass="bg-emerald-500" />}
			/>
		</div>
	);
}

export interface KeyFiguresQualityInput {
	quality: AnalysisForecastQuality;
	/** The same exposure the KPI card reports, so the two cards agree. */
	riskExposure: number;
	opportunities: AnalysisOpportunitySummary;
	risks: AnalysisRiskItem[];
}

/** Nyckeltal's first two cards. */
export function createKeyFiguresQualityWidgets({
	quality,
	riskExposure,
	opportunities,
	risks,
}: KeyFiguresQualityInput): Record<string, WidgetProps> {
	return {
		forecastQuality: {
			title: FORECAST_KEY_FIGURES_CARD_TITLES.forecastQuality,
			icon: Gauge,
			content: <QualityBody quality={quality} />,
		},
		keyFigureRisks: {
			title: FORECAST_KEY_FIGURES_CARD_TITLES.keyFigureRisks,
			icon: ShieldAlert,
			content: <RiskBody riskExposure={riskExposure} opportunities={opportunities} risks={risks} />,
		},
	};
}
