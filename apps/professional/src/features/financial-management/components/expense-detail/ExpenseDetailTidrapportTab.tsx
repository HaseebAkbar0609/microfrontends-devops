"use client";

import React from "react";
import { FileText, Edit2 } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { Button } from "@/components/ui/button";
import { ExpenseItem, ExpenseTimeReportItem } from "../../types/expense.types";
import { ExpenseStatusBadge } from "../expense-list/ExpenseBadges";
import { ExpenseDetailCommentCard } from "./ExpenseDetailCommentCard";

interface ExpenseDetailTidrapportTabProps {
	expense: ExpenseItem;
	onEdit?: () => void;
	onSaveComment?: (comment: string) => void;
}

export function ExpenseDetailTidrapportTab({
	expense,
	onEdit,
	onSaveComment,
}: ExpenseDetailTidrapportTabProps) {
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

	const timeItems = (expense.timeReportItems && expense.timeReportItems.length > 0)
		? expense.timeReportItems
		: defaultTimeItems;

	const totalWorkedHours = timeItems.reduce((sum, item) => sum + (item.workedHours || 0), 0);
	const totalAtaHours = timeItems.reduce((sum, item) => sum + (item.ataHours || 0), 0);
	const totalTime = totalWorkedHours + totalAtaHours;

	return (
		<div>
			{/* 1. Allmän information Card */}
			<div className="bg-white rounded-lg border border-slate-200 shadow-2xs p-5 mb-6">
				{/* Card Header */}
				<div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
					<div className="flex items-center gap-2">
						<FileText className="h-4 w-4 text-slate-600" />
						<h3 className="text-sm font-semibold text-slate-900">
							<Translate text={localizationConstants.expenseDetailCardGeneralInfo} />
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

				{/* Metadata Grid matching Figma detail_tidrapport.png */}
				<div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-x-4 gap-y-3.5 text-xs mb-6">
					<div>
						<span className="text-slate-500 block mb-0.5 font-medium">
							<Translate text={localizationConstants.expenseColInvoiceNo} />
						</span>
						<span className="text-slate-800">
							{expense.fakturaNo || expense.expenseNo}
						</span>
					</div>

					<div>
						<span className="text-slate-500 block mb-0.5 font-medium">
							<Translate text={localizationConstants.expenseColStatus} />
						</span>
						<div>
							<ExpenseStatusBadge status={expense.status} />
						</div>
					</div>

					<div>
						<span className="text-slate-500 block mb-0.5 font-medium">
							<Translate text={localizationConstants.expenseDetailAttachTimeReport} />
						</span>
						<span className="text-slate-800">
							{expense.attachTimeReport !== false ? (
								<Translate text={localizationConstants.expenseDetailYes} />
							) : (
								<Translate text={localizationConstants.expenseDetailNo} />
							)}
						</span>
					</div>

					<div>
						<span className="text-slate-500 block mb-0.5 font-medium">
							<Translate text={localizationConstants.expenseDetailUnderlag} />
						</span>
						<span className="text-slate-800">
							{expense.hasUnderlag !== false ? (
								<Translate text={localizationConstants.expenseDetailYes} />
							) : (
								<Translate text={localizationConstants.expenseDetailNo} />
							)}
						</span>
					</div>

					<div>
						<span className="text-slate-500 block mb-0.5 font-medium">
							<Translate text={localizationConstants.expenseDetailCreditInvoice} />
						</span>
						<span className="text-slate-800">
							{expense.isCreditInvoice ? (
								<Translate text={localizationConstants.expenseDetailYes} />
							) : (
								<Translate text={localizationConstants.expenseDetailNo} />
							)}
						</span>
					</div>

					<div>
						<span className="text-slate-500 block mb-0.5 font-medium">
							<Translate text={localizationConstants.expenseDetailCustomer} />
						</span>
						<span className="text-slate-800 font-medium">
							{expense.customerName || "Allmännyttan"}
						</span>
					</div>

					<div>
						<span className="text-slate-500 block mb-0.5 font-medium">
							<Translate text={localizationConstants.expenseDetailObjectNo} />
						</span>
						<span className="text-slate-800">
							{expense.projectNumber || "PROJ-2026-001"}
						</span>
					</div>
				</div>

				{/* Tidrapport Table matching Figma */}
				<div className="overflow-x-auto border border-slate-200 rounded-md mb-6">
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
									{/* Arbetstid with light green highlight tint */}
									<td className="py-2.5 px-3 text-center font-medium bg-emerald-50 text-emerald-900">
										{item.workedHours}
									</td>
									<td className="py-2.5 px-3 text-slate-500">
										{item.unit || <Translate text={localizationConstants.expenseDetailUnitHours} />}
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

				{/* Summary Block matching Figma */}
				<div className="flex justify-end">
					<div className="w-72 space-y-1.5 text-xs text-slate-700">
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
								{totalTime} <Translate text={localizationConstants.expenseDetailUnitHours} />
							</span>
						</div>
					</div>
				</div>
			</div>

			{/* 2. Kommentar Card */}
			<ExpenseDetailCommentCard
				comment={expense.comments || expense.notes}
				onSaveComment={onSaveComment}
			/>
		</div>
	);
}

export default ExpenseDetailTidrapportTab;
