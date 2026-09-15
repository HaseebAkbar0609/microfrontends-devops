"use client";

import React from "react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { YearEndTabType } from "../../types/yearEnd.types";

interface YearEndHeaderProps {
	activeTab: YearEndTabType;
	onTabChange: (tab: YearEndTabType) => void;
}

export function YearEndHeader({ activeTab, onTabChange }: YearEndHeaderProps) {
	return (
		<div className="pt-2">
			{/* Primary Sub-Tabs: Bokslut & Checklist */}
			<div className="flex border-b border-slate-200 gap-8">
				<button
					type="button"
					onClick={() => onTabChange("bokslut")}
					className={`pb-3 text-sm font-semibold transition-colors relative cursor-pointer ${
						activeTab === "bokslut"
							? "text-slate-900 border-b-2 border-slate-900"
							: "text-slate-500 hover:text-slate-800"
					}`}
				>
					<Translate text={localizationConstants.tabBokslut} />
				</button>
				<button
					type="button"
					onClick={() => onTabChange("checklist")}
					className={`pb-3 text-sm font-semibold transition-colors relative cursor-pointer ${
						activeTab === "checklist"
							? "text-slate-900 border-b-2 border-slate-900"
							: "text-slate-500 hover:text-slate-800"
					}`}
				>
					<Translate text={localizationConstants.tabChecklist} />
				</button>
			</div>
		</div>
	);
}

export default YearEndHeader;
