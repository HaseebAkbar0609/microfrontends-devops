"use client";

import React from "react";
import { ChevronDown } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { AVAILABLE_FISCAL_YEARS } from "../../constants/yearEnd.constants";

interface YearEndYearSelectorProps {
	selectedYear: number;
	onYearChange: (year: number) => void;
}

export function YearEndYearSelector({
	selectedYear,
	onYearChange,
}: YearEndYearSelectorProps) {
	return (
		<div className="space-y-1.5 pt-1">
			<label className="text-xs font-bold text-slate-900 block">
				<Translate text={localizationConstants.labelYear} />
			</label>
			<div className="relative inline-block w-40">
				<select
					value={selectedYear}
					onChange={(e) => onYearChange(Number(e.target.value))}
					className="w-full h-9 appearance-none rounded-lg border border-slate-200 bg-white px-3 pr-8 text-xs font-semibold text-slate-800 shadow-2xs focus:outline-none focus:ring-1 focus:ring-slate-400 cursor-pointer"
				>
					{AVAILABLE_FISCAL_YEARS.map((year) => (
						<option key={year} value={year}>
							{year}
						</option>
					))}
				</select>
				<ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
			</div>
		</div>
	);
}

export default YearEndYearSelector;
