"use client";

import React from "react";

import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { MONTH_KEYS } from "../../../constants/budget.constants";

/** Konto, Kostnadsställe, Årsbudget, Fördelning, %, then the twelve months. */
export function BudgetSpreadsheetHead() {
	return (
		<thead>
			<tr className="border-b border-slate-200 bg-slate-50 font-semibold text-slate-600">
				<th className="min-w-[130px] px-2.5 py-2.5">
					<Translate text={localizationConstants.colBudgetKonto} />
				</th>
				<th className="min-w-[140px] px-2.5 py-2.5">
					<Translate text={localizationConstants.colBudgetKostnadsstalle} />
				</th>
				<th className="min-w-[100px] px-2.5 py-2.5 text-right">
					<Translate text={localizationConstants.colBudgetAnnual} />
				</th>
				<th className="min-w-[60px] px-2 py-2.5 text-center">
					<Translate text={localizationConstants.colBudgetFordelning} />
				</th>
				<th className="min-w-[50px] px-2 py-2.5 text-center">
					<Translate text={localizationConstants.colBudgetPercent} />
				</th>
				{MONTH_KEYS.map((monthKey) => (
					<th
						key={monthKey}
						className="min-w-[80px] px-2 py-2.5 text-right font-medium text-slate-700"
					>
						<Translate text={monthKey} />
					</th>
				))}
				<th className="w-10 px-2 py-2.5 text-center">
					<span className="sr-only">
						<Translate text={localizationConstants.btnDeleteBudget} />
					</span>
				</th>
			</tr>
		</thead>
	);
}

export default BudgetSpreadsheetHead;
