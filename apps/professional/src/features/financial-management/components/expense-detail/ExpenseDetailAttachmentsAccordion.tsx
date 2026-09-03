"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { ExpenseItem, ExpenseUnderlagItem } from "../../types/expense.types";
import { ExpenseStatusBadge } from "../expense-list/ExpenseBadges";
import { formatSEK } from "../../utils/expenseUtils";

interface ExpenseDetailAttachmentsAccordionProps {
	expense: ExpenseItem;
}

export function ExpenseDetailAttachmentsAccordion({
	expense,
}: ExpenseDetailAttachmentsAccordionProps) {
	const [isOpen, setIsOpen] = useState(true);

	const defaultUnderlagItems: ExpenseUnderlagItem[] = [
		{
			id: "und-1",
			date: "2026-01-12",
			supplier: "Bygg Max",
			supplierInvoiceNo: "2025-001-11",
			amount: 15685,
			unit: "st",
			ataNo: "5",
			markupPercent: 12,
			markupKr: 1560,
			costCenter: "10",
			subtotal: 163685,
			comments: "Lorem Ipsum is simply dummy",
		},
		{
			id: "und-2",
			date: "2026-01-14",
			supplier: "Beijer",
			supplierInvoiceNo: "2025-001-11",
			amount: 15685,
			unit: "st",
			ataNo: "14",
			markupPercent: 15,
			markupKr: 1685,
			costCenter: "10",
			subtotal: 163685,
			comments: "Lorem Ipsum is simply dummy",
		},
	];

	const underlagItems =
		expense.underlagItems && expense.underlagItems.length > 0
			? expense.underlagItems
			: defaultUnderlagItems;

	const totalAmount = underlagItems.reduce((sum, item) => sum + item.amount, 0);
	const totalSum = underlagItems.reduce((sum, item) => sum + item.subtotal, 0);

	return (
		<div className="bg-white rounded-lg border border-slate-200 shadow-2xs mb-5 overflow-hidden">
			{/* Accordion Toggle Header matching Figma */}
			<button
				type="button"
				onClick={() => setIsOpen((prev) => !prev)}
				className="w-full flex items-center justify-between p-4 bg-white hover:bg-slate-50/70 transition-colors cursor-pointer text-left"
			>
				<h3 className="text-sm font-semibold text-slate-900">
					<Translate text={localizationConstants.expenseDetailTabUnderlag} />
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

					{/* Underlag Table matching Figma */}
					<div className="overflow-x-auto border border-slate-200 rounded-md mb-4">
						<table className="w-full text-left text-xs border-collapse">
							<thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold">
								<tr>
									<th className="py-2.5 px-3 whitespace-nowrap">
										<Translate text={localizationConstants.expenseColDate} />
									</th>
									<th className="py-2.5 px-3 whitespace-nowrap">
										<Translate text={localizationConstants.expenseDetailUnderlagColSupplier} />
									</th>
									<th className="py-2.5 px-3 text-center whitespace-nowrap">
										<Translate text={localizationConstants.expenseDetailUnderlagColSupplierNo} />
									</th>
									<th className="py-2.5 px-3 text-right whitespace-nowrap">
										<Translate text={localizationConstants.expenseDetailUnderlagColAmount} />
									</th>
									<th className="py-2.5 px-3 whitespace-nowrap">
										<Translate text={localizationConstants.expenseDetailColUnit} />
									</th>
									<th className="py-2.5 px-3 text-center whitespace-nowrap">
										<Translate text={localizationConstants.expenseDetailUnderlagColAtaNo} />
									</th>
									<th className="py-2.5 px-3 text-center whitespace-nowrap">
										<Translate text={localizationConstants.expenseDetailUnderlagColMarkup} />
									</th>
									<th className="py-2.5 px-3 text-right whitespace-nowrap">
										<Translate text={localizationConstants.expenseDetailUnderlagColMarkupKr} />
									</th>
									<th className="py-2.5 px-3 text-center whitespace-nowrap">
										<Translate text={localizationConstants.expenseDetailColKs} />
									</th>
									<th className="py-2.5 px-3 text-right whitespace-nowrap">
										<Translate text={localizationConstants.expenseDetailUnderlagColSubtotal} />
									</th>
									<th className="py-2.5 px-3 whitespace-nowrap">
										<Translate text={localizationConstants.expenseDetailTimeColComments} />
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-slate-100">
								{underlagItems.map((item) => (
									<tr key={item.id} className="hover:bg-slate-50/50">
										<td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">
											{item.date}
										</td>
										<td className="py-2.5 px-3 text-slate-900 font-medium">
											{item.supplier}
										</td>
										{/* Leverantörs nummer yellow tint highlight matching Figma */}
										<td className="py-2.5 px-3 text-center font-medium bg-amber-50 text-amber-900">
											{item.supplierInvoiceNo}
										</td>
										{/* Belopp green tint highlight matching Figma */}
										<td className="py-2.5 px-3 text-right font-semibold bg-emerald-50 text-emerald-900 font-mono">
											{formatSEK(item.amount)}
										</td>
										<td className="py-2.5 px-3 text-slate-500">{item.unit}</td>
										<td className="py-2.5 px-3 text-center text-slate-700">
											{item.ataNo || "-"}
										</td>
										<td className="py-2.5 px-3 text-center text-slate-700">
											{item.markupPercent}%
										</td>
										<td className="py-2.5 px-3 text-right text-slate-700 font-mono">
											{formatSEK(item.markupKr)}
										</td>
										<td className="py-2.5 px-3 text-center text-slate-500 font-mono">
											{item.costCenter}
										</td>
										<td className="py-2.5 px-3 text-right text-slate-700 font-mono font-medium">
											{formatSEK(item.subtotal)}
										</td>
										<td className="py-2.5 px-3 text-slate-600">
											{item.comments || "-"}
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
									<Translate text={localizationConstants.expenseDetailUnderlagSumAmount} />
								</span>
								<span className="font-mono font-medium">
									{formatSEK(totalAmount)}
								</span>
							</div>

							<div className="flex justify-between py-1 border-b border-slate-200">
								<span>
									<Translate text={localizationConstants.expenseDetailUnderlagSumSum} />
								</span>
								<span className="font-mono font-medium">{formatSEK(totalSum)}</span>
							</div>

							<div className="flex justify-between py-1.5 font-bold text-slate-900 text-sm">
								<span>
									<Translate text={localizationConstants.expenseDetailUnderlagSumTotalAmount} />
								</span>
								<span className="font-mono font-bold">
									{formatSEK(totalAmount)}
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

export default ExpenseDetailAttachmentsAccordion;
