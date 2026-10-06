"use client";

import React from "react";
import { ShoppingBag, CheckCircle, Clock } from "lucide-react";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import type { UpcomingPurchaseItem } from "../../types/dataIt.types";

interface UpcomingPurchasesWidgetProps {
	purchases: UpcomingPurchaseItem[];
}

export function UpcomingPurchasesWidget({
	purchases,
}: UpcomingPurchasesWidgetProps) {
	return (
		<div className="space-y-2 pt-2">
			{purchases.map((item) => (
				<div
					key={item.id}
					className="flex items-center justify-between rounded-lg border border-slate-200/80 bg-white p-2.5 shadow-2xs"
				>
					<div className="flex items-center gap-2.5 min-w-0 pr-2">
						<div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-800">
							<ShoppingBag className="h-3.5 w-3.5" />
						</div>
						<div className="min-w-0">
							<p className="truncate text-xs font-semibold text-slate-900">
								{item.itemName}
							</p>
							<p className="text-[11px] text-slate-500">
								{item.estimatedCostSek.toLocaleString("sv-SE")} SEK
							</p>
						</div>
					</div>

					<div className="shrink-0">
						{item.status === "APPROVED" ? (
							<span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
								<CheckCircle className="h-2.5 w-2.5" />
								<Translate text={localizationConstants.dataItApprovedBudget} />
							</span>
						) : (
							<span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
								<Clock className="h-2.5 w-2.5" />
								<Translate text={localizationConstants.dataItEstimatedBudget} />
							</span>
						)}
					</div>
				</div>
			))}
		</div>
	);
}

export default UpcomingPurchasesWidget;
