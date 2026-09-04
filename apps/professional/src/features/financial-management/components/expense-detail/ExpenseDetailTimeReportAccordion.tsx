"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { ExpenseItem, ExpenseTimeReportItem } from "../../types/expense.types";
import { ExpenseStatusBadge } from "../expense-list/ExpenseBadges";

interface ExpenseDetailTimeReportAccordionProps {
	expense: ExpenseItem;
}

export function ExpenseDetailTimeReportAccordion({
	expense,
}: ExpenseDetailTimeReportAccordionProps) {
	const [isOpen, setIsOpen] = useState(true);

	const defaultTimeItems: ExpenseTimeReportItem[] = [
		{
			id: "tr-1",
			date: "2026-01-15",
			referenceName: "Kalle Andersson",
			workedHours: 5,
			unit: "tim",
			hourlyRate: 650,
			ataHours: 20,
			sumTime: 8,
			costCenter: "10",
			total: 5200,
			comments: "Lorem Ipsum is simply dummy",
			included: true,
		},
		{
			id: "tr-2",
			date: "2026-01-16",
			referenceName: "Stefan Svensson",
			workedHours: 8,
			unit: "tim",
			hourlyRate: 650,
			ataHours: 15,
			sumTime: 6,
			costCenter: "10",
			total: 3900,
			comments: "Lorem Ipsum is simply dummy",
			included: true,
		},
	];

	const timeItems =
		expense.timeReportItems && expense.timeReportItems.length > 0
			? expense.timeReportItems
			: defaultTimeItems;

	const totalWorkedHours = timeItems.reduce(
		(sum, item) => sum + (item.workedHours || 0),
		0
	);
	const totalAtaHours = timeItems.reduce(
		(sum, item) => sum + (item.ataHours || 0),
		0
	);
	const totalTime = totalWorkedHours + totalAtaHours;

	return (
		<div className="bg-white rounded-lg border border-slate-200 shadow-2xs mb-5 overflow-hidden">
			{/* Accordion Toggle Header matching Figma */}
			<button
				type="button"
				onClick={() => setIsOpen((prev) => !prev)}
				className="w-full flex items-center justify-between p-4 bg-white hover:bg-slate-50/70 transition-colors cursor-pointer text-left"
			>
				<h3 className="text-sm font-semibold text-slate-900">
					<Translate text={localizationConstants.expenseDetailTabTimeReport} />
				</h3>
				{isOpen ? (
					<ChevronUp className="h-4 w-4 text-slate-500" />
				) : (
					<ChevronDown className="h-4 w-4 text-slate-500" />
				)}
			</button>

			{/* Accordion Content */}
			{isOpen && (
				<div className="p-5 border-t border-slate-100 text-xs">
					{/* Fakturainformation section header */}
					<h4 className="text-xs font-semibold text-slate-800 mb-3">
						<Translate text={localizationConstants.expenseDetailCardInvoiceInfo} />
					</h4>

					{/* Metadata 4-field grid matching Figma */}
					<div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5 pb-4 border-b border-slate-100">
						<div>
							<span className="text-slate-500 block mb-0.5">
								<Translate text={localizationConstants.expenseColInvoiceNo} />:
							</span>
							<span className="font-medium text-slate-800">
								{expense.fakturaNo || "4563"}
							</span>
						</div>

						<div>
							<span className="text-slate-500 block mb-0.5">
								<Translate text={localizationConstants.expenseColStatus} />:
							</span>
							<div>
								<ExpenseStatusBadge status={expense.status} />
							</div>
						</div>

						<div>
							<span className="text-slate-500 block mb-0.5">
								<Translate text={localizationConstants.expenseDetailCustomer} />:
							</span>
							<span className="font-medium text-slate-800">
								{expense.customerName || "David Gilmour"}
							</span>
						</div>

						<div>
							<span className="text-slate-500 block mb-0.5">
								<Translate text={localizationConstants.expenseDetailObjectNo} />:
							</span>
							<span className="font-medium text-slate-800">
								{expense.projectNumber || "2025-001"}
							</span>
						</div>
					</div>

					{/* Tidrapport Table matching Figma */}
					<div className="overflow-x-auto border border-slate-200 rounded-md mb-4">
						<table className="w-full text-left text-xs border-collapse">
							<thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold">
								<tr>
									<th className="py-2.5 px-3 whitespace-nowrap">
										<Translate text={localizationConstants.expenseColDate} />
									</th>
									<th className="py-2.5 px-3 whitespace-nowrap">
										<Translate text={localizationConstants.expenseDetailTimeColPersonal} />
									</th>
									<th className="py-2.5 px-3 text-center whitespace-nowrap">
										<Translate text={localizationConstants.expenseDetailTimeColWorkHours} />
									</th>
									<th className="py-2.5 px-3 whitespace-nowrap">
										<Translate text={localizationConstants.expenseDetailColUnit} />
									</th>
									<th className="py-2.5 px-3 text-center whitespace-nowrap">
										<Translate text={localizationConstants.expenseDetailTimeColAta} />
									</th>
									<th className="py-2.5 px-3 text-center whitespace-nowrap">
										<Translate text={localizationConstants.expenseDetailTimeColSumTime} />
									</th>
									<th className="py-2.5 px-3 text-center whitespace-nowrap">
										<Translate text={localizationConstants.expenseDetailColKs} />
									</th>
									<th className="py-2.5 px-3 whitespace-nowrap">
										<Translate text={localizationConstants.expenseDetailTimeColComments} />
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-slate-100">
								{timeItems.map((item) => (
									<tr key={item.id} className="hover:bg-slate-50/50">
										<td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">
											{item.date}
										</td>
										<td className="py-2.5 px-3 text-slate-900 font-medium">
											{item.referenceName}
										</td>
										{/* Arbetstid green tint highlight matching Figma */}
										<td className="py-2.5 px-3 text-center font-medium bg-emerald-50 text-emerald-900">
											{item.workedHours}
										</td>
										<td className="py-2.5 px-3 text-slate-500">
											{item.unit || (
												<Translate text={localizationConstants.expenseDetailUnitHours} />
											)}
										</td>
										<td className="py-2.5 px-3 text-center text-slate-700">
											{item.ataHours ?? 15}
										</td>
										<td className="py-2.5 px-3 text-center text-slate-700 font-medium">
											{item.sumTime ?? 8}
										</td>
										<td className="py-2.5 px-3 text-center text-slate-500 font-mono">
											{item.costCenter || "10"}
										</td>
										<td className="py-2.5 px-3 text-slate-600">
											{item.comments || "Lorem Ipsum is simply dummy"}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>

					{/* Summary Block on Right */}
					<div className="flex justify-end mb-5">
						<div className="w-64 space-y-1.5 text-xs text-slate-700">
							<div className="flex justify-between py-1">
								<span>
									<Translate text={localizationConstants.expenseDetailTimeSumWorkHours} />
								</span>
								<span className="font-mono font-medium">{totalWorkedHours}</span>
							</div>

							<div className="flex justify-between py-1 border-b border-slate-200">
								<span>
									<Translate text={localizationConstants.expenseDetailTimeSumAtaTime} />
								</span>
								<span className="font-mono font-medium">{totalAtaHours}</span>
							</div>

							<div className="flex justify-between py-1.5 font-bold text-slate-900 text-sm">
								<span>
									<Translate text={localizationConstants.expenseDetailTimeSumTotalTime} />
								</span>
								<span className="font-mono">
									{totalTime}{" "}
									<Translate text={localizationConstants.expenseDetailUnitHours} />
								</span>
							</div>
						</div>
					</div>

					{/* Kommentar section matching Figma */}
					<div className="border-t border-slate-100 pt-4">
						<span className="text-xs font-semibold text-slate-800 block mb-1">
							<Translate text={localizationConstants.expenseDetailCardComment} />
						</span>
						<p className="text-[11px] text-slate-400 mb-2">
							<Translate text={localizationConstants.expenseDetailCommentSubtitle} />
						</p>
						<div className="bg-slate-50 border border-slate-200 rounded-md p-3 text-xs text-slate-600 leading-relaxed">
							{expense.comments ||
								"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries"}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default ExpenseDetailTimeReportAccordion;
