"use client";

import { ArrowLeft } from "lucide-react";

import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";

export interface CustomReportBuilderHeaderProps {
	/** The guarded way out, so the arrow and Avbryt behave alike. */
	onBack: () => void;
}

/**
 * The builder's top bar. The Prognos row of pages steps aside for a screen
 * this deep, so this band carries the way back and the title, as the budget
 * form's does one tab away.
 */
export function CustomReportBuilderHeader({ onBack }: CustomReportBuilderHeaderProps) {
	const t = useTranslate();

	return (
		<div className="border-b border-slate-200 bg-white px-6 py-4">
			<div className="flex items-center gap-3">
				<button
					type="button"
					onClick={onBack}
					className="-ml-1.5 cursor-pointer rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
					aria-label={t(localizationConstants.backAriaLabel)}
				>
					<ArrowLeft className="h-5 w-5" />
				</button>
				<h1 className="text-xl font-bold text-slate-900">
					<Translate text={localizationConstants.forecastCustomReportsBuilderTitle} />
				</h1>
			</div>
		</div>
	);
}

export default CustomReportBuilderHeader;
