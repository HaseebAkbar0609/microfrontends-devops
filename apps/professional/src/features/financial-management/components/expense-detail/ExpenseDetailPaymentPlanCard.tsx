"use client";

import React from "react";
import { FileText, Edit2 } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { Button } from "@/components/ui/button";
import { ExpensePaymentPlanItem } from "../../types/expense.types";
import { formatSEK } from "../../utils/expenseUtils";

interface ExpenseDetailPaymentPlanCardProps {
	items?: ExpensePaymentPlanItem[];
	onEdit?: () => void;
}

export function ExpenseDetailPaymentPlanCard({
	items = [],
	onEdit,
}: ExpenseDetailPaymentPlanCardProps) {
	const defaultItems: ExpensePaymentPlanItem[] = [
		{
			id: "pp-1",
			invoiceNo: "1001",
			date: "2026-01-01",
			description: "Aconto 3",
			debQuantity: 0,
			unit: "tim",
			unitPrice: 750,
			withheld: 375000,
			amount: 375000,
			paid: 375000,
			cost: 375000,
		},
		{
			id: "pp-2",
			invoiceNo: "1002",
			date: "2026-01-01",
			description: "Service electric guitar",
			debQuantity: 0,
			unit: "tim",
			unitPrice: 750,
			withheld: 375000,
			amount: 375000,
			paid: 375000,
			cost: 375000,
		},
	];

	const displayItems = items.length > 0 ? items : defaultItems;

	return (
		<div className="bg-white rounded-lg border border-slate-200 shadow-2xs p-5 mb-6">
			{/* Card Header */}
			<div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
				<div className="flex items-center gap-2">
					<FileText className="h-4 w-4 text-slate-600" />
					<h3 className="text-sm font-semibold text-slate-900">
						<Translate text={localizationConstants.expenseDetailCardPaymentPlan} />
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

			{/* Betalningsplan Table */}
			<div className="overflow-x-auto border border-slate-200 rounded-md">
				<table className="w-full text-left text-xs border-collapse">
					<thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold">
						<tr>
							<th className="py-2.5 px-3 whitespace-nowrap">
								<Translate text={localizationConstants.expenseDetailPaymentPlanInvoiceNo} />
							</th>
							<th className="py-2.5 px-3 whitespace-nowrap">
								<Translate text={localizationConstants.expenseColDate} />
							</th>
							<th className="py-2.5 px-3 whitespace-nowrap">
								<Translate text={localizationConstants.expenseDetailColDesc} />
							</th>
							<th className="py-2.5 px-3 text-right whitespace-nowrap">
								<Translate text={localizationConstants.expenseDetailColDebQty} />
							</th>
							<th className="py-2.5 px-3 whitespace-nowrap">
								<Translate text={localizationConstants.expenseDetailColUnit} />
							</th>
							<th className="py-2.5 px-3 text-right whitespace-nowrap">
								<Translate text={localizationConstants.expenseDetailPaymentPlanPricePerUnit} />
							</th>
							<th className="py-2.5 px-3 text-right whitespace-nowrap">
								<Translate text={localizationConstants.expenseDetailPaymentPlanWithheld} />
							</th>
							<th className="py-2.5 px-3 text-right whitespace-nowrap">
								<Translate text={localizationConstants.expenseDetailPaymentPlanAmount} />
							</th>
							<th className="py-2.5 px-3 text-right whitespace-nowrap">
								<Translate text={localizationConstants.expenseDetailPaymentPlanPaid} />
							</th>
							<th className="py-2.5 px-3 text-right whitespace-nowrap">
								<Translate text={localizationConstants.expenseDetailPaymentPlanCost} />
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-slate-100">
						{displayItems.map((item) => (
							<tr key={item.id} className="hover:bg-slate-50/50">
								<td className="py-2.5 px-3 text-slate-600 font-mono">
									{item.invoiceNo}
								</td>
								<td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">
									{item.date}
								</td>
								<td className="py-2.5 px-3 text-slate-900 font-medium">
									{item.description}
								</td>
								<td className="py-2.5 px-3 text-right text-slate-700">
									{item.debQuantity}
								</td>
								<td className="py-2.5 px-3 text-slate-500">
									{item.unit}
								</td>
								<td className="py-2.5 px-3 text-right text-slate-700 font-mono">
									{formatSEK(item.unitPrice)}
								</td>
								<td className="py-2.5 px-3 text-right text-slate-700 font-mono">
									{formatSEK(item.withheld)}
								</td>
								<td className="py-2.5 px-3 text-right text-slate-700 font-mono">
									{formatSEK(item.amount)}
								</td>
								<td className="py-2.5 px-3 text-right text-slate-700 font-mono">
									{formatSEK(item.paid)}
								</td>
								<td className="py-2.5 px-3 text-right text-slate-700 font-mono">
									{formatSEK(item.cost)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}

export default ExpenseDetailPaymentPlanCard;
