"use client";

import React from "react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { ExpenseItem, ExpenseLineItem } from "../../types/expense.types";
import { ExpenseDetailCalculations } from "../../hooks/useExpenseDetail";

interface ExpenseDetailInvoiceCardProps {
	expense: ExpenseItem;
	calculations: ExpenseDetailCalculations;
}

export function ExpenseDetailInvoiceCard({
	expense,
	calculations,
}: ExpenseDetailInvoiceCardProps) {
	const lineItems: ExpenseLineItem[] = expense.lineItems || [];

	const formatSEK = (val: number) => {
		return val.toLocaleString("sv-SE", {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		});
	};

	return (
		<div className="bg-white rounded-lg border border-slate-200 p-8 shadow-2xs mb-6">
			{/* Top Bar: Logo & Fakturanummer */}
			<div className="flex items-start justify-between border-b border-slate-100 pb-6 mb-6">
				<div>
					<div className="flex items-center gap-2">
						<span className="text-xl font-bold tracking-tight text-slate-900">
							{expense.supplier || "Logo Type"}
						</span>
					</div>
					<p className="text-xs text-slate-500 mt-1">
						{expense.supplierAddress || "Verkstadsvägen 12, 123 45 Stockholm"}
					</p>
				</div>

				<div className="text-right">
					<span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium block">
						<Translate text={localizationConstants.expenseDetailInvoiceNo} />
					</span>
					<span className="inline-block mt-1 px-3 py-1 bg-slate-100 border border-slate-200 text-slate-900 font-bold text-base rounded-md tracking-wider">
						{expense.fakturaNo || expense.expenseNo}
					</span>
				</div>
			</div>

			{/* Dates and References Grid */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-xs border-b border-slate-100 pb-6 mb-6">
				<div>
					<span className="text-slate-400 block mb-1">
						<Translate text={localizationConstants.expenseDetailInvoiceDate} />
					</span>
					<span className="font-semibold text-slate-800">
						{expense.invoiceDate || expense.date}
					</span>
				</div>

				<div>
					<span className="text-slate-400 block mb-1">
						<Translate text={localizationConstants.expenseDetailDueDate} />
					</span>
					<span className="font-semibold text-slate-800">{expense.dueDate}</span>
				</div>

				<div>
					<span className="text-slate-400 block mb-1">
						<Translate text={localizationConstants.expenseDetailPaymentTerms} />
					</span>
					<span className="font-semibold text-slate-800">
						{expense.paymentTerms === "30 dagar netto" ? (
							<Translate text={localizationConstants.expenseDetailPaymentTerms30Net} />
						) : (
							expense.paymentTerms || <Translate text={localizationConstants.expenseDetailPaymentTerms30Net} />
						)}
					</span>
				</div>

				<div>
					<span className="text-slate-400 block mb-1">
						<Translate text={localizationConstants.expenseDetailOurRef} />
					</span>
					<span className="font-semibold text-slate-800">
						{expense.reference || expense.invoiceRef || "AKT-2026-001"}
					</span>
				</div>
			</div>

			{/* Parties Section: Kund & Leverantör */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs border-b border-slate-100 pb-6 mb-6">
				{/* Kund */}
				<div className="bg-slate-50/60 p-4 rounded-md border border-slate-100">
					<span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
						<Translate text={localizationConstants.expenseDetailCustomer} />
					</span>
					<h3 className="font-bold text-slate-900 text-sm mb-1">
						{expense.customerName || "Allmännyttan Bostadsbolag"}
					</h3>
					<p className="text-slate-600">
						{expense.customerAddress || "Storgatan 14, 111 22 Stockholm"}
					</p>
					<p className="text-slate-500 mt-1">
						<Translate text={localizationConstants.expenseDetailOrgNo} />: {expense.customerOrgNo || "556789-0123"}
					</p>
				</div>

				{/* Leverantör */}
				<div className="bg-slate-50/60 p-4 rounded-md border border-slate-100">
					<span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
						<Translate text={localizationConstants.expenseDetailSupplier} />
					</span>
					<h3 className="font-bold text-slate-900 text-sm mb-1">
						{expense.supplier}
					</h3>
					<p className="text-slate-600">
						{expense.supplierAddress || "Verkstadsvägen 12, 123 45 Stockholm"}
					</p>
					<p className="text-slate-500 mt-1">
						<Translate text={localizationConstants.expenseDetailOrgNo} />: {expense.supplierOrgNo || "556112-4301"}
					</p>
					<p className="text-slate-500">
						<Translate text={localizationConstants.expenseDetailEmail} />: {expense.supplierEmail || "faktura@leverantor.se"}
					</p>
				</div>
			</div>

			{/* Project Highlight Box */}
			<div className="bg-sky-50/60 border border-sky-100 rounded-md p-3.5 mb-6 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
				<div>
					<span className="text-[10px] font-bold text-sky-700 uppercase tracking-wider block mb-0.5">
						<Translate text={localizationConstants.expenseDetailProject} />
					</span>
					<span className="font-bold text-slate-900 text-sm">
						{expense.project || "Nybyggnation Botkyrka"}
					</span>
				</div>
				<div className="sm:text-right">
					<span className="text-slate-500 block">
						<Translate text={localizationConstants.expenseDetailProjectNumber} />:{" "}
						<strong className="text-slate-800">{expense.projectNumber || "PROJ-2026-001"}</strong>
					</span>
				</div>
			</div>

			{/* Line Items Table */}
			<div className="overflow-x-auto border border-slate-200 rounded-md mb-6">
				<table className="w-full text-xs text-left">
					<thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold select-none">
						<tr>
							<th className="py-2.5 px-3">
								<Translate text={localizationConstants.expenseDetailColArticle} />
							</th>
							<th className="py-2.5 px-3">
								<Translate text={localizationConstants.expenseDetailColDesc} />
							</th>
							<th className="py-2.5 px-3 text-right">
								<Translate text={localizationConstants.expenseDetailColQty} />
							</th>
							<th className="py-2.5 px-3">
								<Translate text={localizationConstants.expenseDetailColUnit} />
							</th>
							<th className="py-2.5 px-3 text-right">
								<Translate text={localizationConstants.expenseDetailColPrice} />
							</th>
							<th className="py-2.5 px-3 text-right">
								<Translate text={localizationConstants.expenseDetailColSubtotal} />
							</th>
							<th className="py-2.5 px-3">
								<Translate text={localizationConstants.expenseDetailColHandling} />
							</th>
							<th className="py-2.5 px-3 text-right">%</th>
							<th className="py-2.5 px-3 text-right">
								<Translate text={localizationConstants.expenseDetailColAdjustment} />
							</th>
							<th className="py-2.5 px-3 text-right">
								<Translate text={localizationConstants.expenseDetailColTotal} />
							</th>
							<th className="py-2.5 px-3 text-center">
								<Translate text={localizationConstants.expenseDetailColAccount} />
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-slate-100">
						{lineItems.length === 0 ? (
							<tr>
								<td colSpan={11} className="py-6 text-center text-slate-400">
									<Translate text={localizationConstants.expenseDetailLineItemsEmpty} />
								</td>
							</tr>
						) : (
							lineItems.map((item, index) => {
								const lineSubtotal = (item.quantity || 1) * (item.unitPrice || 0);
								return (
									<tr key={item.id || index} className="hover:bg-slate-50/50">
										<td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">
											{item.id ? item.id.slice(0, 6) : `ART-${index + 1}`}
										</td>
										<td className="py-2.5 px-3 font-medium text-slate-900">
											{item.description}
										</td>
										<td className="py-2.5 px-3 text-right text-slate-700">
											{item.quantity}
										</td>
										<td className="py-2.5 px-3 text-slate-500">
											{item.unit || <Translate text={localizationConstants.expenseDetailUnitPieces} />}
										</td>
										<td className="py-2.5 px-3 text-right text-slate-700 font-mono">
											{formatSEK(item.unitPrice)}
										</td>
										<td className="py-2.5 px-3 text-right text-slate-700 font-mono">
											{formatSEK(lineSubtotal)}
										</td>
										<td className="py-2.5 px-3 text-slate-500">-</td>
										<td className="py-2.5 px-3 text-right text-slate-500">
											{item.vatRate}%
										</td>
										<td className="py-2.5 px-3 text-right text-slate-500">0,00</td>
										<td className="py-2.5 px-3 text-right font-semibold text-slate-900 font-mono">
											{formatSEK(item.total)}
										</td>
										<td className="py-2.5 px-3 text-center text-slate-500 font-mono">
											{item.accountNumber || "4010"}
										</td>
									</tr>
								);
							})
						)}
					</tbody>
				</table>
			</div>

			{/* Financial Totals Summary */}
			<div className="flex justify-end mb-8">
				<div className="w-72 bg-slate-50/80 rounded-lg p-4 border border-slate-200 text-xs space-y-2">
					<div className="flex justify-between text-slate-600">
						<span>
							<Translate text={localizationConstants.expenseDetailNetTotal} />:
						</span>
						<span className="font-mono font-medium text-slate-900">
							{formatSEK(calculations.netTotal)} SEK
						</span>
					</div>

					<div className="flex justify-between text-slate-600">
						<span>
							<Translate text={localizationConstants.expenseDetailVatTotal} /> (25%):
						</span>
						<span className="font-mono font-medium text-slate-900">
							{formatSEK(calculations.vatTotal)} SEK
						</span>
					</div>

					<div className="flex justify-between text-slate-500 text-[11px]">
						<span>
							<Translate text={localizationConstants.expenseDetailRounding} />:
						</span>
						<span className="font-mono">{formatSEK(calculations.rounding)} SEK</span>
					</div>

					<div className="border-t border-slate-200 pt-2.5 flex justify-between items-baseline">
						<span className="font-bold text-slate-900 text-sm">
							<Translate text={localizationConstants.expenseDetailGrandTotal} />:
						</span>
						<span className="font-bold text-slate-950 font-mono text-base">
							{formatSEK(calculations.grandTotal)} SEK
						</span>
					</div>
				</div>
			</div>

			{/* Payment Details Footer */}
			<div className="border-t border-slate-200 pt-6 text-[11px] text-slate-500 grid grid-cols-2 sm:grid-cols-4 gap-4">
				<div>
					<span className="font-semibold text-slate-700 block mb-0.5">
						<Translate text={localizationConstants.expenseDetailBankgiro} />
					</span>
					<span>5412-4321</span>
				</div>
				<div>
					<span className="font-semibold text-slate-700 block mb-0.5">
						<Translate text={localizationConstants.expenseDetailIban} />
					</span>
					<span>SE45 5000 0000 0541 2432 1000</span>
				</div>
				<div>
					<span className="font-semibold text-slate-700 block mb-0.5">
						<Translate text={localizationConstants.expenseDetailBicSwift} />
					</span>
					<span>ESSESESS</span>
				</div>
				<div>
					<span className="font-semibold text-slate-700 block mb-0.5">
						<Translate text={localizationConstants.expenseDetailTaxStatus} />
					</span>
					<span>
						<Translate text={localizationConstants.expenseDetailApprovedForFtax} />
					</span>
				</div>
			</div>
		</div>
	);
}

export default ExpenseDetailInvoiceCard;
