"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate, Translate } from "@/utils/translation/translate";
import { DATA_IT_QUICK_ACTIONS } from "../../constants/dataItDashboard.mock";
import type { DataItQuickAction } from "../../types/dataIt.types";

export function QuickActionsWidget() {
	const router = useRouter();
	const t = useTranslate();

	const handleActionClick = (action: DataItQuickAction) => {
		if (action.targetHref) {
			router.push(action.targetHref);
		} else {
			showToast("info", t(localizationConstants.economyComingSoon));
		}
	};

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
			{DATA_IT_QUICK_ACTIONS.map((action) => {
				const Icon = action.icon;
				return (
					<button
						key={action.id}
						type="button"
						onClick={() => handleActionClick(action)}
						className="flex items-center gap-3 rounded-lg border border-slate-200/80 bg-white p-3 text-left shadow-2xs transition-all hover:border-slate-300 hover:bg-slate-50/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 cursor-pointer"
					>
						<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-slate-900 text-white">
							<Icon className="h-4 w-4" />
						</div>
						<div className="min-w-0 flex-1">
							<p className="text-xs font-semibold text-slate-900">
								<Translate text={action.labelKey} />
							</p>
						</div>
					</button>
				);
			})}
		</div>
	);
}

export default QuickActionsWidget;

