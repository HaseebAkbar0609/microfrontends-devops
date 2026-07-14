"use client";

import { useTranslation } from "react-i18next";
import localizationConstants from "@/utils/translation/constants";
import { formatCurrency } from "../utils";

interface PriceDonutChartProps {
	materialShare: number;
	laborShare: number;
	materialAmount: number;
	laborAmount: number;
}

export function PriceDonutChart({
	materialShare,
	laborShare,
	materialAmount,
	laborAmount,
}: PriceDonutChartProps) {
	const { t } = useTranslation();

	const size = 160;
	const strokeWidth = 24;
	const radius = (size - strokeWidth) / 2;
	const circumference = 2 * Math.PI * radius;
	const materialLength = (materialShare / 100) * circumference;
	const laborLength = (laborShare / 100) * circumference;

	return (
		<div className="rounded-xl border border-slate-200 bg-slate-50/50 p-6 sm:p-8">
			<div className="flex flex-col items-center justify-center gap-8 sm:flex-row sm:gap-12">
				<svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="w-40 h-40 max-w-full">
					<circle
						cx={size / 2}
						cy={size / 2}
						r={radius}
						fill="none"
						stroke="#007BFF"
						strokeWidth={strokeWidth}
						strokeDasharray={`${laborLength} ${circumference}`}
						strokeDashoffset={-materialLength}
						transform={`rotate(-90 ${size / 2} ${size / 2})`}
						strokeLinecap="round"
					/>
					<circle
						cx={size / 2}
						cy={size / 2}
						r={radius}
						fill="none"
						stroke="#FF8100"
						strokeWidth={strokeWidth}
						strokeDasharray={`${materialLength} ${circumference}`}
						strokeDashoffset={0}
						transform={`rotate(-90 ${size / 2} ${size / 2})`}
						strokeLinecap="round"
					/>
					<circle
						cx={size / 2}
						cy={size / 2}
						r={size / 2 - strokeWidth}
						fill="white"
					/>
					<text
						x={size / 2}
						y={size / 2 - 10}
						textAnchor="middle"
						className="fill-slate-500 text-[11px]"
					>
						{t(localizationConstants.priceCalculatorTotal)}
					</text>
					<text
						x={size / 2}
						y={size / 2 + 10}
						textAnchor="middle"
						className="fill-slate-950 text-base font-semibold"
					>
						{materialShare}%
					</text>
				</svg>
				<div className="space-y-3 text-center text-xs sm:text-left col-span-2">
					<div>
						<div className="flex items-center gap-2 font-medium text-slate-950 justify-center sm:justify-start">
							<span className="size-3 rounded-full" style={{ backgroundColor: "#FF8100" }} />
							{t(localizationConstants.priceCalculatorMaterial)}
						</div>
						<div className="ml-5 text-slate-650">
							{formatCurrency(materialAmount)} ({materialShare}%)
						</div>
					</div>
					<div>
						<div className="flex items-center gap-2 font-medium text-slate-950 justify-center sm:justify-start">
							<span className="size-3 rounded-full" style={{ backgroundColor: "#007BFF" }} />
							{t(localizationConstants.priceCalculatorLabor)}
						</div>
						<div className="ml-5 text-slate-650">
							{formatCurrency(laborAmount)} ({laborShare}%)
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
