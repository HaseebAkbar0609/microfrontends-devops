"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import {
	YEAR_END_BASE_ROUTE,
	DEFAULT_FISCAL_YEAR,
} from "../../../constants/yearEnd.constants";
import type { YearEndTabType } from "../../../types/yearEnd.types";

interface YearEndCreateHeaderProps {
	activeTab: YearEndTabType;
	fiscalYear?: number;
}

export function YearEndCreateHeader({
	activeTab,
	fiscalYear = DEFAULT_FISCAL_YEAR,
}: YearEndCreateHeaderProps) {
	const router = useRouter();

	const titleKey =
		activeTab === "checklist"
			? localizationConstants.titleCreateYearEndChecklist
			: localizationConstants.titleCreateYearEndBokslut;

	return (
		<div className="bg-white border-b border-slate-200 px-6 py-4">
			<div className="flex items-center gap-3">
				<button
					type="button"
					onClick={() =>
						router.push(
							`${YEAR_END_BASE_ROUTE}?tab=${activeTab}&year=${fiscalYear}`,
						)
					}
					className="p-1.5 -ml-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
					aria-label="Back"
				>
					<ArrowLeft className="w-5 h-5" />
				</button>
				<h1 className="text-xl font-bold text-slate-900">
					<Translate text={titleKey} />
				</h1>
			</div>
		</div>
	);
}

export default YearEndCreateHeader;

