"use client";

import { Cell, Pie, PieChart } from "recharts";

import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import { RISK_GAUGE_BANDS, RISK_GAUGE_MAX_PERCENT } from "../../../../../constants/forecastRisk.constants";
import { formatPercent } from "../../../../../utils/economyFormatters";

/* Fixed geometry: the needle and the arc share one coordinate space, so the
   needle lands exactly on its band whatever the card's width. */
const WIDTH = 220;
const HEIGHT = 120;
const CX = WIDTH / 2;
const CY = HEIGHT - 10;
const NEEDLE_LENGTH = 78;

/** Each band as a slice of the dial, sized by the span it covers. */
const BAND_SLICES = RISK_GAUGE_BANDS.map((band, index) => ({
	name: String(band.upTo),
	color: band.color,
	span: band.upTo - (RISK_GAUGE_BANDS[index - 1]?.upTo ?? 0),
}));

export interface RiskGaugeProps {
	/** The outstanding amount as a percentage of the threshold. */
	percent: number;
}

/** Which band a reading falls in, so the figure matches the needle. */
function bandColor(percent: number): string {
	return (RISK_GAUGE_BANDS.find((band) => percent <= band.upTo) ?? RISK_GAUGE_BANDS[RISK_GAUGE_BANDS.length - 1]).color;
}

/**
 * The outstanding amount against the client's threshold. The dial stops at
 * 120 %, since a needle past the end of its arc says no more than one pinned
 * to it — the figure under it carries the real number.
 */
export function RiskGauge({ percent }: RiskGaugeProps) {
	const t = useTranslate();
	const clamped = Math.min(Math.max(percent, 0), RISK_GAUGE_MAX_PERCENT);
	const angle = Math.PI * (1 - clamped / RISK_GAUGE_MAX_PERCENT);
	const x = CX + NEEDLE_LENGTH * Math.cos(angle);
	const y = CY - NEEDLE_LENGTH * Math.sin(angle);
	const color = bandColor(percent);

	return (
		<div className="flex flex-col items-center gap-2">
			{/* Recharts draws no text a screen reader can follow, so the figure names itself. */}
			<div
				className="relative"
				style={{ width: WIDTH, height: HEIGHT }}
				role="img"
				aria-label={t(localizationConstants.forecastRiskGaugeLabel, { percent: formatPercent(percent, 0) })}
			>
				<PieChart width={WIDTH} height={HEIGHT}>
					<Pie
						data={BAND_SLICES}
						dataKey="span"
						nameKey="name"
						cx={CX}
						cy={CY}
						startAngle={180}
						endAngle={0}
						innerRadius={58}
						outerRadius={92}
						stroke="none"
						isAnimationActive={false}
					>
						{BAND_SLICES.map((slice) => (
							<Cell key={slice.name} fill={slice.color} />
						))}
					</Pie>
				</PieChart>

				<svg className="absolute inset-0" width={WIDTH} height={HEIGHT} aria-hidden>
					<line x1={CX} y1={CY} x2={x} y2={y} stroke="#0f172a" strokeWidth={3} strokeLinecap="round" />
					<circle cx={CX} cy={CY} r={6} fill="#0f172a" />
				</svg>
			</div>

			<span
				className="rounded-md px-2 py-0.5 text-sm font-semibold text-white tabular-nums"
				style={{ backgroundColor: color }}
			>
				{formatPercent(percent, 0)}
			</span>
		</div>
	);
}

export default RiskGauge;
