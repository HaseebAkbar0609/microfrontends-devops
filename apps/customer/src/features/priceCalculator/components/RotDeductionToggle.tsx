"use client";

import { useTranslation } from "react-i18next";
import localizationConstants from "@/utils/translation/constants";
import { formatCurrency } from "../utils";

interface RotDeductionToggleProps {
	enabled: boolean;
	onToggle: () => void;
	rotSaving: number;
	priceAfterRot: number;
}

export function RotDeductionToggle({
	enabled,
	onToggle,
	rotSaving,
	priceAfterRot,
}: RotDeductionToggleProps) {
	const { t } = useTranslation();

	return (
		<>
			<div className="mt-5 flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-750">
				<span>{t(localizationConstants.priceCalculatorRotRutDeduction)}</span>
				<button
					type="button"
					role="switch"
					aria-checked={enabled}
					onClick={onToggle}
					className={`relative h-6 w-11 rounded-full transition-colors ${
						enabled ? "bg-emerald-500" : "bg-slate-200"
					}`}
				>
					<span
						className="absolute top-1 left-[4px] size-4 rounded-full bg-white shadow transition-all"
						style={{ left: enabled ? "22px" : "4px" }}
					/>
				</button>
			</div>
			{enabled && (
				<div className="mt-3 rounded-lg bg-emerald-50 px-4 py-3">
					<div className="text-sm text-emerald-700">
						{t(localizationConstants.priceCalculatorAfterRotRut)}
					</div>
					<div className="mt-1 text-2xl font-semibold text-emerald-700">
						{formatCurrency(priceAfterRot)}
					</div>
					<div className="mt-1 text-sm text-emerald-700 font-medium">
						{t(localizationConstants.priceCalculatorSaving)}:{" "}
						{formatCurrency(rotSaving)}
					</div>
				</div>
			)}
		</>
	);
}
