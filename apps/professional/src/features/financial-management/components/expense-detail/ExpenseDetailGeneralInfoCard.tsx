"use client";

import React from "react";
import { Edit2 } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { Button } from "@/components/ui/button";
import { ExpenseItem } from "../../types/expense.types";
import { ExpenseStatusBadge } from "../expense-list/ExpenseBadges";

interface ExpenseDetailGeneralInfoCardProps {
	expense: ExpenseItem;
	onEdit?: () => void;
}

export function ExpenseDetailGeneralInfoCard({
	expense,
	onEdit,
}: ExpenseDetailGeneralInfoCardProps) {
	return (
		<div className="bg-white rounded-lg border border-slate-200 p-5 shadow-2xs mb-5">
			<div className="flex items-center justify-between pb-3 border-b border-slate-100">
				<h2 className="text-sm font-semibold text-slate-900">
					<Translate text={localizationConstants.expenseDetailGeneralInfoTitle} />
				</h2>
				{onEdit && (
					<Button
						type="button"
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

			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-3 text-xs">
				<div>
					<span className="text-slate-500 block mb-0.5">
						<Translate text={localizationConstants.expenseDetailResponsible} />
					</span>
					<span className="font-medium text-slate-900">
						{expense.attestResponsible || "-"}
					</span>
				</div>

				<div>
					<span className="text-slate-500 block mb-0.5">
						<Translate text={localizationConstants.expenseColStatus} />
					</span>
					<div>
						<ExpenseStatusBadge status={expense.status} />
					</div>
				</div>

				<div>
					<span className="text-slate-500 block mb-0.5">
						<Translate text={localizationConstants.registerExpenseCategoryLabel} />
					</span>
					<span className="font-medium text-slate-900 capitalize">
						{expense.category || "material"}
					</span>
				</div>

				<div>
					<span className="text-slate-500 block mb-0.5">
						<Translate text={localizationConstants.registerExpenseCostCenterLabel} />
					</span>
					<span className="font-medium text-slate-900">
						{expense.costCenter || "10"}
					</span>
				</div>
			</div>
		</div>
	);
}

export default ExpenseDetailGeneralInfoCard;
