"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, Clock } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { ExpenseItem, ExpenseTimeReportItem } from "../../types/expense.types";

interface ExpenseDetailTimeReportAccordionProps {
	expense: ExpenseItem;
}

export function ExpenseDetailTimeReportAccordion({
	expense,
}: ExpenseDetailTimeReportAccordionProps) {
	const [isOpen, setIsOpen] = useState(true);
	const timeItems: ExpenseTimeReportItem[] = expense.timeReportItems || [];

	const totalHours = timeItems.reduce((acc, curr) => acc + (curr.workedHours || 0), 0);
	const totalAmount = timeItems.reduce((acc, curr) => acc + (curr.total || 0), 0);

	const formatSEK = (val: number) => {
		return val.toLocaleString("sv-SE", {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		});
	};

	return (
		<div className="bg-white rounded-lg border border-slate-200 shadow-2xs mb-5 overflow-hidden">
			{/* Accordion Toggle Header */}
			<button
				type="button"
				onClick={() => setIsOpen((prev) => !prev)}
				className="w-full flex items-center justify-between p-4 bg-white hover:bg-slate-50/70 transition-colors cursor-pointer text-left"
			>
				<div className="flex items-center gap-2.5">
					<Clock className="h-4 w-4 text-slate-500" />
					<h3 className="text-sm font-semibold text-slate-900">
						<Translate text={localizationConstants.expenseDetailTimeReportTitle} />
					</h3>
					<span className="text-xs text-slate-400 font-normal">
						({timeItems.length} {timeItems.length === 1 ? "rad" : "rader"})
					</span>
				</div>
				<div className="flex items-center gap-2">
					<span className="text-xs font-semibold text-slate-700">
						{totalHours} h • {formatSEK(totalAmount)} SEK
					</span>
					{isOpen ? (
						<ChevronUp className="h-4 w-4 text-slate-400" />
					) : (
						<ChevronDown className="h-4 w-4 text-slate-400" />
					)}
				</div>
			</button>

			{/* Accordion Content */}
			{isOpen && (
				<div className="p-4 border-t border-slate-100 text-xs">
					<div className="overflow-x-auto border border-slate-200 rounded-md mb-4">
						<table className="w-full text-left">
							<thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
								<tr>
									<th className="py-2.5 px-3">
										<Translate text={localizationConstants.expenseColDate} />
									</th>
									<th className="py-2.5 px-3">
										<Translate text={localizationConstants.registerExpenseTimeColRef} />
									</th>
									<th className="py-2.5 px-3 text-right">
										<Translate text={localizationConstants.registerExpenseTimeColHours} />
									</th>
									<th className="py-2.5 px-3">
										<Translate text={localizationConstants.registerExpenseLineColUnit} />
									</th>
									<th className="py-2.5 px-3 text-right">
										<Translate text={localizationConstants.registerExpenseTimeColRate} />
									</th>
									<th className="py-2.5 px-3 text-right">
										<Translate text={localizationConstants.registerExpenseTimeColSum} />
									</th>
									<th className="py-2.5 px-3">
										<Translate text={localizationConstants.registerExpenseTimeColComment} />
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-slate-100">
								{timeItems.length === 0 ? (
									<tr>
										<td colSpan={7} className="py-6 text-center text-slate-400">
											Ingen arbetad tid har kopplats till denna utgift.
										</td>
									</tr>
								) : (
									timeItems.map((item) => (
										<tr key={item.id} className="hover:bg-slate-50/50">
											<td className="py-2.5 px-3 text-slate-700">{item.date}</td>
											<td className="py-2.5 px-3 font-medium text-slate-900">
												{item.referenceName}
											</td>
											<td className="py-2.5 px-3 text-right font-medium text-slate-900">
												{item.workedHours}
											</td>
											<td className="py-2.5 px-3 text-slate-500">{item.unit || "tim"}</td>
											<td className="py-2.5 px-3 text-right font-mono text-slate-700">
												{formatSEK(item.hourlyRate)}
											</td>
											<td className="py-2.5 px-3 text-right font-mono font-semibold text-slate-900">
												{formatSEK(item.total)}
											</td>
											<td className="py-2.5 px-3 text-slate-600">
												{item.comments || "-"}
											</td>
										</tr>
									))
								)}
							</tbody>
						</table>
					</div>

					{/* Time report totals */}
					<div className="flex justify-end gap-6 text-xs text-slate-600 font-medium py-1">
						<span>
							<Translate text={localizationConstants.registerExpenseTimeTotalHours} />{" "}
							<strong className="text-slate-900">{totalHours} h</strong>
						</span>
						<span>
							<Translate text={localizationConstants.registerExpenseTimeTotalAmount} />{" "}
							<strong className="text-slate-900">{formatSEK(totalAmount)} SEK</strong>
						</span>
					</div>
				</div>
			)}
		</div>
	);
}

export default ExpenseDetailTimeReportAccordion;
