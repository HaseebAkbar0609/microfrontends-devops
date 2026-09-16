"use client";

import React from "react";
import { UserPlus, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { ClaimItem } from "../../../types/claims.types";

interface ClaimDetailDemandCardProps {
	item: ClaimItem;
	onEdit: () => void;
}

export function ClaimDetailDemandCard({
	item,
	onEdit,
}: ClaimDetailDemandCardProps) {
	const formattedAmount = item.disputedAmount
		? `${new Intl.NumberFormat("sv-SE", {
				minimumFractionDigits: 0,
				maximumFractionDigits: 0,
		  }).format(item.disputedAmount)} SEK`
		: "info";

	return (
		<div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
			{/* Card Header matching Screenshot 4 */}
			<div className="px-6 py-3.5 border-b border-slate-200 flex items-center justify-between">
				<div className="flex items-center gap-2.5">
					<UserPlus className="w-4 h-4 text-slate-700" />
					<h2 className="text-sm font-semibold text-slate-900">
						<Translate text={localizationConstants.claimsSectionDemand} />
					</h2>
				</div>

				<Button
					type="button"
					variant="outline"
					size="sm"
					onClick={onEdit}
					className="h-7 px-2.5 text-xs border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-md gap-1.5 cursor-pointer shadow-2xs"
				>
					<Edit2 className="w-3 h-3 text-slate-600" />
					<Translate text={localizationConstants.claimsBtnEdit} />
				</Button>
			</div>

			{/* Fields matching Screenshot 4 */}
			<div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
				<div>
					<span className="block text-xs text-slate-500 font-medium mb-1">
						<Translate text={localizationConstants.claimsFieldDisputedAmount} />
					</span>
					<span className="text-xs text-slate-800 font-medium">
						{formattedAmount}
					</span>
				</div>

				<div>
					<span className="block text-xs text-slate-500 font-medium mb-1">
						<Translate text={localizationConstants.claimsFieldDesiredAction} />
					</span>
					<span className="text-xs text-slate-800 font-medium">
						{item.desiredAction || "info"}
					</span>
				</div>
			</div>
		</div>
	);
}

export default ClaimDetailDemandCard;
