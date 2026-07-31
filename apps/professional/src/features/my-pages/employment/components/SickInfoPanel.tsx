"use client";

import { useState } from "react";
import { ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { SICK_INFORMATION } from "../constants/mockData";

const SickInfoPanel = () => {
	const [collapsed, setCollapsed] = useState(false);

	return (
		<div className="overflow-hidden rounded-md border border-slate-200 bg-white">
			<button
				type="button"
				onClick={() => setCollapsed((value) => !value)}
				className="flex w-full cursor-pointer items-center justify-between bg-slate-200/60 px-5 py-3.5"
			>
				<span className="text-base font-semibold text-slate-800">
					<Translate
						text={localizationConstants.myPagesEmpSickInfoTitle}
					/>
				</span>
				<ChevronUp
					className={cn(
						"h-4 w-4 text-slate-600 transition-transform",
						collapsed && "rotate-180",
					)}
				/>
			</button>

			{!collapsed && (
				<div className="space-y-4 px-5 py-4 text-sm">
					{SICK_INFORMATION.map((entry) => (
						<div key={entry.id}>
							<p className="font-semibold text-slate-900">
								<Translate text={entry.labelKey} />
							</p>
							{entry.lines.map((line) => (
								<p key={line} className="text-slate-600">
									{line}
								</p>
							))}
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default SickInfoPanel;
