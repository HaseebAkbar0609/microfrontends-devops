"use client";

import React from "react";
import { UserPlus, Edit2 } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { Button } from "@/components/ui/button";
import { ExpenseItem } from "../../types/expense.types";

interface ExpenseDetailAttestCardProps {
	expense: ExpenseItem;
	onEdit?: () => void;
}

export function ExpenseDetailAttestCard({
	expense,
	onEdit,
}: ExpenseDetailAttestCardProps) {
	return (
		<div className="bg-white rounded-lg border border-slate-200 shadow-2xs p-5 mb-4">
			{/* Card Header */}
			<div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
				<div className="flex items-center gap-2">
					<UserPlus className="h-4 w-4 text-slate-700" />
					<h3 className="text-sm font-semibold text-slate-900">
						<Translate text={localizationConstants.expenseDetailAttestResponsibleCardTitle} />
					</h3>
				</div>
				{onEdit && (
					<Button
						variant="ghost"
						size="sm"
						onClick={onEdit}
						className="h-7 px-2.5 text-xs text-slate-600 hover:text-slate-900 gap-1.5 cursor-pointer"
					>
						<Edit2 className="h-3 w-3 text-slate-500" />
						<span>
							<Translate text={localizationConstants.expenseDetailBtnEdit} />
						</span>
					</Button>
				)}
			</div>

			{/* Card Body */}
			<div>
				<span className="text-xs text-slate-500 block mb-0.5 font-medium">
					<Translate text={localizationConstants.expenseDetailAttestResponsibleLabel} />
				</span>
				<span className="text-sm font-semibold text-slate-900">
					{expense.attestResponsible || "Kalle Andersson"}
				</span>
			</div>
		</div>
	);
}

export default ExpenseDetailAttestCard;
