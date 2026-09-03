"use client";

import React from "react";
import { FileText, Edit2 } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { Button } from "@/components/ui/button";
import { ExpenseItem, ExpenseLineItem } from "../../types/expense.types";
import { ExpenseStatusBadge } from "../expense-list/ExpenseBadges";
import { formatSEK } from "../../utils/expenseUtils";

interface ExpenseDetailInvoiceInfoCardProps {
	expense: ExpenseItem;
	onEdit?: () => void;
}

export function ExpenseDetailInvoiceInfoCard({
	expense,
	onEdit,
}: ExpenseDetailInvoiceInfoCardProps) {
	const lineItems: ExpenseLineItem[] = expense.lineItems || [];

	const subtotal = expense.subtotal ?? lineItems.reduce((acc, li) => acc + (li.subtotal ?? (li.quantity * li.unitPrice)), 0);
	const withheld = expense.withheldAmount ?? -1000;
	const markup = expense.markupAmount ?? 15000;
	const rotRut = expense.rotRutAmount ?? -1500;
	const total = expense.amount ?? (subtotal + withheld + markup + rotRut);
	const tax = expense.vatAmount ?? Math.round(total * 0.25);
	const toReceive = expense.toReceiveAmount ?? (total + tax);

	return (
		<div className="bg-white rounded-lg border border-slate-200 shadow-2xs p-5 mb-6">
			{/* Card Header */}
			<div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
				<div className="flex items-center gap-2">
					<FileText className="h-4 w-4 text-slate-600" />
					<h3 className="text-sm font-semibold text-slate-900">
						<Translate text={localizationConstants.expenseDetailCardInvoiceInfo} />
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

			{/* Metadata Multi-column Grid matching Figma */}
			<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-x-4 gap-y-3.5 text-xs mb-6">
				{/* Row 1 */}
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
						<Translate text={localizationConstants.expenseDetailInvoiceTemplate} />
					</span>
					<span className="text-slate-800">
						{expense.invoiceTemplate || "Standard"}
					</span>
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

				{/* Row 2 */}
				<div>
					<span className="text-slate-500 block mb-0.5 font-medium">
						<Translate text={localizationConstants.expenseDetailProjectName} />
					</span>
					<span className="text-slate-800 font-medium">
						{expense.project}
					</span>
				</div>

				<div>
					<span className="text-slate-500 block mb-0.5 font-medium">
						<Translate text={localizationConstants.expenseDetailProjectNumber} />
					</span>
					<span className="text-slate-800">
						{expense.projectNumber || "PROJ-2026-001"}
					</span>
				</div>

				<div>
					<span className="text-slate-500 block mb-0.5 font-medium">
						<Translate text={localizationConstants.expenseDetailContactPerson} />
					</span>
					<span className="text-slate-800">
						{expense.contactPerson || expense.attestResponsible || "Kalle Andersson"}
					</span>
				</div>

				<div>
					<span className="text-slate-500 block mb-0.5 font-medium">
						<Translate text={localizationConstants.expenseDetailProjectSum} />
					</span>
					<span className="text-slate-800 font-mono">
						{formatSEK(expense.projectSum || 500000)} SEK
					</span>
				</div>

				<div>
					<span className="text-slate-500 block mb-0.5 font-medium">
						<Translate text={localizationConstants.expenseDetailInvoicedEarlier} />
					</span>
					<span className="text-slate-800 font-mono">
						{formatSEK(expense.invoicedEarlier || 120000)} SEK
					</span>
				</div>

				<div>
					<span className="text-slate-500 block mb-0.5 font-medium">
						<Translate text={localizationConstants.expenseDetailInvoiceInclThis} />
					</span>
					<span className="text-slate-800 font-mono">
						{formatSEK(expense.invoiceInclThis || 298000)} SEK
					</span>
				</div>

				{/* Row 3 */}
				<div>
					<span className="text-slate-500 block mb-0.5 font-medium">
						<Translate text={localizationConstants.registerExpenseDateLabel} />
					</span>
					<span className="text-slate-800">
						{expense.date}
					</span>
				</div>

				<div>
					<span className="text-slate-500 block mb-0.5 font-medium">
						<Translate text={localizationConstants.expenseDetailRotRut} />
					</span>
					<span className="text-slate-800">
						{expense.rotRut || "Startade"}
					</span>
				</div>

				<div>
					<span className="text-slate-500 block mb-0.5 font-medium">
						<Translate text={localizationConstants.expenseDetailCardPaymentPlan} />
					</span>
					<span className="text-slate-800">
						{expense.paymentPlanTitle || "Standard"}
					</span>
				</div>

				<div>
					<span className="text-slate-500 block mb-0.5 font-medium">
						<Translate text={localizationConstants.expenseDetailPricingModel} />
					</span>
					<span className="text-slate-800">
						{expense.pricingModel || "Fast pris"}
					</span>
				</div>

				<div>
					<span className="text-slate-500 block mb-0.5 font-medium">
						<Translate text={localizationConstants.expenseColDueDate} />
					</span>
					<span className="text-slate-800">
						{expense.dueDate}
					</span>
				</div>

				<div>
					<span className="text-slate-500 block mb-0.5 font-medium">
						<Translate text={localizationConstants.expenseDetailColKs} />
					</span>
					<span className="text-slate-800 font-mono">
						{expense.costCenter || "10"}
					</span>
				</div>
			</div>

			{/* Line Items Table matching Figma */}
			<div className="overflow-x-auto border border-slate-200 rounded-md mb-6">
				<table className="w-full text-left text-xs border-collapse">
					<thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold">
						<tr>
							<th className="py-2.5 px-3 whitespace-nowrap">
								<Translate text={localizationConstants.expenseDetailColArticle} />
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
								<Translate text={localizationConstants.expenseDetailColPrice} />
							</th>
							<th className="py-2.5 px-3 text-right whitespace-nowrap">
								<Translate text={localizationConstants.expenseDetailColSubtotal} />
							</th>
							<th className="py-2.5 px-3 whitespace-nowrap">
								<Translate text={localizationConstants.expenseDetailColHandling} />
							</th>
							<th className="py-2.5 px-3 text-center whitespace-nowrap">
								<Translate text={localizationConstants.expenseDetailColPercent} />
							</th>
							<th className="py-2.5 px-3 text-right whitespace-nowrap">
								<Translate text={localizationConstants.expenseDetailColAdjustment} />
							</th>
							<th className="py-2.5 px-3 text-right whitespace-nowrap">
								<Translate text={localizationConstants.expenseDetailColTotal} />
							</th>
							<th className="py-2.5 px-3 text-center whitespace-nowrap">
								<Translate text={localizationConstants.expenseDetailColKs} />
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-slate-100">
						{lineItems.map((item, index) => {
							const itemSubtotal = item.subtotal ?? (item.quantity * item.unitPrice);
							return (
								<tr key={item.id || index} className="hover:bg-slate-50/50">
									<td className="py-2.5 px-3 text-slate-600 font-mono">
										{item.articleNo || item.id || `100${index + 1}`}
									</td>
									<td className="py-2.5 px-3 text-slate-900 font-medium">
										{item.description}
									</td>
									<td className="py-2.5 px-3 text-right text-slate-700">
										{item.quantity}
									</td>
									<td className="py-2.5 px-3 text-slate-500">
										{item.unit}
									</td>
									<td className="py-2.5 px-3 text-right text-slate-700 font-mono">
										{formatSEK(item.unitPrice)}
									</td>
									<td className="py-2.5 px-3 text-right text-slate-700 font-mono">
										{formatSEK(itemSubtotal)}
									</td>
									<td className="py-2.5 px-3 text-slate-700">
										{item.handling || "Rabatt"}
									</td>
									<td className="py-2.5 px-3 text-center text-slate-500">
										{item.percent || "-"}
									</td>
									<td className="py-2.5 px-3 text-right text-slate-700 font-mono">
										{item.adjustment ? formatSEK(item.adjustment) : "-"}
									</td>
									<td className="py-2.5 px-3 text-right font-semibold text-slate-900 font-mono">
										{formatSEK(item.total)}
									</td>
									<td className="py-2.5 px-3 text-center text-slate-500 font-mono">
										{item.costCenter || item.accountNumber || "10"}
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>

			{/* Financial Summary Block matching Figma */}
			<div className="flex justify-end">
				<div className="w-80 space-y-1.5 text-xs text-slate-700">
					<div className="flex justify-between py-1">
						<span>
							<Translate text={localizationConstants.expenseDetailSumSubtotal} />
						</span>
						<span className="font-mono">{formatSEK(subtotal)}</span>
					</div>

					<div className="flex justify-between py-1">
						<span>
							<Translate text={localizationConstants.expenseDetailSumWithheld} />
						</span>
						<span className="font-mono">{formatSEK(withheld)}</span>
					</div>

					<div className="flex justify-between py-1">
						<span>
							<Translate text={localizationConstants.expenseDetailSumMarkup} />
						</span>
						<span className="font-mono">{formatSEK(markup)}</span>
					</div>

					<div className="flex justify-between py-1">
						<span>
							<Translate text={localizationConstants.expenseDetailSumRotRut} />
						</span>
						<span className="font-mono">{formatSEK(rotRut)}</span>
					</div>

					<div className="flex justify-between py-1 border-b border-slate-200">
						<span>
							<Translate text={localizationConstants.expenseDetailSumTotal} />
						</span>
						<span className="font-mono font-medium">{formatSEK(total)}</span>
					</div>

					<div className="flex justify-between py-1 font-bold text-slate-900">
						<span>
							<Translate text={localizationConstants.expenseDetailSumTax25} />
						</span>
						<span className="font-mono">{formatSEK(tax)} SEK</span>
					</div>

					<div className="flex justify-between py-1.5 font-bold text-emerald-600 text-sm">
						<span>
							<Translate text={localizationConstants.expenseDetailSumToReceive} />
						</span>
						<span className="font-mono">{formatSEK(toReceive)} SEK</span>
					</div>
				</div>
			</div>
		</div>
	);
}

export default ExpenseDetailInvoiceInfoCard;
